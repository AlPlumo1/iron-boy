create type public.swimming_environment as enum (
  'pool',
  'open_water'
);

create table public.swimming_activities (
  activity_id uuid primary key
    references public.activities(id)
    on delete cascade,

  environment public.swimming_environment not null,

  pool_length_m smallint
    check (
      pool_length_m is null
      or pool_length_m > 0
    ),

  constraint valid_pool_information
    check (
      (environment = 'pool' and pool_length_m is not null)
      or
      (environment = 'open_water' and pool_length_m is null)
    )
);

create function public.validate_swimming_activity()
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
      and activities.sport = 'swimming'::public.activity_sport
  ) then
    raise exception 'Activity % is not a swimming activity', new.activity_id;
  end if;

  return new;
end;
$$;

create trigger validate_swimming_activity
before insert or update on public.swimming_activities
for each row
execute function public.validate_swimming_activity();

revoke execute on function public.validate_swimming_activity() from public;

alter table public.swimming_activities enable row level security;

revoke all on table public.swimming_activities from anon, authenticated;

grant select, insert, update, delete
on table public.swimming_activities
to authenticated;

create policy "Users can view their own swimming activities"
on public.swimming_activities
for select
to authenticated
using (
  exists (
    select 1
    from public.activities
    where activities.id = swimming_activities.activity_id
      and activities.user_id = (select auth.uid())
  )
);

create policy "Users can insert their own swimming activities"
on public.swimming_activities
for insert
to authenticated
with check (
  exists (
    select 1
    from public.activities
    where activities.id = swimming_activities.activity_id
      and activities.user_id = (select auth.uid())
  )
);

create policy "Users can update their own swimming activities"
on public.swimming_activities
for update
to authenticated
using (
  exists (
    select 1
    from public.activities
    where activities.id = swimming_activities.activity_id
      and activities.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.activities
    where activities.id = swimming_activities.activity_id
      and activities.user_id = (select auth.uid())
  )
);

create policy "Users can delete their own swimming activities"
on public.swimming_activities
for delete
to authenticated
using (
  exists (
    select 1
    from public.activities
    where activities.id = swimming_activities.activity_id
      and activities.user_id = (select auth.uid())
  )
);