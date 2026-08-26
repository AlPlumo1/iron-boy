create type public.weather as enum(
    'sunny',
    'partly_sunny',
    'rainy',
    'foggy',
    'snowy',
    'stormy',
    'overcast'
);

create type public.wind_direction as enum (
  'n',
  'ne',
  'e',
  'se',
  's',
  'so',
  'o',
  'no'
);


create table public.activity_environment (
  activity_id uuid primary key
    references public.activities(id)
    on delete cascade,

  elevation_gain_m numeric(10, 2)
    check (
      elevation_gain_m is null
      or elevation_gain_m >= 0
    ),

  elevation_loss_m numeric(10, 2)
    check (
      elevation_loss_m is null
      or elevation_loss_m >= 0
    ),

  min_altitude_m numeric(10, 2),

  max_altitude_m numeric(10, 2),

  temperature_c numeric(5, 2),

  wind_speed_kmh numeric(5, 2),

  wind_direction public.wind_direction,

  weather public.weather, 

  constraint valid_altitude_range
    check (
      min_altitude_m is null
      or max_altitude_m is null
      or max_altitude_m >= min_altitude_m
    )
);

alter table public.activity_environment enable row level security;

revoke all on table public.activity_environment from anon, authenticated;

grant select, insert, update, delete
on table public.activity_environment
to authenticated;

create policy "Users can view their own activity environment"
on public.activity_environment
for select
to authenticated
using (
  exists (
    select 1
    from public.activities
    where activities.id = activity_environment.activity_id
      and activities.user_id = (select auth.uid())
  )
);

create policy "Users can insert their own activity environment"
on public.activity_environment
for insert
to authenticated
with check (
  exists (
    select 1
    from public.activities
    where activities.id = activity_environment.activity_id
      and activities.user_id = (select auth.uid())
  )
);

create policy "Users can update their own activity environment"
on public.activity_environment
for update
to authenticated
using (
  exists (
    select 1
    from public.activities
    where activities.id = activity_environment.activity_id
      and activities.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.activities
    where activities.id = activity_environment.activity_id
      and activities.user_id = (select auth.uid())
  )
);

create policy "Users can delete their own activity environment"
on public.activity_environment
for delete
to authenticated
using (
  exists (
    select 1
    from public.activities
    where activities.id = activity_environment.activity_id
      and activities.user_id = (select auth.uid())
  )
);