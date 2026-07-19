import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { recalculateDailySummary } from './useDailySummary'
import { recalculateWeeklyCycle } from './useWeeklyCycle'
import { getWeekStartDate } from '../lib/dates'
import type { Food, FoodEntry, MealType, Weekday } from '../types/database'

export type FoodEntryWithFoodName = FoodEntry & { foods: { name: string } | null }

export function useTodayEntries(userId: string | undefined, date: string) {
  return useQuery({
    queryKey: ['foodEntries', userId, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('food_entries')
        .select('*, foods(name)')
        .eq('user_id', userId!)
        .eq('logged_date', date)
        .order('id')
      if (error) throw error
      return data as unknown as FoodEntryWithFoodName[]
    },
    enabled: !!userId,
  })
}

const RECENTLY_LOGGED_LIMIT = 8

/** Most recently logged distinct foods, newest first — powers the "Recently logged" section (handover-doc §5 step 5). */
export function useRecentlyLoggedFoods(userId: string | undefined) {
  return useQuery({
    queryKey: ['recentlyLoggedFoods', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('food_entries')
        .select('food_id, logged_date, foods(*)')
        .eq('user_id', userId!)
        .order('logged_date', { ascending: false })
        .limit(30)
      if (error) throw error

      const seen = new Set<string>()
      const recentFoods: Food[] = []
      for (const entry of data as unknown as { food_id: string; foods: Food | null }[]) {
        if (!entry.foods || seen.has(entry.food_id)) continue
        seen.add(entry.food_id)
        recentFoods.push(entry.foods)
        if (recentFoods.length >= RECENTLY_LOGGED_LIMIT) break
      }
      return recentFoods
    },
    enabled: !!userId,
  })
}

export interface LogFoodEntryInput {
  userId: string
  foodId: string
  loggedDate: string
  mealType: MealType
  quantity: number
  pointsPerServing: number
  dailyPointsAllowance: number
  weeklyResetDay: Weekday
}

export interface DeleteFoodEntryInput {
  entryId: string
  userId: string
  loggedDate: string
  dailyPointsAllowance: number
  weeklyResetDay: Weekday
}

export function useDeleteFoodEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: DeleteFoodEntryInput) => {
      const { error } = await supabase.from('food_entries').delete().eq('id', input.entryId)
      if (error) throw error

      await recalculateDailySummary(input.userId, input.loggedDate, input.dailyPointsAllowance)
      await recalculateWeeklyCycle(input.userId, input.weeklyResetDay, input.loggedDate)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['foodEntries', variables.userId, variables.loggedDate] })
      queryClient.invalidateQueries({ queryKey: ['recentlyLoggedFoods', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['dailySummary', variables.userId, variables.loggedDate] })
      const weekStartDate = getWeekStartDate(variables.loggedDate, variables.weeklyResetDay)
      queryClient.invalidateQueries({ queryKey: ['weeklyCycle', variables.userId, weekStartDate] })
    },
  })
}

export function useLogFoodEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: LogFoodEntryInput) => {
      // Snapshotted at log time — editing the food later must not rewrite this entry (spec §5).
      const pointsUsed = Math.round(input.pointsPerServing * input.quantity)

      const { data, error } = await supabase
        .from('food_entries')
        .insert({
          user_id: input.userId,
          food_id: input.foodId,
          logged_date: input.loggedDate,
          meal_type: input.mealType,
          quantity: input.quantity,
          points_used: pointsUsed,
        })
        .select()
        .single()
      if (error) throw error

      await recalculateDailySummary(input.userId, input.loggedDate, input.dailyPointsAllowance)
      await recalculateWeeklyCycle(input.userId, input.weeklyResetDay, input.loggedDate)

      return data as FoodEntry
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['foodEntries', variables.userId, variables.loggedDate] })
      queryClient.invalidateQueries({ queryKey: ['dailySummary', variables.userId, variables.loggedDate] })
      const weekStartDate = getWeekStartDate(variables.loggedDate, variables.weeklyResetDay)
      queryClient.invalidateQueries({ queryKey: ['weeklyCycle', variables.userId, weekStartDate] })
    },
  })
}
