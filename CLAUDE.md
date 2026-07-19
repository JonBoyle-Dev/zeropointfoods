# zeropointfoods — Personal Points Tracker

React + Vite + Tailwind + Supabase personal food/activity points tracker (WW-points-inspired, independently formulated — see `points-tracker-spec (1).md` §1 for the IP note). Single user, no login. **Current scope: Phase 1 of the 5-phase build order in `handover-doc.md` §5** — onboarding, manual food entry, logging a food, and the Today screen dial. Search/favourites, recipes, banking, activities, the Zero-Point Library, and reporting are later phases, not yet built.

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
│   └── seed.sql       # placeholder — real content seeding is a later task (handover-doc §6)
└── src/
    ├── lib/
    │   ├── supabase.ts   # client singleton, no generic Database type (hand-typed per hook instead)
    │   ├── dates.ts      # toDateInputValue formats from LOCAL date parts, not toISOString — see below
    │   └── points.ts     # the 4 formulas from spec §2 — single source of truth, don't reimplement inline
    ├── types/database.ts # hand-written row types for all 12 tables, no generated schema
    ├── hooks/             # one file per table, react-query wrapped
    ├── components/{onboarding,foods,log,today,common}/
    └── pages/             # route-level screens
```

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
- **Weekly cycles are keyed to the user's own `weekly_reset_day`** — never hardcode Monday-start logic anywhere (spec §5). Weekly banking itself (`weekly_cycles`) isn't wired up yet — that's Phase 3.
- **Mixers and flavor boosters are flags on `foods`** (`is_mixer`, `is_flavor_booster`), not separate tables — logging them goes through the same food-entry flow as everything else.
- **Dates must be formatted from local `Date` parts, never `.toISOString().slice(0,10)`.** UTC conversion silently shifts the date backward a day in positive-UTC-offset timezones once round-tripped through a local `Date` construction. Use `toDateInputValue`/`todayDateInputValue` from `src/lib/dates.ts`.

## Local dev

Requires a real Supabase project — copy `.env.local.example` to `.env.local` and fill in your project's URL + anon key. Run `supabase/schema.sql` then `supabase/policies.sql` in the Supabase SQL editor before first use.

```
npm install
npm run dev
```
