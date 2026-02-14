import type { DeckMeta } from './types'

export async function saveDeck(deck: DeckMeta): Promise<void> {
  const res = await fetch(`/__deck-api/${deck.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deck),
  })
  if (!res.ok) throw new Error(`saveDeck failed: ${res.status}`)
}

export async function deleteDeckFile(id: string): Promise<void> {
  const res = await fetch(`/__deck-api/${id}`, { method: 'DELETE' })
  if (!res.ok && res.status !== 404) throw new Error(`deleteDeck failed: ${res.status}`)
}
