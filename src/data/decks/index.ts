import type { DeckMeta } from '../types'

// Auto-import all decks from JSON and TS sources
const builtinJsonModules = import.meta.glob('./*.json', { eager: true })
const userTsModules = import.meta.glob('../user-decks/*.ts', { eager: true })
const userJsonModules = import.meta.glob('../user-decks/*.json', { eager: true })

function extractDeck(mod: unknown): DeckMeta | null {
  // JSON imports: object itself or { default: ... }
  const obj = (mod as { default?: unknown }).default ?? mod
  if (obj && typeof obj === 'object' && 'id' in obj && 'slides' in obj) {
    return obj as DeckMeta
  }
  // TS modules: may export multiple named exports
  if (mod && typeof mod === 'object') {
    for (const exp of Object.values(mod as Record<string, unknown>)) {
      if (exp && typeof exp === 'object' && 'id' in exp && 'slides' in exp) {
        return exp as DeckMeta
      }
    }
  }
  return null
}

const allDecks: Record<string, DeckMeta> = {}

for (const mod of Object.values(builtinJsonModules)) {
  const deck = extractDeck(mod)
  if (deck) allDecks[deck.id] = deck
}
for (const mod of Object.values(userTsModules)) {
  const deck = extractDeck(mod)
  if (deck) allDecks[deck.id] = deck
}
for (const mod of Object.values(userJsonModules)) {
  const deck = extractDeck(mod)
  if (deck) allDecks[deck.id] = deck
}

export const decks = allDecks

// Sorted by date ascending (oldest first)
export const deckList = Object.values(allDecks).sort((a, b) => {
  const da = a.date || ''
  const db = b.date || ''
  return da.localeCompare(db)
})
