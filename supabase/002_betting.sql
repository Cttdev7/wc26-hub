-- ============================================================
-- WC26 HUB — Migration 002 : paris (betting) + bonus inscription
-- À coller dans Supabase > SQL Editor > New Query
-- ============================================================

-- 1 · Donner 1000 pts d'office à l'inscription (au lieu de 0)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, pseudo, total_points)
  VALUES (NEW.id, split_part(NEW.email, '@', 1), 1000)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 2 · Backfill des comptes déjà créés à 0 pts (donne-leur leur bonus)
UPDATE public.profiles SET total_points = 1000 WHERE total_points = 0;

-- 3 · Assouplir la table pronostics pour absorber le modèle "paris" du design.
--     Le design utilise des match_id mock ('m1', 'm2'...) côté front, pas des
--     UUIDs du futur cache API-Football — on relâche la FK et on stocke en TEXT.
ALTER TABLE public.pronostics DROP CONSTRAINT IF EXISTS pronostics_match_id_fkey;
ALTER TABLE public.pronostics ALTER COLUMN match_id TYPE TEXT;
ALTER TABLE public.pronostics ALTER COLUMN score_home DROP NOT NULL;
ALTER TABLE public.pronostics ALTER COLUMN score_away DROP NOT NULL;

ALTER TABLE public.pronostics ADD COLUMN IF NOT EXISTS pick TEXT
  CHECK (pick IN ('home','draw','away'));
ALTER TABLE public.pronostics ADD COLUMN IF NOT EXISTS stake INTEGER;
ALTER TABLE public.pronostics ADD COLUMN IF NOT EXISTS odds NUMERIC(5,2);
ALTER TABLE public.pronostics ADD COLUMN IF NOT EXISTS payout INTEGER;
ALTER TABLE public.pronostics ADD COLUMN IF NOT EXISTS status TEXT
  DEFAULT 'pending' CHECK (status IN ('pending','won','lost','cancelled'));

-- 4 · Placer un pari (atomique : vérifie solde, débite, upsert le pari)
CREATE OR REPLACE FUNCTION public.place_bet(
  p_match_id TEXT,
  p_pick     TEXT,
  p_stake    INTEGER,
  p_odds     NUMERIC
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_bet_id      UUID;
  v_prev_stake  INTEGER;
  v_current_pts INTEGER;
  v_uid         UUID := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF p_stake <= 0 THEN RAISE EXCEPTION 'Stake must be positive'; END IF;
  IF p_pick NOT IN ('home','draw','away') THEN RAISE EXCEPTION 'Invalid pick'; END IF;

  -- Solde actuel
  SELECT total_points INTO v_current_pts FROM public.profiles WHERE id = v_uid;
  IF v_current_pts IS NULL THEN RAISE EXCEPTION 'Profile not found'; END IF;

  -- Y a-t-il déjà un pari pending sur ce match ? on rembourse avant de re-débiter
  SELECT stake INTO v_prev_stake
    FROM public.pronostics
   WHERE user_id = v_uid AND match_id = p_match_id AND status = 'pending';

  IF v_prev_stake IS NOT NULL THEN
    v_current_pts := v_current_pts + v_prev_stake;
  END IF;

  IF v_current_pts < p_stake THEN
    RAISE EXCEPTION 'Solde insuffisant (% pts, mise %)', v_current_pts, p_stake;
  END IF;

  -- Update du solde (net : on a déjà recrédité le pari précédent au-dessus)
  UPDATE public.profiles
     SET total_points = v_current_pts - p_stake
   WHERE id = v_uid;

  -- Upsert du pari
  INSERT INTO public.pronostics (user_id, match_id, pick, stake, odds, status, score_home, score_away)
  VALUES (v_uid, p_match_id, p_pick, p_stake, p_odds, 'pending', NULL, NULL)
  ON CONFLICT (user_id, match_id) DO UPDATE
     SET pick = EXCLUDED.pick,
         stake = EXCLUDED.stake,
         odds = EXCLUDED.odds,
         status = 'pending',
         payout = NULL,
         scored = FALSE,
         points_earned = 0,
         created_at = now()
  RETURNING id INTO v_bet_id;

  RETURN v_bet_id;
END;
$$;

-- 5 · Refresh la vue classement pour qu'elle prenne en compte les nouveaux paris
DROP VIEW IF EXISTS public.classement;
CREATE VIEW public.classement AS
  SELECT
    p.id,
    p.pseudo,
    p.total_points,
    COUNT(pr.id)::INTEGER                                          AS total_pronostics,
    COUNT(CASE WHEN pr.status = 'won'  THEN 1 END)::INTEGER        AS bets_won,
    COUNT(CASE WHEN pr.status = 'lost' THEN 1 END)::INTEGER        AS bets_lost,
    RANK() OVER (ORDER BY p.total_points DESC)::INTEGER            AS rang
  FROM public.profiles p
  LEFT JOIN public.pronostics pr ON pr.user_id = p.id
  GROUP BY p.id, p.pseudo, p.total_points;
