import { useNavigate } from 'react-router-dom'
import { useProfileContext } from '../../context/ProfileContext'
import { useUser } from '../../hooks/useUser'

export function ProfileBadge() {
  const { currentProfileId, setCurrentProfileId } = useProfileContext()
  const { data: user } = useUser(currentProfileId)
  const navigate = useNavigate()

  if (!user) return null

  function handleSwitch() {
    setCurrentProfileId(null)
    navigate('/')
  }

  return (
    <button
      onClick={handleSwitch}
      className="fixed right-3 top-3 z-50 rounded-full border border-[#DADFD7] bg-white px-3 py-1 text-[11px] font-medium text-[#5B665D] shadow-sm"
    >
      {user.name} ▾
    </button>
  )
}
