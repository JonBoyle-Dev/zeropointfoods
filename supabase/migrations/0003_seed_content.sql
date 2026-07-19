-- Phase 4 — curated content seed (handover-doc.md §6).
-- A starter food database across all 8 categories, a handful of Zero-Point
-- Meals per meal type, a Mixers list, and a Flavor Boosters list. All
-- nutrition figures are typical/representative values for common
-- foods — not sourced from any proprietary database. points_per_serving is
-- pre-computed by hand using spec §2.2 (calories/33 + sat_fat*0.4 + sugar*0.3
-- - protein*0.2, floored at 0), and set to 0 for is_zero_point rows to match
-- what calculateFoodPoints() would return in the app.
-- is_user_created = false marks this as curated/global content (spec §3).

-- ===== Protein =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Chicken breast, grilled, skinless', 'protein', 165, 1, 0, 31, 100, 'g', 0, true, false, false, false),
  ('Turkey breast, roasted', 'protein', 135, 0.4, 0, 30, 100, 'g', 0, true, false, false, false),
  ('White fish (cod), baked', 'protein', 105, 0.2, 0, 23, 100, 'g', 0, true, false, false, false),
  ('Shrimp, cooked', 'protein', 99, 0.3, 0, 24, 100, 'g', 0, true, false, false, false),
  ('Salmon, grilled', 'protein', 208, 3.1, 0, 20, 100, 'g', 4, false, false, false, false),
  ('Lean ground beef (5% fat), cooked', 'protein', 137, 2, 0, 21, 100, 'g', 1, false, false, false, false),
  ('Pork tenderloin, roasted', 'protein', 143, 1.4, 0, 26, 100, 'g', 0, true, false, false, false),
  ('Egg, whole, boiled', 'protein', 78, 1.6, 0.4, 6.3, 1, 'egg', 2, false, false, false, false),
  ('Egg whites', 'protein', 17, 0, 0.2, 3.6, 1, 'white', 0, true, false, false, false),
  ('Tofu, firm', 'protein', 76, 1.3, 0.5, 8, 100, 'g', 0, true, false, false, false);

-- ===== Dairy =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Non-fat plain Greek yogurt', 'dairy', 59, 0, 3.6, 10, 100, 'g', 0, true, false, false, false),
  ('Skim milk', 'dairy', 34, 0, 5, 3.4, 100, 'ml', 2, false, false, false, false),
  ('Cottage cheese, low fat 2%', 'dairy', 82, 0.6, 3, 11, 100, 'g', 0, true, false, false, false),
  ('Cheddar cheese', 'dairy', 403, 21, 0.5, 25, 100, 'g', 16, false, false, false, false),
  ('Mozzarella, part skim', 'dairy', 254, 5, 1, 24, 100, 'g', 5, false, false, false, false),
  ('Butter', 'dairy', 717, 51, 0.1, 0.9, 100, 'g', 42, false, false, false, false),
  ('Whole milk', 'dairy', 61, 1.9, 5, 3.2, 100, 'ml', 3, false, false, false, false),
  ('Low-fat plain yogurt', 'dairy', 63, 1, 4.7, 5.3, 100, 'g', 3, false, false, false, false);

-- ===== Grains =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('White rice, cooked', 'grains', 130, 0.1, 0.1, 2.7, 100, 'g', 3, false, false, false, false),
  ('Brown rice, cooked', 'grains', 112, 0.2, 0.4, 2.6, 100, 'g', 3, false, false, false, false),
  ('Whole wheat bread', 'grains', 69, 0.14, 1.4, 3.6, 1, 'slice', 2, false, false, false, false),
  ('Rolled oats, dry', 'grains', 150, 0.5, 0.5, 5, 40, 'g', 4, false, false, false, false),
  ('Whole wheat pasta, cooked', 'grains', 124, 0.1, 0.5, 5, 100, 'g', 3, false, false, false, false),
  ('Quinoa, cooked', 'grains', 120, 0.2, 0.9, 4.4, 100, 'g', 3, false, false, false, false),
  ('Corn tortilla', 'grains', 52, 0.1, 0.4, 1.4, 1, 'tortilla', 1, false, false, false, false),
  ('Bagel, plain', 'grains', 245, 0.3, 4, 10, 1, 'medium', 7, false, false, false, false);

