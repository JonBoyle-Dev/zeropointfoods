import type { FoodCategory } from '../../types/database'

const CATEGORIES: { value: FoodCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'protein', label: 'Protein' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'grains', label: 'Grains' },
  { value: 'fruit_veg', label: 'Fruit & Veg' },
  { value: 'alcohol', label: 'Alcohol' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'condiments', label: 'Condiments' },
]

export function CategoryChips({
  selected,
  onChange,
}: {
  selected: FoodCategory | 'all'
  onChange: (category: FoodCategory | 'all') => void
}) {
  return (
    <div className="mb-3.5 flex gap-2 overflow-x-auto pb-1.5">
      {CATEGORIES.map((c) => (
        <button
          key={c.value}
          onClick={() => onChange(c.value)}
          className={
            'flex-shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium ' +
            (selected === c.value
              ? 'border-[#2B6E63] bg-[#2B6E63] text-white'
              : 'border-[#DADFD7] bg-white text-[#5B665D]')
          }
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}
