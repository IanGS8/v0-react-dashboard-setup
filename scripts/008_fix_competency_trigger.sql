-- Update the trigger function to use new subject column names
create or replace function public.handle_new_user_competencies()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.competencies (user_id, matematica, portugues, historia, geografia, fisica, quimica)
  values (new.id, 5, 5, 5, 5, 5, 5)
  on conflict (user_id) do nothing;
  return new;
end;
$$;