-- ===== Fruit & Veg =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Broccoli, steamed', 'fruit_veg', 35, 0, 1.7, 2.4, 100, 'g', 0, true, false, false, false),
  ('Spinach, raw', 'fruit_veg', 23, 0, 0.4, 2.9, 100, 'g', 0, true, false, false, false),
  ('Green beans, steamed', 'fruit_veg', 35, 0, 3.3, 1.8, 100, 'g', 0, true, false, false, false),
  ('Zucchini, sauteed', 'fruit_veg', 17, 0, 2.5, 1.2, 100, 'g', 0, true, false, false, false),
  ('Bell pepper, raw', 'fruit_veg', 31, 0, 4.2, 1, 100, 'g', 0, true, false, false, false),
  ('Cucumber, raw', 'fruit_veg', 15, 0, 1.7, 0.7, 100, 'g', 0, true, false, false, false),
  ('Cherry tomatoes', 'fruit_veg', 18, 0, 2.6, 0.9, 100, 'g', 0, true, false, false, false),
  ('Cauliflower, steamed', 'fruit_veg', 25, 0, 1.9, 1.9, 100, 'g', 0, true, false, false, false),
  ('Mixed salad greens', 'fruit_veg', 15, 0, 0.5, 1.4, 100, 'g', 0, true, false, false, false),
  ('Carrots, raw', 'fruit_veg', 41, 0, 4.7, 0.9, 100, 'g', 0, true, false, false, false),
  ('Apple, medium', 'fruit_veg', 95, 0, 19, 0.5, 1, 'medium', 8, false, false, false, false),
  ('Banana, medium', 'fruit_veg', 105, 0.1, 14, 1.3, 1, 'medium', 7, false, false, false, false),
  ('Strawberries', 'fruit_veg', 32, 0, 4.9, 0.7, 100, 'g', 0, true, false, false, false),
  ('Blueberries', 'fruit_veg', 57, 0, 10, 0.7, 100, 'g', 5, false, false, false, false),
  ('Watermelon', 'fruit_veg', 30, 0, 6, 0.6, 100, 'g', 3, false, false, false, false),
  ('Orange, medium', 'fruit_veg', 62, 0, 12, 1.2, 1, 'medium', 5, false, false, false, false);

-- ===== Alcohol (never zero-point, spec §2.2) =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Red wine', 'alcohol', 125, 0, 0.9, 0.1, 150, 'ml', 4, false, false, false, false),
  ('White wine', 'alcohol', 121, 0, 1, 0.1, 150, 'ml', 4, false, false, false, false),
  ('Light beer', 'alcohol', 103, 0, 0.3, 0.9, 355, 'ml', 3, false, false, false, false),
  ('Regular beer', 'alcohol', 153, 0, 0, 1.6, 355, 'ml', 4, false, false, false, false),
  ('Vodka, single shot', 'alcohol', 97, 0, 0, 0, 44, 'ml', 3, false, false, false, false),
  ('Gin & tonic (regular tonic)', 'alcohol', 175, 0, 16, 0, 1, 'serving', 10, false, false, false, false);

-- ===== Snacks =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Almonds', 'snacks', 164, 1.1, 1.2, 6, 28, 'g', 5, false, false, false, false),
  ('Popcorn, air-popped', 'snacks', 31, 0.1, 0.1, 1, 1, 'cup', 1, false, false, false, false),
  ('Potato chips', 'snacks', 152, 1.9, 0.1, 2, 28, 'g', 5, false, false, false, false),
  ('Dark chocolate (70%)', 'snacks', 170, 6, 7, 2, 28, 'g', 9, false, false, false, false),
  ('Rice cakes, plain', 'snacks', 35, 0.1, 0.1, 0.7, 1, 'cake', 1, false, false, false, false),
  ('Beef jerky', 'snacks', 82, 1, 3, 13, 28, 'g', 1, false, false, false, false),
  ('Hummus', 'snacks', 70, 0.5, 0.2, 2, 30, 'g', 2, false, false, false, false),
  ('Trail mix', 'snacks', 137, 1.5, 7, 4, 28, 'g', 6, false, false, false, false);

-- ===== Condiments (includes flavor boosters — flags on foods, not a separate table, spec §5) =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Ketchup', 'condiments', 15, 0, 3, 0.2, 1, 'tbsp', 1, false, false, false, false),
  ('Mayonnaise', 'condiments', 94, 1.6, 0.1, 0.1, 1, 'tbsp', 4, false, false, false, false),
  ('Mustard, yellow', 'condiments', 3, 0, 0.1, 0.2, 1, 'tbsp', 0, true, false, true, false),
  ('Soy sauce, low sodium', 'condiments', 8, 0, 0.4, 1.3, 1, 'tbsp', 0, true, false, true, false),
  ('Balsamic vinegar', 'condiments', 14, 0, 2.4, 0.1, 1, 'tbsp', 0, true, false, true, false),
  ('Hot sauce', 'condiments', 1, 0, 0.1, 0, 1, 'tsp', 0, true, false, true, false),
  ('BBQ sauce', 'condiments', 29, 0, 7, 0.2, 1, 'tbsp', 3, false, false, false, false),
  ('Ranch dressing', 'condiments', 73, 1, 0.5, 0.2, 1, 'tbsp', 3, false, false, false, false),
  ('Chili flakes', 'condiments', 6, 0, 0.2, 0.2, 1, 'tsp', 0, true, false, true, false),
  ('Garlic powder', 'condiments', 10, 0, 0.1, 0.5, 1, 'tsp', 0, true, false, true, false),
  ('Fresh lemon juice', 'condiments', 3, 0, 0.8, 0.1, 1, 'tbsp', 0, true, false, true, false),
  ('Apple cider vinegar', 'condiments', 3, 0, 0.1, 0, 1, 'tbsp', 0, true, false, true, false),
  ('Black pepper', 'condiments', 6, 0, 0, 0.2, 1, 'tsp', 0, true, false, true, false),
  ('Fresh basil, chopped', 'condiments', 1, 0, 0, 0.1, 1, 'tbsp', 0, true, false, true, false);

