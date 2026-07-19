# Points Tracker — Product Spec (v1)

*A personal food/activity points tracker, inspired by the WW points concept but running on our own transparent formula.*

---

## 1. Overview

A web app where users:
- Get a personalised daily points allowance based on their body stats and activity level
- Log food, drinks, and alcohol against that allowance, organised by category
- Log activities to earn bonus points (FitPoints)
- Bank unused points into a weekly allowance, with a daily rollover cap
- Track weigh-ins, water, and goals
- Browse a curated **Zero-Point Library** (meals, mixers, flavor boosters) for quick, points-free logging
- View daily / weekly / monthly reports
- Edit history and export data

> **Note on IP:** WW's SmartPoints/PersonalPoints formulas and branding are proprietary. This spec defines our own formula, inspired by the same concept but independently derived — no WW branding, copy, or exact formula reproduction.

---

## 2. Points Formulas

### 2.1 Daily Personal Points Allowance

Recalculated automatically whenever weight, height, age (birthday tick), or activity level changes.

```
allowance = 8
  + (weight_kg * 0.07)
  + (height_cm * 0.05)
  - (age_years * 0.05)
  + sex_offset          // female: -2, male: 0 (optional field)
  + activity_bonus      // sedentary: 0, low_active: +1, active: +2, very_active: +3

allowance = max(allowance, 20)   // floor — never below 20/day
```

### 2.2 Food Points (per serving)

```
points = round(
    (calories / 33)
  + (sat_fat_g * 0.4)
  + (sugar_g * 0.3)
  - (protein_g * 0.2)
)
points = max(points, 0)   // never negative
```

- `is_zero_point` flag overrides the calculation to 0 for curated zero-point foods.
- Alcohol is **never** zero-point — always calculated normally.

### 2.3 Activity Points (FitPoints)

Standard MET-based formula (public domain sports science, not WW-specific):

```
points = duration_minutes * met_value * weight_kg * 0.0175 / 10
```

Each activity has a `met_value` sourced from a public MET table (e.g. walking 3.5, running 8–12, cycling 6–8).

### 2.4 Weekly Rollover / Banking

Runs at end-of-day:

```
daily_rollover = min(4, max(0, daily_allowance - daily_points_used))
weekly_bank += daily_rollover
```

When daily usage exceeds the allowance:

```
shortfall = daily_points_used - daily_allowance
weekly_bank = max(0, weekly_bank - shortfall)

if weekly_bank == 0 and shortfall not fully covered:
    mark day as "over budget"
```

- Weekly bank **never goes negative** — floors at 0, displays "over budget" instead.
- **Weekly reset day** is user-configurable (not fixed to Monday).
- Daily rollover into the bank is capped at **4 points/day** to prevent hoarding.

---

## 3. Feature List

### Core Tracking
- [x] Onboarding: capture weight, height, age, sex (optional), activity level, weekly reset day, units (metric/imperial)
- [x] Daily points allowance (auto-calculated, recalculates on weigh-in / activity level change)
- [x] Weekly points bank with rollover (max 4/day) and auto-dip on overspend
- [x] Daily / weekly view of points remaining, with "over budget" state

