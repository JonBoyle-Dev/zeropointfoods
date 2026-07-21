export function WeeklyBankStrip({ bank }: { bank: number }) {
  return (
    <div className="mt-4 flex items-center justify-between rounded-lg bg-[#F3F4F1] px-3 py-2">
      <span className="text-xs text-[#5B665D]">Points banked this week</span>
      <b className="font-mono text-sm text-[#1C2620]">{Math.round(bank)} pts</b>
    </div>
  )
}
