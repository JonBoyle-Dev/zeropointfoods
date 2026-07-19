import { DAYS_PER_WEEK, MAX_DAILY_ROLLOVER } from '../../lib/points'

const MAX_BANK = DAYS_PER_WEEK * MAX_DAILY_ROLLOVER

export function WeeklyBankStrip({ bank }: { bank: number }) {
  const filledCoins = Math.round((Math.min(bank, MAX_BANK) / MAX_BANK) * DAYS_PER_WEEK)

  return (
    <div className="mt-4">
      <div className="mb-1.5 flex justify-between text-xs text-[#5B665D]">
        <span>Weekly bank</span>
        <b className="font-mono text-[#1C2620]">
          {Math.round(bank)} / {MAX_BANK} pts
        </b>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: DAYS_PER_WEEK }).map((_, i) => (
          <div key={i} className={'h-3.5 flex-1 rounded ' + (i < filledCoins ? 'bg-[#D9A62E]' : 'bg-[#DADFD7]')} />
        ))}
      </div>
    </div>
  )
}
