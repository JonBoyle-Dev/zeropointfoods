import { WeeklyTrendChart } from '../components/reports/WeeklyTrendChart'
import { CategoryBreakdownList } from '../components/reports/CategoryBreakdownList'
import { useWeeklyTrend, useCategoryBreakdown } from '../hooks/useReports'
import { useUser } from '../hooks/useUser'
import { useProfileContext } from '../context/ProfileContext'
import { addDays, getWeekStartDate, toDateInputValue, todayDateInputValue } from '../lib/dates'

export function ReportsPage() {
  const { currentProfileId } = useProfileContext()
  const { data: user } = useUser(currentProfileId)
  const today = todayDateInputValue()
  const weekStartDate = user ? getWeekStartDate(today, user.weekly_reset_day) : ''
  const weekEndDate = weekStartDate ? toDateInputValue(addDays(new Date(weekStartDate + 'T00:00:00'), 6)) : ''

  const { data: weeks } = useWeeklyTrend(user?.id, user?.weekly_reset_day ?? 'monday')
  const { data: breakdown } = useCategoryBreakdown(user?.id, weekStartDate, weekEndDate)

  const currentWeek = weeks?.[weeks.length - 1]
  const activityEarned = currentWeek?.totalActivity ?? 0

  return (
    <div className="min-h-screen bg-[#EFF2ED] px-5 py-6 pb-24">
      <h1 className="mb-4 font-['Space_Grotesk',sans-serif] text-[15px] font-semibold text-[#1C2620]">Reports</h1>

      <div className="mb-4 flex items-center justify-between rounded-2xl bg-white p-5 shadow-[0_1px_0_#DADFD7]">
        <span className="text-[13px] text-[#5B665D]">Activity earned this week</span>
        <b className="font-mono text-2xl font-bold text-[#2B6E63]">+{Math.round(activityEarned)} pts</b>
      </div>

      {weeks && (
        <div className="mb-4">
          <WeeklyTrendChart weeks={weeks} />
        </div>
      )}

      {breakdown && <CategoryBreakdownList breakdown={breakdown} />}
    </div>
  )
}