-- ===== Custom (mixers — flags on foods, not a separate table, spec §5) =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Soda water', 'custom', 0, 0, 0, 0, 1, 'cup', 0, true, true, false, false),
  ('Diet tonic water', 'custom', 0, 0, 0, 0, 1, 'cup', 0, true, true, false, false),
  ('Diet cola', 'custom', 0, 0, 0, 0, 1, 'can', 0, true, true, false, false),
  ('Fresh lime wedge', 'custom', 2, 0, 0.4, 0, 1, 'wedge', 0, true, true, false, false),
  ('Sparkling water, unflavored', 'custom', 0, 0, 0, 0, 1, 'can', 0, true, true, false, false),
  ('Club soda', 'custom', 0, 0, 0, 0, 1, 'cup', 0, true, true, false, false);

-- ===== Zero-Point Meals — 4 per meal type, one-tap logs all ingredients =====

-- Breakfast
insert into zero_point_meals (name, meal_type, description, is_user_created) values
  ('Egg white & spinach scramble', 'breakfast', 'Egg whites, spinach, cherry tomato, black pepper.', false),
  ('Greek yogurt with strawberries', 'breakfast', 'Non-fat Greek yogurt topped with fresh strawberries.', false),
  ('Turkey & egg white breakfast bowl', 'breakfast', 'Turkey breast, egg whites, bell pepper.', false),
  ('Tofu veggie scramble', 'breakfast', 'Firm tofu, spinach, bell pepper, black pepper.', false);

insert into zero_point_meal_ingredients (meal_id, food_id, quantity)
  select m.id, f.id, v.quantity from (values
    ('Egg white & spinach scramble', 'Egg whites', 3),
    ('Egg white & spinach scramble', 'Spinach, raw', 1),
    ('Egg white & spinach scramble', 'Cherry tomatoes', 1),
    ('Egg white & spinach scramble', 'Black pepper', 1),
    ('Greek yogurt with strawberries', 'Non-fat plain Greek yogurt', 1),
    ('Greek yogurt with strawberries', 'Strawberries', 1),
    ('Turkey & egg white breakfast bowl', 'Turkey breast, roasted', 1),
    ('Turkey & egg white breakfast bowl', 'Egg whites', 2),
    ('Turkey & egg white breakfast bowl', 'Bell pepper, raw', 1),
    ('Tofu veggie scramble', 'Tofu, firm', 1),
    ('Tofu veggie scramble', 'Spinach, raw', 1),
    ('Tofu veggie scramble', 'Bell pepper, raw', 1),
    ('Tofu veggie scramble', 'Black pepper', 1)
  ) as v(meal_name, food_name, quantity)
  join zero_point_meals m on m.name = v.meal_name
  join foods f on f.name = v.food_name;

-- Lunch
insert into zero_point_meals (name, meal_type, description, is_user_created) values
  ('Grilled chicken & garden salad', 'lunch', 'Chicken breast, mixed greens, cucumber, cherry tomatoes, lemon juice.', false),
  ('Shrimp & zucchini stir-fry', 'lunch', 'Shrimp, zucchini, bell pepper, garlic powder.', false),
  ('Turkey lettuce wraps', 'lunch', 'Turkey breast, mixed greens, cucumber, balsamic vinegar.', false),
  ('White fish & steamed veg', 'lunch', 'Baked cod, broccoli, cauliflower, lemon juice.', false);

