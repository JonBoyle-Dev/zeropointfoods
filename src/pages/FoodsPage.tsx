import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AddFoodForm } from '../components/foods/AddFoodForm'
import { EditFoodModal } from '../components/foods/EditFoodModal'
import { LogFoodModal } from '../components/log/LogFoodModal'
import { useCreateFood, useDeleteFood, useFoods } from '../hooks/useFoods'
import { useUser } from '../hooks/useUser'
import { useProfileContext } from '../context/ProfileContext'
import { todayDateInputValue } from '../lib/dates'
import type { Food } from '../types/database'

export function FoodsPage() {
  const { currentProfileId } = useProfileContext()
  const { data: foods, isLoading } = useFoods()
  const { data: user } = useUser(currentProfileId)
  const createFood = useCreateFood()
  const deleteFood = useDeleteFood()
  const [loggingFood, setLoggingFood] = useState<Food | null>(null)
  const [editingFood, setEditingFood] = useState<Food | null>(null)

  function handleDelete(food: Food) {
    if (!window.confirm(`Delete "${food.name}"? This can't be undone.`)) return
    deleteFood.mutate(food.id, {
      onError: (error) => window.alert((error as Error).message),
    })
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Foods</h1>
        <Link to="/log" className="text-xs font-medium text-slate-500">
          ← Back to log
        </Link>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 p-4">
        <h2 className="text-sm font-medium text-slate-700">Add a new food</h2>
        <div className="mt-3">
          <AddFoodForm onSubmit={(input) => createFood.mutate(input)} isSubmitting={createFood.isPending} />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-medium text-slate-700">Food database</h2>
        {isLoading && <p className="mt-2 text-sm text-slate-500">Loading…</p>}
        <ul className="mt-2 divide-y divide-slate-200 rounded-xl border border-slate-200">
          {foods?.map((food) => (
            <li key={food.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-slate-900">{food.name}</p>
                <p className="text-slate-500">
                  {food.serving_size} {food.serving_unit}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-700">{food.points_per_serving} pts</span>
                <button
                  onClick={() => setEditingFood(food)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  Edit
                </button>
                {food.is_user_created && (
                  <button
                    onClick={() => handleDelete(food)}
                    className="text-xs font-medium text-red-600"
                    aria-label={`Delete ${food.name}`}
                  >
                    Delete
                  </button>
                )}
                {user && (
                  <button
                    onClick={() => setLoggingFood(food)}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Log
                  </button>
                )}
              </div>
            </li>
          ))}
          {foods?.length === 0 && <li className="px-4 py-3 text-sm text-slate-500">No foods yet — add one above.</li>}
        </ul>
      </div>

      {loggingFood && user && (
        <LogFoodModal food={loggingFood} user={user} loggedDate={todayDateInputValue()} onClose={() => setLoggingFood(null)} />
      )}

      {editingFood && <EditFoodModal food={editingFood} onClose={() => setEditingFood(null)} />}
    </div>
  )
}
