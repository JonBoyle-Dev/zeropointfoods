-- Replaces MET-based activity points with a directly-assigned points-per-session
-- model, per explicit user request — matches the same "points are given
-- directly, not calculated" pivot already made for foods (migration 0006).
-- points_earned when logging = round(points_per_session * duration_minutes / session_minutes),
-- i.e. session_minutes is just the reference length the points were assigned against.
--
-- Deletes the old curated activities (is_user_created = false) and replaces
-- them with the new list. activity_entries.activity_id has ON DELETE CASCADE,
-- so any previously-logged entries against the old activities (e.g. existing
-- "Walking" logs) are removed too — same tradeoff as the food database
-- replacement. The reconciliation step at the bottom fixes up
-- daily_summary.activity_points_earned for any day affected by that.

alter table activities add column points_per_session numeric not null default 0;
alter table activities add column session_minutes numeric not null default 30;
alter table activities drop column met_value;

delete from activity_entries where activity_id in (select id from activities where is_user_created = false);
delete from activities where is_user_created = false;

insert into activities (name, points_per_session, session_minutes, is_user_created) values
  ('10 000 steps', 2, 30, false),
  ('5000 steps', 1, 30, false),
  ('Boxing', 3, 30, false),
  ('Cycle', 3, 30, false),
  ('Swimming', 3, 30, false),
  ('Treadmill', 3, 30, false),
  ('VR/Dance', 3, 30, false),
  ('Walking', 2, 30, false),
  ('Weight Training', 4, 30, false);

-- Reconcile daily_summary.activity_points_earned for any day whose activity_entries just got cascade-deleted above.
update daily_summary
set activity_points_earned = coalesce(
  (select sum(ae.points_earned) from activity_entries ae where ae.user_id = daily_summary.user_id and ae.logged_date = daily_summary.date),
  0
);
