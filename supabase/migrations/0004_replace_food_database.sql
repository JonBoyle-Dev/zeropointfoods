-- Replaces the invented Phase 4 curated food seed with a real South African
-- WW Freestyle-style points reference table (~250 items across 14 categories),
-- provided directly by the user. Unlike the previous seed, points here are
-- authoritative given values, not derived from calculateFoodPoints() —
-- calories/sat_fat_g/sugar_g/protein_g are set to 0 (unknown/not provided)
-- since nothing in the app recomputes points_per_serving from them once set.
--
-- Deletes old curated (is_user_created = false) zero_point_meals and foods
-- first. zero_point_meal_ingredients cascades away with the meals. foods has
-- ON DELETE CASCADE from food_entries/recipe_ingredients/zero_point_meal_ingredients,
-- so any previously-logged test entries referencing the old curated foods
-- (not user-created ones) will disappear too — expected here since this is
-- a deliberate full replacement of the shared library, not incidental data
-- loss. Run the daily_summary reconciliation at the bottom afterward.

delete from zero_point_meal_ingredients where meal_id in (select id from zero_point_meals where is_user_created = false);
delete from zero_point_meals where is_user_created = false;
delete from foods where is_user_created = false;

-- ===== Part 1: Fruit (fruit_veg, all zero-point except avocado) =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Apple', 'fruit_veg', 0, 0, 0, 0, 1, 'medium', 0, true, false, false, false),
  ('Apricot', 'fruit_veg', 0, 0, 0, 0, 2, 'medium', 0, true, false, false, false),
  ('Avocado', 'fruit_veg', 0, 0, 0, 0, 0.25, 'medium', 2, false, false, false, false),
  ('Banana', 'fruit_veg', 0, 0, 0, 0, 1, 'medium', 0, true, false, false, false),
  ('Blackberries', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 0, true, false, false, false),
  ('Blueberries', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 0, true, false, false, false),
  ('Cherries', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 0, true, false, false, false),
  ('Clementine', 'fruit_veg', 0, 0, 0, 0, 2, 'small', 0, true, false, false, false),
  ('Cranberries (fresh)', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 0, true, false, false, false),
  ('Grapefruit', 'fruit_veg', 0, 0, 0, 0, 0.5, 'large', 0, true, false, false, false),
  ('Grapes', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 0, true, false, false, false),
  ('Guava', 'fruit_veg', 0, 0, 0, 0, 1, 'medium', 0, true, false, false, false),
  ('Kiwi Fruit', 'fruit_veg', 0, 0, 0, 0, 2, 'small', 0, true, false, false, false),
  ('Lemon', 'fruit_veg', 0, 0, 0, 0, 1, 'whole', 0, true, false, false, false),
  ('Lime', 'fruit_veg', 0, 0, 0, 0, 1, 'whole', 0, true, false, false, false),
  ('Litchis', 'fruit_veg', 0, 0, 0, 0, 10, 'fruit', 0, true, false, false, false),
  ('Mango', 'fruit_veg', 0, 0, 0, 0, 1, 'cup diced', 0, true, false, false, false),
  ('Melon (Honeydew)', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 0, true, false, false, false),
  ('Naartjie', 'fruit_veg', 0, 0, 0, 0, 2, 'small', 0, true, false, false, false),
  ('Nectarine', 'fruit_veg', 0, 0, 0, 0, 1, 'medium', 0, true, false, false, false),
  ('Orange', 'fruit_veg', 0, 0, 0, 0, 1, 'medium', 0, true, false, false, false),
  ('Papaya (Pawpaw)', 'fruit_veg', 0, 0, 0, 0, 1, 'cup diced', 0, true, false, false, false),
  ('Passion Fruit', 'fruit_veg', 0, 0, 0, 0, 2, 'fruit', 0, true, false, false, false),
  ('Peach', 'fruit_veg', 0, 0, 0, 0, 1, 'medium', 0, true, false, false, false),
  ('Pear', 'fruit_veg', 0, 0, 0, 0, 1, 'medium', 0, true, false, false, false),
  ('Pineapple', 'fruit_veg', 0, 0, 0, 0, 1, 'cup diced', 0, true, false, false, false),
  ('Plum', 'fruit_veg', 0, 0, 0, 0, 2, 'medium', 0, true, false, false, false),
  ('Strawberries', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 0, true, false, false, false),
  ('Tangerine', 'fruit_veg', 0, 0, 0, 0, 2, 'small', 0, true, false, false, false),
  ('Watermelon', 'fruit_veg', 0, 0, 0, 0, 2, 'cups diced', 0, true, false, false, false);

