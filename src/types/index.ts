// Shared
export type Person = 'Max' | 'Medina'

// ── Todo ──────────────────────────────────────────────────────────────────
export type TodoCategory = 'Algemeen' | 'Administratief' | 'Woning' | 'Overig'

export interface TodoItem {
  id: string
  title: string
  category: TodoCategory
  completed: boolean
  createdAt: string
}

// ── Kooplijst ─────────────────────────────────────────────────────────────
export interface KoopItem {
  id: string
  name: string
  quantity: number
  store?: string
  bought: boolean
  createdAt: string
}

// ── Kosten ────────────────────────────────────────────────────────────────
export type KostenCategory = 'Woning' | 'Meubels' | 'Verbouwing' | 'Transport' | 'Diversen'

export interface KostenItem {
  id: string
  description: string
  amount: number
  category: KostenCategory
  paid: boolean
  date?: string
  createdAt: string
}

export interface RecurringBill {
  id: string
  name: string
  amount: number
  frequency: 'Maandelijks' | 'Jaarlijks'
  createdAt: string
}

// ── Planning ──────────────────────────────────────────────────────────────
export interface PlanningEvent {
  id: string
  title: string
  date: string
  description?: string
  done: boolean
  createdAt: string
}

// ── Inspiratie ────────────────────────────────────────────────────────────
export interface InspiratieVotes {
  max: 'ja' | 'nee' | null
  medina: 'ja' | 'nee' | null
}

export interface InspiratieItem {
  id: string
  title: string
  url: string
  notes?: string
  viewed: boolean
  favorite: boolean
  addedBy: Person
  isNew: boolean
  votes: InspiratieVotes
  createdAt: string
}

// ── Dozen Tracker ─────────────────────────────────────────────────────────
export type DozenRoom = 'Woonkamer' | 'Slaapkamer' | 'Keuken' | 'Badkamer' | 'Zolder' | 'Garage' | 'Kantoor' | 'Overig'
export type DozenStatus = 'Ingepakt' | 'Uitgepakt' | 'In transit'

export interface DozenItem {
  id: string
  number: number
  room: DozenRoom
  colorLabel?: string
  status: DozenStatus
  description: string
  tags: string[]
  photo?: string
  createdAt: string
}

// ── Verlanglijst ──────────────────────────────────────────────────────────
export type Priority = 'Hoog' | 'Middel' | 'Laag'

export interface VerlangItem {
  id: string
  title: string
  notes?: string
  priority: Priority
  acquired: boolean
  addedBy: Person
  url?: string
  createdAt: string
}

// ── Notifications ─────────────────────────────────────────────────────────
export interface ActivityItem {
  id: string
  message: string
  path: string
  read: boolean
  createdAt: string
}

// ── Toast ─────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  message: string
  type: ToastType
}
