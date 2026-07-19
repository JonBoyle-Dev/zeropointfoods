-- zeropointfoods — core schema
-- Run in the Supabase SQL editor in this order: schema.sql, policies.sql, seed.sql

create extension if not exists "pgcrypto";

create type sex as enum ('female', 'male');
create type activity_level as enum ('sedentary', 'low_active', 'active', 'very_active');
create type units_preference as enum ('metric', 'imperial');
-- Generic weekday enum — the weekly reset day is user-configurable, never hardcode Monday-start logic (spec §5).
create type weekday as enum ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
create type food_category as enum ('protein', 'dairy', 'grains', 'fruit_veg', 'alcohol', 'snacks', 'condiments', 'custom');
create type meal_type as enum ('breakfast', 'lunch', 'dinner', 'snack');

create table users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  sex sex,
  height_cm numeric not null,
  date_of_birth date not null,
  activity_level activity_level not null default 'sedentary',
  weekly_reset_day weekday not null default 'monday',
  units_preference units_preference not null default 'metric',
  daily_points_allowance numeric not null default 20,
  current_weight_kg numeric not null
);

create table weigh_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  weight_kg numeric not null,
  logged_at timestamptz not null default now()
);
create index weigh_ins_user_idx on weigh_ins (user_id);

create table foods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category food_category not null,
  calories numeric not null,
  sat_fat_g numeric not null default 0,
  sugar_g numeric not null default 0,
  protein_g numeric not null default 0,
  serving_size numeric not null default 1,
  serving_unit text not null default 'serving',
  points_per_serving numeric not null,
  is_zero_point boolean not null default false,
  is_mixer boolean not null default false,
  is_flavor_booster boolean not null default false,
  is_user_created boolean not null default true,
  created_by_user_id uuid references users(id) on delete set null,
  -- Alcohol is never zero-point (spec §2.2) — enforced in the app layer via calculateFoodPoints,
  -- but this check backstops it at the data layer too.
  check (not (is_zero_point and category = 'alcohol'))
);
create index foods_category_idx on foods (category);

create table food_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  food_id uuid not null references foods(id) on delete cascade,
  logged_date date not null,
  meal_type meal_type not null,
  quantity numeric not null default 1 check (quantity > 0),
  -- Snapshotted at log time — editing a food later must not retroactively change past entries (spec §5).
  points_used numeric not null
);
create index food_entries_user_date_idx on food_entries (user_id, logged_date);
create index food_entries_food_idx on food_entries (food_id);

create table recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  total_points numeric not null default 0
);
create index recipes_user_idx on recipes (user_id);

create table recipe_ingredients (
  recipe_id uuid not null references recipes(id) on delete cascade,
  food_id uuid not null references foods(id) on delete cascade,
  quantity numeric not null default 1 check (quantity > 0),
  primary key (recipe_id, food_id)
);

create table zero_point_meals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  meal_type meal_type not null,
  description text,
  image_url text,
  is_user_created boolean not null default false,
  created_by_user_id uuid references users(id) on delete set null
);
create index zero_point_meals_type_idx on zero_point_meals (meal_type);

create table zero_point_meal_ingredients (
  meal_id uuid not null references zero_point_meals(id) on delete cascade,
  food_id uuid not null references foods(id) on delete cascade,
  quantity numeric not null default 1 check (quantity > 0),
  primary key (meal_id, food_id)
);

create table activities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  met_value numeric not null,
  is_user_created boolean not null default false
);

create table activity_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  activity_id uuid not null references activities(id) on delete cascade,
  logged_date date not null,
  duration_minutes numeric not null check (duration_minutes > 0),
  -- Calculated + snapshotted at log time (spec §4), same rationale as food_entries.points_used.
  points_earned numeric not null
);
create index activity_entries_user_date_idx on activity_entries (user_id, logged_date);

create table water_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  logged_date date not null,
  amount_ml numeric not null check (amount_ml > 0)
);
create index water_entries_user_date_idx on water_entries (user_id, logged_date);

-- Materialized daily rollup — computed/upserted in the app layer after each log action,
-- not a view, so monthly reports don't recompute from raw entries every load (spec §5).
create table daily_summary (
  user_id uuid not null references users(id) on delete cascade,
  date date not null,
  points_allowance numeric not null,
  points_used numeric not null default 0,
  activity_points_earned numeric not null default 0,
  rollover_to_weekly numeric not null default 0,
  is_over_budget boolean not null default false,
  primary key (user_id, date)
);

create table weekly_cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  -- Keyed to the user's own weekly_reset_day — "the week" is not a fixed Mon-start calendar concept (spec §5).
  week_start_date date not null,
  weekly_bank_starting numeric not null default 0,
  weekly_bank_current numeric not null default 0,
  unique (user_id, week_start_date)
);
create index weekly_cycles_user_idx on weekly_cycles (user_id);