-- ===== Part 2: Non-Starchy Vegetables (fruit_veg, all zero-point) =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Baby Marrow (Zucchini)', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 0, true, false, false, false),
  ('Broccoli', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 0, true, false, false, false),
  ('Capsicum (Bell Peppers)', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 0, true, false, false, false),
  ('Carrots', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 0, true, false, false, false),
  ('Cauliflower', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 0, true, false, false, false),
  ('Chilli Peppers', 'fruit_veg', 0, 0, 0, 0, 2, 'whole', 0, true, false, true, false),
  ('Cucumber', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 0, true, false, false, false),
  ('Garlic', 'fruit_veg', 0, 0, 0, 0, 3, 'cloves', 0, true, false, true, false),
  ('Green Beans', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 0, true, false, false, false),
  ('Lettuce (All varieties)', 'fruit_veg', 0, 0, 0, 0, 2, 'cups', 0, true, false, false, false),
  ('Mushrooms', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 0, true, false, false, false),
  ('Onion', 'fruit_veg', 0, 0, 0, 0, 0.5, 'cup', 0, true, false, false, false),
  ('Spinach', 'fruit_veg', 0, 0, 0, 0, 1, 'cup cooked', 0, true, false, false, false),
  ('Spring Onions', 'fruit_veg', 0, 0, 0, 0, 0.5, 'cup', 0, true, false, false, false),
  ('Tomato', 'fruit_veg', 0, 0, 0, 0, 1, 'medium', 0, true, false, false, false);

-- ===== Part 3: Starchy Vegetables (fruit_veg, none zero-point) =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Baby Potatoes', 'fruit_veg', 0, 0, 0, 0, 100, 'g (about 3-4)', 3, false, false, false, false),
  ('Butternut (cooked)', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 3, false, false, false, false),
  ('Corn Kernels', 'fruit_veg', 0, 0, 0, 0, 0.5, 'cup', 2, false, false, false, false),
  ('Corn on the Cob', 'fruit_veg', 0, 0, 0, 0, 1, 'medium cob', 3, false, false, false, false),
  ('Green Peas', 'fruit_veg', 0, 0, 0, 0, 0.5, 'cup', 2, false, false, false, false),
  ('Mixed Vegetables (with corn & peas)', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 2, false, false, false, false),
  ('Pumpkin (cooked)', 'fruit_veg', 0, 0, 0, 0, 1, 'cup', 3, false, false, false, false),
  ('Sweet Potato', 'fruit_veg', 0, 0, 0, 0, 100, 'g (about 1/2 large)', 3, false, false, false, false),
  ('White Potato (boiled or baked)', 'fruit_veg', 0, 0, 0, 0, 100, 'g (1 small)', 3, false, false, false, false),
  ('Yellow Sweetcorn', 'fruit_veg', 0, 0, 0, 0, 1, 'medium cob', 3, false, false, false, false);

