import { useState } from 'react'
import { Modal } from '../common/Modal'
import { useUpdateFood } from '../../hooks/useFoods'
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
  const [servingSize, setServingSize] = useState(String(food.serving_size))
  const [servingUnit, setServingUnit] = useState(food.serving_unit)
  const [isZeroPoint, setIsZeroPoint] = useState(food.is_zero_point)
  const [isMixer, setIsMixer] = useState(food.is_mixer)
  const [isFlavorBooster, setIsFlavorBooster] = useState(food.is_flavor_booster)
  const [pointsPerServing, setPointsPerServing] = useState(String(food.points_per_serving))

  const updateFood = useUpdateFood()
  const zeroPointDisabled = category === 'alcohol'

  const isValid = name.trim() && servingSize && servingUnit.trim() && pointsPerServing !== ''

  function handleSubmit() {
    if (!isValid) return
    updateFood.mutate(
      {
        foodId: food.id,
        name: name.trim(),
        category,
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

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Points per serving</label>
          <input
            type="number"
            value={pointsPerServing}
            onChange={(e) => setPointsPerServing(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
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
