-- Supabase SQL migration: Add or replace the add_daily_practice function
-- This function adds a practice to the user's daily practices using the authenticated user's ID

create or replace function add_daily_practice(p_practice_id int)
returns boolean
language plpgsql
as $$
begin
  insert into user_daily_practices_enhanced (user_id, practice_id)
  values (auth.uid(), p_practice_id)
  on conflict do nothing;
  return true;
end;
$$;
