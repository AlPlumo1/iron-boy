create function public.prevent_invalid_activity_sport_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.sport = old.sport then
    return new;
  end if;

  if exists (
    select 1
    from public.running_activities
    where running_activities.activity_id = old.id
  ) then
    raise exception
      'Cannot change sport of activity % because running-specific data exists',
      old.id;
  end if;

  if exists (
    select 1
    from public.cycling_activities
    where cycling_activities.activity_id = old.id
  ) then
    raise exception
      'Cannot change sport of activity % because cycling-specific data exists',
      old.id;
  end if;

  if exists (
    select 1
    from public.swimming_activities
    where swimming_activities.activity_id = old.id
  ) then
    raise exception
      'Cannot change sport of activity % because swimming-specific data exists',
      old.id;
  end if;

  return new;
end;
$$;

create trigger prevent_invalid_activity_sport_change
before update of sport on public.activities
for each row
execute function public.prevent_invalid_activity_sport_change();

revoke execute
on function public.prevent_invalid_activity_sport_change()
from public;