import { useState } from 'react'
import { Modal } from '../common/Modal'
import { useLogWeighIn } from '../../hooks/useWeighIns'
import type { User } from '../../types/database'

export function WeighInModal({ user, today, onClose }: { user: User; today: string; onClose: () => void }) {
  const [weightKg, setWeightKg] = useState(String(user.current_weight_kg))
  const logWeighIn = useLogWeighIn()

  function handleSubmit() {
    logWeighIn.mutate({ user, weightKg: Number(weightKg), today }, { onSuccess: onClose })
  }

  return (
    <Modal title="Log weigh-in" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            autoFocus
          />
        </div>

        <p className="text-sm text-slate-500">Your daily points allowance recalculates automatically from this.</p>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={logWeighIn.isPending || !Number(weightKg)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {logWeighIn.isPending ? 'Saving…' : 'Save weigh-in'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
