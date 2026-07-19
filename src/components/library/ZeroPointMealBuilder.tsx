import { useState } from 'react'
import type { Food, MealType } from '../../types/database'
import type { NewZeroPointMealInput, ZeroPointMealIngredientInput } from '../../hooks/useZeroPointMeals'

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
]

type IngredientDraft = ZeroPointMealIngredientInput & { food: Food }

export function ZeroPointMealBuilder({
  userId,
  zeroPointFoods,
  onSubmit,
  isSubmitting,
}: {
  userId: string
  zeroPointFoods: Food[]
  onSubmit: (input: NewZeroPointMealInput) => void
  isSubmitting: boolean
}) {
  const [name, setName] = useState('')
  const [mealType, setMealType] = useState<MealType>('dinner')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState<IngredientDraft[]>([])
  const [selectedFoodId, setSelectedFoodId] = useState('')
  const [quantity, setQuantity] = useState('1')

  function addIngredient() {
    const food = zeroPointFoods.find((f) => f.id === selectedFoodId)
    if (!food || !quantity) return
    setIngredients((prev) => [...prev, { foodId: food.id, food, quantity: Number(quantity) }])
    setSelectedFoodId('')
    setQuantity('1')
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSave() {
    if (!name.trim() || ingredients.length === 0) return
    onSubmit({
      userId,
      name: name.trim(),
      mealType,
      description: description.trim() || undefined,
      ingredients: ingredients.map(({ foodId, quantity }) => ({ foodId, quantity })),
    })
    setName('')
    setDescription('')
    setIngredients([])
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Meal name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Herby grilled chicken & steamed greens"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Meal type</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            {MEAL_TYPES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Description (optional)</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_auto] gap-2">
        <select
          value={selectedFoodId}
          onChange={(e) => setSelectedFoodId(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          <option value="">Add zero-point ingredient…</option>
          {zeroPointFoods.map((food) => (
            <option key={food.id} value={food.id}>
              {food.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0.25"
          step="0.25"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={addIngredient}
          disabled={!selectedFoodId}
          className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
        >
          Add
        </button>
      </div>
      {zeroPointFoods.length === 0 && (
        <p className="text-xs text-slate-500">No zero-point foods yet — mark a food as zero-point on the Foods page first.</p>
      )}

      {ingredients.length > 0 && (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-center justify-between px-3 py-2 text-sm">
              <span>
                {ingredient.quantity}× {ingredient.food.name}
              </span>
              <button type="button" onClick={() => removeIngredient(index)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={!name.trim() || ingredients.length === 0 || isSubmitting}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {isSubmitting ? 'Saving…' : 'Save to library'}
        </button>
      </div>
    </div>
  )
}
