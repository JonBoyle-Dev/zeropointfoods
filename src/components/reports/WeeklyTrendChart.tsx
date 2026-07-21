import type { WeekTrendPoint } from '../../hooks/useReports'

export function WeeklyTrendChart({ weeks }: { weeks: WeekTrendPoint[] }) {
  const maxTotal = Math.max(1, ...weeks.map((w) => Math.max(w.totalUsed, w.totalAllowance + w.totalActivity)))

  return (
    <div className="rounded-2xl border border-[#DADFD7] bg-white p-4">
      <div className="mb-3.5 text-xs text-[#5B665D]">Points used vs. allowance — last 5 weeks</div>
      <div className="flex h-28 items-end gap-2">
        {weeks.map((week, i) => {
          const heightPct = Math.max(4, Math.round((week.totalUsed / maxTotal) * 100))
          const isCurrentWeek = i === weeks.length - 1
          return (
            <div key={week.weekStartDate} className="flex flex-1 flex-col items-center justify-end gap-1.5">
              <div
                className={'w-full rounded-t ' + (week.isOverBudget ? 'bg-[#B8492F]' : 'bg-[#2B6E63]')}
                style={{ height: `${heightPct}%` }}
              />
              <div className={'font-mono text-[10px] ' + (isCurrentWeek ? 'font-semibold text-[#1C2620]' : 'text-[#5B665D]')}>
                {isCurrentWeek ? 'This wk' : new Date(week.weekStartDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