-- ===== Part 4: Meat & Poultry (protein) =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Bacon (back, trimmed)', 'protein', 0, 0, 0, 0, 2, 'rashers', 3, false, false, false, false),
  ('Bacon (streaky)', 'protein', 0, 0, 0, 0, 2, 'rashers', 5, false, false, false, false),
  ('Beef Biltong (lean)', 'protein', 0, 0, 0, 0, 30, 'g', 1, false, false, false, false),
  ('Beef Fillet (trimmed)', 'protein', 0, 0, 0, 0, 100, 'g cooked', 3, false, false, false, false),
  ('Beef Mince (95% lean)', 'protein', 0, 0, 0, 0, 100, 'g cooked', 2, false, false, false, false),
  ('Beef Mince (Extra Lean 97-98%)', 'protein', 0, 0, 0, 0, 100, 'g cooked', 0, true, false, false, false),
  ('Beef Rump Steak (trimmed)', 'protein', 0, 0, 0, 0, 100, 'g cooked', 3, false, false, false, false),
  ('Beef Sirloin (trimmed)', 'protein', 0, 0, 0, 0, 100, 'g cooked', 3, false, false, false, false),
  ('Beef Stew Meat (trimmed)', 'protein', 0, 0, 0, 0, 100, 'g cooked', 3, false, false, false, false),
  ('Boerewors', 'protein', 0, 0, 0, 0, 100, 'g', 9, false, false, false, false),
  ('Chicken Breast (skinless)', 'protein', 0, 0, 0, 0, 100, 'g cooked', 0, true, false, false, false),
  ('Chicken Drumstick (skinless)', 'protein', 0, 0, 0, 0, 1, 'medium', 2, false, false, false, false),
  ('Chicken Thigh (skinless)', 'protein', 0, 0, 0, 0, 100, 'g cooked', 3, false, false, false, false),
  ('Chicken Wings (skinless)', 'protein', 0, 0, 0, 0, 2, 'wings', 4, false, false, false, false),
  ('Droewors', 'protein', 0, 0, 0, 0, 30, 'g', 3, false, false, false, false),
  ('Gammon', 'protein', 0, 0, 0, 0, 100, 'g', 3, false, false, false, false),
  ('Ham (lean)', 'protein', 0, 0, 0, 0, 50, 'g', 1, false, false, false, false),
  ('Lamb Leg (trimmed)', 'protein', 0, 0, 0, 0, 100, 'g cooked', 4, false, false, false, false),
  ('Lamb Loin Chop (trimmed)', 'protein', 0, 0, 0, 0, 100, 'g cooked', 5, false, false, false, false),
  ('Pork Chop (trimmed)', 'protein', 0, 0, 0, 0, 100, 'g cooked', 4, false, false, false, false),
  ('Pork Fillet', 'protein', 0, 0, 0, 0, 100, 'g cooked', 3, false, false, false, false),
  ('Pork Loin (trimmed)', 'protein', 0, 0, 0, 0, 100, 'g cooked', 3, false, false, false, false),
  ('Roast Beef (lean)', 'protein', 0, 0, 0, 0, 100, 'g', 2, false, false, false, false),
  ('Roast Chicken (skin removed)', 'protein', 0, 0, 0, 0, 100, 'g', 1, false, false, false, false);

-- ===== Part 5: Fish, Seafood & Eggs (protein) =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Calamari (grilled)', 'protein', 0, 0, 0, 0, 100, 'g cooked', 0, true, false, false, false),
  ('Eggs', 'protein', 0, 0, 0, 0, 1, 'large', 0, true, false, false, false),
  ('Egg Whites', 'protein', 0, 0, 0, 0, 2, 'large', 0, true, false, false, false),
  ('Hake', 'protein', 0, 0, 0, 0, 100, 'g cooked', 0, true, false, false, false),
  ('Kingklip', 'protein', 0, 0, 0, 0, 100, 'g cooked', 0, true, false, false, false),
  ('Mussels', 'protein', 0, 0, 0, 0, 100, 'g cooked', 0, true, false, false, false),
  ('Oysters', 'protein', 0, 0, 0, 0, 6, 'medium', 0, true, false, false, false),
  ('Prawns', 'protein', 0, 0, 0, 0, 100, 'g cooked', 0, true, false, false, false),
  ('Salmon', 'protein', 0, 0, 0, 0, 100, 'g cooked', 4, false, false, false, false),
  ('Tuna (in brine/water)', 'protein', 0, 0, 0, 0, 100, 'g drained', 0, true, false, false, false),
  ('Tuna (in oil, drained)', 'protein', 0, 0, 0, 0, 100, 'g drained', 3, false, false, false, false);

