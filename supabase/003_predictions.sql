-- ============================================================
-- WC26 HUB — Migration 003 : système de pronostics (5/3/0)
-- À coller dans Supabase > SQL Editor > New Query
-- Remplace l'ancien système de mise (place_bet) par un pronostic
-- simple : un pick (home/draw/away) + un score exact optionnel.
-- ============================================================

-- 1 · Supprimer l'ancienne fonction place_bet (système de mise)
DROP FUNCTION IF EXISTS public.place_bet;

-- 2 · Nouvelle fonction : place_prediction
--     Sauve un pronostic. Pas de débit de points — les points sont
--     attribués après la fin du match par la fonction de scoring.
CREATE OR REPLACE FUNCTION public.place_prediction(
  p_match_id TEXT,
  p_pick TEXT,
  p_score_home INTEGER DEFAULT NULL,
  p_score_away INTEGER DEFAULT NULL
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_id  UUID;
  v_uid UUID := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF p_pick NOT IN ('home','draw','away') THEN RAISE EXCEPTION 'Invalid pick'; END IF;

  INSERT INTO public.pronostics (user_id, match_id, pick, score_home, score_away, status, scored, points_earned)
  VALUES (v_uid, p_match_id, p_pick, p_score_home, p_score_away, 'pending', FALSE, 0)
  ON CONFLICT (user_id, match_id) DO UPDATE
    SET pick = EXCLUDED.pick,
        score_home = EXCLUDED.score_home,
        score_away = EXCLUDED.score_away,
        status = 'pending',
        scored = FALSE,
        points_earned = 0,
        created_at = now()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- 3 · Fonction de scoring (à appeler quand un match a son résultat final)
--     Règle : score exact = 5 pts, bon vainqueur (sans le score) = 3 pts, faux = 0 pts.
--     Idempotent : ne re-score pas un pronostic déjà scoré.
CREATE OR REPLACE FUNCTION public.score_prediction(
  p_match_id   TEXT,
  p_real_home  INTEGER,
  p_real_away  INTEGER
)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_real_pick  TEXT;
  v_scored     INTEGER := 0;
  rec RECORD;
  v_points     INTEGER;
  v_status     TEXT;
BEGIN
  -- Détermine l'issue réelle
  IF    p_real_home >  p_real_away THEN v_real_pick := 'home';
  ELSIF p_real_home <  p_real_away THEN v_real_pick := 'away';
  ELSE                                  v_real_pick := 'draw';
  END IF;

  FOR rec IN
    SELECT id, user_id, pick, score_home, score_away
      FROM public.pronostics
     WHERE match_id = p_match_id AND scored = FALSE
  LOOP
    -- Score exact ?
    IF rec.score_home IS NOT NULL
       AND rec.score_away IS NOT NULL
       AND rec.score_home = p_real_home
       AND rec.score_away = p_real_away THEN
      v_points := 5; v_status := 'won';
    -- Bon vainqueur ?
    ELSIF rec.pick = v_real_pick THEN
      v_points := 3; v_status := 'won';
    -- Faux
    ELSE
      v_points := 0; v_status := 'lost';
    END IF;

    UPDATE public.pronostics
       SET points_earned = v_points,
           scored = TRUE,
           status = v_status
     WHERE id = rec.id;

    UPDATE public.profiles
       SET total_points = total_points + v_points
     WHERE id = rec.user_id;

    v_scored := v_scored + 1;
  END LOOP;

  RETURN v_scored;
END;
$$;

-- 4 · Refresh de la vue classement pour le nouveau scoring (5/3/0)
DROP VIEW IF EXISTS public.classement;
CREATE VIEW public.classement AS
  SELECT
    p.id,
    p.pseudo,
    p.total_points,
    COUNT(pr.id)::INTEGER                                   AS total_predictions,
    COUNT(CASE WHEN pr.points_earned = 5 THEN 1 END)::INTEGER AS exact_scores,
    COUNT(CASE WHEN pr.points_earned = 3 THEN 1 END)::INTEGER AS correct_outcomes,
    RANK() OVER (ORDER BY p.total_points DESC)::INTEGER     AS rang
  FROM public.profiles p
  LEFT JOIN public.pronostics pr ON pr.user_id = p.id
  GROUP BY p.id, p.pseudo, p.total_points;

-- 5 · La vue classement est lue par tout le monde (pas de RLS sur les vues)
-- mais on s'assure que profiles est lisible (déjà le cas via la policy
-- profiles_read).
