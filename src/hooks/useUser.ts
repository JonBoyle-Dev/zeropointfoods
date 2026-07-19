import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { calculateAllowance } from '../lib/points'
import { toDateInputValue } from '../lib/dates'
import type { ActivityLevel, Sex, UnitsPreference, User, Weekday } from '../types/database'

/** Single-user app — there's exactly one row in `users`, or none yet (onboarding not done). */
export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data, error } = await supabase.from('users').select('*').maybeSingle()
      if (error) throw error
      return data as User | null
    },
  })
}

export interface OnboardingInput {
  name: string
  weightKg: number
  heightCm: number
  ageYears: number
  sex?: Sex
  activityLevel: ActivityLevel
  weeklyResetDay: Weekday
  unitsPreference: UnitsPreference
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: OnboardingInput) => {
      const dailyPointsAllowance = calculateAllowance({
        weightKg: input.weightKg,
        heightCm: input.heightCm,
        ageYears: input.ageYears,
        sex: input.sex,
        activityLevel: input.activityLevel,
      })
      const dateOfBirth = new Date()
      dateOfBirth.setFullYear(dateOfBirth.getFullYear() - input.ageYears)

      const { data, error } = await supabase
        .from('users')
        .insert({
          name: input.name,
          sex: input.sex ?? null,
          height_cm: input.heightCm,
          date_of_birth: toDateInputValue(dateOfBirth),
          activity_level: input.activityLevel,
          weekly_reset_day: input.weeklyResetDay,
          units_preference: input.unitsPreference,
          daily_points_allowance: dailyPointsAllowance,
          current_weight_kg: input.weightKg,
        })
        .select()
        .single()
      if (error) throw error
      return data as User
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
  })
}
