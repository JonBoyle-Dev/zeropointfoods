import { DAYS_PER_WEEK } from '../../lib/points'

// Purely a visual scale for the coin fill — there's no real ceiling on the bank
// anymore (the daily rollover cap was removed), so this just gives the bar a
// sensible range to fill across; it clamps rather than implying a hard max.
const VISUAL_SCALE = 28

export function WeeklyBankStrip({ bank }: { bank: number }) {
  const filledCoins = Math.min(DAYS_PER_WEEK, Math.round((Math.max(0, bank) / VISUAL_SCALE) * DAYS_PER_WEEK))

  return (
    <div className="mt-4">
      <div className="mb-1.5 flex justify-between text-xs text-[#5B665D]">
        <span>Weekly bank</span>
        <b className="font-mono text-[#1C2620]">{Math.round(bank)} pts</b>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: DAYS_PER_WEEK }).map((_, i) => (
          <div key={i} className={'h-3.5 flex-1 rounded ' + (i < filledCoins ? 'bg-[#D9A62E]' : 'bg-[#DADFD7]')} />
        ))}
      </div>
    </div>
  )
}
