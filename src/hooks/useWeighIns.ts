import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { calculateAllowance } from '../lib/points'
import { ageInYears, getWeekStartDate } from '../lib/dates'
import { recalculateDailySummary } from './useDailySummary'
import { recalculateWeeklyCycle } from './useWeeklyCycle'
import type { User, WeighIn } from '../types/database'

export function useWeighIns(userId: string | undefined) {
  return useQuery({
    queryKey: ['weighIns', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weigh_ins')
        .select('*')
        .eq('user_id', userId!)
        .order('logged_at', { ascending: false })
      if (error) throw error
      return data as WeighIn[]
    },
    enabled: !!userId,
  })
}

export interface LogWeighInInput {
  user: User
  weightKg: number
  today: string
}

/**
 * Logging a weigh-in recalculates daily_points_allowance from the new weight
 * (spec: "Recalculated automatically whenever weight, height, age, or activity
 * level changes" — §2.1), then cascades that new allowance into today's
 * daily_summary and the current week's bank, same as any other log action.
 */
export function useLogWeighIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: LogWeighInInput) => {
      const { user, weightKg, today } = input

      const { error: weighInError } = await supabase.from('weigh_ins').insert({ user_id: user.id, weight_kg: weightKg })
      if (weighInError) throw weighInError

      const newAllowance = calculateAllowance({
        weightKg,
        heightCm: user.height_cm,
        ageYears: ageInYears(user.date_of_birth),
        sex: user.sex ?? undefined,
        activityLevel: user.activity_level,
      })

      const { error: userError } = await supabase
        .from('users')
        .update({ current_weight_kg: weightKg, daily_points_allowance: newAllowance })
        .eq('id', user.id)
      if (userError) throw userError

      await recalculateDailySummary(user.id, today, newAllowance)
      await recalculateWeeklyCycle(user.id, user.weekly_reset_day, today)

      return newAllowance
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['weighIns', variables.user.id] })
      queryClient.invalidateQueries({ queryKey: ['dailySummary', variables.user.id, variables.today] })
      const weekStartDate = getWeekStartDate(variables.today, variables.user.weekly_reset_day)
      queryClient.invalidateQueries({ queryKey: ['weeklyCycle', variables.user.id, weekStartDate] })
      queryClient.invalidateQueries({ queryKey: ['bankCarriedIn', variables.user.id] })
      queryClient.invalidateQueries({ queryKey: ['weekOverBudget', variables.user.id] })
    },
  })
}
