import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { recalculateDailySummary } from './useDailySummary'
import { recalculateWeeklyCycle } from './useWeeklyCycle'
import { getWeekStartDate } from '../lib/dates'
import type { Food, MealType, Recipe, Weekday } from '../types/database'

export type RecipeIngredientWithFood = { food_id: string; quantity: number; foods: Food }
export type RecipeWithIngredients = Recipe & { recipe_ingredients: RecipeIngredientWithFood[] }

export function useRecipes(userId: string | undefined) {
  return useQuery({
    queryKey: ['recipes', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*, recipe_ingredients(food_id, quantity, foods(*))')
        .eq('user_id', userId!)
        .order('name')
      if (error) throw error
      return data as unknown as RecipeWithIngredients[]
    },
    enabled: !!userId,
  })
}

export interface RecipeIngredientInput {
  foodId: string
  quantity: number
}

export interface NewRecipeInput {
  userId: string
  name: string
  ingredients: RecipeIngredientInput[]
  totalPoints: number
}

export function useCreateRecipe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: NewRecipeInput) => {
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({ user_id: input.userId, name: input.name, total_points: input.totalPoints })
        .select()
        .single()
      if (recipeError) throw recipeError

      const { error: ingredientsError } = await supabase.from('recipe_ingredients').insert(
        input.ingredients.map((ingredient) => ({
          recipe_id: recipe.id,
          food_id: ingredient.foodId,
          quantity: ingredient.quantity,
        }))
      )
      if (ingredientsError) throw ingredientsError

      return recipe as Recipe
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recipes'] }),
  })
}

export interface LogRecipeInput {
  userId: string
  recipe: RecipeWithIngredients
  loggedDate: string
  mealType: MealType
  servings: number
  dailyPointsAllowance: number
  weeklyResetDay: Weekday
}

/**
 * Logging a recipe inserts one snapshotted food_entries row per ingredient
 * (scaled by the ingredient's own quantity and the servings multiplier) rather
 * than a single recipe-level entry — the schema has no recipe_id on
 * food_entries, so this reuses the existing per-food logging path instead of
 * widening that table for one feature.
 */
export function useLogRecipe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: LogRecipeInput) => {
      const rows = input.recipe.recipe_ingredients.map((ingredient) => {
        const quantity = ingredient.quantity * input.servings
        return {
          user_id: input.userId,
          food_id: ingredient.food_id,
          logged_date: input.loggedDate,
          meal_type: input.mealType,
          quantity,
          points_used: Math.round(ingredient.foods.points_per_serving * quantity),
        }
      })

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
