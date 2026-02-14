import { useState, useEffect, useCallback, useMemo } from 'react'
import SlideDeck from './components/SlideDeck'
import DeckSelector from './components/DeckSelector'
import { decks } from './data/decks'
import { importDeckFromFile } from './data/deck-io'
import { saveDeck, deleteDeckFile } from './data/deck-api'
import type { DeckMeta, SlideData } from './data/types'

const STORAGE_KEY_DECKS = 'web-ppt:runtime-decks'

function getHashDeckId(): string | null {
  const hash = window.location.hash.slice(1)
  return hash || null
}

export default function App() {
  const [deckId, setDeckId] = useState<string | null>(getHashDeckId)
  const [pendingDeck, setPendingDeck] = useState<DeckMeta | null>(null)

  // One-time migration: localStorage → file
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DECKS)
      if (!raw) return
      const runtimeDecks: Record<string, DeckMeta> = JSON.parse(raw)
      const entries = Object.values(runtimeDecks)
      if (entries.length === 0) {
        localStorage.removeItem(STORAGE_KEY_DECKS)
        return
      }
      Promise.all(entries.map((d) => saveDeck(d)))
        .then(() => {
          localStorage.removeItem(STORAGE_KEY_DECKS)
          localStorage.removeItem('web-ppt:deleted-ids')
        })
        .catch(() => {/* keep localStorage if migration fails */})
    } catch {/* ignore */}
  }, [])

  const allDecks = useMemo(() => {
    const merged = { ...decks }
    // Overlay pending deck for optimistic navigation
    if (pendingDeck) merged[pendingDeck.id] = pendingDeck
    return merged
  }, [pendingDeck])

  // Clear pendingDeck once HMR brings the real data
  useEffect(() => {
    if (pendingDeck && decks[pendingDeck.id]) {
      setPendingDeck(null)
    }
  }, [pendingDeck])

  const allDeckList = useMemo(() => Object.values(allDecks), [allDecks])

  const onHashChange = useCallback(() => {
    setDeckId(getHashDeckId())
  }, [])

  useEffect(() => {
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [onHashChange])

  const handleBack = useCallback(() => {
    window.location.hash = ''
  }, [])

  const handleCreateDeck = useCallback(() => {
    const id = `deck-${Date.now()}`
    const now = new Date()
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const defaultSlide: SlideData = { type: 'title', title: '新文档' }
    const newDeck: DeckMeta = { id, title: '新文档', date, slides: [defaultSlide] }
    setPendingDeck(newDeck)
    saveDeck(newDeck).catch(() => {/* file write failed, pendingDeck still works */})
    window.location.hash = id
  }, [])

  const handleDeleteDeck = useCallback((id: string) => {
    deleteDeckFile(id).catch(() => {/* ignore — .ts decks can't be deleted via API */})
    if (deckId === id) window.location.hash = ''
  }, [deckId])

  const handleImportDeck = useCallback(async (file: File) => {
    try {
      const newDeck = await importDeckFromFile(file)
      setPendingDeck(newDeck)
      await saveDeck(newDeck)
      window.location.hash = newDeck.id
    } catch (err) {
      alert(err instanceof Error ? err.message : '导入失败')
    }
  }, [])

  if (!deckId) {
    return <DeckSelector decks={allDeckList} onCreateDeck={handleCreateDeck} onDeleteDeck={handleDeleteDeck} onImportDeck={handleImportDeck} />
  }

  const deck = allDecks[deckId]
  if (!deck) {
    return <DeckSelector decks={allDeckList} onCreateDeck={handleCreateDeck} onDeleteDeck={handleDeleteDeck} onImportDeck={handleImportDeck} />
  }

  return (
    <SlideDeck
      slides={deck.slides}
      onBack={handleBack}
      deckId={deckId}
      deckTitle={deck.title}
      deckDescription={deck.description}
    />
  )
}
