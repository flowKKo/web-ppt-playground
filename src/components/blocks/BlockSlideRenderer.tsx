import type { BlockSlideData } from '../../data/types'
import { useEditor } from '../editor/EditorProvider'
import { useSpotlight } from '../../hooks/useSpotlight'
import BlockRenderer from './BlockRenderer'
import BlockWrapper from './BlockWrapper'

interface BlockSlideRendererProps {
  data: BlockSlideData
  slideIndex: number
}

export default function BlockSlideRenderer({ data, slideIndex }: BlockSlideRendererProps) {
  const {
    editMode,
    selection,
    setSelection,
    beginDrag,
    updateBlockQuiet,
  } = useEditor()
  const { active: spotlightActive, revealedCount } = useSpotlight()

  const handleBlockSelect = (blockId: string) => {
    setSelection({ type: 'block', slideIndex, blockId })
  }

  // Click on empty canvas area → select the slide (shows add-block panel)
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!editMode) return
    // Only fire when clicking directly on the canvas, not on a block
    if (e.target === e.currentTarget) {
      setSelection({ type: 'content-box', slideIndex })
    }
  }

  return (
    <div
      className="relative w-full h-full"
      onClick={handleCanvasClick}
    >
      {data.blocks.map((block, blockIndex) => {
        const isSelected =
          selection?.type === 'block' &&
          selection.slideIndex === slideIndex &&
          selection.blockId === block.id

        const isRevealed = !spotlightActive || blockIndex < revealedCount

        return (
          <BlockWrapper
            key={block.id}
            block={block}
            isSelected={isSelected}
            editMode={editMode}
            onSelect={() => handleBlockSelect(block.id)}
            onUpdate={(bounds) => updateBlockQuiet(slideIndex, block.id, bounds)}
            onUpdateQuiet={(bounds) => updateBlockQuiet(slideIndex, block.id, bounds)}
            onDragStart={beginDrag}
            spotlightRevealed={isRevealed}
          >
            <BlockRenderer data={block.data} blockId={block.id} slideIndex={slideIndex} />
          </BlockWrapper>
        )
      })}
    </div>
  )
}
