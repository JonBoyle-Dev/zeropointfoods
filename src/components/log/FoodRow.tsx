import type { Food } from '../../types/database'

export function FoodRow({
  food,
  onAdd,
  onToggleFavourite,
}: {
  food: Food
  onAdd: (food: Food) => void
  onToggleFavourite: (food: Food) => void
}) {
  return (
    <div className="mb-2 flex items-center justify-between rounded-xl border border-[#DADFD7] bg-white px-3.5 py-3">
      <div>
        <div className="text-[13.5px] font-semibold text-[#1C2620]">{food.name}</div>
        <div className="mt-0.5 text-[11.5px] text-[#5B665D]">
          {food.serving_size} {food.serving_unit} · {food.points_per_serving} pts
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleFavourite(food)}
          aria-label={food.is_favourite ? `Unfavourite ${food.name}` : `Favourite ${food.name}`}
          aria-pressed={food.is_favourite}
          className={'text-[16px] ' + (food.is_favourite ? 'text-[#D9A62E]' : 'text-[#DADFD7]')}
        >
          ★
        </button>
        <button
          onClick={() => onAdd(food)}
          aria-label={`Log ${food.name}`}
          className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#2B6E63] text-[17px] text-[#2B6E63]"
        >
          +
        </button>
      </div>
    </div>
  )
}
