-- Phase 2 — favourites (handover-doc.md §5 step 5).
-- The spec's data model has no dedicated favourites table, so this is a flag
-- on `foods` rather than a new table — simplest fit for a single-user app.
alter table foods add column is_favourite boolean not null default false;
