-- zeropointfoods — Row Level Security
-- Run after schema.sql
--
-- No auth/login exists — this is a single-user personal app. RLS stays
-- enabled with permissive policies rather than disabled outright: it avoids
-- tripping Supabase's security advisor and documents the openness as
-- intentional rather than an oversight. Only the anon/publishable key is
-- ever used client-side. If this app is ever shared beyond one person,
-- swap these for Supabase Auth + auth.uid()-scoped policies first.

alter table users enable row level security;
alter table weigh_ins enable row level security;
alter table foods enable row level security;
alter table food_entries enable row level security;
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;
alter table zero_point_meals enable row level security;
alter table zero_point_meal_ingredients enable row level security;
alter table activities enable row level security;
alter table activity_entries enable row level security;
alter table water_entries enable row level security;
alter table daily_summary enable row level security;
alter table weekly_cycles enable row level security;

create policy "public all users" on users for all using (true) with check (true);
create policy "public all weigh_ins" on weigh_ins for all using (true) with check (true);
create policy "public all foods" on foods for all using (true) with check (true);
create policy "public all food_entries" on food_entries for all using (true) with check (true);
create policy "public all recipes" on recipes for all using (true) with check (true);
create policy "public all recipe_ingredients" on recipe_ingredients for all using (true) with check (true);
create policy "public all zero_point_meals" on zero_point_meals for all using (true) with check (true);
create policy "public all zero_point_meal_ingredients" on zero_point_meal_ingredients for all using (true) with check (true);
create policy "public all activities" on activities for all using (true) with check (true);
create policy "public all activity_entries" on activity_entries for all using (true) with check (true);
create policy "public all water_entries" on water_entries for all using (true) with check (true);
create policy "public all daily_summary" on daily_summary for all using (true) with check (true);
create policy "public all weekly_cycles" on weekly_cycles for all using (true) with check (true);
