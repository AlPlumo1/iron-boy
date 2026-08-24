create type public.activity_sport as enum (
  'running',
  'cycling',
  'swimming'
);

create type public.activity_feeling as enum (
  'very_easy',
  'easy',
  'moderate',
  'hard',
  'very_hard'
);

create type public.activity_source as enum (
  'manual',
  'garmin',
  'import'
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  sport public.activity_sport not null,

  started_at timestamptz not null,

  duration_seconds integer not null
    check (duration_seconds > 0),

  distance_meters numeric(12, 2)
    check (
      distance_meters is null
      or distance_meters >= 0
    ),

  avg_heart_rate_bpm smallint
    check (
      avg_heart_rate_bpm is null
      or avg_heart_rate_bpm between 1 and 300
    ),

  max_heart_rate_bpm smallint
    check (
      max_heart_rate_bpm is null
      or max_heart_rate_bpm between 1 and 300
    ),

  feeling public.activity_feeling,

  comment text,

  source public.activity_source not null default 'manual',

  external_id text,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint valid_heart_rate_range
    check (
      avg_heart_rate_bpm is null
      or max_heart_rate_bpm is null
      or max_heart_rate_bpm >= avg_heart_rate_bpm
    )
);

alter table public.activities enable row level security;

revoke all on table public.activities from anon, authenticated;

grant select, insert, update, delete
on table public.activities
to authenticated;

create policy "Users can view their own activities"
on public.activities
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their own activities"
on public.activities
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own activities"
on public.activities
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own activities"
on public.activities
for delete
to authenticated
using ((select auth.uid()) = user_id);

create index activities_user_started_at_idx
on public.activities (user_id, started_at);

create index activities_user_sport_started_at_idx
on public.activities (user_id, sport, started_at);

create unique index activities_external_id_idx
on public.activities (user_id, source, external_id)
where external_id is not null;