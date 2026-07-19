import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CategoryChips } from '../components/log/CategoryChips'
import { FoodRow } from '../components/log/FoodRow'
import { LogFoodModal } from '../components/log/LogFoodModal'
import { useFoods, useToggleFavourite } from '../hooks/useFoods'
import { useRecentlyLoggedFoods } from '../hooks/useFoodEntries'
import { useUser } from '../hooks/useUser'
import { todayDateInputValue } from '../lib/dates'
import type { Food, FoodCategory } from '../types/database'

export function LogPage() {
  const { data: user } = useUser()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<FoodCategory | 'all'>('all')
  const [loggingFood, setLoggingFood] = useState<Food | null>(null)

  const isBrowsing = search.trim() !== '' || category !== 'all'
  const { data: results, isLoading: resultsLoading } = useFoods({ search, category })
  const { data: allFoods } = useFoods()
  const { data: recentlyLogged } = useRecentlyLoggedFoods(user?.id)
  const toggleFavourite = useToggleFavourite()

  const favourites = allFoods?.filter((food) => food.is_favourite) ?? []

  function handleToggleFavourite(food: Food) {
    toggleFavourite.mutate({ foodId: food.id, isFavourite: !food.is_favourite })
  }

  return (
    <div className="min-h-screen bg-[#EFF2ED] px-5 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-['Space_Grotesk',sans-serif] text-[15px] font-semibold text-[#1C2620]">Log food or drink</h1>
        <div className="flex gap-3">
          <Link to="/library" className="text-[12px] font-medium text-[#2B6E63]">
            Library
          </Link>
          <Link to="/recipes" className="text-[12px] font-medium text-[#2B6E63]">
            Recipes
          </Link>
          <Link to="/today" className="text-[12px] font-medium text-[#2B6E63]">
            Today
          </Link>
        </div>
      </div>

      <div className="mb-3.5 flex items-center gap-2 rounded-xl border border-[#DADFD7] bg-white px-3.5 py-3 text-[13.5px] text-[#5B665D]">
        <span>🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search foods…"
          className="w-full bg-transparent outline-none placeholder:text-[#5B665D]"
        />
      </div>

      <CategoryChips selected={category} onChange={setCategory} />

      {isBrowsing ? (
        <div>
          <div className="mb-2.5 font-['Space_Grotesk',sans-serif] text-[15px] font-semibold text-[#1C2620]">Results</div>
          {resultsLoading && <p className="text-sm text-[#5B665D]">Loading…</p>}
          {results?.map((food) => (
            <FoodRow key={food.id} food={food} onAdd={setLoggingFood} onToggleFavourite={handleToggleFavourite} />
          ))}
          {results?.length === 0 && <p className="text-sm text-[#5B665D]">No foods match — try a different search or add a new one below.</p>}
        </div>
      ) : (
        <>
          <div className="mb-2.5 font-['Space_Grotesk',sans-serif] text-[15px] font-semibold text-[#1C2620]">Favourites</div>
          {favourites.length === 0 && <p className="mb-3 text-sm text-[#5B665D]">Tap the star on any food to favourite it.</p>}
          {favourites.map((food) => (
            <FoodRow key={food.id} food={food} onAdd={setLoggingFood} onToggleFavourite={handleToggleFavourite} />
          ))}

          <div className="mt-3.5 mb-2.5 font-['Space_Grotesk',sans-serif] text-[15px] font-semibold text-[#1C2620]">Recently logged</div>
          {recentlyLogged?.length === 0 && <p className="text-sm text-[#5B665D]">Nothing logged yet.</p>}
          {recentlyLogged?.map((food) => (
            <FoodRow key={food.id} food={food} onAdd={setLoggingFood} onToggleFavourite={handleToggleFavourite} />
          ))}
        </>
      )}

      <Link
        to="/foods"
        className="mt-2 block w-full rounded-xl border-[1.5px] border-dashed border-[#5B665D] py-3.5 text-center text-[13px] font-medium text-[#5B665D]"
      >
        + Add a new food or drink
      </Link>

      {loggingFood && user && (
        <LogFoodModal food={loggingFood} user={user} loggedDate={todayDateInputValue()} onClose={() => setLoggingFood(null)} />
      )}
    </div>
  )
}
