import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PointsDial } from '../components/today/PointsDial'
import { WeeklyBankStrip } from '../components/today/WeeklyBankStrip'
import { DayNav } from '../components/today/DayNav'
import { LogActivityModal } from '../components/today/LogActivityModal'
import { WeighInModal } from '../components/today/WeighInModal'
import { useDailySummary } from '../hooks/useDailySummary'
import { useTodayEntries, useDeleteFoodEntry } from '../hooks/useFoodEntries'
import { useTodayActivityEntries, useDeleteActivityEntry } from '../hooks/useActivities'
import { useWeeklyCycle, useBankCarriedIntoDay } from '../hooks/useWeeklyCycle'
import { useUser } from '../hooks/useUser'
import { useProfileContext } from '../context/ProfileContext'
import { addDays, getWeekStartDate, toDateInputValue, todayDateInputValue } from '../lib/dates'

export function TodayPage() {
  const { currentProfileId } = useProfileContext()
  const { data: user } = useUser(currentProfileId)
  const today = todayDateInputValue()
  const [selectedDate, setSelectedDate] = useState(today)
  const isToday = selectedDate === today

  const { data: summary } = useDailySummary(user?.id, selectedDate)
  const { data: foodEntries } = useTodayEntries(user?.id, selectedDate)
  const { data: activityEntries } = useTodayActivityEntries(user?.id, selectedDate)
  const weekStartDate = user ? getWeekStartDate(selectedDate, user.weekly_reset_day) : ''
  const { data: weeklyCycle } = useWeeklyCycle(user?.id, weekStartDate)
  const { data: bankCarriedIn } = useBankCarriedIntoDay(user?.id, user?.weekly_reset_day ?? 'monday', selectedDate)
  const [loggingActivity, setLoggingActivity] = useState(false)
  const [loggingWeighIn, setLoggingWeighIn] = useState(false)
  const deleteFoodEntry = useDeleteFoodEntry()
  const deleteActivityEntry = useDeleteActivityEntry()

  function handleDeleteFoodEntry(entryId: string) {
    if (!user) return
    deleteFoodEntry.mutate({
      entryId,
      userId: user.id,
      loggedDate: selectedDate,
      dailyPointsAllowance: user.daily_points_allowance,
      weeklyResetDay: user.weekly_reset_day,
    })
  }

  function handleDeleteActivityEntry(entryId: string) {
    if (!user) return
    deleteActivityEntry.mutate({
      entryId,
      userId: user.id,
      loggedDate: selectedDate,
      dailyPointsAllowance: user.daily_points_allowance,
      weeklyResetDay: user.weekly_reset_day,
    })
  }

  // Historical days keep their own snapshotted allowance; a day with nothing logged yet (including today) falls back to the current allowance.
  const allowance = summary ? summary.points_allowance : (user?.daily_points_allowance ?? 0)
  const used = summary?.points_used ?? 0
  const activityEarned = summary?.activity_points_earned ?? 0
  // Unused points from earlier this week increase what's left to spend; overspending earlier reduces it (bankCarriedIn is signed).
  const pointsLeft = allowance + activityEarned + (bankCarriedIn ?? 0) - used
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
          <div className="font-mono text-[11px] uppercase tracking-wider text-[#5B665D]">
            {isToday ? 'Today' : new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          <div className="mt-2.5 flex items-center gap-4">
            <PointsDial pointsLeft={pointsLeft} allowance={allowance} />
            <div className="flex flex-1 flex-col gap-2.5">
              <div className="flex justify-between text-[13px] text-[#5B665D]">
                <span>Daily allowance</span>
                <b className="font-mono font-semibold text-[#1C2620]">{Math.round(allowance)}</b>
              </div>
              <div className="flex justify-between text-[13px] text-[#5B665D]">
                <span>Logged</span>
                <b className="font-mono font-semibold text-[#1C2620]">{Math.round(used)}</b>
              </div>
              <div className="flex justify-between text-[13px] text-[#5B665D]">
                <span>Activity earned</span>
                <b className="font-mono font-semibold text-[#1C2620]">+{Math.round(activityEarned)}</b>
              </div>
              <div className="flex justify-between text-[13px] text-[#5B665D]">
                <span>Carried in</span>
                <b className="font-mono font-semibold text-[#1C2620]">{Math.round(bankCarriedIn ?? 0)}</b>
              </div>
            </div>
          </div>

          {user && (
            <DayNav
              weekStartDate={weekStartDate}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
              onPrevWeek={() => setSelectedDate((d) => toDateInputValue(addDays(new Date(d + 'T00:00:00'), -7)))}
              onNextWeek={() => setSelectedDate((d) => toDateInputValue(addDays(new Date(d + 'T00:00:00'), 7)))}
            />
          )}

          <WeeklyBankStrip bank={weeklyBank} />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setLoggingActivity(true)}
            className="flex-1 rounded-xl border border-[#DADFD7] bg-white py-2.5 text-[12.5px] font-medium text-[#1C2620]"
          >
            + Log activity
          </button>
          {isToday && (
            <button
              onClick={() => setLoggingWeighIn(true)}
              className="flex-1 rounded-xl border border-[#DADFD7] bg-white py-2.5 text-[12.5px] font-medium text-[#1C2620]"
            >
              + Log weigh-in
            </button>
          )}
        </div>

        <div className="mt-6 mb-2.5 flex items-center justify-between font-['Space_Grotesk',sans-serif] text-[15px] font-semibold text-[#1C2620]">
          <span>Logged {isToday ? 'today' : ''}</span>
          <Link to={`/log?date=${selectedDate}`} className="text-[12px] font-medium text-[#2B6E63]">
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
            <button
              onClick={() => handleDeleteFoodEntry(entry.id)}
              aria-label={`Remove ${entry.foods?.name ?? 'food'} entry`}
              className="text-[#5B665D]"
            >
              ✕
            </button>
          </div>
        ))}

        {activityEntries?.map((entry) => (
          <div key={entry.id} className="mb-2 flex items-center gap-3 rounded-xl border border-[#DADFD7] bg-white px-3.5 py-3">
            <div className="flex-1">
              <div className="text-[13.5px] font-semibold text-[#1C2620]">{entry.activities?.name ?? 'Activity'}</div>
              <div className="mt-0.5 text-[11.5px] text-[#5B665D]">Activity · {entry.duration_minutes} min</div>
            </div>
            <div className="font-mono text-[13px] font-semibold text-[#2B6E63]">+{Math.round(entry.points_earned)} pt</div>
            <button
              onClick={() => handleDeleteActivityEntry(entry.id)}
              aria-label={`Remove ${entry.activities?.name ?? 'activity'} entry`}
              className="text-[#5B665D]"
            >
              ✕
            </button>
          </div>
        ))}

        {!hasEntries && <p className="text-sm text-[#5B665D]">Nothing logged {isToday ? 'yet today' : 'this day'}.</p>}
      </div>

      {loggingActivity && user && (
        <LogActivityModal user={user} loggedDate={selectedDate} onClose={() => setLoggingActivity(false)} />
      )}
      {loggingWeighIn && user && <WeighInModal user={user} today={today} onClose={() => setLoggingWeighIn(false)} />}
    </div>
  )
}
