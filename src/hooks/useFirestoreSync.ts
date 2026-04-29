import { useEffect, useState } from 'react'
import { collection, doc, onSnapshot, FirestoreError } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useTodoStore } from '@/stores/useTodoStore'
import { useKoopStore } from '@/stores/useKoopStore'
import { useKostenStore } from '@/stores/useKostenStore'
import { usePlanningStore } from '@/stores/usePlanningStore'
import { useInspiratieStore } from '@/stores/useInspiratieStore'
import { useDozenStore } from '@/stores/useDozenStore'
import { useVerlangStore } from '@/stores/useVerlangStore'
import type { TodoItem, KoopItem, KostenItem, RecurringBill, PlanningEvent, InspiratieItem, DozenItem, VerlangItem } from '@/types'

export type SyncStatus = 'verbinden' | 'gesynchroniseerd' | 'offline' | 'fout'

export function useFirestoreSync() {
  const [status, setStatus] = useState<SyncStatus>('verbinden')

  const setTodos     = useTodoStore((s) => s._setItems)
  const setKoop      = useKoopStore((s) => s._setItems)
  const setKosten    = useKostenStore((s) => s._setItems)
  const setRecurring = useKostenStore((s) => s._setRecurring)
  const setPlanning  = usePlanningStore((s) => s._setItems)
  const setMoveDate  = usePlanningStore((s) => s._setMoveDate)
  const setInspiratie = useInspiratieStore((s) => s._setItems)
  const setBudget    = useKostenStore((s) => s._setBudget)
  const setDOzen     = useDozenStore((s) => s._setItems)
  const setVerlang   = useVerlangStore((s) => s._setItems)

  useEffect(() => {
    let synced = 0
    const total = 8 // aantal listeners

    function onReady() {
      synced++
      if (synced >= total) setStatus('gesynchroniseerd')
    }

    function onError(e: FirestoreError) {
      console.error('Firestore fout:', e)
      if (e.code === 'unavailable') setStatus('offline')
      else setStatus('fout')
    }

    const unsubs = [
      onSnapshot(
        collection(db, 'todos'),
        (snap) => { setTodos(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TodoItem))); onReady() },
        onError
      ),
      onSnapshot(
        collection(db, 'kooplijst'),
        (snap) => { setKoop(snap.docs.map((d) => ({ id: d.id, ...d.data() } as KoopItem))); onReady() },
        onError
      ),
      onSnapshot(
        collection(db, 'kosten'),
        (snap) => { setKosten(snap.docs.map((d) => ({ id: d.id, ...d.data() } as KostenItem))); onReady() },
        onError
      ),
      onSnapshot(
        collection(db, 'recurring'),
        (snap) => { setRecurring(snap.docs.map((d) => ({ id: d.id, ...d.data() } as RecurringBill))); onReady() },
        onError
      ),
      onSnapshot(
        collection(db, 'planning'),
        (snap) => { setPlanning(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PlanningEvent))); onReady() },
        onError
      ),
      onSnapshot(
        doc(db, 'config', 'planning'),
        (snap) => { if (snap.exists()) setMoveDate(snap.data().moveDate ?? ''); onReady() },
        onError
      ),
      onSnapshot(
        collection(db, 'inspiratie'),
        (snap) => { setInspiratie(snap.docs.map((d) => ({ id: d.id, ...d.data() } as InspiratieItem))); onReady() },
        onError
      ),
      onSnapshot(
        collection(db, 'dozen'),
        (snap) => { setDOzen(snap.docs.map((d) => ({ id: d.id, ...d.data() } as DozenItem))); onReady() },
        onError
      ),
      onSnapshot(
        collection(db, 'verlang'),
        (snap) => { setVerlang(snap.docs.map((d) => ({ id: d.id, ...d.data() } as VerlangItem))); onReady() },
        onError
      ),
      onSnapshot(
        doc(db, 'config', 'kosten'),
        (snap) => { setBudget(snap.exists() ? (snap.data().budget ?? null) : null); onReady() },
        onError
      ),
    ]

    // Offline detectie
    const handleOffline = () => setStatus('offline')
    const handleOnline  = () => setStatus('gesynchroniseerd')
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      unsubs.forEach((u) => u())
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [setTodos, setKoop, setKosten, setRecurring, setPlanning, setMoveDate, setInspiratie, setDOzen, setVerlang, setBudget])

  return status
}
