import type { DeckExportPayload, DeckMeta, SlideData } from './types'

const VALID_SLIDE_TYPES = new Set([
  'title', 'key-point', 'chart', 'grid-item', 'sequence',
  'compare', 'funnel', 'concentric', 'hub-spoke', 'venn', 'block-slide',
])

export function exportDeck(title: string, description: string | undefined, slides: SlideData[]) {
  const payload: DeckExportPayload = {
    version: 1,
    title,
    description,
    slides,
  }
  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title || 'untitled'}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function importDeckFromFile(file: File): Promise<DeckMeta> {
  let raw: string
  try {
    raw = await file.text()
  } catch {
    throw new Error('文件读取失败')
  }

  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    throw new Error('文件格式错误：无法解析 JSON')
  }

  const obj = data as Record<string, unknown>

  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new Error('文件内容无效：缺少必要字段或幻灯片格式不正确')
  }
  if (obj.version !== 1) {
    throw new Error('文件内容无效：不支持的版本号')
  }
  if (typeof obj.title !== 'string' || !obj.title) {
    throw new Error('文件内容无效：缺少必要字段或幻灯片格式不正确')
  }
  if (!Array.isArray(obj.slides) || obj.slides.length === 0) {
    throw new Error('文件内容无效：缺少必要字段或幻灯片格式不正确')
  }

  for (const slide of obj.slides as Record<string, unknown>[]) {
    if (typeof slide !== 'object' || slide === null || !VALID_SLIDE_TYPES.has(slide.type as string)) {
      throw new Error('文件内容无效：缺少必要字段或幻灯片格式不正确')
    }
  }

  const now = new Date()
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  return {
    id: `deck-${Date.now()}`,
    title: obj.title as string,
    description: typeof obj.description === 'string' ? obj.description : undefined,
    date,
    slides: obj.slides as SlideData[],
  }
}
