-- Phase 3 — activities (handover-doc.md §5 step 9).
-- MET values are the public-domain examples spec §2.3 itself calls out
-- (walking 3.5, running 8-12, cycling 6-8) plus a few common extras, all
-- from the standard public MET table — not WW-specific.
insert into activities (name, met_value, is_user_created) values
  ('Walking', 3.5, false),
  ('Jogging', 7, false),
  ('Running', 9.8, false),
  ('Cycling', 7.5, false),
  ('Swimming', 7, false),
  ('Yoga', 3, false),
  ('Strength training', 5, false),
  ('Dancing', 4.8, false);
