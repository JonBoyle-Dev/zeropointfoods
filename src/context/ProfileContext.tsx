import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

// Shop-Manager's equivalent MemberContext stores the whole serialized member
// object under this style of key. Here we store only the id and always
// refetch the row via react-query instead — zeropointfoods' user row changes
// often (weigh-ins update weight/allowance), so a stale cached copy would be
// more likely to mislead than help.
const CURRENT_PROFILE_STORAGE_KEY = 'zeropointfoods:current-profile-id'

interface ProfileContextValue {
  currentProfileId: string | null
  setCurrentProfileId: (profileId: string | null) => void
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [currentProfileId, setCurrentProfileIdState] = useState<string | null>(() =>
    localStorage.getItem(CURRENT_PROFILE_STORAGE_KEY)
  )

  const setCurrentProfileId = useCallback((profileId: string | null) => {
    setCurrentProfileIdState(profileId)
    if (profileId) {
      localStorage.setItem(CURRENT_PROFILE_STORAGE_KEY, profileId)
    } else {
      localStorage.removeItem(CURRENT_PROFILE_STORAGE_KEY)
    }
  }, [])

  return <ProfileContext.Provider value={{ currentProfileId, setCurrentProfileId }}>{children}</ProfileContext.Provider>
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfileContext must be used within a ProfileProvider')
  return ctx
}
