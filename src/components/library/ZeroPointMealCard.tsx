import type { ZeroPointMealWithIngredients } from '../../hooks/useZeroPointMeals'

const MEAL_EMOJI: Record<string, string> = {
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍗',
  snack: '🍎',
}

export function ZeroPointMealCard({
  meal,
  onLog,
  isLogging,
}: {
  meal: ZeroPointMealWithIngredients
  onLog: () => void
  isLogging: boolean
}) {
  return (
    <div className="mb-3 overflow-hidden rounded-2xl border border-[#DADFD7] bg-white">
      <div className="flex h-16 items-center justify-center bg-gradient-to-br from-[#DCEAE6] to-[#F3E3B8] text-2xl">
        {MEAL_EMOJI[meal.meal_type] ?? '🍽️'}
      </div>
      <div className="px-3.5 py-3">
        <div className="text-[13.5px] font-semibold text-[#1C2620]">{meal.name}</div>
        {meal.description && <div className="mt-0.5 text-[11.5px] leading-snug text-[#5B665D]">{meal.description}</div>}
        <div className="mt-2.5 flex items-center justify-between">
          <span className="rounded-full bg-[#DCEAE6] px-2 py-0.5 font-mono text-[10.5px] font-semibold uppercase text-[#2B6E63]">
            0 pts · {meal.meal_type}
          </span>
          <button
            onClick={onLog}
            disabled={isLogging}
            className="rounded-full bg-[#1C2620] px-3 py-1.5 text-[11.5px] font-semibold text-white disabled:opacity-40"
          >
            {isLogging ? 'Logging…' : 'Log meal'}
          </button>
        </div>
      </div>
    </div>
  )
}
