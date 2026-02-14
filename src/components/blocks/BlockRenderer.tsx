import type { ReactNode } from 'react'
import type { BlockData } from '../../data/types'
import { colors, motionConfig } from '../../theme/swiss'
import EditableText from '../editor/EditableText'
import { useEditor } from '../editor/EditorProvider'
import { GridItemDiagram } from '../engines/GridItemEngine'
import { SequenceDiagram } from '../engines/SequenceEngine'
import { CompareDiagram } from '../engines/CompareEngine'
import { FunnelDiagram } from '../engines/FunnelPyramidEngine'
import { ConcentricDiagram } from '../engines/ConcentricEngine'
import { HubSpokeDiagram } from '../engines/HubSpokeEngine'
import { VennDiagram } from '../engines/VennEngine'
import { ChartDiagram } from '../slides/ChartSlide'

interface BlockRendererProps {
  data: BlockData
  blockId: string
  slideIndex: number
}

function DiagramWrapper({ children }: { children: ReactNode }) {
  return <div className="flex-1 min-h-0 w-full flex flex-col">{children}</div>
}

function TitleBodyBlock({ data }: { data: Extract<BlockData, { type: 'title-body' }> }) {
  return (
    <div className="flex flex-col justify-center h-full">
      <h2 className="text-4xl font-bold" style={{ color: colors.textPrimary }}>
        {data.title}
      </h2>
      {data.body && (
        <p className="text-lg mt-2" style={{ color: colors.textSecondary }}>
          {data.body}
        </p>
      )}
    </div>
  )
}

function ImageBlock({ data, blockId, slideIndex }: { data: Extract<BlockData, { type: 'image' }>; blockId: string; slideIndex: number }) {
  const { editMode, updateBlockData } = useEditor()

  const handleUpload = () => {
    if (!editMode) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        updateBlockData(slideIndex, blockId, { ...data, src: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  if (data.src) {
    return (
      <div className="w-full h-full" onDoubleClick={handleUpload}>
        <img
          src={data.src}
          alt={data.alt || ''}
          className="w-full h-full"
          style={{ objectFit: data.fit || 'cover' }}
          draggable={false}
        />
      </div>
    )
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl"
      style={{ borderColor: colors.border, color: colors.textCaption }}
      onDoubleClick={handleUpload}
    >
      <svg className="w-12 h-12 opacity-40" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21zM8.25 8.625a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
      </svg>
      <span className="text-sm font-medium">{data.placeholder || '图片占位'}</span>
      {editMode && <span className="text-xs opacity-60">双击上传图片</span>}
    </div>
  )
}

export default function BlockRenderer({ data, blockId, slideIndex }: BlockRendererProps) {
  switch (data.type) {
    case 'title-body':
      return <TitleBodyBlock data={data} />
    case 'image':
      return <ImageBlock data={data} blockId={blockId} slideIndex={slideIndex} />
    case 'grid-item':
      return <DiagramWrapper><GridItemDiagram items={data.items} variant={data.variant} columns={data.columns} gap={data.gap} /></DiagramWrapper>
    case 'sequence':
      return <div className="flex items-center justify-center h-full"><SequenceDiagram steps={data.steps} variant={data.variant} direction={data.direction} gap={data.gap} /></div>
    case 'compare':
      return <DiagramWrapper><CompareDiagram mode={data.mode} sides={data.sides} quadrantItems={data.quadrantItems} xAxis={data.xAxis} yAxis={data.yAxis} visible={data.visible} hidden={data.hidden} /></DiagramWrapper>
    case 'funnel':
      return <DiagramWrapper><FunnelDiagram layers={data.layers} variant={data.variant} /></DiagramWrapper>
    case 'concentric':
      return <DiagramWrapper><ConcentricDiagram rings={data.rings} variant={data.variant} /></DiagramWrapper>
    case 'hub-spoke':
      return <DiagramWrapper><HubSpokeDiagram center={data.center} spokes={data.spokes} variant={data.variant} /></DiagramWrapper>
    case 'venn':
      return <DiagramWrapper><VennDiagram sets={data.sets} variant={data.variant} intersectionLabel={data.intersectionLabel} /></DiagramWrapper>
    case 'chart':
      return (
        <DiagramWrapper>
          <div className="flex-1 min-h-0 rounded-xl overflow-hidden" style={{ background: colors.card, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: '12px 8px 4px' }}>
            <ChartDiagram chartType={data.chartType} bars={data.bars} slices={data.slices} innerRadius={data.innerRadius} categories={data.categories} lineSeries={data.lineSeries} indicators={data.indicators} radarSeries={data.radarSeries} />
          </div>
        </DiagramWrapper>
      )
  }
}