-- ===== Part 7: Dairy & Milk Alternatives (dairy) =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Almond Milk (unsweetened)', 'dairy', 0, 0, 0, 0, 250, 'ml', 1, false, false, false, false),
  ('Blue Cheese', 'dairy', 0, 0, 0, 0, 30, 'g', 4, false, false, false, false),
  ('Brie', 'dairy', 0, 0, 0, 0, 30, 'g', 4, false, false, false, false),
  ('Butter', 'dairy', 0, 0, 0, 0, 1, 'tsp', 2, false, false, false, false),
  ('Cheddar Cheese', 'dairy', 0, 0, 0, 0, 30, 'g', 4, false, false, false, false),
  ('Cottage Cheese (fat-free)', 'dairy', 0, 0, 0, 0, 0.5, 'cup', 0, true, false, false, false),
  ('Cottage Cheese (low-fat)', 'dairy', 0, 0, 0, 0, 0.5, 'cup', 2, false, false, false, false),
  ('Cream', 'dairy', 0, 0, 0, 0, 2, 'tbsp', 3, false, false, false, false),
  ('Cream Cheese', 'dairy', 0, 0, 0, 0, 2, 'tbsp', 3, false, false, false, false),
  ('Feta Cheese', 'dairy', 0, 0, 0, 0, 30, 'g', 3, false, false, false, false),
  ('Full Cream Milk', 'dairy', 0, 0, 0, 0, 250, 'ml', 4, false, false, false, false),
  ('Greek Yogurt (fat-free, plain)', 'dairy', 0, 0, 0, 0, 170, 'g', 0, true, false, false, false),
  ('Greek Yogurt (low-fat, plain)', 'dairy', 0, 0, 0, 0, 170, 'g', 2, false, false, false, false),
  ('Halloumi', 'dairy', 0, 0, 0, 0, 30, 'g', 4, false, false, false, false),
  ('Low-Fat Milk', 'dairy', 0, 0, 0, 0, 250, 'ml', 3, false, false, false, false),
  ('Mozzarella (light)', 'dairy', 0, 0, 0, 0, 30, 'g', 2, false, false, false, false),
  ('Mozzarella (regular)', 'dairy', 0, 0, 0, 0, 30, 'g', 3, false, false, false, false),
  ('Oat Milk (unsweetened)', 'dairy', 0, 0, 0, 0, 250, 'ml', 2, false, false, false, false),
  ('Parmesan Cheese', 'dairy', 0, 0, 0, 0, 2, 'tbsp', 2, false, false, false, false),
  ('Plain Yogurt (fat-free)', 'dairy', 0, 0, 0, 0, 170, 'g', 0, true, false, false, false),
  ('Plain Yogurt (low-fat)', 'dairy', 0, 0, 0, 0, 170, 'g', 2, false, false, false, false);

