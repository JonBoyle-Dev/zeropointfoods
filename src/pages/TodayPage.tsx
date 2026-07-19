import { Link } from 'react-router-dom'
import { PointsDial } from '../components/today/PointsDial'
import { useDailySummary } from '../hooks/useDailySummary'
import { useTodayEntries } from '../hooks/useFoodEntries'
import { useUser } from '../hooks/useUser'
import { todayDateInputValue } from '../lib/dates'

export function TodayPage() {
  const { data: user } = useUser()
  const today = todayDateInputValue()
  const { data: summary } = useDailySummary(user?.id, today)
  const { data: entries } = useTodayEntries(user?.id, today)

  const allowance = user?.daily_points_allowance ?? 0
  const used = summary?.points_used ?? 0
  const activityEarned = summary?.activity_points_earned ?? 0
  const pointsLeft = allowance + activityEarned - used

  return (
    <div className="min-h-screen bg-[#EFF2ED] pb-24">
      <header className="flex items-center justify-between px-5 pb-3 pt-6">
        <div className="font-['Space_Grotesk',sans-serif] text-[19px] font-bold text-[#1C2620]">
          zeropoint<span className="text-[#D9A62E]">foods</span>
        </div>
      </header>

      <div className="px-5">
        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_0_#DADFD7]">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[#5B665D]">Today</div>
          <div className="mt-2.5 flex items-center gap-4">
            <PointsDial pointsLeft={pointsLeft} allowance={allowance} />
            <div className="flex flex-1 flex-col gap-2.5">
              <div className="flex justify-between text-[13px] text-[#5B665D]">
                <span>Daily allowance</span>
                <b className="font-mono font-semibold text-[#1C2620]">{Math.round(allowance)}</b>
              </div>
              <div className="flex justify-between text-[13px] text-[#5B665D]">
                <span>Logged today</span>
                <b className="font-mono font-semibold text-[#1C2620]">{Math.round(used)}</b>
              </div>
              <div className="flex justify-between text-[13px] text-[#5B665D]">
                <span>Activity earned</span>
                <b className="font-mono font-semibold text-[#1C2620]">+{Math.round(activityEarned)}</b>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 mb-2.5 flex items-center justify-between font-['Space_Grotesk',sans-serif] text-[15px] font-semibold text-[#1C2620]">
          <span>Logged today</span>
          <Link to="/foods" className="text-[12px] font-medium text-[#2B6E63]">
            Log food
          </Link>
        </div>

        {entries?.map((entry) => (
          <div key={entry.id} className="mb-2 flex items-center gap-3 rounded-xl border border-[#DADFD7] bg-white px-3.5 py-3">
            <div className="flex-1">
              <div className="text-[13.5px] font-semibold text-[#1C2620]">{entry.foods?.name ?? 'Food'}</div>
              <div className="mt-0.5 text-[11.5px] text-[#5B665D] capitalize">
                {entry.meal_type} · {entry.quantity}×
              </div>
            </div>
            <div className="font-mono text-[13px] font-semibold text-[#1C2620]">{entry.points_used} pt</div>
          </div>
        ))}
        {entries?.length === 0 && <p className="text-sm text-[#5B665D]">Nothing logged yet today.</p>}
      </div>
    </div>
  )
}
