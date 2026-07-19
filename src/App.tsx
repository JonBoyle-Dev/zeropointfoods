import { Navigate, Route, Routes } from 'react-router-dom'
import { OnboardingPage } from './pages/OnboardingPage'
import { TodayPage } from './pages/TodayPage'
import { FoodsPage } from './pages/FoodsPage'
import { useUser } from './hooks/useUser'

function HomeRoute() {
  const { data: user, isLoading } = useUser()
  if (isLoading) return null
  if (!user) return <OnboardingPage />
  return <Navigate to="/today" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/today" element={<TodayPage />} />
      <Route path="/foods" element={<FoodsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
