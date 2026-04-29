import { useState, useRef } from 'react'
import type { InspiratieItem } from '@/types'
import { useInspiratieStore } from '@/stores/useInspiratieStore'
import { useUserStore } from '@/stores/useUserStore'
import { useToast } from '@/hooks/useToast'
import Modal from '@/components/ui/Modal'

interface Props { item: InspiratieItem }

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace('www.', '') } catch { return url }
}

function getVoteConsensus(votes: InspiratieItem['votes']) {
  const v = votes ?? { max: null, medina: null }
  if (v.max === 'ja' && v.medina === 'ja') return 'both-ja'
  if (v.max === 'nee' && v.medina === 'nee') return 'both-nee'
  if (v.max !== null && v.medina !== null) return 'different'
  return 'pending'
}

const consensusBanner: Record<string, { text: string; className: string }> = {
  'both-ja':   { text: '✨ Jullie zijn het eens — toegevoegd aan verlanglijst!', className: 'bg-olive-600/10 text-olive-700 border-olive-600/20' },
  'both-nee':  { text: 'Allebei niet enthousiast', className: 'bg-sand-100 text-warm-gray border-sand-200' },
  'different': { text: 'Jullie zijn het niet eens 🤔', className: 'bg-terra-400/10 text-terra-500 border-terra-300/20' },
  'pending':   { text: '', className: '' },
}

const cardBorder: Record<string, string> = {
  'both-ja':   'border-olive-600/30',
  'both-nee':  'border-sand-200',
  'different': 'border-terra-300/40',
  'pending':   'border-sand-100',
}

