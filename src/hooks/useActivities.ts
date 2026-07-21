import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { recalculateDailySummary } from './useDailySummary'
import { recalculateWeeklyCycle } from './useWeeklyCycle'
import { getWeekStartDate } from '../lib/dates'
import type { Activity, ActivityEntry, Weekday } from '../types/database'

export function useActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase.from('activities').select('*').order('name')
      if (error) throw error
      return data as Activity[]
    },
  })
}

export type ActivityEntryWithActivityName = ActivityEntry & { activities: { name: string } | null }

export function useTodayActivityEntries(userId: string | undefined, date: string) {
  return useQuery({
    queryKey: ['activityEntries', userId, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_entries')
        .select('*, activities(name)')
        .eq('user_id', userId!)
        .eq('logged_date', date)
        .order('id')
      if (error) throw error
      return data as unknown as ActivityEntryWithActivityName[]
    },
    enabled: !!userId,
  })
}

export interface LogActivityEntryInput {
  userId: string
  activityId: string
  loggedDate: string
  durationMinutes: number
  pointsPerSession: number
  sessionMinutes: number
  dailyPointsAllowance: number
  weeklyResetDay: Weekday
}

export interface DeleteActivityEntryInput {
  entryId: string
  userId: string
  loggedDate: string
  dailyPointsAllowance: number
  weeklyResetDay: Weekday
}

export function useDeleteActivityEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: DeleteActivityEntryInput) => {
      const { error } = await supabase.from('activity_entries').delete().eq('id', input.entryId)
      if (error) throw error

      await recalculateDailySummary(input.userId, input.loggedDate, input.dailyPointsAllowance)
      await recalculateWeeklyCycle(input.userId, input.weeklyResetDay, input.loggedDate)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activityEntries', variables.userId, variables.loggedDate] })
      queryClient.invalidateQueries({ queryKey: ['dailySummary', variables.userId, variables.loggedDate] })
      const weekStartDate = getWeekStartDate(variables.loggedDate, variables.weeklyResetDay)
      queryClient.invalidateQueries({ queryKey: ['weeklyCycle', variables.userId, weekStartDate] })
      queryClient.invalidateQueries({ queryKey: ['bankCarriedIn', variables.userId] })
    },
  })
}

export function useLogActivityEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: LogActivityEntryInput) => {
      // Points are assigned directly per session length, not calculated from MET/weight
      // (removed per explicit user request) — scale proportionally to the actual duration logged.
      // Snapshotted at log time, same rationale as food_entries.points_used (spec §4).
      const pointsEarned = Math.round((input.pointsPerSession * input.durationMinutes) / input.sessionMinutes)

      const { data, error } = await supabase
        .from('activity_entries')
        .insert({
          user_id: input.userId,
          activity_id: input.activityId,
          logged_date: input.loggedDate,
          duration_minutes: input.durationMinutes,
          points_earned: pointsEarned,
        })
        .select()
        .single()
      if (error) throw error

      await recalculateDailySummary(input.userId, input.loggedDate, input.dailyPointsAllowance)
      await recalculateWeeklyCycle(input.userId, input.weeklyResetDay, input.loggedDate)

      return data as ActivityEntry
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activityEntries', variables.userId, variables.loggedDate] })
      queryClient.invalidateQueries({ queryKey: ['dailySummary', variables.userId, variables.loggedDate] })
      const weekStartDate = getWeekStartDate(variables.loggedDate, variables.weeklyResetDay)
      queryClient.invalidateQueries({ queryKey: ['weeklyCycle', variables.userId, weekStartDate] })
      queryClient.invalidateQueries({ queryKey: ['bankCarriedIn', variables.userId] })
    },
  })
}