-- ===== Part 8: Bread, Rolls & Wraps (grains) =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Albany Brown Bread', 'grains', 0, 0, 0, 0, 2, 'slices', 4, false, false, false, false),
  ('Albany Low GI Bread', 'grains', 0, 0, 0, 0, 2, 'slices', 4, false, false, false, false),
  ('Albany Seeded Bread', 'grains', 0, 0, 0, 0, 2, 'slices', 5, false, false, false, false),
  ('Albany White Bread', 'grains', 0, 0, 0, 0, 2, 'slices', 5, false, false, false, false),
  ('Bagel (plain)', 'grains', 0, 0, 0, 0, 1, 'medium', 6, false, false, false, false),
  ('Baguette', 'grains', 0, 0, 0, 0, 50, 'g', 4, false, false, false, false),
  ('Bread Roll (brown)', 'grains', 0, 0, 0, 0, 1, 'small', 4, false, false, false, false),
  ('Bread Roll (white)', 'grains', 0, 0, 0, 0, 1, 'small', 5, false, false, false, false),
  ('Burger Bun', 'grains', 0, 0, 0, 0, 1, 'regular', 5, false, false, false, false),
  ('Ciabatta Roll', 'grains', 0, 0, 0, 0, 1, 'small', 5, false, false, false, false),
  ('Croissant (plain)', 'grains', 0, 0, 0, 0, 1, 'medium', 8, false, false, false, false),
  ('English Muffin', 'grains', 0, 0, 0, 0, 1, 'muffin', 4, false, false, false, false),
  ('Hot Dog Roll', 'grains', 0, 0, 0, 0, 1, 'roll', 5, false, false, false, false),
  ('Low-Carb Wrap', 'grains', 0, 0, 0, 0, 1, 'medium', 3, false, false, false, false),
  ('Pita Bread', 'grains', 0, 0, 0, 0, 1, 'small', 4, false, false, false, false),
  ('Provita Original', 'grains', 0, 0, 0, 0, 4, 'crispbreads', 3, false, false, false, false),
  ('Provita Wholewheat', 'grains', 0, 0, 0, 0, 4, 'crispbreads', 3, false, false, false, false),
  ('Ryvita Original', 'grains', 0, 0, 0, 0, 2, 'crispbreads', 2, false, false, false, false),
  ('Ryvita Multigrain', 'grains', 0, 0, 0, 0, 2, 'crispbreads', 2, false, false, false, false),
  ('Sasko Brown Bread', 'grains', 0, 0, 0, 0, 2, 'slices', 4, false, false, false, false),
  ('Sasko Low GI Bread', 'grains', 0, 0, 0, 0, 2, 'slices', 4, false, false, false, false),
  ('Sasko White Bread', 'grains', 0, 0, 0, 0, 2, 'slices', 5, false, false, false, false),
  ('Seeded Roll', 'grains', 0, 0, 0, 0, 1, 'small', 5, false, false, false, false),
  ('Tortilla Wrap (white)', 'grains', 0, 0, 0, 0, 1, 'medium', 5, false, false, false, false),
  ('Tortilla Wrap (wholewheat)', 'grains', 0, 0, 0, 0, 1, 'medium', 4, false, false, false, false),
  ('Vetkoek (plain)', 'grains', 0, 0, 0, 0, 1, 'medium', 9, false, false, false, false),
  ('Wholewheat Bread', 'grains', 0, 0, 0, 0, 2, 'slices', 4, false, false, false, false),
  ('Wholewheat Pita', 'grains', 0, 0, 0, 0, 1, 'small', 4, false, false, false, false),
  ('Woolworths Low GI Bread', 'grains', 0, 0, 0, 0, 2, 'slices', 4, false, false, false, false);

-- ===== Part 9: Breakfast Cereals (grains) =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Bokomo Granola', 'grains', 0, 0, 0, 0, 45, 'g', 6, false, false, false, false),
  ('Bokomo Muesli', 'grains', 0, 0, 0, 0, 45, 'g', 5, false, false, false, false),
  ('Bran Flakes', 'grains', 0, 0, 0, 0, 40, 'g', 4, false, false, false, false),
  ('Cheerios', 'grains', 0, 0, 0, 0, 39, 'g', 4, false, false, false, false),
  ('Corn Flakes', 'grains', 0, 0, 0, 0, 30, 'g', 4, false, false, false, false),
  ('Futurelife High Protein', 'grains', 0, 0, 0, 0, 50, 'g', 4, false, false, false, false),
  ('Futurelife Original', 'grains', 0, 0, 0, 0, 50, 'g', 4, false, false, false, false),
  ('Futurelife Smart Oats', 'grains', 0, 0, 0, 0, 50, 'g', 4, false, false, false, false),
  ('Granola (plain)', 'grains', 0, 0, 0, 0, 45, 'g', 6, false, false, false, false),
  ('High-Fibre Bran Cereal', 'grains', 0, 0, 0, 0, 40, 'g', 4, false, false, false, false),
  ('Instant Oats (plain, cooked)', 'grains', 0, 0, 0, 0, 0.5, 'cup', 4, false, false, false, false),
  ('Jungle Oats (cooked)', 'grains', 0, 0, 0, 0, 0.5, 'cup', 4, false, false, false, false),
  ('Kellogg''s Special K Original', 'grains', 0, 0, 0, 0, 30, 'g', 4, false, false, false, false),
  ('Muesli (plain)', 'grains', 0, 0, 0, 0, 45, 'g', 5, false, false, false, false),
  ('Nutrific', 'grains', 0, 0, 0, 0, 45, 'g', 5, false, false, false, false),
  ('Oat Bran (cooked)', 'grains', 0, 0, 0, 0, 0.5, 'cup', 3, false, false, false, false),
  ('Pronutro Original', 'grains', 0, 0, 0, 0, 45, 'g', 5, false, false, false, false),
  ('ProNutro Wholewheat', 'grains', 0, 0, 0, 0, 45, 'g', 5, false, false, false, false),
  ('Rice Krispies', 'grains', 0, 0, 0, 0, 30, 'g', 4, false, false, false, false),
  ('Weet-Bix', 'grains', 0, 0, 0, 0, 2, 'biscuits', 4, false, false, false, false),
  ('Weetabix Protein', 'grains', 0, 0, 0, 0, 2, 'biscuits', 4, false, false, false, false);