### Food & Drink Logging
- [x] Food categories: Protein, Dairy, Grains, Fruit & Veg, Alcohol, Snacks, Condiments, Custom
- [x] Add new food (name, calories, sat fat, sugar, protein, serving size)
- [x] Search existing food database
- [x] Favorites & recently logged
- [x] Serving size / quantity multiplier
- [x] Recipe builder (combine foods into a saved dish with total points)
- [x] Meal tagging (breakfast / lunch / dinner / snack)
- [x] Points snapshotted at log time (editing a food later doesn't retroactively change past entries)

### Zero-Point Library
- [x] **Zero-Point Meals** — full meal ideas built from zero-point ingredients, browsable by meal type, one-tap logs all ingredients
- [x] **Zero-Point Mixers** — alcohol pairings that don't add points (soda water, diet tonic, etc.), suggested when logging alcohol
- [x] **Zero-Point Flavor Boosters** — spices, sauces, condiments at zero/near-zero points, suggested when logging a zero-point meal
- [x] All three: curated/global library + user-created personal additions

### Activity
- [x] Log activity (type, duration) → dynamically calculated FitPoints based on user's current weight
- [x] Activity list sourced from public MET table, extensible with user-created activities

### Beyond Food
- [x] Water tracking
- [x] Weigh-ins with weight trend graph
- [x] Goal setting (target weight, target date, projected pace)

### History & Reporting
- [x] Daily / weekly / monthly reports (points used, allowance, activity points, over-budget days)
- [x] Edit past days' entries
- [x] CSV / PDF export

---

## 4. Data Model

### `users`
| field | type |
|---|---|
| id | uuid |
| name, email | string |
| sex | enum (optional) |
| height_cm | decimal |
| date_of_birth | date |
| activity_level | enum: sedentary / low_active / active / very_active |
| weekly_reset_day | enum: Mon–Sun |
| units_preference | enum: metric / imperial |
| daily_points_allowance | decimal (cached, recalculated) |
| current_weight_kg | decimal (denormalized from latest weigh-in) |

### `weigh_ins`
| field | type |
|---|---|
| id | uuid |
| user_id | fk |
| weight_kg | decimal |
| logged_at | timestamp |

→ triggers `daily_points_allowance` recalculation on insert.

### `foods`
| field | type |
|---|---|
| id | uuid |
| name | string |
| category | enum: protein / dairy / grains / fruit_veg / alcohol / snacks / condiments / custom |
| calories, sat_fat_g, sugar_g, protein_g | decimal |
| serving_size, serving_unit | decimal / string |
| points_per_serving | decimal (calculated, cached) |
| is_zero_point | boolean |
| is_mixer | boolean |
| is_flavor_booster | boolean |
| is_user_created | boolean |
| created_by_user_id | fk (nullable) |

### `food_entries`
| field | type |
|---|---|
| id | uuid |
| user_id | fk |
| food_id | fk |
| logged_date | date |
| meal_type | enum: breakfast / lunch / dinner / snack |
| quantity | decimal |
| points_used | decimal (snapshotted) |

### `recipes`
| field | type |
|---|---|
| id | uuid |
| user_id | fk |
| name | string |
| total_points | decimal |

### `recipe_ingredients`
| field | type |
|---|---|
| recipe_id | fk |
| food_id | fk |
| quantity | decimal |

### `zero_point_meals`
| field | type |
|---|---|
| id | uuid |
| name | string |
| meal_type | enum: breakfast / lunch / dinner / snack |
| description | text |
| image_url | string (optional) |
| is_user_created | boolean |
| created_by_user_id | fk (nullable) |

### `zero_point_meal_ingredients`
| field | type |
|---|---|
| meal_id | fk |
| food_id | fk (must reference a food where `is_zero_point = true`) |
| quantity | decimal |

### `activities`
| field | type |
|---|---|
| id | uuid |
| name | string |
| met_value | decimal |
| is_user_created | boolean |

### `activity_entries`
| field | type |
|---|---|
| id | uuid |
| user_id | fk |
| activity_id | fk |
| logged_date | date |
| duration_minutes | decimal |
| points_earned | decimal (calculated + snapshotted) |

### `water_entries`
| field | type |
|---|---|
| id | uuid |
| user_id | fk |
| logged_date | date |
| amount_ml | decimal |

### `daily_summary` (cached rollup)
| field | type |
|---|---|
| user_id, date | pk |
| points_allowance | decimal (snapshot) |
| points_used | decimal |
| activity_points_earned | decimal |
| rollover_to_weekly | decimal |
| is_over_budget | boolean |

### `weekly_cycles`
| field | type |
|---|---|
| id | uuid |
| user_id | fk |
| week_start_date | date (based on user's `weekly_reset_day`) |
| weekly_bank_starting | decimal |
| weekly_bank_current | decimal |

---

## 5. Implementation Notes

- **Snapshot, don't recalculate retroactively** — `points_used` / `points_earned` are stored at log time so editing a food or activity later doesn't rewrite history.
- **`daily_summary` should be materialized**, not computed live on every page load — otherwise monthly reports get expensive fast.
- **Weekly cycles are keyed to the user's custom reset day** — "the week" isn't a fixed calendar concept per user, so don't hardcode Monday-start logic anywhere.
- **Mixers and flavor boosters are flags on `foods`**, not separate tables — they're just zero-point foods tagged by purpose, and logging them should go through the same food-entry flow as everything else.
- **Zero-point meals get their own table** since they're a composition of multiple foods, similar to `recipes` but curated + browsable rather than purely user-built.

---

## 6. Open Questions / v2 Backlog

- Barcode scanning
- Streaks / badges (gamification)
- Meal reminders / notifications
- Multi-user / compare-with-friends
- Own points formula tuning pass once real usage data exists
