-- ============================================================
-- WC26 HUB — Schéma initial
-- Colle ce script dans Supabase > SQL Editor > New Query
-- ============================================================

-- Matchs (cache de l'API-Football)
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  api_match_id integer unique not null,
  home_team text not null,
  away_team text not null,
  home_flag text,
  away_flag text,
  score_home integer,
  score_away integer,
  status text not null default 'NS',
  kickoff_at timestamptz not null,
  phase text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Profils utilisateurs
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  pseudo text unique not null,
  total_points integer default 0,
  created_at timestamptz default now()
);

-- Pronostics
create table public.pronostics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  match_id uuid references public.matches(id) on delete cascade not null,
  score_home integer not null,
  score_away integer not null,
  points_earned integer default 0,
  scored boolean default false,
  created_at timestamptz default now(),
  unique(user_id, match_id)
);

-- Vue classement
create view public.classement as
  select
    p.id,
    p.pseudo,
    p.total_points,
    count(pr.id)::integer as total_pronostics,
    count(case when pr.points_earned = 3 then 1 end)::integer as scores_exacts,
    count(case when pr.points_earned = 1 then 1 end)::integer as bons_vainqueurs,
    rank() over (order by p.total_points desc)::integer as rang
  from public.profiles p
  left join public.pronostics pr on pr.user_id = p.id
  group by p.id, p.pseudo, p.total_points;

-- RLS
alter table public.matches enable row level security;
alter table public.pronostics enable row level security;
alter table public.profiles enable row level security;

create policy "matches_read" on public.matches for select using (true);
create policy "matches_all_service" on public.matches for all using (true);

create policy "pronostics_read_own" on public.pronostics for select using (auth.uid() = user_id);
create policy "pronostics_insert_own" on public.pronostics for insert with check (auth.uid() = user_id);
create policy "pronostics_update_own" on public.pronostics for update using (auth.uid() = user_id);

create policy "profiles_read" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Fonction incrémenter les points
create or replace function public.increment_points(uid uuid, pts integer)
returns void language sql security definer as $$
  update public.profiles set total_points = total_points + pts where id = uid;
$$;

-- Trigger : créer profil automatiquement à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, pseudo)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