-- ===== Part 10: Rice, Pasta & Grains (grains) =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Basmati Rice (cooked)', 'grains', 0, 0, 0, 0, 0.5, 'cup', 3, false, false, false, false),
  ('Couscous (cooked)', 'grains', 0, 0, 0, 0, 0.5, 'cup', 3, false, false, false, false),
  ('Egg Noodles (cooked)', 'grains', 0, 0, 0, 0, 1, 'cup', 5, false, false, false, false),
  ('Rice Noodles (cooked)', 'grains', 0, 0, 0, 0, 1, 'cup', 5, false, false, false, false),
  ('Spaghetti (cooked)', 'grains', 0, 0, 0, 0, 1, 'cup', 5, false, false, false, false),
  ('White Rice (cooked)', 'grains', 0, 0, 0, 0, 0.5, 'cup', 3, false, false, false, false);

-- ===== Part 11: Pantry Staples (condiments) =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Apricot Jam', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 2, false, false, false, false),
  ('Balsamic Vinegar', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 0, true, false, true, false),
  ('Brown Sugar', 'condiments', 0, 0, 0, 0, 1, 'tsp', 1, false, false, false, false),
  ('Cornstarch', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 1, false, false, false, false),
  ('Golden Syrup', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 3, false, false, false, false),
  ('Honey', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 3, false, false, false, false),
  ('Mayonnaise (light)', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 2, false, false, false, false),
  ('Olive Oil', 'condiments', 0, 0, 0, 0, 1, 'tsp', 2, false, false, false, false),
  ('Peanut Butter', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 3, false, false, false, false),
  ('Pesto', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 3, false, false, false, false),
  ('Raspberry Jam', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 2, false, false, false, false),
  ('Strawberry Jam', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 2, false, false, false, false),
  ('Sunflower Oil', 'condiments', 0, 0, 0, 0, 1, 'tsp', 2, false, false, false, false),
  ('Tomato Paste', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 0, true, false, false, false),
  ('Vegetable Oil', 'condiments', 0, 0, 0, 0, 1, 'tsp', 2, false, false, false, false),
  ('Vinegar (white or apple cider)', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 0, true, false, true, false);

