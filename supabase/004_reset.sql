-- ============================================================
-- WC26 HUB — Migration 004 : reset des profils + ré-application des fonctions
-- À coller dans Supabase > SQL Editor > New Query > Run.
--
-- Effet :
-- 1. Tous les comptes existants sont remis à 0 pts.
-- 2. L'historique des pronostics est effacé (table vidée).
-- 3. Le trigger d'inscription est mis à jour : les nouveaux comptes
--    démarrent à 0 pts (et non plus 1000 comme dans 002).
-- 4. Les fonctions place_prediction / score_prediction et la vue
--    classement sont ré-écrites pour garantir qu'elles existent même si
--    003_predictions.sql n'avait pas encore été lancé.
--
-- Idempotent : tu peux la relancer sans danger.
-- ============================================================

-- 1 · Trigger : nouveau compte = 0 pts
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, pseudo, total_points)
  VALUES (NEW.id, split_part(NEW.email, '@', 1), 0)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 2 · Wipe : tous les pronostics existants et tous les compteurs à zéro
TRUNCATE TABLE public.pronostics RESTART IDENTITY;
UPDATE public.profiles SET total_points = 0;

-- 3 · S'assurer que la table pronostics a la forme attendue par
--     place_prediction (colonnes ajoutées dans 002_betting.sql).
ALTER TABLE public.pronostics
  ALTER COLUMN match_id    TYPE TEXT,
  ALTER COLUMN score_home  DROP NOT NULL,
  ALTER COLUMN score_away  DROP NOT NULL;

ALTER TABLE public.pronostics ADD COLUMN IF NOT EXISTS pick   TEXT
  CHECK (pick IN ('home','draw','away'));
ALTER TABLE public.pronostics ADD COLUMN IF NOT EXISTS stake  INTEGER;
ALTER TABLE public.pronostics ADD COLUMN IF NOT EXISTS odds   NUMERIC(5,2);
ALTER TABLE public.pronostics ADD COLUMN IF NOT EXISTS payout INTEGER;
ALTER TABLE public.pronostics ADD COLUMN IF NOT EXISTS status TEXT
  DEFAULT 'pending' CHECK (status IN ('pending','won','lost','cancelled'));

-- Au cas où la FK vers matches existerait encore (003 la dropait, on
-- s'assure que c'est bien parti pour accepter les match_id mock 'm1'…).
ALTER TABLE public.pronostics DROP CONSTRAINT IF EXISTS pronostics_match_id_fkey;

-- 4 · place_prediction : sauve un pronostic (pas de débit de pts)
DROP FUNCTION IF EXISTS public.place_bet;
CREATE OR REPLACE FUNCTION public.place_prediction(
  p_match_id    TEXT,
  p_pick        TEXT,
  p_score_home  INTEGER DEFAULT NULL,
  p_score_away  INTEGER DEFAULT NULL
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

-- 5 · score_prediction : applique 5 / 3 / 0 après la fin d'un match
CREATE OR REPLACE FUNCTION public.score_prediction(
  p_match_id   TEXT,
  p_real_home  INTEGER,
  p_real_away  INTEGER
)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_real_pick TEXT;
  v_scored INTEGER := 0;
  rec RECORD;
  v_points INTEGER;
  v_status TEXT;
BEGIN
  IF    p_real_home >  p_real_away THEN v_real_pick := 'home';
  ELSIF p_real_home <  p_real_away THEN v_real_pick := 'away';
  ELSE                                  v_real_pick := 'draw';
  END IF;

  FOR rec IN
    SELECT id, user_id, pick, score_home, score_away
      FROM public.pronostics
     WHERE match_id = p_match_id AND scored = FALSE
  LOOP
    IF rec.score_home IS NOT NULL
       AND rec.score_away IS NOT NULL
       AND rec.score_home = p_real_home
       AND rec.score_away = p_real_away THEN
      v_points := 5; v_status := 'won';
    ELSIF rec.pick = v_real_pick THEN
      v_points := 3; v_status := 'won';
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

-- 6 · Vue classement
DROP VIEW IF EXISTS public.classement;
CREATE VIEW public.classement AS
  SELECT
    p.id,
    p.pseudo,
    p.total_points,
    COUNT(pr.id)::INTEGER                                              AS total_predictions,
    COUNT(CASE WHEN pr.points_earned = 5 THEN 1 END)::INTEGER          AS exact_scores,
    COUNT(CASE WHEN pr.points_earned = 3 THEN 1 END)::INTEGER          AS correct_outcomes,
    RANK() OVER (ORDER BY p.total_points DESC)::INTEGER                AS rang
  FROM public.profiles p
  LEFT JOIN public.pronostics pr ON pr.user_id = p.id
  GROUP BY p.id, p.pseudo, p.total_points;

-- ============================================================
-- Sanity check : combien de profils, combien à 0 pts ?
-- ============================================================
SELECT
  (SELECT COUNT(*) FROM public.profiles)                       AS total_profiles,
  (SELECT COUNT(*) FROM public.profiles WHERE total_points=0)  AS profiles_at_zero,
  (SELECT COUNT(*) FROM public.pronostics)                     AS predictions_remaining;
