import type { Weekday } from '../types/database'

const WEEKDAY_INDEX: Record<Weekday, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

/** Start-of-week date (inclusive) for a given date, keyed to the user's own weekly_reset_day — never assume Monday (spec §5). */
export function getWeekStartDate(dateStr: string, weeklyResetDay: Weekday): string {
  const date = new Date(dateStr + 'T00:00:00')
  const diff = (date.getDay() - WEEKDAY_INDEX[weeklyResetDay] + 7) % 7
  return toDateInputValue(addDays(date, -diff))
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + Math.round(days))
  return result
}

/** Formats using local date components — toISOString() would convert to UTC and can shift the date by a day. */
export function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayDateInputValue(): string {
  return toDateInputValue(new Date())
}

/** Whole years elapsed since a date of birth — used for the age_years term in calculateAllowance (spec §2.1). */
export function ageInYears(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth + 'T00:00:00')
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const hasHadBirthdayThisYear = today.getMonth() > dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())
  if (!hasHadBirthdayThisYear) age -= 1
  return age
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}
