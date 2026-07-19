import { useState } from 'react'
import { ZeroPointMealCard } from '../components/library/ZeroPointMealCard'
import { ZeroPointMealBuilder } from '../components/library/ZeroPointMealBuilder'
import { FoodRow } from '../components/log/FoodRow'
import { LogFoodModal } from '../components/log/LogFoodModal'
import { useZeroPointMeals, useCreateZeroPointMeal, useLogZeroPointMeal, useDeleteZeroPointMeal } from '../hooks/useZeroPointMeals'
import { useFoods, useMixers, useFlavorBoosters, useToggleFavourite } from '../hooks/useFoods'
import { useUser } from '../hooks/useUser'
import { useProfileContext } from '../context/ProfileContext'
import { todayDateInputValue } from '../lib/dates'
import type { Food } from '../types/database'

type LibraryTab = 'meals' | 'mixers' | 'boosters'

export function LibraryPage() {
  const { currentProfileId } = useProfileContext()
  const { data: user } = useUser(currentProfileId)
  const [tab, setTab] = useState<LibraryTab>('meals')
  const [loggingFood, setLoggingFood] = useState<Food | null>(null)
  const [loggingMealId, setLoggingMealId] = useState<string | null>(null)

  const { data: meals } = useZeroPointMeals('all')
  const { data: mixers } = useMixers()
  const { data: boosters } = useFlavorBoosters()
  const { data: allFoods } = useFoods()
  const zeroPointFoods = allFoods?.filter((food) => food.is_zero_point) ?? []
  const toggleFavourite = useToggleFavourite()

  const createMeal = useCreateZeroPointMeal()
  const logMeal = useLogZeroPointMeal()
  const deleteMeal = useDeleteZeroPointMeal()

  function handleToggleFavourite(food: Food) {
    toggleFavourite.mutate({ foodId: food.id, isFavourite: !food.is_favourite })
  }

  function handleDeleteMeal(meal: NonNullable<typeof meals>[number]) {
    if (!window.confirm(`Delete "${meal.name}"? This can't be undone.`)) return
    deleteMeal.mutate(meal.id)
  }

  function handleLogMeal(meal: NonNullable<typeof meals>[number]) {
    if (!user) return
    setLoggingMealId(meal.id)
    logMeal.mutate(
      {
        userId: user.id,
        meal,
        loggedDate: todayDateInputValue(),
        dailyPointsAllowance: user.daily_points_allowance,
        weeklyResetDay: user.weekly_reset_day,
      },
      { onSettled: () => setLoggingMealId(null) }
    )
  }

  return (
    <div className="min-h-screen bg-[#EFF2ED] px-5 py-6 pb-24">
      <h1 className="mb-4 font-['Space_Grotesk',sans-serif] text-[15px] font-semibold text-[#1C2620]">Zero-Point Library</h1>

      <div className="mb-4 flex gap-1.5 rounded-full bg-white p-1">
        {(['meals', 'mixers', 'boosters'] as LibraryTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              'flex-1 rounded-full py-2 text-xs font-semibold ' + (tab === t ? 'bg-[#2B6E63] text-white' : 'text-[#5B665D]')
            }
          >
            {t === 'meals' ? 'Meals' : t === 'mixers' ? 'Mixers' : 'Flavor Boosters'}
          </button>
        ))}
      </div>

      {tab === 'meals' && (
        <div>
          {meals?.map((meal) => (
            <ZeroPointMealCard
              key={meal.id}
              meal={meal}
              onLog={() => handleLogMeal(meal)}
              onDelete={() => handleDeleteMeal(meal)}
              isLogging={loggingMealId === meal.id}
            />
          ))}
          {meals?.length === 0 && <p className="mb-3 text-sm text-[#5B665D]">No zero-point meals yet.</p>}
        </div>
      )}

      {tab === 'mixers' && (
        <div>
          {mixers?.map((food) => (
            <FoodRow key={food.id} food={food} onAdd={setLoggingFood} onToggleFavourite={handleToggleFavourite} />
          ))}
          {mixers?.length === 0 && <p className="mb-3 text-sm text-[#5B665D]">No mixers yet — mark a food as a mixer on the Foods page.</p>}
        </div>
      )}

      {tab === 'boosters' && (
        <div>
          {boosters?.map((food) => (
            <FoodRow key={food.id} food={food} onAdd={setLoggingFood} onToggleFavourite={handleToggleFavourite} />
          ))}
          {boosters?.length === 0 && <p className="mb-3 text-sm text-[#5B665D]">No flavor boosters yet — mark a food as one on the Foods page.</p>}
        </div>
      )}

      {tab === 'meals' && user && (
        <div className="mt-4 rounded-xl border border-[#DADFD7] bg-white p-4">
          <h2 className="mb-3 text-sm font-medium text-[#1C2620]">Add your own idea to the library</h2>
          <ZeroPointMealBuilder
            userId={user.id}
            zeroPointFoods={zeroPointFoods}
            onSubmit={(input) => createMeal.mutate(input)}
            isSubmitting={createMeal.isPending}
          />
        </div>
      )}

      {loggingFood && user && (
        <LogFoodModal food={loggingFood} user={user} loggedDate={todayDateInputValue()} onClose={() => setLoggingFood(null)} />
      )}
    </div>
  )
}
