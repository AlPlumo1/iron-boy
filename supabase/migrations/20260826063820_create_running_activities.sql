create table public.running_activities (
  activity_id uuid primary key
    references public.activities(id)
    on delete cascade,

  avg_cadence_spm smallint
    check (
      avg_cadence_spm is null
      or avg_cadence_spm > 0
    ),

  max_cadence_spm smallint
    check (
      max_cadence_spm is null
      or max_cadence_spm > 0
    ),

  constraint valid_cadence_range
    check (
      avg_cadence_spm is null
      or max_cadence_spm is null
      or max_cadence_spm >= avg_cadence_spm
    )
);

-- Ensure that only running activities can have running-specific data.
create function public.validate_running_activity()
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
      and activities.sport = 'running'::public.activity_sport
  ) then
    raise exception 'Activity % is not a running activity', new.activity_id;
  end if;

  return new;
end;
$$;

create trigger validate_running_activity
before insert or update on public.running_activities
for each row
execute function public.validate_running_activity();

revoke execute on function public.validate_running_activity() from public;

alter table public.running_activities enable row level security;

revoke all on table public.running_activities from anon, authenticated;

grant select, insert, update, delete
on table public.running_activities
to authenticated;

create policy "Users can view their own running activities"
on public.running_activities
for select
to authenticated
using (
  exists (
    select 1
    from public.activities
    where activities.id = running_activities.activity_id
      and activities.user_id = (select auth.uid())
  )
);

create policy "Users can insert their own running activities"
on public.running_activities
for insert
to authenticated
with check (
  exists (
    select 1
    from public.activities
    where activities.id = running_activities.activity_id
      and activities.user_id = (select auth.uid())
  )
);

create policy "Users can update their own running activities"
on public.running_activities
for update
to authenticated
using (
  exists (
    select 1
    from public.activities
    where activities.id = running_activities.activity_id
      and activities.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.activities
    where activities.id = running_activities.activity_id
      and activities.user_id = (select auth.uid())
  )
);

create policy "Users can delete their own running activities"
on public.running_activities
for delete
to authenticated
using (
  exists (
    select 1
    from public.activities
    where activities.id = running_activities.activity_id
      and activities.user_id = (select auth.uid())
  )
);