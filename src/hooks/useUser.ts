import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { calculateAllowance } from '../lib/points'
import { toDateInputValue, todayDateInputValue } from '../lib/dates'
import { recalculateWeeklyCycle } from './useWeeklyCycle'
import type { ActivityLevel, Sex, UnitsPreference, User, Weekday } from '../types/database'

/** All profiles, for the profile picker (spec update: household app, not single-user). */
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('users').select('*').order('name')
      if (error) throw error
      return data as User[]
    },
  })
}

/** The currently-selected profile (from ProfileContext), or null if none/not found. */
export function useUser(profileId: string | null) {
  return useQuery({
    queryKey: ['user', profileId],
    queryFn: async () => {
      const { data, error } = await supabase.from('users').select('*').eq('id', profileId!).maybeSingle()
      if (error) throw error
      return data as User | null
    },
    enabled: !!profileId,
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}

/** Changing the reset day shifts the whole week's boundary, so the current week's bank/rollover is recalculated under it immediately rather than waiting for the next log action. */
export function useUpdateWeeklyResetDay() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, weeklyResetDay }: { userId: string; weeklyResetDay: Weekday }) => {
      const { error } = await supabase.from('users').update({ weekly_reset_day: weeklyResetDay }).eq('id', userId)
      if (error) throw error
      await recalculateWeeklyCycle(userId, weeklyResetDay, todayDateInputValue())
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['weeklyCycle', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['bankCarriedIn', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['weekOverBudget', variables.userId] })
    },
  })
}