export default function InspiratieCard({ item }: Props) {
  const { toggleFavorite, toggleViewed, vote, addComment, deleteItem } = useInspiratieStore()
  const currentUser = useUserStore((s) => s.currentUser)
  const toast = useToast()
  const [deleteModal, setDeleteModal] = useState(false)
  const [heartPopping, setHeartPopping] = useState(false)
  const [commentOpen, setCommentOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const votes = item.votes ?? { max: null, medina: null }
  const consensus = getVoteConsensus(votes)
  const banner = consensusBanner[consensus]
  const borderClass = cardBorder[consensus]
  const comments = item.comments ?? []

  const myVote = currentUser === 'Max' ? votes.max : votes.medina
  const otherName = currentUser === 'Max' ? 'Medina' : 'Max'
  const otherVote = currentUser === 'Max' ? votes.medina : votes.max

  function handleFavorite() {
    setHeartPopping(true)
    setTimeout(() => setHeartPopping(false), 300)
    toggleFavorite(item.id)
    toast(item.favorite ? 'Uit favorieten' : 'Aan favorieten toegevoegd! ♥')
  }

  function handleOpen() {
    toggleViewed(item.id)
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }

  async function handleVote(v: 'ja' | 'nee') {
    if (!currentUser) { toast('Selecteer eerst een gebruiker', 'info'); return }
    await vote(item.id, currentUser, v)
    const newVotes = { ...votes, [currentUser.toLowerCase()]: v }
    if (newVotes.max === 'ja' && newVotes.medina === 'ja') {
      toast('🎉 Jullie zijn het eens! Toegevoegd aan verlanglijst.')
    } else {
      toast(v === 'ja' ? '👍 Jij vindt dit mooi!' : '👎 Geen fan')
    }
  }

  function handleCommentToggle() {
    setCommentOpen((o) => !o)
    if (!commentOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }

  async function handleCommentSubmit() {
    const text = commentText.trim()
    if (!text || !currentUser) return
    await addComment(item.id, currentUser, text)
    setCommentText('')
    setCommentOpen(false)
    toast('Reactie geplaatst')
  }

  return (
    <>
      <div className={`card p-4 animate-bounce-in border ${borderClass}`}>
        {/* Header row */}
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 bg-sand-100 rounded-xl flex items-center justify-center text-warm-gray">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {item.isNew && <span className="pill bg-terra-400 text-white text-[10px] py-0.5">Nieuw</span>}
              {!item.viewed && !item.isNew && <span className="pill bg-sand-200 text-warm-gray text-[10px] py-0.5">Ongelezen</span>}
            </div>
            <button onClick={handleOpen} className="text-sm font-semibold text-olive-800 hover:text-terra-400 transition-colors text-left mt-0.5 leading-snug">
              {item.title}
            </button>
            <p className="text-xs text-warm-muted mt-0.5 truncate">{getDomain(item.url)}</p>
          </div>

          <div className="shrink-0 flex items-center gap-1">
            <button
              onClick={handleFavorite}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${heartPopping ? 'animate-heart-pop' : ''} ${item.favorite ? 'text-terra-400' : 'text-warm-muted'}`}
            >
              <svg className="w-5 h-5" fill={item.favorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={item.favorite ? 0 : 1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
            <button onClick={() => setDeleteModal(true)} className="w-8 h-8 rounded-lg flex items-center justify-center text-warm-muted hover:text-terra-400 hover:bg-terra-400/10 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {item.notes && (
          <p className="text-xs text-warm-gray mt-2.5 line-clamp-2" style={{ paddingLeft: '52px' }}>
            {item.notes}
          </p>
        )}

        {/* Voting section */}
        <div className="mt-3 pt-3 border-t border-sand-100">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 flex-1">
              <button
                onClick={() => handleVote('ja')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all border ${
                  myVote === 'ja'
                    ? 'bg-olive-700 text-white border-olive-700'
                    : 'bg-white text-warm-gray border-sand-200 hover:border-olive-600'
                }`}
              >
                👍 Ja
              </button>
              <button
                onClick={() => handleVote('nee')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all border ${
                  myVote === 'nee'
                    ? 'bg-terra-400 text-white border-terra-400'
                    : 'bg-white text-warm-gray border-sand-200 hover:border-terra-400'
                }`}
              >
                👎 Nee
              </button>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[10px] text-warm-muted">{otherName}</p>
              <p className="text-base leading-none mt-0.5">
                {otherVote === 'ja' ? '👍' : otherVote === 'nee' ? '👎' : '❓'}
              </p>
            </div>
          </div>

          {banner.text && (
            <div className={`mt-2 px-3 py-1.5 rounded-xl border text-xs font-medium text-center ${banner.className}`}>
              {banner.text}
            </div>
          )}
        </div>

        {/* Comments */}
        {comments.length > 0 && (
          <div className="mt-3 pt-3 border-t border-sand-100 space-y-2">
            {comments.map((c) => {
              const isMe = c.author === currentUser
              return (
                <div key={c.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-warm-muted mb-0.5 px-1">{c.author}</span>
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-terra-400 text-white rounded-br-sm'
                      : 'bg-sand-100 text-olive-800 rounded-bl-sm'
                  }`}>
                    {c.text}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Comment input */}
        {commentOpen && (
          <div className="mt-3 flex gap-2">
            <textarea
              ref={inputRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCommentSubmit() } }}
              placeholder="Typ een reactie…"
              rows={2}
              className="flex-1 text-sm border border-sand-200 rounded-xl px-3 py-2 bg-white text-olive-800 placeholder:text-warm-muted resize-none focus:outline-none focus:border-terra-400"
            />
            <button
              onClick={handleCommentSubmit}
              disabled={!commentText.trim()}
              className="self-end px-3 py-2 bg-terra-400 text-white rounded-xl text-xs font-medium disabled:opacity-40 active:bg-terra-500 transition-colors"
            >
              Stuur
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-sand-100">
          <span className="text-[10px] text-warm-muted">
            Van <span className="font-medium text-olive-600">{item.addedBy}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCommentToggle}
              className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${commentOpen ? 'text-terra-400' : 'text-warm-muted'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              {comments.length > 0 ? `${comments.length}` : 'Reageer'}
            </button>
            <button onClick={handleOpen} className="flex items-center gap-1 text-[11px] text-terra-400 font-medium active:opacity-70">
              Bekijken
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Link verwijderen"
        message={`Weet je zeker dat je "${item.title}" wilt verwijderen?`}
        onConfirm={() => { deleteItem(item.id); toast('Link verwijderd', 'info') }}
      />
    </>
  )
}
