import type { ReactNode } from 'react'
import { colors } from '../theme/swiss'

export default function SlideDeck({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex flex-col items-center gap-10 py-10 min-h-screen"
      style={{ background: colors.page }}
    >
      {children}
    </div>
  )
}
