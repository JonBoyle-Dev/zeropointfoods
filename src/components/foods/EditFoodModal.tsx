import { useState } from 'react'
import { Modal } from '../common/Modal'
import { useUpdateFood } from '../../hooks/useFoods'
import { calculateFoodPoints } from '../../lib/points'
import type { Food, FoodCategory } from '../../types/database'

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

export function EditFoodModal({ food, onClose }: { food: Food; onClose: () => void }) {
  const [name, setName] = useState(food.name)
  const [category, setCategory] = useState<FoodCategory>(food.category)
  const [calories, setCalories] = useState(String(food.calories))
  const [satFatG, setSatFatG] = useState(String(food.sat_fat_g))
  const [sugarG, setSugarG] = useState(String(food.sugar_g))
  const [proteinG, setProteinG] = useState(String(food.protein_g))
  const [servingSize, setServingSize] = useState(String(food.serving_size))
  const [servingUnit, setServingUnit] = useState(food.serving_unit)
  const [isZeroPoint, setIsZeroPoint] = useState(food.is_zero_point)
  const [isMixer, setIsMixer] = useState(food.is_mixer)
  const [isFlavorBooster, setIsFlavorBooster] = useState(food.is_flavor_booster)
  const [pointsPerServing, setPointsPerServing] = useState(String(food.points_per_serving))

  const updateFood = useUpdateFood()
  const zeroPointDisabled = category === 'alcohol'

  const calculatedPoints = calculateFoodPoints({
    calories: Number(calories || 0),
    satFatG: Number(satFatG || 0),
    sugarG: Number(sugarG || 0),
    proteinG: Number(proteinG || 0),
    isZeroPoint: zeroPointDisabled ? false : isZeroPoint,
    category,
  })

  const isValid = name.trim() && calories && servingSize && servingUnit.trim() && pointsPerServing !== ''

  function handleSubmit() {
    if (!isValid) return
    updateFood.mutate(
      {
        foodId: food.id,
        name: name.trim(),
        category,
        calories: Number(calories),
        satFatG: Number(satFatG || 0),
        sugarG: Number(sugarG || 0),
        proteinG: Number(proteinG || 0),
        servingSize: Number(servingSize),
        servingUnit: servingUnit.trim(),
        pointsPerServing: Number(pointsPerServing),
        isZeroPoint: zeroPointDisabled ? false : isZeroPoint,
        isMixer,
        isFlavorBooster,
      },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal title={`Edit ${food.name}`} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
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
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Protein (g)</label>
            <input
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
              type="number"
              value={satFatG}
              onChange={(e) => setSatFatG(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Sugar (g)</label>
            <input
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
              type="number"
              value={servingSize}
              onChange={(e) => setServingSize(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Serving unit</label>
            <input
              value={servingUnit}
              onChange={(e) => setServingUnit(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-700">
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={isZeroPoint}
              disabled={zeroPointDisabled}
              onChange={(e) => setIsZeroPoint(e.target.checked)}
            />
            Zero-point{zeroPointDisabled ? ' (not for alcohol)' : ''}
          </label>
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={isMixer} onChange={(e) => setIsMixer(e.target.checked)} />
            Mixer
          </label>
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={isFlavorBooster} onChange={(e) => setIsFlavorBooster(e.target.checked)} />
            Flavor booster
          </label>
        </div>

        <div className="rounded-lg border border-slate-200 p-3">
          <label className="mb-1 block text-sm font-medium text-slate-700">Points per serving</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={pointsPerServing}
              onChange={(e) => setPointsPerServing(e.target.value)}
              className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
            <span className="text-xs text-slate-500">
              Calculated from the values above: <b className="font-mono">{calculatedPoints}</b>
            </span>
            {Number(pointsPerServing) !== calculatedPoints && (
              <button
                type="button"
                onClick={() => setPointsPerServing(String(calculatedPoints))}
                className="ml-auto text-xs font-medium text-teal-700 underline"
              >
                Use calculated
              </button>
            )}
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Type your own value here to override the calculated points for this food.
          </p>
        </div>

        {updateFood.isError && <p className="text-sm text-red-600">{(updateFood.error as Error).message}</p>}

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!isValid || updateFood.isPending}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {updateFood.isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
