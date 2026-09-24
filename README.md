# Zero Point Foods

A household food and activity points tracker. Log what you eat, bank what you don't
spend, earn points back from activity, and watch the trend over five weeks — on a phone,
with no login.

Built for a household rather than an individual: pick your name at launch and the app
switches to your day, your allowance and your history. No passwords, no accounts.

**Live:** https://zeropointfoods.vercel.app

## Features

- **Today** — a points dial for the day, a weekly bank strip showing what's left to
  spend, and quick logging for food, activity and weigh-ins.
- **Log** — search your food library with favourites, recently-logged and a serving
  multiplier, filtered by category.
- **Zero-Point Library** — meals, mixers and flavour boosters that cost nothing, with a
  builder for assembling your own from ingredients.
- **Recipes** — build a recipe once from its ingredients, then log it as a single item.
- **Activity** — log movement to earn points back against the week's allowance.
- **Weigh-ins** — record weight over time; the daily allowance recalculates from it.
- **Reports** — a five-week trend chart and a breakdown of where the points went by
  category.
- **Multi-profile** — a name picker, not a login. Each profile keeps its own log,
  allowance and history.

## Stack

React + Vite + TypeScript + Tailwind, with Supabase (Postgres) behind it. Deployed on
Vercel. State via TanStack Query; routing via React Router.

## Setup

```bash
npm install
cp .env.local.example .env.local   # add your Supabase URL and anon key
npm run dev
```

Then provision the database from `supabase/`, in this order:

1. `schema.sql` — 12 tables, enums and indexes
2. `policies.sql` — row-level security
3. `migrations/` — incremental changes, in filename order, for a project already provisioned

## Docs

- `handover-doc.md` — quick reference and the phased build order
- `points-tracker-spec (1).md` — formulas, feature checklist and the full data model
- `points-tracker-wireframe.html` — clickable mockup of the four core screens
- `CLAUDE.md` — repo structure and working notes

## A note on the points system

The formulas are **independently formulated** and this project is not affiliated with,
endorsed by, or derived from any commercial weight-management programme. See §1 of the
spec for the detail.

## Status

Phases 1–4 of the five-phase build are complete, plus the first slice of Phase 5
(Reports). CSV export is not built yet.
