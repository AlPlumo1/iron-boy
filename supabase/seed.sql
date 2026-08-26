-- ============================================================
-- IronBoy development seed
-- ============================================================
--
-- This file is executed after all migrations by:
--   npx supabase db reset
--
-- Development-only users and data.
-- Never use this seed on production.
-- ============================================================


-- ------------------------------------------------------------
-- Fixed development users
-- ------------------------------------------------------------

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
values
(
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'alice@ironboy.local',
  crypt('IronBoyDev123!', gen_salt('bf')),
  now(),
  null,
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"Alice"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
),
(
  '00000000-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'bob@ironboy.local',
  crypt('IronBoyDev123!', gen_salt('bf')),
  now(),
  null,
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"Bob"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
);


-- ------------------------------------------------------------
-- Email identities
-- ------------------------------------------------------------

insert into auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values
(
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  jsonb_build_object(
    'sub', '11111111-1111-1111-1111-111111111111',
    'email', 'alice@ironboy.local'
  ),
  'email',
  null,
  now(),
  now()
),
(
  '22222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  jsonb_build_object(
    'sub', '22222222-2222-2222-2222-222222222222',
    'email', 'bob@ironboy.local'
  ),
  'email',
  null,
  now(),
  now()
);


-- ------------------------------------------------------------
-- Profiles
-- ------------------------------------------------------------
--
-- Normally these are created by the auth.users trigger.
-- We only update the display name here.
-- ------------------------------------------------------------

update public.profiles
set display_name = 'Alice'
where id = '11111111-1111-1111-1111-111111111111';

update public.profiles
set display_name = 'Bob'
where id = '22222222-2222-2222-2222-222222222222';


-- ------------------------------------------------------------
-- Alice activities
-- ------------------------------------------------------------

insert into public.activities (
  id,
  user_id,
  sport,
  started_at,
  duration_seconds,
  distance_meters,
  avg_heart_rate_bpm,
  max_heart_rate_bpm,
  feeling,
  comment,
  source
)
values
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  '11111111-1111-1111-1111-111111111111',
  'running',
  now() - interval '6 days',
  3600,
  10000,
  152,
  174,
  'moderate',
  'Easy endurance run',
  'manual'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
  '11111111-1111-1111-1111-111111111111',
  'cycling',
  now() - interval '4 days',
  5400,
  42000,
  143,
  168,
  'hard',
  'Hilly ride',
  'manual'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
  '11111111-1111-1111-1111-111111111111',
  'swimming',
  now() - interval '2 days',
  2700,
  2500,
  138,
  155,
  'easy',
  'Pool session',
  'manual'
);


-- ------------------------------------------------------------
-- Bob activities
-- ------------------------------------------------------------

insert into public.activities (
  id,
  user_id,
  sport,
  started_at,
  duration_seconds,
  distance_meters,
  avg_heart_rate_bpm,
  max_heart_rate_bpm,
  feeling,
  comment,
  source
)
values
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
  '22222222-2222-2222-2222-222222222222',
  'running',
  now() - interval '5 days',
  3000,
  6500,
  148,
  165,
  'easy',
  'Recovery run',
  'manual'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
  '22222222-2222-2222-2222-222222222222',
  'cycling',
  now() - interval '3 days',
  4500,
  32000,
  139,
  161,
  'moderate',
  'Steady ride',
  'manual'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
  '22222222-2222-2222-2222-222222222222',
  'swimming',
  now() - interval '1 day',
  2400,
  2000,
  141,
  158,
  'moderate',
  'Technique session',
  'manual'
);


-- ------------------------------------------------------------
-- Activity environment
-- ------------------------------------------------------------

insert into public.activity_environment (
  activity_id,
  elevation_gain_m,
  elevation_loss_m,
  min_altitude_m,
  max_altitude_m,
  temperature_c,
  wind_speed_kmh,
  wind_direction,
  weather
)
values
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  85,
  82,
  210,
  295,
  16.5,
  12.5,
  'ne',
  'partly_sunny'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
  420,
  415,
  180,
  560,
  14.0,
  18.0,
  'o',
  'overcast'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
  35,
  34,
  205,
  240,
  18.0,
  8.5,
  's',
  'sunny'
);


-- ------------------------------------------------------------
-- Running details
-- ------------------------------------------------------------

insert into public.running_activities (
  activity_id,
  avg_cadence_spm,
  max_cadence_spm
)
values
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  168,
  181
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
  164,
  176
);


-- ------------------------------------------------------------
-- Cycling details
-- ------------------------------------------------------------

insert into public.cycling_activities (
  activity_id,
  avg_cadence_rpm,
  max_cadence_rpm,
  avg_power_w,
  max_power_w
)
values
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
  82,
  104,
  185,
  465
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
  79,
  101,
  168,
  390
);


-- ------------------------------------------------------------
-- Swimming details
-- ------------------------------------------------------------

insert into public.swimming_activities (
  activity_id,
  environment,
  pool_length_m
)
values
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
  'pool',
  25
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
  'pool',
  25
);


-- ------------------------------------------------------------
-- Equipment
-- ------------------------------------------------------------

insert into public.equipment (
  id,
  user_id,
  name,
  type,
  purchased_at
)
values
(
  'aaaa1111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'Nike Pegasus 41',
  'running_shoes',
  current_date - 180
),
(
  'aaaa2222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Canyon Speedmax',
  'bike',
  current_date - 365
),
(
  'bbbb1111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Saucony Endorphin Speed',
  'running_shoes',
  current_date - 120
),
(
  'bbbb2222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  'Arena Pull Buoy',
  'swim_equipment',
  current_date - 60
);


-- ------------------------------------------------------------
-- Activity ↔ Equipment
-- ------------------------------------------------------------

insert into public.activity_equipment (
  activity_id,
  equipment_id
)
values
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  'aaaa1111-1111-1111-1111-111111111111'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
  'aaaa2222-2222-2222-2222-222222222222'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
  'bbbb1111-1111-1111-1111-111111111111'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
  'bbbb2222-2222-2222-2222-222222222222'
);