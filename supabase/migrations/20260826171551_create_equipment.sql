create type public.equipment_type as enum (
  'running_shoes',
  'bike',
  'swim_equipment',
  'other'
);

create table public.equipment (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  name text not null
    check (length(trim(name)) > 0),

  type public.equipment_type not null,

  purchased_at date,

  retired_at date,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint valid_equipment_lifecycle
    check (
      retired_at is null
      or purchased_at is null
      or retired_at >= purchased_at
    )
);

create table public.activity_equipment (
  activity_id uuid not null
    references public.activities(id)
    on delete cascade,

  equipment_id uuid not null
    references public.equipment(id)
    on delete cascade,

  primary key (activity_id, equipment_id)
);

alter table public.equipment enable row level security;

revoke all on table public.equipment from anon, authenticated;

grant select, insert, update, delete
on table public.equipment
to authenticated;

create policy "Users can view their own equipment"
on public.equipment
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their own equipment"
on public.equipment
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own equipment"
on public.equipment
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own equipment"
on public.equipment
for delete
to authenticated
using ((select auth.uid()) = user_id);

alter table public.activity_equipment enable row level security;

revoke all on table public.activity_equipment from anon, authenticated;

grant select, insert, update, delete
on table public.activity_equipment
to authenticated;

create policy "Users can view their own activity equipment"
on public.activity_equipment
for select
to authenticated
using (
  exists (
    select 1
    from public.activities
    join public.equipment
      on equipment.user_id = activities.user_id
    where activities.id = activity_equipment.activity_id
      and equipment.id = activity_equipment.equipment_id
      and activities.user_id = (select auth.uid())
  )
);

create policy "Users can insert their own activity equipment"
on public.activity_equipment
for insert
to authenticated
with check (
  exists (
    select 1
    from public.activities
    where activities.id = activity_equipment.activity_id
      and activities.user_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.equipment
    where equipment.id = activity_equipment.equipment_id
      and equipment.user_id = (select auth.uid())
  )
);

create policy "Users can update their own activity equipment"
on public.activity_equipment
for update
to authenticated
using (
  exists (
    select 1
    from public.activities
    where activities.id = activity_equipment.activity_id
      and activities.user_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.equipment
    where equipment.id = activity_equipment.equipment_id
      and equipment.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.activities
    where activities.id = activity_equipment.activity_id
      and activities.user_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.equipment
    where equipment.id = activity_equipment.equipment_id
      and equipment.user_id = (select auth.uid())
  )
);

create policy "Users can delete their own activity equipment"
on public.activity_equipment
for delete
to authenticated
using (
  exists (
    select 1
    from public.activities
    where activities.id = activity_equipment.activity_id
      and activities.user_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.equipment
    where equipment.id = activity_equipment.equipment_id
      and equipment.user_id = (select auth.uid())
  )
);

create index equipment_user_id_idx
on public.equipment (user_id);

create index activity_equipment_equipment_id_idx
on public.activity_equipment (equipment_id);