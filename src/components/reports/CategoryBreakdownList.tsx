import type { CategoryBreakdownPoint } from '../../hooks/useReports'
import type { FoodCategory } from '../../types/database'

const CATEGORY_LABELS: Record<FoodCategory, string> = {
  protein: 'Protein',
  dairy: 'Dairy',
  grains: 'Grains',
  fruit_veg: 'Fruit & Veg',
  alcohol: 'Alcohol',
  snacks: 'Snacks',
  condiments: 'Condiments',
  custom: 'Custom',
}

export function CategoryBreakdownList({ breakdown }: { breakdown: CategoryBreakdownPoint[] }) {
  const total = breakdown.reduce((sum, c) => sum + c.points, 0)

  return (
    <div className="rounded-2xl border border-[#DADFD7] bg-white p-4">
      <div className="mb-3.5 text-xs text-[#5B665D]">Where this week's points went</div>
      {breakdown.length === 0 && <p className="text-sm text-[#5B665D]">Nothing logged this week yet.</p>}
      <div className="space-y-2.5">
        {breakdown.map((c) => {
          const pct = total > 0 ? Math.round((c.points / total) * 100) : 0
          return (
            <div key={c.category}>
              <div className="mb-1 flex justify-between text-[12.5px]">
                <span className="text-[#1C2620]">{CATEGORY_LABELS[c.category]}</span>
                <b className="font-mono text-[#1C2620]">{c.points} pts</b>
              </div>
              <div className="h-2 rounded-full bg-[#EFF2ED]">
                <div className="h-2 rounded-full bg-[#D9A62E]" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
