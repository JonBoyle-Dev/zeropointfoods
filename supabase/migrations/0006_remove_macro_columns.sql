-- Foods now always carry a directly-entered/overridden points_per_serving —
-- macro-based calculation (calculateFoodPoints) has been dropped from the app
-- entirely per user request. These columns have been unused dead weight since
-- migration 0004 replaced the food database with a real WW-style points
-- table (points given directly, macros always 0 placeholders).
alter table foods drop column calories;
alter table foods drop column sat_fat_g;
alter table foods drop column sugar_g;
alter table foods drop column protein_g;