insert into zero_point_meal_ingredients (meal_id, food_id, quantity)
  select m.id, f.id, v.quantity from (values
    ('Grilled chicken & garden salad', 'Chicken breast, grilled, skinless', 1),
    ('Grilled chicken & garden salad', 'Mixed salad greens', 1),
    ('Grilled chicken & garden salad', 'Cucumber, raw', 1),
    ('Grilled chicken & garden salad', 'Cherry tomatoes', 1),
    ('Grilled chicken & garden salad', 'Fresh lemon juice', 1),
    ('Shrimp & zucchini stir-fry', 'Shrimp, cooked', 1),
    ('Shrimp & zucchini stir-fry', 'Zucchini, sauteed', 1),
    ('Shrimp & zucchini stir-fry', 'Bell pepper, raw', 1),
    ('Shrimp & zucchini stir-fry', 'Garlic powder', 1),
    ('Turkey lettuce wraps', 'Turkey breast, roasted', 1),
    ('Turkey lettuce wraps', 'Mixed salad greens', 1),
    ('Turkey lettuce wraps', 'Cucumber, raw', 1),
    ('Turkey lettuce wraps', 'Balsamic vinegar', 1),
    ('White fish & steamed veg', 'White fish (cod), baked', 1),
    ('White fish & steamed veg', 'Broccoli, steamed', 1),
    ('White fish & steamed veg', 'Cauliflower, steamed', 1),
    ('White fish & steamed veg', 'Fresh lemon juice', 1)
  ) as v(meal_name, food_name, quantity)
  join zero_point_meals m on m.name = v.meal_name
  join foods f on f.name = v.food_name;

-- Dinner
insert into zero_point_meals (name, meal_type, description, is_user_created) values
  ('Herby grilled chicken & steamed greens', 'dinner', 'Chicken breast, broccoli, garlic, lemon. Built entirely from zero-point ingredients.', false),
  ('Pork tenderloin with green beans', 'dinner', 'Pork tenderloin, green beans, chili flakes.', false),
  ('Baked cod with cauliflower mash', 'dinner', 'Baked cod, cauliflower, lemon juice, black pepper.', false),
  ('Turkey & vegetable skillet', 'dinner', 'Turkey breast, zucchini, bell pepper, cherry tomatoes, chili flakes.', false);

insert into zero_point_meal_ingredients (meal_id, food_id, quantity)
  select m.id, f.id, v.quantity from (values
    ('Herby grilled chicken & steamed greens', 'Chicken breast, grilled, skinless', 1),
    ('Herby grilled chicken & steamed greens', 'Broccoli, steamed', 1),
    ('Herby grilled chicken & steamed greens', 'Garlic powder', 1),
    ('Herby grilled chicken & steamed greens', 'Fresh lemon juice', 1),
    ('Pork tenderloin with green beans', 'Pork tenderloin, roasted', 1),
    ('Pork tenderloin with green beans', 'Green beans, steamed', 1),
    ('Pork tenderloin with green beans', 'Chili flakes', 1),
    ('Baked cod with cauliflower mash', 'White fish (cod), baked', 1),
    ('Baked cod with cauliflower mash', 'Cauliflower, steamed', 1),
    ('Baked cod with cauliflower mash', 'Fresh lemon juice', 1),
    ('Baked cod with cauliflower mash', 'Black pepper', 1),
    ('Turkey & vegetable skillet', 'Turkey breast, roasted', 1),
    ('Turkey & vegetable skillet', 'Zucchini, sauteed', 1),
    ('Turkey & vegetable skillet', 'Bell pepper, raw', 1),
    ('Turkey & vegetable skillet', 'Cherry tomatoes', 1),
    ('Turkey & vegetable skillet', 'Chili flakes', 1)
  ) as v(meal_name, food_name, quantity)
  join zero_point_meals m on m.name = v.meal_name
  join foods f on f.name = v.food_name;

-- Snack
insert into zero_point_meals (name, meal_type, description, is_user_created) values
  ('Cottage cheese & cucumber bites', 'snack', 'Low-fat cottage cheese, cucumber, black pepper.', false),
  ('Crunchy veggie plate', 'snack', 'Carrots, cucumber, bell pepper.', false),
  ('Egg white bites', 'snack', 'Egg whites, bell pepper.', false),
  ('Strawberries & Greek yogurt cup', 'snack', 'Fresh strawberries with non-fat Greek yogurt.', false);

insert into zero_point_meal_ingredients (meal_id, food_id, quantity)
  select m.id, f.id, v.quantity from (values
    ('Cottage cheese & cucumber bites', 'Cottage cheese, low fat 2%', 1),
    ('Cottage cheese & cucumber bites', 'Cucumber, raw', 1),
    ('Cottage cheese & cucumber bites', 'Black pepper', 1),
    ('Crunchy veggie plate', 'Carrots, raw', 1),
    ('Crunchy veggie plate', 'Cucumber, raw', 1),
    ('Crunchy veggie plate', 'Bell pepper, raw', 1),
    ('Egg white bites', 'Egg whites', 2),
    ('Egg white bites', 'Bell pepper, raw', 1),
    ('Strawberries & Greek yogurt cup', 'Strawberries', 1),
    ('Strawberries & Greek yogurt cup', 'Non-fat plain Greek yogurt', 1)
  ) as v(meal_name, food_name, quantity)
  join zero_point_meals m on m.name = v.meal_name
  join foods f on f.name = v.food_name;
