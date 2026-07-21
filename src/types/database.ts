export type Sex = 'female' | 'male'
export type ActivityLevel = 'sedentary' | 'low_active' | 'active' | 'very_active'
export type UnitsPreference = 'metric' | 'imperial'
export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type FoodCategory =
  | 'protein'
  | 'dairy'
  | 'grains'
  | 'fruit_veg'
  | 'alcohol'
  | 'snacks'
  | 'condiments'
  | 'custom'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface User {
  id: string
  name: string | null
  email: string | null
  sex: Sex | null
  height_cm: number
  date_of_birth: string
  activity_level: ActivityLevel
  weekly_reset_day: Weekday
  units_preference: UnitsPreference
  daily_points_allowance: number
  current_weight_kg: number
}

export interface WeighIn {
  id: string
  user_id: string
  weight_kg: number
  logged_at: string
}

export interface Food {
  id: string
  name: string
  category: FoodCategory
  serving_size: number
  serving_unit: string
  points_per_serving: number
  is_zero_point: boolean
  is_mixer: boolean
  is_flavor_booster: boolean
  is_favourite: boolean
  is_user_created: boolean
  created_by_user_id: string | null
}

export interface FoodEntry {
  id: string
  user_id: string
  food_id: string
  logged_date: string
  meal_type: MealType
  quantity: number
  points_used: number
}

export interface Recipe {
  id: string
  user_id: string
  name: string
  total_points: number
}

export interface RecipeIngredient {
  recipe_id: string
  food_id: string
  quantity: number
}

export interface ZeroPointMeal {
  id: string
  name: string
  meal_type: MealType
  description: string | null
  image_url: string | null
  is_user_created: boolean
  created_by_user_id: string | null
}

export interface ZeroPointMealIngredient {
  meal_id: string
  food_id: string
  quantity: number
}

export interface Activity {
  id: string
  name: string
  points_per_session: number
  session_minutes: number
  is_user_created: boolean
}

export interface ActivityEntry {
  id: string
  user_id: string
  activity_id: string
  logged_date: string
  duration_minutes: number
  points_earned: number
}

export interface WaterEntry {
  id: string
  user_id: string
  logged_date: string
  amount_ml: number
}

export interface DailySummary {
  user_id: string
  date: string
  points_allowance: number
  points_used: number
  activity_points_earned: number
  rollover_to_weekly: number
  is_over_budget: boolean
}

export interface WeeklyCycle {
  id: string
  user_id: string
  week_start_date: string
  weekly_bank_starting: number
  weekly_bank_current: number
}
