-- =============================================
-- Construindo a Sabedoria - Database Schema
-- =============================================

-- 1. Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  xp integer not null default 0,
  level integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- 2. Competencies table
create table if not exists public.competencies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  comunicacao integer not null default 5 check (comunicacao between 1 and 10),
  pensamento_critico integer not null default 5 check (pensamento_critico between 1 and 10),
  resolucao_problemas integer not null default 5 check (resolucao_problemas between 1 and 10),
  colaboracao integer not null default 5 check (colaboracao between 1 and 10),
  criatividade integer not null default 5 check (criatividade between 1 and 10),
  gestao_tempo integer not null default 5 check (gestao_tempo between 1 and 10),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

alter table public.competencies enable row level security;

create policy "competencies_select_all" on public.competencies for select using (true);
create policy "competencies_insert_own" on public.competencies for insert with check (auth.uid() = user_id);
create policy "competencies_update_own" on public.competencies for update using (auth.uid() = user_id);

-- 3. Guilds table
create table if not exists public.guilds (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  xp_total integer not null default 0,
  max_members integer not null default 5,
  created_at timestamptz not null default now()
);

alter table public.guilds enable row level security;

create policy "guilds_select_all" on public.guilds for select using (true);
create policy "guilds_insert_auth" on public.guilds for insert with check (auth.uid() = owner_id);
create policy "guilds_update_owner" on public.guilds for update using (auth.uid() = owner_id);
create policy "guilds_delete_owner" on public.guilds for delete using (auth.uid() = owner_id);

-- 4. Guild members table
create table if not exists public.guild_members (
  id uuid primary key default gen_random_uuid(),
  guild_id uuid not null references public.guilds(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique(guild_id, user_id)
);

alter table public.guild_members enable row level security;

create policy "guild_members_select_all" on public.guild_members for select using (true);
create policy "guild_members_insert_own" on public.guild_members for insert with check (auth.uid() = user_id);
create policy "guild_members_delete_own" on public.guild_members for delete using (auth.uid() = user_id);

-- 5. Matches table
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  partner_id uuid not null references public.profiles(id) on delete cascade,
  compatibility_score numeric(5,2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now()
);

alter table public.matches enable row level security;

create policy "matches_select_own" on public.matches for select using (auth.uid() = user_id or auth.uid() = partner_id);
create policy "matches_insert_own" on public.matches for insert with check (auth.uid() = user_id);
create policy "matches_update_involved" on public.matches for update using (auth.uid() = user_id or auth.uid() = partner_id);

-- 6. Auto-create profile + competencies on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  insert into public.competencies (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
