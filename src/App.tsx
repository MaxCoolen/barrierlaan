import { Routes, Route, Navigate } from 'react-router-dom'
import { useUserStore } from '@/stores/useUserStore'
import { useFirestoreSync } from '@/hooks/useFirestoreSync'
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

function SyncStatusBar({ status }: { status: ReturnType<typeof useFirestoreSync> }) {
  if (status === 'gesynchroniseerd') return null
  const config = {
    verbinden: { bg: 'bg-sand-200', text: 'text-olive-700', label: 'Verbinden met server…', dot: 'bg-warm-gray animate-pulse' },
    offline:   { bg: 'bg-amber-50',  text: 'text-amber-800', label: 'Offline — wijzigingen worden later gesynchroniseerd', dot: 'bg-amber-400' },
    fout:      { bg: 'bg-red-50',    text: 'text-red-800',   label: 'Verbindingsfout — probeer opnieuw', dot: 'bg-red-400' },
  }[status]

  return (
    <div className={`fixed top-16 left-0 right-0 z-40 flex items-center gap-2 px-4 py-1.5 text-xs font-body ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      {config.label}
    </div>
  )
}

export default function App() {
  const currentUser = useUserStore((s) => s.currentUser)
  const syncStatus = useFirestoreSync()

  if (!currentUser) {
    return <UserSelectScreen />
  }

  const mainPadding = syncStatus !== 'gesynchroniseerd' ? 'pt-[4.5rem]' : 'pt-16'

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />
      <SyncStatusBar status={syncStatus} />
      <main className={`flex-1 overflow-y-auto ${mainPadding} pb-20 smooth-scroll`}>
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
