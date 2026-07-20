import type { ActivityLevel, Sex } from '../types/database'

const SEX_OFFSET: Record<Sex, number> = {
  female: -2,
  male: 0,
}

const ACTIVITY_BONUS: Record<ActivityLevel, number> = {
  sedentary: 0,
  low_active: 1,
  active: 2,
  very_active: 3,
}

const MIN_DAILY_ALLOWANCE = 20
export const MAX_DAILY_ROLLOVER = 4
export const DAYS_PER_WEEK = 7

export interface AllowanceInput {
  weightKg: number
  heightCm: number
  ageYears: number
  sex?: Sex
  activityLevel: ActivityLevel
}

/** Personal daily points allowance — spec §2.1. Floors at MIN_DAILY_ALLOWANCE. */
export function calculateAllowance(input: AllowanceInput): number {
  const sexOffset = input.sex ? SEX_OFFSET[input.sex] : 0
  const activityBonus = ACTIVITY_BONUS[input.activityLevel]
  const allowance =
    8 +
    input.weightKg * 0.07 +
    input.heightCm * 0.05 -
    input.ageYears * 0.05 +
    sexOffset +
    activityBonus
  return Math.max(allowance, MIN_DAILY_ALLOWANCE)
}

export interface ActivityPointsInput {
  durationMinutes: number
  metValue: number
  weightKg: number
}

/** Activity (FitPoints) — spec §2.3, standard MET-based formula. */
export function calculateActivityPoints(input: ActivityPointsInput): number {
  return (input.durationMinutes * input.metValue * input.weightKg * 0.0175) / 10
}

export interface DailyRolloverInput {
  dailyAllowance: number
  dailyPointsUsed: number
  currentWeeklyBank: number
}

export interface DailyRolloverResult {
  weeklyBank: number
  isOverBudget: boolean
}

/** Weekly bank rollover/dip — spec §2.4. Bank floors at 0 and never goes negative. */
export function calculateDailyRollover(input: DailyRolloverInput): DailyRolloverResult {
  const { dailyAllowance, dailyPointsUsed, currentWeeklyBank } = input

  if (dailyPointsUsed <= dailyAllowance) {
    const rollover = Math.min(MAX_DAILY_ROLLOVER, dailyAllowance - dailyPointsUsed)
    return { weeklyBank: currentWeeklyBank + rollover, isOverBudget: false }
  }

  const shortfall = dailyPointsUsed - dailyAllowance
  const newBank = currentWeeklyBank - shortfall
  return { weeklyBank: Math.max(0, newBank), isOverBudget: newBank < 0 }
}
