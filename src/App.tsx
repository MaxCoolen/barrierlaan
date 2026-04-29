import { Routes, Route, Navigate } from 'react-router-dom'
import { useUserStore } from '@/stores/useUserStore'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import ToastProvider from '@/components/ui/Toast'
import UserSelectScreen from '@/components/screens/UserSelectScreen'
import TodoPage from '@/components/pages/Todo/TodoPage'
import KoopPage from '@/components/pages/Koop/KoopPage'
import KostenPage from '@/components/pages/Kosten/KostenPage'
import PlanningPage from '@/components/pages/Planning/PlanningPage'
import InspiratiePage from '@/components/pages/Inspiratie/InspiratiePage'
import DozenPage from '@/components/pages/Dozen/DozenPage'
import VerlangPage from '@/components/pages/Verlang/VerlangPage'

export default function App() {
  const currentUser = useUserStore((s) => s.currentUser)

  if (!currentUser) {
    return <UserSelectScreen />
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />
      <main className="flex-1 overflow-y-auto pt-16 pb-20 smooth-scroll">
        <Routes>
          <Route path="/" element={<Navigate to="/todo" replace />} />
          <Route path="/todo" element={<TodoPage />} />
          <Route path="/kooplijst" element={<KoopPage />} />
          <Route path="/kosten" element={<KostenPage />} />
          <Route path="/planning" element={<PlanningPage />} />
          <Route path="/inspiratie" element={<InspiratiePage />} />
          <Route path="/dozen" element={<DozenPage />} />
          <Route path="/verlang" element={<VerlangPage />} />
        </Routes>
      </main>
      <BottomNav />
      <ToastProvider />
    </div>
  )
}
