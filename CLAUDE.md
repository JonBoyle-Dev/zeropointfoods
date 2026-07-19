# zeropointfoods — Personal Points Tracker

React + Vite + Tailwind + Supabase personal food/activity points tracker (WW-points-inspired, independently formulated — see `points-tracker-spec (1).md` §1 for the IP note). Single user, no login. **Current scope: Phase 1–3 of the 5-phase build order in `handover-doc.md` §5** — onboarding, food logging (search/favourites/recently logged/serving multiplier), recipe builder, weekly bank rollover, activity logging (FitPoints), and weigh-ins with allowance recalculation. The Zero-Point Library and reporting/export are later phases, not yet built.

## Source-of-truth docs

- `handover-doc.md` — quick reference + Phase 1–5 build order
- `points-tracker-spec (1).md` — full formulas, feature checklist, 12-table data model
- `points-tracker-wireframe.html` — clickable mockup of the 4 core screens (Today/Log/Zero-Point Library/Reports)

Don't re-derive formulas or schema decisions from scratch — these docs already settled them.

## Structure
```
zeropointfoods/
├── supabase/
│   ├── schema.sql     # 12 tables, enums, indexes — run first
│   ├── policies.sql   # RLS (enabled, permissive — no auth exists) — run second
│   ├── seed.sql       # placeholder — real content seeding is a later task (handover-doc §6)
│   └── migrations/    # incremental changes for already-provisioned projects, run in filename order
└── src/
    ├── lib/
    │   ├── supabase.ts   # client singleton, no generic Database type (hand-typed per hook instead)
    │   ├── dates.ts      # toDateInputValue formats from LOCAL date parts, not toISOString — see below
    │   └── points.ts     # the 4 formulas from spec §2 — single source of truth, don't reimplement inline
    ├── types/database.ts # hand-written row types for all 12 tables, no generated schema
    ├── hooks/             # one file per table, react-query wrapped
    ├── components/{onboarding,foods,log,today,recipes,common}/
    └── pages/             # route-level screens (Onboarding, Today, Log, Foods, Recipes)
```

Note on schema drift: `schema.sql` reflects the original 12-table baseline; the favourites column and activities seed data only exist via `supabase/migrations/`. A fresh install must run `schema.sql` → `policies.sql` → every file in `migrations/` in order — don't assume `schema.sql` alone is current.

## Formula reference

`src/lib/points.ts` implements, in this exact order, the formulas from spec §2:
- `calculateAllowance` — daily personal points allowance (§2.1), floors at 20/day
- `calculateFoodPoints` — food points per serving (§2.2); alcohol is never zero-point regardless of the `is_zero_point` flag (also backstopped by a DB check constraint on `foods`)
- `calculateActivityPoints` — MET-based FitPoints (§2.3)
- `calculateDailyRollover` — weekly bank rollover/dip (§2.4), floors at 0, capped at 4pts/day rollover

If the spec's formulas change, update `points.ts` and nowhere else.

## Key design decisions

- **No auth.** Single personal user — RLS stays *enabled* with permissive `USING (true)` policies rather than disabled, to avoid tripping Supabase's security linter and to document the openness as intentional. If this ever becomes multi-user or gets shared, swap in Supabase Auth + `auth.uid()`-scoped policies first.
- **Snapshot, don't recalculate retroactively.** `food_entries.points_used` and `activity_entries.points_earned` are stored at log time — editing a food/activity later doesn't rewrite history (spec §5).
- **`daily_summary` is materialized**, not computed live — `recalculateDailySummary` in `src/hooks/useDailySummary.ts` upserts it after every log action, so reports don't recompute from raw entries on every load.
- **Weekly cycles are keyed to the user's own `weekly_reset_day`** — never hardcode Monday-start logic anywhere (spec §5). `getWeekStartDate` in `src/lib/dates.ts` finds the most recent occurrence of that weekday on/before a given date.
- **Weekly bank rollover is sequential, not a stateless sum** (`recalculateWeeklyCycle` in `src/hooks/useWeeklyCycle.ts`). Each day's dip floors the bank at 0, and that floor is order-dependent — folding `calculateDailyRollover` day-by-day from the week's start through today is the only correct way to reproduce spec §2.4, and every log mutation (food, recipe, activity, weigh-in) re-runs this fold afterward. Design choice: **a new week always starts its bank at 0** — nothing carries over from the previous week's leftover bank (the spec doesn't specify either way; this follows the common "weekly allowance resets" convention).
- **Activity points effectively expand the day's allowance** for banking purposes too — `recalculateWeeklyCycle` feeds `points_allowance + activity_points_earned` into `calculateDailyRollover`, matching the Today dial's `allowance + activity − used` display.
- **`daily_summary.rollover_to_weekly` is that day's own delta contribution to the bank** (can be negative on an over-budget day), not the running bank total — the running total lives on `weekly_cycles.weekly_bank_current`.
- **Weigh-ins recalculate the allowance immediately** (`useLogWeighIn` in `src/hooks/useWeighIns.ts`): update `users.current_weight_kg` + `daily_points_allowance` via `calculateAllowance`, then cascade into today's `daily_summary` and the current week's bank — same pattern as any other log action.
- **Mixers and flavor boosters are flags on `foods`** (`is_mixer`, `is_flavor_booster`), not separate tables — logging them goes through the same food-entry flow as everything else.
- **Dates must be formatted from local `Date` parts, never `.toISOString().slice(0,10)`.** UTC conversion silently shifts the date backward a day in positive-UTC-offset timezones once round-tripped through a local `Date` construction. Use `toDateInputValue`/`todayDateInputValue` from `src/lib/dates.ts`.
- **Favourites are a flag on `foods`** (`is_favourite`, added in `supabase/migrations/0001_add_favourites.sql`) — the spec's data model has no dedicated favourites table, so this is the simplest fit rather than introducing one.
- **Logging a recipe inserts one food_entries row per ingredient** (scaled by the ingredient's quantity and the servings multiplier), not a single recipe-level entry — `food_entries` has no `recipe_id` column, so this reuses the existing per-food logging/snapshot path (`useLogRecipe` in `src/hooks/useRecipes.ts`) instead of widening that table for one feature. `recipes.total_points` stays a cached display value on the recipe itself.

## Local dev

Requires a real Supabase project — copy `.env.local.example` to `.env.local` and fill in your project's URL + anon key. Run `supabase/schema.sql`, then `supabase/policies.sql`, then everything in `supabase/migrations/` in filename order, in the Supabase SQL editor before first use.

```
npm install
npm run dev
```
