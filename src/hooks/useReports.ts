import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { addDays, getWeekStartDate, todayDateInputValue, toDateInputValue } from '../lib/dates'
import type { FoodCategory, Weekday } from '../types/database'

export interface WeekTrendPoint {
  weekStartDate: string
  totalUsed: number
  totalAllowance: number
  totalActivity: number
  isOverBudget: boolean
}

const WEEKS_BACK = 5

/** Last 5 weeks (oldest to newest, ending with the current week) — totals summed from whatever daily_summary rows exist in each week. */
export function useWeeklyTrend(userId: string | undefined, weeklyResetDay: Weekday) {
  const today = todayDateInputValue()
  const currentWeekStart = getWeekStartDate(today, weeklyResetDay)
  const earliestWeekStart = toDateInputValue(addDays(new Date(currentWeekStart + 'T00:00:00'), -7 * (WEEKS_BACK - 1)))

  return useQuery({
    queryKey: ['weeklyTrend', userId, currentWeekStart],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_summary')
        .select('date, points_used, points_allowance, activity_points_earned')
        .eq('user_id', userId!)
        .gte('date', earliestWeekStart)
        .lte('date', today)
      if (error) throw error

      const weeks: WeekTrendPoint[] = []
      for (let i = WEEKS_BACK - 1; i >= 0; i--) {
        const weekStartDate = toDateInputValue(addDays(new Date(currentWeekStart + 'T00:00:00'), -7 * i))
        const weekEndDate = toDateInputValue(addDays(new Date(weekStartDate + 'T00:00:00'), 6))
        const daysInWeek = (data ?? []).filter((d) => d.date >= weekStartDate && d.date <= weekEndDate)

        const totalUsed = daysInWeek.reduce((sum, d) => sum + Number(d.points_used), 0)
        const totalAllowance = daysInWeek.reduce((sum, d) => sum + Number(d.points_allowance), 0)
        const totalActivity = daysInWeek.reduce((sum, d) => sum + Number(d.activity_points_earned), 0)

        weeks.push({ weekStartDate, totalUsed, totalAllowance, totalActivity, isOverBudget: totalUsed > totalAllowance + totalActivity })
      }
      return weeks
    },
    enabled: !!userId,
  })
}

export interface CategoryBreakdownPoint {
  category: FoodCategory
  points: number
}

/** Where a week's points went, by food category — sums food_entries.points_used grouped by foods.category. */
export function useCategoryBreakdown(userId: string | undefined, weekStartDate: string, weekEndDate: string) {
  return useQuery({
    queryKey: ['categoryBreakdown', userId, weekStartDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('food_entries')
        .select('points_used, foods(category)')
        .eq('user_id', userId!)
        .gte('logged_date', weekStartDate)
        .lte('logged_date', weekEndDate)
      if (error) throw error

      const totals: Partial<Record<FoodCategory, number>> = {}
      for (const entry of data as unknown as { points_used: number; foods: { category: FoodCategory } | null }[]) {
        if (!entry.foods) continue
        totals[entry.foods.category] = (totals[entry.foods.category] ?? 0) + Number(entry.points_used)
      }

      return (Object.entries(totals) as [FoodCategory, number][])
        .filter(([, points]) => points > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([category, points]): CategoryBreakdownPoint => ({ category, points }))
    },
    enabled: !!userId,
  })
}
