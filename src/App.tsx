import { useState, useEffect, useCallback, useMemo } from 'react'
import SlideDeck from './components/SlideDeck'
import DeckSelector from './components/DeckSelector'
import { decks, deckList } from './data/decks'
import { importDeckFromFile } from './data/deck-io'
import type { DeckMeta, SlideData } from './data/types'

function getHashDeckId(): string | null {
  const hash = window.location.hash.slice(1)
  return hash || null
}

export default function App() {
  const [deckId, setDeckId] = useState<string | null>(getHashDeckId)
  const [runtimeDecks, setRuntimeDecks] = useState<Record<string, DeckMeta>>({})
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())

  const allDecks = useMemo(() => {
    const merged = { ...decks, ...runtimeDecks }
    for (const id of deletedIds) delete merged[id]
    return merged
  }, [runtimeDecks, deletedIds])
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
    const defaultSlide: SlideData = { type: 'title', title: '新文档' }
    const newDeck: DeckMeta = {
      id,
      title: '新文档',
      slides: [defaultSlide],
    }
    setRuntimeDecks(prev => ({ ...prev, [id]: newDeck }))
    window.location.hash = id
  }, [])

  const handleUpdateDeckMeta = useCallback((title: string, description: string) => {
    if (!deckId) return
    const base = allDecks[deckId]
    if (!base) return
    setRuntimeDecks(prev => ({
      ...prev,
      [deckId]: { ...base, ...prev[deckId], title, description },
    }))
  }, [deckId, allDecks])

  const handleDeleteDeck = useCallback((id: string) => {
    setDeletedIds(prev => new Set(prev).add(id))
    setRuntimeDecks(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const handleImportDeck = useCallback(async (file: File) => {
    try {
      const newDeck = await importDeckFromFile(file)
      setRuntimeDecks(prev => ({ ...prev, [newDeck.id]: newDeck }))
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
      onUpdateDeckMeta={handleUpdateDeckMeta}
    />
  )
}
