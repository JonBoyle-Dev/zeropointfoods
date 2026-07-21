import { addDays, todayDateInputValue, toDateInputValue } from '../../lib/dates'

export function DayNav({
  weekStartDate,
  selectedDate,
  dayStatuses,
  onSelect,
  onPrevWeek,
  onNextWeek,
}: {
  weekStartDate: string
  selectedDate: string
  /** date -> is_over_budget. A day with no entry (nothing logged yet) is left out — no verdict without data. */
  dayStatuses: Record<string, boolean>
  onSelect: (date: string) => void
  onPrevWeek: () => void
  onNextWeek: () => void
}) {
  const today = todayDateInputValue()
  const start = new Date(weekStartDate + 'T00:00:00')
  const days = Array.from({ length: 7 }, (_, i) => toDateInputValue(addDays(start, i)))

  return (
    <div className="mt-4 flex items-center gap-1.5">
      <button onClick={onPrevWeek} aria-label="Previous week" className="px-1 text-[#5B665D]">
        ‹
      </button>
      <div className="flex flex-1 gap-1">
        {days.map((date) => {
          const d = new Date(date + 'T00:00:00')
          const isSelected = date === selectedDate
          const isToday = date === today
          const overBudget = dayStatuses[date]

          const fill =
            overBudget === true
              ? 'bg-[#F7D9D9] text-[#8B2E2E]'
              : overBudget === false
                ? 'bg-[#DCEAE6] text-[#1C2620]'
                : 'text-[#5B665D]'

          return (
            <button
              key={date}
              onClick={() => onSelect(date)}
              className={
                'flex flex-1 flex-col items-center rounded-lg py-1.5 text-[11px] font-medium ' +
                fill +
                (isSelected ? ' ring-2 ring-inset ring-[#1C2620]' : '') +
                (isToday && !isSelected ? ' border-b-2 border-[#1C2620]' : '')
              }
            >
              <span>{d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2)}</span>
              <span className="font-mono">{d.getDate()}</span>
            </button>
          )
        })}
      </div>
      <button onClick={onNextWeek} aria-label="Next week" className="px-1 text-[#5B665D]">
        ›
      </button>
    </div>
  )
}
