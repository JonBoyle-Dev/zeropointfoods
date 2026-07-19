import { useState, type FormEvent } from 'react'
import type { FoodCategory } from '../../types/database'
import type { NewFoodInput } from '../../hooks/useFoods'

const CATEGORIES: { value: FoodCategory; label: string }[] = [
  { value: 'protein', label: 'Protein' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'grains', label: 'Grains' },
  { value: 'fruit_veg', label: 'Fruit & Veg' },
  { value: 'alcohol', label: 'Alcohol' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'condiments', label: 'Condiments' },
  { value: 'custom', label: 'Custom' },
]

export function AddFoodForm({ onSubmit, isSubmitting }: { onSubmit: (input: NewFoodInput) => void; isSubmitting: boolean }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<FoodCategory>('custom')
  const [calories, setCalories] = useState('')
  const [satFatG, setSatFatG] = useState('')
  const [sugarG, setSugarG] = useState('')
  const [proteinG, setProteinG] = useState('')
  const [servingSize, setServingSize] = useState('1')
  const [servingUnit, setServingUnit] = useState('serving')

  const isValid = name.trim() && calories && servingSize && servingUnit.trim()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isValid) return
    onSubmit({
      name: name.trim(),
      category,
      calories: Number(calories),
      satFatG: Number(satFatG || 0),
      sugarG: Number(sugarG || 0),
      proteinG: Number(proteinG || 0),
      servingSize: Number(servingSize),
      servingUnit: servingUnit.trim(),
    })
    setName('')
    setCalories('')
    setSatFatG('')
    setSugarG('')
    setProteinG('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Grilled chicken breast"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          autoFocus
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as FoodCategory)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Calories</label>
          <input
            name="calories"
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Protein (g)</label>
          <input
            name="proteinG"
            type="number"
            value={proteinG}
            onChange={(e) => setProteinG(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Sat fat (g)</label>
          <input
            name="satFatG"
            type="number"
            value={satFatG}
            onChange={(e) => setSatFatG(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Sugar (g)</label>
          <input
            name="sugarG"
            type="number"
            value={sugarG}
            onChange={(e) => setSugarG(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Serving size</label>
          <input
            name="servingSize"
            type="number"
            value={servingSize}
            onChange={(e) => setServingSize(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Serving unit</label>
          <input
            name="servingUnit"
            value={servingUnit}
            onChange={(e) => setServingUnit(e.target.value)}
            placeholder="e.g. 100g, cup, slice"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {isSubmitting ? 'Saving…' : 'Add food'}
        </button>
      </div>
    </form>
  )
}
