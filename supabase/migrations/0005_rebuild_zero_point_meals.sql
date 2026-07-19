-- Rebuilds the curated Zero-Point Meals (4 per meal type) using the new food
-- database from migration 0004 — the old ones referenced foods that no
-- longer exist. Run this after 0004.

insert into zero_point_meals (name, meal_type, description, is_user_created) values
  ('Egg white & spinach scramble', 'breakfast', 'Egg whites, spinach, tomato.', false),
  ('Greek yogurt with berries', 'breakfast', 'Fat-free Greek yogurt, strawberries, blueberries.', false),
  ('Chicken & veg breakfast bowl', 'breakfast', 'Chicken breast, broccoli, bell peppers.', false),
  ('Fruit & cottage cheese bowl', 'breakfast', 'Fat-free cottage cheese, apple, banana.', false),

  ('Grilled chicken & garden salad', 'lunch', 'Chicken breast, lettuce, cucumber, tomato, lemon juice.', false),
  ('Prawns & veg stir-fry', 'lunch', 'Prawns, baby marrow, bell peppers, garlic.', false),
  ('Hake & steamed veg', 'lunch', 'Hake, broccoli, cauliflower, lemon juice.', false),
  ('Tuna salad bowl', 'lunch', 'Tuna in brine, lettuce, cucumber, onion.', false),

  ('Herby grilled chicken & greens', 'dinner', 'Chicken breast, broccoli, garlic, lemon juice. Built entirely from zero-point ingredients.', false),
  ('Calamari & mixed veg', 'dinner', 'Grilled calamari, green beans, mushrooms, chilli peppers.', false),
  ('Kingklip with cauliflower', 'dinner', 'Kingklip, cauliflower, lemon juice, Worcestershire sauce.', false),
  ('Beef mince & veg skillet', 'dinner', 'Extra lean beef mince, baby marrow, bell peppers, tomato.', false),

  ('Cottage cheese & cucumber bites', 'snack', 'Fat-free cottage cheese, cucumber.', false),
  ('Crunchy veggie plate', 'snack', 'Carrots, cucumber, bell peppers.', false),
  ('Egg white bites', 'snack', 'Egg whites, bell peppers.', false),
  ('Berries & yogurt cup', 'snack', 'Strawberries with fat-free Greek yogurt.', false);

insert into zero_point_meal_ingredients (meal_id, food_id, quantity)
  select m.id, f.id, v.quantity from (values
    ('Egg white & spinach scramble', 'Egg Whites', 2),
    ('Egg white & spinach scramble', 'Spinach', 1),
    ('Egg white & spinach scramble', 'Tomato', 1),
    ('Greek yogurt with berries', 'Greek Yogurt (fat-free, plain)', 1),
    ('Greek yogurt with berries', 'Strawberries', 1),
    ('Greek yogurt with berries', 'Blueberries', 1),
    ('Chicken & veg breakfast bowl', 'Chicken Breast (skinless)', 1),
    ('Chicken & veg breakfast bowl', 'Broccoli', 1),
    ('Chicken & veg breakfast bowl', 'Capsicum (Bell Peppers)', 1),
    ('Fruit & cottage cheese bowl', 'Cottage Cheese (fat-free)', 1),
    ('Fruit & cottage cheese bowl', 'Apple', 1),
    ('Fruit & cottage cheese bowl', 'Banana', 1),

    ('Grilled chicken & garden salad', 'Chicken Breast (skinless)', 1),
    ('Grilled chicken & garden salad', 'Lettuce (All varieties)', 1),
    ('Grilled chicken & garden salad', 'Cucumber', 1),
    ('Grilled chicken & garden salad', 'Tomato', 1),
    ('Grilled chicken & garden salad', 'Lemon Juice', 1),
    ('Prawns & veg stir-fry', 'Prawns', 1),
    ('Prawns & veg stir-fry', 'Baby Marrow (Zucchini)', 1),
    ('Prawns & veg stir-fry', 'Capsicum (Bell Peppers)', 1),
    ('Prawns & veg stir-fry', 'Garlic', 1),
    ('Hake & steamed veg', 'Hake', 1),
    ('Hake & steamed veg', 'Broccoli', 1),
    ('Hake & steamed veg', 'Cauliflower', 1),
    ('Hake & steamed veg', 'Lemon Juice', 1),
    ('Tuna salad bowl', 'Tuna (in brine/water)', 1),
    ('Tuna salad bowl', 'Lettuce (All varieties)', 1),
    ('Tuna salad bowl', 'Cucumber', 1),
    ('Tuna salad bowl', 'Onion', 1),

    ('Herby grilled chicken & greens', 'Chicken Breast (skinless)', 1),
    ('Herby grilled chicken & greens', 'Broccoli', 1),
    ('Herby grilled chicken & greens', 'Garlic', 1),
    ('Herby grilled chicken & greens', 'Lemon Juice', 1),
    ('Calamari & mixed veg', 'Calamari (grilled)', 1),
    ('Calamari & mixed veg', 'Green Beans', 1),
    ('Calamari & mixed veg', 'Mushrooms', 1),
    ('Calamari & mixed veg', 'Chilli Peppers', 1),
    ('Kingklip with cauliflower', 'Kingklip', 1),
    ('Kingklip with cauliflower', 'Cauliflower', 1),
    ('Kingklip with cauliflower', 'Lemon Juice', 1),
    ('Kingklip with cauliflower', 'Worcestershire Sauce', 1),
    ('Beef mince & veg skillet', 'Beef Mince (Extra Lean 97-98%)', 1),
    ('Beef mince & veg skillet', 'Baby Marrow (Zucchini)', 1),
    ('Beef mince & veg skillet', 'Capsicum (Bell Peppers)', 1),
    ('Beef mince & veg skillet', 'Tomato', 1),

    ('Cottage cheese & cucumber bites', 'Cottage Cheese (fat-free)', 1),
    ('Cottage cheese & cucumber bites', 'Cucumber', 1),
    ('Crunchy veggie plate', 'Carrots', 1),
    ('Crunchy veggie plate', 'Cucumber', 1),
    ('Crunchy veggie plate', 'Capsicum (Bell Peppers)', 1),
    ('Egg white bites', 'Egg Whites', 2),
    ('Egg white bites', 'Capsicum (Bell Peppers)', 1),
    ('Berries & yogurt cup', 'Strawberries', 1),
    ('Berries & yogurt cup', 'Greek Yogurt (fat-free, plain)', 1)
  ) as v(meal_name, food_name, quantity)
  join zero_point_meals m on m.name = v.meal_name
  join foods f on f.name = v.food_name;
