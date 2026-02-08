-- Function to increment XP and auto-level-up
create or replace function public.increment_xp(uid uuid, amount integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  new_xp integer;
  new_level integer;
begin
  update public.profiles
  set xp = xp + amount,
      updated_at = now()
  where id = uid
  returning xp into new_xp;

  -- Calculate level: every 100 XP is a new level
  new_level := greatest(1, (new_xp / 100) + 1);

  update public.profiles
  set level = new_level
  where id = uid;
end;
$$;
