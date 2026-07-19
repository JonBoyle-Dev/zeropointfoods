# Points Tracker — Project Handover Doc

*Everything needed to pick this up cold on a new account. No prior context assumed beyond this file (and the two attached: spec + wireframe).*

---

## 1. What this is

A personal points-based food/activity tracker, inspired by the WW points concept but running on an independently-derived formula (not a WW clone — no WW branding, copy, or exact proprietary formula reproduced anywhere).

Core loop: get a personalised daily points allowance → log food/drink against it → log activities to earn bonus points → bank unused points weekly → check reports → repeat.

**Attached alongside this doc:**
- `points-tracker-spec.md` — full formulas, feature checklist, and data model (source of truth for what "done" looks like)
- `points-tracker-wireframe.html` — clickable mockup of the four core screens (Today / Log / Zero-Point Library / Reports). Open directly in a browser.

This handover doc is the "start here" — it summarises both, adds the tech decisions and sequencing that came out of planning, and tells you what to build first.

---

## 2. The formula (quick reference)

**Daily allowance**
```
allowance = 8 + (weight_kg*0.07) + (height_cm*0.05) - (age_years*0.05) + sex_offset + activity_bonus
allowance = max(allowance, 20)
```

**Food points**
```
points = round((calories/33) + (sat_fat_g*0.4) + (sugar_g*0.3) - (protein_g*0.2))
points = max(points, 0)
```
`is_zero_point` flag overrides to 0. Alcohol is never zero-point.

**Activity points (FitPoints)**
```
points = duration_minutes * met_value * weight_kg * 0.0175 / 10
```

**Weekly bank**
```
daily_rollover = min(4, max(0, allowance - points_used))     // capped at 4/day
weekly_bank += daily_rollover

// on overspend:
weekly_bank = max(0, weekly_bank - shortfall)                 // floors at 0, never negative
```
Weekly reset day is user-configurable, not fixed to Monday.

Full derivation and reasoning is in `points-tracker-spec.md` §2.

---

## 3. Feature scope (v1)

- Onboarding: weight, height, age, sex (optional), activity level, weekly reset day, units
- Daily/weekly points tracking with rollover banking
- Food logging: categories, search, favourites, recents, serving multiplier, recipe builder, meal tagging
- **Zero-Point Library**: Meals / Mixers / Flavor Boosters — curated + user-created
- Activity logging with dynamic FitPoints
- Water tracking, weigh-ins + trend, goal setting
- Daily/weekly/monthly reports, history editing, CSV/PDF export

Full checklist with checkboxes: `points-tracker-spec.md` §3.
Full schema (12 tables): `points-tracker-spec.md` §4.

---

## 4. Tech stack (recommended, not mandatory)

Chosen to match existing muscle memory rather than for any technical reason — swap freely if the new account has different constraints.

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + TypeScript | Familiar stack, matches wireframe's component shape |
| Backend | C#/.NET Web API | Familiar stack, strong with relational schema |
| Database | Postgres | Handles the fk-heavy relational schema cleanly |
| Dev workflow | Git repo + Claude Code wired in from commit 1 | Same pattern used for other personal projects — keeps a README with the formula reference so it's not just tribal knowledge |

---

## 5. Build order (MVP slice → full v1)

Don't build the whole spec at once. Suggested sequence, each step usable/demoable on its own:

**Phase 1 — Core loop**
1. Onboarding form → calculates and stores `daily_points_allowance`
2. Food table + manual "add new food" (no search/favourites yet)
3. Log a food entry → see points deducted from today's allowance
4. Today screen: points dial (allowance − used)

**Phase 2 — Make logging fast**
5. Food search, favourites, recently logged
6. Serving size multiplier
7. Recipe builder

**Phase 3 — Banking & activity**
8. Weekly bank + rollover logic + reset-day config
9. Activity table + FitPoints calc
10. Weigh-ins → recalculation trigger on allowance

**Phase 4 — Zero-Point Library**
11. `is_zero_point` / `is_mixer` / `is_flavor_booster` flags on foods
12. Zero-Point Meals table + one-tap logging
13. Curated seed content (see §6)

**Phase 5 — Reporting & polish**
14. Daily/weekly/monthly report views
15. History editing
16. CSV/PDF export
17. Water tracking, goals

This ordering front-loads the part that makes the app *feel real* (log food → see points move) before anything else, and pushes reporting/export to the end since it depends on having real logged data to look meaningful.

---

## 6. Content seeding (do this before it feels alive)

The app is only as good as its food/library data. Before real use, seed:
- A starter food database (~100–150 common items across all categories) with calories/fat/sugar/protein filled in
- A handful of Zero-Point Meals per meal type (aim for 3–5 each to start)
- A short Zero-Point Mixers list (5–10)
- A short Flavor Boosters list (5–10)

This is a good candidate to generate with AI assistance in one batch rather than hand-typing — flag it as its own task rather than something to do ad hoc while building features.

---

## 7. Known open decisions / v2 backlog

- Barcode scanning
- Streaks/badges (gamification)
- Meal reminders/notifications
- Multi-user / compare-with-friends
- Formula tuning pass once there's real usage data to sanity-check against

---

## 8. Where to pick up a conversation about this

If continuing with Claude on the new account, this doc + the two attachments are self-contained — no need to re-explain the concept, formulas, or schema. Good next prompts on the new account:
- *"Here's my handover doc — let's scaffold the repo and Phase 1 of the build order."*
- *"Let's turn the Phase 1–5 build order into ClickUp epics and tasks."*
- *"Let's generate the seed content for the food database and Zero-Point Library."*
