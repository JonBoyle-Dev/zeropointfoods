import { useState } from 'react'
import { Modal } from '../common/Modal'
import { useLogFoodEntry } from '../../hooks/useFoodEntries'
import type { Food, MealType, User } from '../../types/database'

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
]

export function LogFoodModal({
  food,
  user,
  loggedDate,
  onClose,
}: {
  food: Food
  user: User
  loggedDate: string
  onClose: () => void
}) {
  const [quantity, setQuantity] = useState('1')
  const [mealType, setMealType] = useState<MealType>('snack')
  const logEntry = useLogFoodEntry()

  function handleSubmit() {
    logEntry.mutate(
      {
        userId: user.id,
        foodId: food.id,
        loggedDate,
        mealType,
        quantity: Number(quantity),
        pointsPerServing: food.points_per_serving,
        dailyPointsAllowance: user.daily_points_allowance,
        weeklyResetDay: user.weekly_reset_day,
      },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal title={`Log ${food.name}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Servings</label>
            <input
              name="quantity"
              type="number"
              min="0.25"
              step="0.25"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Meal</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value as MealType)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            >
              {MEAL_TYPES.map((meal) => (
                <option key={meal.value} value={meal.value}>
                  {meal.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          {Math.round(food.points_per_serving * Number(quantity || 0))} points for {quantity || 0}× {food.serving_size} {food.serving_unit}
        </p>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={logEntry.isPending || !Number(quantity)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {logEntry.isPending ? 'Logging…' : 'Log it'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