-- ===== Part 12: Sauces, Dressings & Condiments (condiments) =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('BBQ Sauce', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 1, false, false, false, false),
  ('Chilli Sauce (sweet)', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 1, false, false, false, false),
  ('Chutney (Mrs Ball''s Original)', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 2, false, false, false, false),
  ('Garlic Sauce', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 2, false, false, false, false),
  ('Gravy (prepared)', 'condiments', 0, 0, 0, 0, 0.25, 'cup', 1, false, false, false, false),
  ('Hot Sauce', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 0, true, false, true, false),
  ('Lemon Juice', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 0, true, false, true, false),
  ('Low-Fat Salad Dressing', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 1, false, false, false, false),
  ('Mayonnaise (regular)', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 3, false, false, false, false),
  ('Mint Sauce', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 1, false, false, false, false),
  ('Mustard (Dijon or Yellow)', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 0, true, false, true, false),
  ('Oyster Sauce', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 1, false, false, false, false),
  ('Peri-Peri Sauce', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 0, true, false, true, false),
  ('Salad Cream', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 2, false, false, false, false),
  ('Salsa (tomato-based)', 'condiments', 0, 0, 0, 0, 2, 'tbsp', 0, true, false, true, false),
  ('Soya Sauce', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 0, true, false, true, false),
  ('Sweet Chilli Sauce', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 2, false, false, false, false),
  ('Sweet Mustard Sauce', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 2, false, false, false, false),
  ('Tomato Sauce (Ketchup)', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 1, false, false, false, false),
  ('Worcestershire Sauce', 'condiments', 0, 0, 0, 0, 1, 'tbsp', 0, true, false, true, false);

-- ===== Part 13: Snacks (snacks) =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Air-Popped Popcorn', 'snacks', 0, 0, 0, 0, 3, 'cups', 3, false, false, false, false),
  ('Biltong (lean)', 'snacks', 0, 0, 0, 0, 30, 'g', 2, false, false, false, false),
  ('Cashew Nuts', 'snacks', 0, 0, 0, 0, 30, 'g', 5, false, false, false, false),
  ('Cheese & Crackers Snack Pack', 'snacks', 0, 0, 0, 0, 1, 'pack', 7, false, false, false, false),
  ('Corn Chips', 'snacks', 0, 0, 0, 0, 30, 'g', 5, false, false, false, false),
  ('Crackers (plain)', 'snacks', 0, 0, 0, 0, 6, 'small', 4, false, false, false, false),
  ('Dark Chocolate', 'snacks', 0, 0, 0, 0, 20, 'g', 4, false, false, false, false),
  ('Dried Apricots', 'snacks', 0, 0, 0, 0, 30, 'g', 3, false, false, false, false),
  ('Dried Fruit Mix', 'snacks', 0, 0, 0, 0, 30, 'g', 4, false, false, false, false),
  ('Dried Mango', 'snacks', 0, 0, 0, 0, 30, 'g', 4, false, false, false, false),
  ('Jelly (sugar-free)', 'snacks', 0, 0, 0, 0, 0.5, 'cup', 0, true, false, false, false),
  ('Macadamia Nuts', 'snacks', 0, 0, 0, 0, 30, 'g', 6, false, false, false, false),
  ('Mixed Nuts', 'snacks', 0, 0, 0, 0, 30, 'g', 5, false, false, false, false),
  ('Peanuts (dry roasted)', 'snacks', 0, 0, 0, 0, 30, 'g', 5, false, false, false, false),
  ('Pistachios', 'snacks', 0, 0, 0, 0, 30, 'g', 5, false, false, false, false),
  ('Popcorn (light microwave)', 'snacks', 0, 0, 0, 0, 3, 'cups popped', 4, false, false, false, false),
  ('Potato Chips (plain)', 'snacks', 0, 0, 0, 0, 30, 'g', 5, false, false, false, false),
  ('Pretzels', 'snacks', 0, 0, 0, 0, 30, 'g', 3, false, false, false, false),
  ('Protein Bar', 'snacks', 0, 0, 0, 0, 1, 'bar (50-60g)', 6, false, false, false, false),
  ('Rice Cakes (plain)', 'snacks', 0, 0, 0, 0, 2, 'cakes', 2, false, false, false, false),
  ('Salted Crackers', 'snacks', 0, 0, 0, 0, 6, 'small', 4, false, false, false, false),
  ('White Chocolate', 'snacks', 0, 0, 0, 0, 20, 'g', 5, false, false, false, false);

