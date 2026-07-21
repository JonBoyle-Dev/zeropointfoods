import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfileContext } from '../../context/ProfileContext'
import { useUser } from '../../hooks/useUser'
import { SettingsModal } from './SettingsModal'

export function ProfileBadge() {
  const { currentProfileId, setCurrentProfileId } = useProfileContext()
  const { data: user } = useUser(currentProfileId)
  const navigate = useNavigate()
  const [showSettings, setShowSettings] = useState(false)

  if (!user) return null

  function handleSwitch() {
    setCurrentProfileId(null)
    navigate('/')
  }

  return (
    <>
      <div className="fixed right-3 top-3 z-50 flex gap-1.5">
        <button
          onClick={() => setShowSettings(true)}
          aria-label="Settings"
          className="rounded-full border border-[#DADFD7] bg-white px-2.5 py-1 text-[13px] shadow-sm"
        >
          ⚙
        </button>
        <button
          onClick={handleSwitch}
          className="rounded-full border border-[#DADFD7] bg-white px-3 py-1 text-[11px] font-medium text-[#5B665D] shadow-sm"
        >
          {user.name} ▾
        </button>
      </div>

      {showSettings && <SettingsModal user={user} onClose={() => setShowSettings(false)} />}
    </>
  )
}
