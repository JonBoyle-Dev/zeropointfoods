import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { getWeekStartDate } from '../lib/dates'
import { calculateDailyRollover } from '../lib/points'
import type { WeeklyCycle, Weekday } from '../types/database'

export function useWeeklyCycle(userId: string | undefined, weekStartDate: string) {
  return useQuery({
    queryKey: ['weeklyCycle', userId, weekStartDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_cycles')
        .select('*')
        .eq('user_id', userId!)
        .eq('week_start_date', weekStartDate)
        .maybeSingle()
      if (error) throw error
      return data as WeeklyCycle | null
    },
    enabled: !!userId,
  })
}

/**
 * Bank available to spend on `date`, carried in from earlier days in the same
 * week — this is what TodayPage's "points left" was missing (it only ever
 * showed allowance+activity-used for the single day, so unused points never
 * actually became spendable later, and overspending never reduced later days).
 *
 * Safe to compute as a plain sum of `rollover_to_weekly` for days strictly
 * before `date`: each stored value is already `bank_after_day - bank_before_day`
 * from the correct sequential fold (recalculateWeeklyCycle), so summing them
 * telescopes to exactly `bank_after_last_day` — no re-deriving or reordering,
 * so the floor-at-zero non-linearity that makes a *raw* stateless recompute
 * unsafe doesn't apply here.
 */
export function useBankCarriedIntoDay(userId: string | undefined, weeklyResetDay: Weekday, date: string) {
  const weekStartDate = getWeekStartDate(date, weeklyResetDay)
  return useQuery({
    queryKey: ['bankCarriedIn', userId, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_summary')
        .select('rollover_to_weekly')
        .eq('user_id', userId!)
        .gte('date', weekStartDate)
        .lt('date', date)
      if (error) throw error
      return (data ?? []).reduce((sum, day) => sum + Number(day.rollover_to_weekly), 0)
    },
    enabled: !!userId,
  })
}

/**
 * Recomputes the current week's bank by sequentially folding calculateDailyRollover
 * over each day's daily_summary from the week's start through today, then writes
 * the result back — both per-day (rollover_to_weekly, is_over_budget) and the
 * week total (weekly_cycles). This has to be sequential, not a stateless sum: the
 * bank floors at 0 after each day's dip, and that floor is order-dependent (spec §2.4).
 *
 * Design choice: a fresh week always starts its bank at 0 — nothing carries over
 * from the previous week's leftover bank. The spec doesn't say either way, so this
 * follows the common "weekly allowance resets" convention rather than accumulating
 * banked points indefinitely.
 */
export async function recalculateWeeklyCycle(userId: string, weeklyResetDay: Weekday, today: string) {
  const weekStartDate = getWeekStartDate(today, weeklyResetDay)

  const { data: days, error } = await supabase
    .from('daily_summary')
    .select('date, points_allowance, points_used, activity_points_earned')
    .eq('user_id', userId)
    .gte('date', weekStartDate)
    .lte('date', today)
    .order('date')
  if (error) throw error

  let bank = 0
  for (const day of days ?? []) {
    const bankBefore = bank
    // Activity points effectively expand the day's allowance — same treatment as the Today dial (allowance + activity − used).
    const effectiveAllowance = Number(day.points_allowance) + Number(day.activity_points_earned)
    const result = calculateDailyRollover({
      dailyAllowance: effectiveAllowance,
      dailyPointsUsed: Number(day.points_used),
      currentWeeklyBank: bankBefore,
    })
    bank = result.weeklyBank
    // rollover_to_weekly is this day's own contribution to the bank (can be
    // negative on an over-budget day), not the running bank total itself.
    const dailyDelta = bank - bankBefore

    const { error: updateError } = await supabase
      .from('daily_summary')
      .update({ rollover_to_weekly: dailyDelta, is_over_budget: result.isOverBudget })
      .eq('user_id', userId)
      .eq('date', day.date)
    if (updateError) throw updateError
  }

  const { error: upsertError } = await supabase.from('weekly_cycles').upsert(
    {
      user_id: userId,
      week_start_date: weekStartDate,
      weekly_bank_starting: 0,
      weekly_bank_current: bank,
    },
    { onConflict: 'user_id,week_start_date' }
  )
  if (upsertError) throw upsertError
}
