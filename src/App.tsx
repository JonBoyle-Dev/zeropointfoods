import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ProfileSelectPage } from './pages/ProfileSelectPage'
import { TodayPage } from './pages/TodayPage'
import { FoodsPage } from './pages/FoodsPage'
import { LogPage } from './pages/LogPage'
import { RecipesPage } from './pages/RecipesPage'
import { LibraryPage } from './pages/LibraryPage'
import { ReportsPage } from './pages/ReportsPage'
import { BottomNav } from './components/layout/BottomNav'
import { ProfileBadge } from './components/layout/ProfileBadge'
import { useProfileContext } from './context/ProfileContext'
import { useUser } from './hooks/useUser'

function HomeRoute() {
  const { currentProfileId } = useProfileContext()
  if (!currentProfileId) return <ProfileSelectPage />
  return <Navigate to="/today" replace />
}

/**
 * Redirects to the profile picker if no profile is selected, or if the
 * selected profile no longer exists (e.g. it was deleted directly in
 * Supabase — localStorage still remembers the id, so without this check
 * every page would render a broken "ghost" dashboard for a nonexistent user).
 */
function RequireProfile({ children }: { children: ReactNode }) {
  const { currentProfileId, setCurrentProfileId } = useProfileContext()
  const { data: user, isLoading } = useUser(currentProfileId)

  if (!currentProfileId) return <Navigate to="/" replace />
  if (isLoading) return null
  if (!user) {
    setCurrentProfileId(null)
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

function App() {
  const location = useLocation()
  const showChrome = location.pathname !== '/'

  return (
    <>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route
          path="/today"
          element={
            <RequireProfile>
              <TodayPage />
            </RequireProfile>
          }
        />
        <Route
          path="/log"
          element={
            <RequireProfile>
              <LogPage />
            </RequireProfile>
          }
        />
        <Route
          path="/foods"
          element={
            <RequireProfile>
              <FoodsPage />
            </RequireProfile>
          }
        />
        <Route
          path="/recipes"
          element={
            <RequireProfile>
              <RecipesPage />
            </RequireProfile>
          }
        />
        <Route
          path="/library"
          element={
            <RequireProfile>
              <LibraryPage />
            </RequireProfile>
          }
        />
        <Route
          path="/reports"
          element={
            <RequireProfile>
              <ReportsPage />
            </RequireProfile>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showChrome && <ProfileBadge />}
      {showChrome && <BottomNav />}
    </>
  )
}

export default App
