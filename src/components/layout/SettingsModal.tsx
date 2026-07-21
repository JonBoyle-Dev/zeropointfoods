import { useState } from 'react'
import { Modal } from '../common/Modal'
import { useUpdateWeeklyResetDay } from '../../hooks/useUser'
import type { User, Weekday } from '../../types/database'

const WEEKDAYS: { value: Weekday; label: string }[] = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
]

export function SettingsModal({ user, onClose }: { user: User; onClose: () => void }) {
  const [weeklyResetDay, setWeeklyResetDay] = useState<Weekday>(user.weekly_reset_day)
  const updateResetDay = useUpdateWeeklyResetDay()

  function handleSave() {
    updateResetDay.mutate({ userId: user.id, weeklyResetDay }, { onSuccess: onClose })
  }

  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Weekly reset day</label>
          <select
            value={weeklyResetDay}
            onChange={(e) => setWeeklyResetDay(e.target.value as Weekday)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            {WEEKDAYS.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-slate-500">Your weekly points bank resets on this day each week.</p>
        </div>

        {updateResetDay.isError && <p className="text-sm text-red-600">{(updateResetDay.error as Error).message}</p>}

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={updateResetDay.isPending}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {updateResetDay.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
