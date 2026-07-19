import { useState } from 'react'
import { Modal } from '../common/Modal'
import { useActivities, useLogActivityEntry } from '../../hooks/useActivities'
import { calculateActivityPoints } from '../../lib/points'
import type { User } from '../../types/database'

export function LogActivityModal({ user, loggedDate, onClose }: { user: User; loggedDate: string; onClose: () => void }) {
  const { data: activities } = useActivities()
  const [activityId, setActivityId] = useState('')
  const [durationMinutes, setDurationMinutes] = useState('30')
  const logActivity = useLogActivityEntry()

  const activity = activities?.find((a) => a.id === activityId)
  const previewPoints = activity
    ? Math.round(calculateActivityPoints({ durationMinutes: Number(durationMinutes || 0), metValue: activity.met_value, weightKg: user.current_weight_kg }))
    : 0

  function handleSubmit() {
    if (!activity) return
    logActivity.mutate(
      {
        userId: user.id,
        activityId: activity.id,
        loggedDate,
        durationMinutes: Number(durationMinutes),
        metValue: activity.met_value,
        weightKg: user.current_weight_kg,
        dailyPointsAllowance: user.daily_points_allowance,
        weeklyResetDay: user.weekly_reset_day,
      },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal title="Log activity" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Activity</label>
          <select
            value={activityId}
            onChange={(e) => setActivityId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            <option value="">Choose an activity…</option>
            {activities?.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Duration (minutes)</label>
          <input
            type="number"
            min="1"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>

        <p className="text-sm text-slate-500">+{previewPoints} FitPoints for this session</p>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={logActivity.isPending || !activity || !Number(durationMinutes)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {logActivity.isPending ? 'Logging…' : 'Log it'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
