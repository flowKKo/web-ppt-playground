import type { DeckMeta } from '../types'
import { engineDemoDeck } from './engine-demo'

// Built-in decks (tracked by git)
const builtinDecks: Record<string, DeckMeta> = {
  'engine-demo': engineDemoDeck,
}

// Auto-import user-generated decks from src/data/user-decks/ (gitignored)
const userTsModules = import.meta.glob('../user-decks/*.ts', { eager: true })
const userJsonModules = import.meta.glob('../user-decks/*.json', { eager: true })

const userDecks: Record<string, DeckMeta> = {}

for (const mod of Object.values(userTsModules)) {
  const m = mod as Record<string, unknown>
  for (const exp of Object.values(m)) {
    if (exp && typeof exp === 'object' && 'id' in exp && 'slides' in exp) {
      const deck = exp as DeckMeta
      userDecks[deck.id] = deck
    }
  }
}

for (const mod of Object.values(userJsonModules)) {
  // .json imports have the object as default export
  const deck = (mod as { default: DeckMeta }).default ?? mod as DeckMeta
  if (deck && typeof deck === 'object' && 'id' in deck && 'slides' in deck) {
    userDecks[deck.id] = deck
  }
}

export const decks: Record<string, DeckMeta> = { ...builtinDecks, ...userDecks }
export const deckList = Object.values(decks)
