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
        isZeroPoint: false,
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
