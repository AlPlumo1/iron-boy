create table public.cycling_activities (
  activity_id uuid primary key
    references public.activities(id)
    on delete cascade,

  avg_cadence_rpm smallint
    check (
      avg_cadence_rpm is null
      or avg_cadence_rpm > 0
    ),

  max_cadence_rpm smallint
    check (
      max_cadence_rpm is null
      or max_cadence_rpm > 0
    ),

  avg_power_w integer
    check (
      avg_power_w is null
      or avg_power_w >= 0
    ),

  max_power_w integer
    check (
      max_power_w is null
      or max_power_w >= 0
    ),

  constraint valid_cadence_range
    check (
      avg_cadence_rpm is null
      or max_cadence_rpm is null
      or max_cadence_rpm >= avg_cadence_rpm
    ),

  constraint valid_power_range
    check (
      avg_power_w is null
      or max_power_w is null
      or max_power_w >= avg_power_w
    )
);

create function public.validate_cycling_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.activities
    where activities.id = new.activity_id
      and activities.sport = 'cycling'::public.activity_sport
  ) then
    raise exception 'Activity % is not a cycling activity', new.activity_id;
  end if;

  return new;
end;
$$;

create trigger validate_cycling_activity
before insert or update on public.cycling_activities
for each row
execute function public.validate_cycling_activity();

revoke execute on function public.validate_cycling_activity() from public;

alter table public.cycling_activities enable row level security;

revoke all on table public.cycling_activities from anon, authenticated;

grant select, insert, update, delete
on table public.cycling_activities
to authenticated;

create policy "Users can view their own cycling activities"
on public.cycling_activities
for select
to authenticated
using (
  exists (
    select 1
    from public.activities
    where activities.id = cycling_activities.activity_id
      and activities.user_id = (select auth.uid())
  )
);

create policy "Users can insert their own cycling activities"
on public.cycling_activities
for insert
to authenticated
with check (
  exists (
    select 1
    from public.activities
    where activities.id = cycling_activities.activity_id
      and activities.user_id = (select auth.uid())
  )
);

create policy "Users can update their own cycling activities"
on public.cycling_activities
for update
to authenticated
using (
  exists (
    select 1
    from public.activities
    where activities.id = cycling_activities.activity_id
      and activities.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.activities
    where activities.id = cycling_activities.activity_id
      and activities.user_id = (select auth.uid())
  )
);

create policy "Users can delete their own cycling activities"
on public.cycling_activities
for delete
to authenticated
using (
  exists (
    select 1
    from public.activities
    where activities.id = cycling_activities.activity_id
      and activities.user_id = (select auth.uid())
  )
);