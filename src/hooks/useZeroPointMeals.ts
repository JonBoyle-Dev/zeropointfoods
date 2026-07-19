import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { recalculateDailySummary } from './useDailySummary'
import { recalculateWeeklyCycle } from './useWeeklyCycle'
import { getWeekStartDate } from '../lib/dates'
import type { Food, MealType, Weekday, ZeroPointMeal } from '../types/database'

export type ZeroPointMealIngredientWithFood = { food_id: string; quantity: number; foods: Food }
export type ZeroPointMealWithIngredients = ZeroPointMeal & { zero_point_meal_ingredients: ZeroPointMealIngredientWithFood[] }

export function useZeroPointMeals(mealType: MealType | 'all') {
  return useQuery({
    queryKey: ['zeroPointMeals', mealType],
    queryFn: async () => {
      let query = supabase
        .from('zero_point_meals')
        .select('*, zero_point_meal_ingredients(food_id, quantity, foods(*))')
        .order('name')
      if (mealType !== 'all') query = query.eq('meal_type', mealType)
      const { data, error } = await query
      if (error) throw error
      return data as unknown as ZeroPointMealWithIngredients[]
    },
  })
}

export interface ZeroPointMealIngredientInput {
  foodId: string
  quantity: number
}

export interface NewZeroPointMealInput {
  userId: string
  name: string
  mealType: MealType
  description?: string
  ingredients: ZeroPointMealIngredientInput[]
}

/**
 * The spec's data model notes zero_point_meal_ingredients "must reference a food
 * where is_zero_point = true" — there's no cross-table DB constraint for that
 * (would need a trigger), so it's enforced app-side: the builder UI only offers
 * zero-point foods as ingredient choices.
 */
export function useCreateZeroPointMeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: NewZeroPointMealInput) => {
      const { data: meal, error: mealError } = await supabase
        .from('zero_point_meals')
        .insert({
          name: input.name,
          meal_type: input.mealType,
          description: input.description ?? null,
          is_user_created: true,
          created_by_user_id: input.userId,
        })
        .select()
        .single()
      if (mealError) throw mealError

      const { error: ingredientsError } = await supabase.from('zero_point_meal_ingredients').insert(
        input.ingredients.map((ingredient) => ({
          meal_id: meal.id,
          food_id: ingredient.foodId,
          quantity: ingredient.quantity,
        }))
      )
      if (ingredientsError) throw ingredientsError

      return meal as ZeroPointMeal
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['zeroPointMeals'] }),
  })
}

export interface LogZeroPointMealInput {
  userId: string
  meal: ZeroPointMealWithIngredients
  loggedDate: string
  dailyPointsAllowance: number
  weeklyResetDay: Weekday
}

/**
 * One-tap logging: inserts a food_entries row per ingredient (all zero-point,
 * so points_used is 0 for each) — same reuse-the-food-entry-path approach as
 * useLogRecipe, rather than adding a meal_id to food_entries.
 */
export function useLogZeroPointMeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: LogZeroPointMealInput) => {
      const rows = input.meal.zero_point_meal_ingredients.map((ingredient) => ({
        user_id: input.userId,
        food_id: ingredient.food_id,
        logged_date: input.loggedDate,
        meal_type: input.meal.meal_type,
        quantity: ingredient.quantity,
        points_used: Math.round(ingredient.foods.points_per_serving * ingredient.quantity),
      }))

      const { error } = await supabase.from('food_entries').insert(rows)
      if (error) throw error

      await recalculateDailySummary(input.userId, input.loggedDate, input.dailyPointsAllowance)
      await recalculateWeeklyCycle(input.userId, input.weeklyResetDay, input.loggedDate)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['foodEntries', variables.userId, variables.loggedDate] })
      queryClient.invalidateQueries({ queryKey: ['dailySummary', variables.userId, variables.loggedDate] })
      const weekStartDate = getWeekStartDate(variables.loggedDate, variables.weeklyResetDay)
      queryClient.invalidateQueries({ queryKey: ['weeklyCycle', variables.userId, weekStartDate] })
    },
  })
}
