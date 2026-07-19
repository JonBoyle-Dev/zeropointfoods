import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { calculateFoodPoints } from '../lib/points'
import type { Food, FoodCategory } from '../types/database'

export interface FoodFilters {
  search?: string
  category?: FoodCategory | 'all'
}

export function useFoods(filters: FoodFilters = {}) {
  const { search, category } = filters
  return useQuery({
    queryKey: ['foods', search ?? '', category ?? 'all'],
    queryFn: async () => {
      let query = supabase.from('foods').select('*').order('name')
      if (search) query = query.ilike('name', `%${search}%`)
      if (category && category !== 'all') query = query.eq('category', category)
      const { data, error } = await query
      if (error) throw error
      return data as Food[]
    },
  })
}

export function useToggleFavourite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ foodId, isFavourite }: { foodId: string; isFavourite: boolean }) => {
      const { error } = await supabase.from('foods').update({ is_favourite: isFavourite }).eq('id', foodId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['foods'] }),
  })
}

export interface NewFoodInput {
  name: string
  category: FoodCategory
  calories: number
  satFatG: number
  sugarG: number
  proteinG: number
  servingSize: number
  servingUnit: string
  isZeroPoint?: boolean
  isMixer?: boolean
  isFlavorBooster?: boolean
}

export function useCreateFood() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: NewFoodInput) => {
      const pointsPerServing = calculateFoodPoints({
        calories: input.calories,
        satFatG: input.satFatG,
        sugarG: input.sugarG,
        proteinG: input.proteinG,
        isZeroPoint: input.isZeroPoint ?? false,
        category: input.category,
      })

      const { data, error } = await supabase
        .from('foods')
        .insert({
          name: input.name,
          category: input.category,
          calories: input.calories,
          sat_fat_g: input.satFatG,
          sugar_g: input.sugarG,
          protein_g: input.proteinG,
          serving_size: input.servingSize,
          serving_unit: input.servingUnit,
          points_per_serving: pointsPerServing,
          is_zero_point: input.isZeroPoint ?? false,
          is_mixer: input.isMixer ?? false,
          is_flavor_booster: input.isFlavorBooster ?? false,
          is_user_created: true,
        })
        .select()
        .single()
      if (error) throw error
      return data as Food
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['foods'] }),
  })
}

export interface UpdateFoodInput {
  foodId: string
  name: string
  category: FoodCategory
  calories: number
  satFatG: number
  sugarG: number
  proteinG: number
  servingSize: number
  servingUnit: string
  pointsPerServing: number
  isZeroPoint: boolean
  isMixer: boolean
  isFlavorBooster: boolean
}

/**
 * pointsPerServing is taken as-is rather than recalculated here — EditFoodModal
 * shows the live calculateFoodPoints() result alongside an editable field, so
 * the caller has already decided (recalculated or manually overridden) by the
 * time this runs. Past food_entries.points_used snapshots are untouched (spec §5).
 */
export function useUpdateFood() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateFoodInput) => {
      const { error } = await supabase
        .from('foods')
        .update({
          name: input.name,
          category: input.category,
          calories: input.calories,
          sat_fat_g: input.satFatG,
          sugar_g: input.sugarG,
          protein_g: input.proteinG,
          serving_size: input.servingSize,
          serving_unit: input.servingUnit,
          points_per_serving: input.pointsPerServing,
          is_zero_point: input.isZeroPoint,
          is_mixer: input.isMixer,
          is_flavor_booster: input.isFlavorBooster,
        })
        .eq('id', input.foodId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['foods'] }),
  })
}

/**
 * food_entries/recipe_ingredients/zero_point_meal_ingredients all reference
 * foods with ON DELETE CASCADE, so a naive delete would silently wipe any
 * history or recipe/meal that uses this food. This checks for references
 * first and blocks with a clear error rather than letting that cascade happen.
 * Only ever offered in the UI for is_user_created foods — curated library
 * content isn't user-deletable.
 */
export function useDeleteFood() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (foodId: string) => {
      const [{ count: entryCount }, { count: recipeCount }, { count: mealCount }] = await Promise.all([
        supabase.from('food_entries').select('id', { count: 'exact', head: true }).eq('food_id', foodId),
        supabase.from('recipe_ingredients').select('food_id', { count: 'exact', head: true }).eq('food_id', foodId),
        supabase.from('zero_point_meal_ingredients').select('food_id', { count: 'exact', head: true }).eq('food_id', foodId),
      ])

      if (entryCount) throw new Error(`Can't delete — this food has been logged ${entryCount} time${entryCount === 1 ? '' : 's'}.`)
      if (recipeCount) throw new Error("Can't delete — this food is used in a recipe.")
      if (mealCount) throw new Error("Can't delete — this food is used in a Zero-Point Meal.")

      const { error } = await supabase.from('foods').delete().eq('id', foodId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['foods'] }),
  })
}

export function useMixers() {
  return useQuery({
    queryKey: ['foods', 'mixers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('foods').select('*').eq('is_mixer', true).order('name')
      if (error) throw error
      return data as Food[]
    },
  })
}

export function useFlavorBoosters() {
  return useQuery({
    queryKey: ['foods', 'flavorBoosters'],
    queryFn: async () => {
      const { data, error } = await supabase.from('foods').select('*').eq('is_flavor_booster', true).order('name')
      if (error) throw error
      return data as Food[]
    },
  })
}
