import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { calculateFoodPoints } from '../lib/points'
import type { Food, FoodCategory } from '../types/database'

export function useFoods() {
  return useQuery({
    queryKey: ['foods'],
    queryFn: async () => {
      const { data, error } = await supabase.from('foods').select('*').order('name')
      if (error) throw error
      return data as Food[]
    },
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
