import { useState } from 'react'
import { Modal } from '../common/Modal'
import { useLogRecipe } from '../../hooks/useRecipes'
import type { RecipeWithIngredients } from '../../hooks/useRecipes'
import type { MealType } from '../../types/database'

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
]

export function LogRecipeModal({
  recipe,
  userId,
  loggedDate,
  dailyPointsAllowance,
  onClose,
}: {
  recipe: RecipeWithIngredients
  userId: string
  loggedDate: string
  dailyPointsAllowance: number
  onClose: () => void
}) {
  const [servings, setServings] = useState('1')
  const [mealType, setMealType] = useState<MealType>('dinner')
  const logRecipe = useLogRecipe()

  function handleSubmit() {
    logRecipe.mutate(
      { userId, recipe, loggedDate, mealType, servings: Number(servings), dailyPointsAllowance },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal title={`Log ${recipe.name}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Servings</label>
            <input
              type="number"
              min="0.25"
              step="0.25"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
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

        <p className="text-sm text-slate-500">{Math.round(recipe.total_points * Number(servings || 0))} points for {servings || 0}× serving</p>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={logRecipe.isPending || !Number(servings)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {logRecipe.isPending ? 'Logging…' : 'Log it'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
