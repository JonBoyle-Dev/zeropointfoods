import { useState } from 'react'
import type { Food } from '../../types/database'
import type { NewRecipeInput, RecipeIngredientInput } from '../../hooks/useRecipes'

type IngredientDraft = RecipeIngredientInput & { food: Food }

export function RecipeBuilder({
  userId,
  foods,
  onSubmit,
  isSubmitting,
}: {
  userId: string
  foods: Food[]
  onSubmit: (input: NewRecipeInput) => void
  isSubmitting: boolean
}) {
  const [name, setName] = useState('')
  const [ingredients, setIngredients] = useState<IngredientDraft[]>([])
  const [selectedFoodId, setSelectedFoodId] = useState('')
  const [quantity, setQuantity] = useState('1')

  const totalPoints = Math.round(ingredients.reduce((sum, i) => sum + i.food.points_per_serving * i.quantity, 0))

  function addIngredient() {
    const food = foods.find((f) => f.id === selectedFoodId)
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
      ingredients: ingredients.map(({ foodId, quantity }) => ({ foodId, quantity })),
      totalPoints,
    })
    setName('')
    setIngredients([])
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Recipe name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sunday roast tray bake"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-[1fr_auto_auto] gap-2">
        <select
          value={selectedFoodId}
          onChange={(e) => setSelectedFoodId(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          <option value="">Add ingredient…</option>
          {foods.map((food) => (
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

      {ingredients.length > 0 && (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-center justify-between px-3 py-2 text-sm">
              <span>
                {ingredient.quantity}× {ingredient.food.name}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-500">{Math.round(ingredient.food.points_per_serving * ingredient.quantity)} pts</span>
                <button type="button" onClick={() => removeIngredient(index)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className="text-sm text-slate-600">
          Total: <b className="font-mono">{totalPoints} pts</b>
        </span>
        <button
          type="button"
          onClick={handleSave}
          disabled={!name.trim() || ingredients.length === 0 || isSubmitting}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {isSubmitting ? 'Saving…' : 'Save recipe'}
        </button>
      </div>
    </div>
  )
}