-- ===== Part 14a: Alcohol (never zero-point) =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Beer (light)', 'alcohol', 0, 0, 0, 0, 340, 'ml', 4, false, false, false, false),
  ('Beer (regular)', 'alcohol', 0, 0, 0, 0, 340, 'ml', 5, false, false, false, false),
  ('Brandy', 'alcohol', 0, 0, 0, 0, 30, 'ml', 2, false, false, false, false),
  ('Dry Red Wine', 'alcohol', 0, 0, 0, 0, 150, 'ml', 4, false, false, false, false),
  ('Dry White Wine', 'alcohol', 0, 0, 0, 0, 150, 'ml', 4, false, false, false, false),
  ('Gin', 'alcohol', 0, 0, 0, 0, 30, 'ml', 2, false, false, false, false),
  ('Vodka', 'alcohol', 0, 0, 0, 0, 30, 'ml', 2, false, false, false, false),
  ('Whisky', 'alcohol', 0, 0, 0, 0, 30, 'ml', 2, false, false, false, false);

-- ===== Part 14b: Non-alcoholic drinks (custom) — mixer flag on common alcohol mixers =====
insert into foods (name, category, calories, sat_fat_g, sugar_g, protein_g, serving_size, serving_unit, points_per_serving, is_zero_point, is_mixer, is_flavor_booster, is_user_created) values
  ('Americano (black)', 'custom', 0, 0, 0, 0, 250, 'ml', 0, true, false, false, false),
  ('Black Coffee', 'custom', 0, 0, 0, 0, 250, 'ml', 0, true, false, false, false),
  ('Cappuccino (made with skim milk)', 'custom', 0, 0, 0, 0, 1, 'medium', 2, false, false, false, false),
  ('Coca-Cola No Sugar', 'custom', 0, 0, 0, 0, 330, 'ml', 0, true, true, false, false),
  ('Diet Soft Drink', 'custom', 0, 0, 0, 0, 330, 'ml', 0, true, true, false, false),
  ('Espresso', 'custom', 0, 0, 0, 0, 1, 'shot', 0, true, false, false, false),
  ('Herbal Tea (unsweetened)', 'custom', 0, 0, 0, 0, 250, 'ml', 0, true, false, false, false),
  ('Hot Chocolate (made with low-fat milk)', 'custom', 0, 0, 0, 0, 250, 'ml', 5, false, false, false, false),
  ('Iced Tea (sugar-free)', 'custom', 0, 0, 0, 0, 330, 'ml', 0, true, false, false, false),
  ('Latte (made with skim milk)', 'custom', 0, 0, 0, 0, 1, 'medium', 3, false, false, false, false),
  ('Milkshake', 'custom', 0, 0, 0, 0, 250, 'ml', 8, false, false, false, false),
  ('Orange Juice (100%)', 'custom', 0, 0, 0, 0, 250, 'ml', 5, false, false, false, false),
  ('Rooibos Tea (unsweetened)', 'custom', 0, 0, 0, 0, 250, 'ml', 0, true, false, false, false),
  ('Sparkling Water', 'custom', 0, 0, 0, 0, 250, 'ml', 0, true, true, false, false),
  ('Tea (black, unsweetened)', 'custom', 0, 0, 0, 0, 250, 'ml', 0, true, false, false, false),
  ('Tomato Juice', 'custom', 0, 0, 0, 0, 250, 'ml', 2, false, false, false, false),
  ('Tonic Water (regular)', 'custom', 0, 0, 0, 0, 250, 'ml', 3, false, true, false, false),
  ('Tonic Water (sugar-free)', 'custom', 0, 0, 0, 0, 250, 'ml', 0, true, true, false, false),
  ('Water', 'custom', 0, 0, 0, 0, 250, 'ml', 0, true, true, false, false);

-- ===== Reconcile daily_summary for any day whose food_entries just got cascade-deleted =====
-- (the old curated foods being replaced above). This only fixes points_used;
-- rollover_to_weekly/is_over_budget/weekly_cycles self-correct next time
-- anyone logs or deletes something (recalculateWeeklyCycle re-folds them).
update daily_summary
set points_used = coalesce(
  (select sum(fe.points_used) from food_entries fe where fe.user_id = daily_summary.user_id and fe.logged_date = daily_summary.date),
  0
);
