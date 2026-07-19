import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { DailySummary } from '../types/database'

export function useDailySummary(userId: string | undefined, date: string) {
  return useQuery({
    queryKey: ['dailySummary', userId, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_summary')
        .select('*')
        .eq('user_id', userId!)
        .eq('date', date)
        .maybeSingle()
      if (error) throw error
      return data as DailySummary | null
    },
    enabled: !!userId,
  })
}

/**
 * Recomputes and upserts the materialized daily_summary row from raw entries.
 * Called after any food/activity log action so `daily_summary` stays a cheap
 * read for reports rather than recomputed from raw entries on every load (spec §5).
 *
 * is_over_budget and rollover_to_weekly here are only a first-pass estimate
 * (ignoring the weekly bank cushion) — every call site immediately follows this
 * with recalculateWeeklyCycle (src/hooks/useWeeklyCycle.ts), which overwrites
 * both with the real banking-aware values. This function still needs to run
 * first so the bank fold has this day's up-to-date points_used to read.
 */
export async function recalculateDailySummary(userId: string, date: string, pointsAllowance: number) {
  const [{ data: foodEntries, error: foodError }, { data: activityEntries, error: activityError }] = await Promise.all([
    supabase.from('food_entries').select('points_used').eq('user_id', userId).eq('logged_date', date),
    supabase.from('activity_entries').select('points_earned').eq('user_id', userId).eq('logged_date', date),
  ])
  if (foodError) throw foodError
  if (activityError) throw activityError

  const pointsUsed = (foodEntries ?? []).reduce((sum, entry) => sum + Number(entry.points_used), 0)
  const activityPointsEarned = (activityEntries ?? []).reduce((sum, entry) => sum + Number(entry.points_earned), 0)
  const isOverBudget = pointsUsed > pointsAllowance + activityPointsEarned

  const { error } = await supabase.from('daily_summary').upsert(
    {
      user_id: userId,
      date,
      points_allowance: pointsAllowance,
      points_used: pointsUsed,
      activity_points_earned: activityPointsEarned,
      rollover_to_weekly: 0,
      is_over_budget: isOverBudget,
    },
    { onConflict: 'user_id,date' }
  )
  if (error) throw error
}
