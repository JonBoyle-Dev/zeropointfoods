import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PointsDial } from '../components/today/PointsDial'
import { WeeklyBankStrip } from '../components/today/WeeklyBankStrip'
import { LogActivityModal } from '../components/today/LogActivityModal'
import { WeighInModal } from '../components/today/WeighInModal'
import { useDailySummary } from '../hooks/useDailySummary'
import { useTodayEntries } from '../hooks/useFoodEntries'
import { useTodayActivityEntries } from '../hooks/useActivities'
import { useWeeklyCycle } from '../hooks/useWeeklyCycle'
import { useUser } from '../hooks/useUser'
import { getWeekStartDate, todayDateInputValue } from '../lib/dates'

export function TodayPage() {
  const { data: user } = useUser()
  const today = todayDateInputValue()
  const { data: summary } = useDailySummary(user?.id, today)
  const { data: foodEntries } = useTodayEntries(user?.id, today)
  const { data: activityEntries } = useTodayActivityEntries(user?.id, today)
  const weekStartDate = user ? getWeekStartDate(today, user.weekly_reset_day) : ''
  const { data: weeklyCycle } = useWeeklyCycle(user?.id, weekStartDate)
  const [loggingActivity, setLoggingActivity] = useState(false)
  const [loggingWeighIn, setLoggingWeighIn] = useState(false)

  const allowance = user?.daily_points_allowance ?? 0
  const used = summary?.points_used ?? 0
  const activityEarned = summary?.activity_points_earned ?? 0
  const pointsLeft = allowance + activityEarned - used
  const weeklyBank = weeklyCycle?.weekly_bank_current ?? 0

  const hasEntries = (foodEntries?.length ?? 0) > 0 || (activityEntries?.length ?? 0) > 0

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

          <WeeklyBankStrip bank={weeklyBank} />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setLoggingActivity(true)}
            className="flex-1 rounded-xl border border-[#DADFD7] bg-white py-2.5 text-[12.5px] font-medium text-[#1C2620]"
          >
            + Log activity
          </button>
          <button
            onClick={() => setLoggingWeighIn(true)}
            className="flex-1 rounded-xl border border-[#DADFD7] bg-white py-2.5 text-[12.5px] font-medium text-[#1C2620]"
          >
            + Log weigh-in
          </button>
        </div>

        <div className="mt-6 mb-2.5 flex items-center justify-between font-['Space_Grotesk',sans-serif] text-[15px] font-semibold text-[#1C2620]">
          <span>Logged today</span>
          <Link to="/log" className="text-[12px] font-medium text-[#2B6E63]">
            Log food
          </Link>
        </div>

        {foodEntries?.map((entry) => (
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

        {activityEntries?.map((entry) => (
          <div key={entry.id} className="mb-2 flex items-center gap-3 rounded-xl border border-[#DADFD7] bg-white px-3.5 py-3">
            <div className="flex-1">
              <div className="text-[13.5px] font-semibold text-[#1C2620]">{entry.activities?.name ?? 'Activity'}</div>
              <div className="mt-0.5 text-[11.5px] text-[#5B665D]">Activity · {entry.duration_minutes} min</div>
            </div>
            <div className="font-mono text-[13px] font-semibold text-[#2B6E63]">+{Math.round(entry.points_earned)} pt</div>
          </div>
        ))}

        {!hasEntries && <p className="text-sm text-[#5B665D]">Nothing logged yet today.</p>}
      </div>

      {loggingActivity && user && <LogActivityModal user={user} loggedDate={today} onClose={() => setLoggingActivity(false)} />}
      {loggingWeighIn && user && <WeighInModal user={user} today={today} onClose={() => setLoggingWeighIn(false)} />}
    </div>
  )
}
