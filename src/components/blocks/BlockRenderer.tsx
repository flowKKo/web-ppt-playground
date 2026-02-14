import type { ReactNode } from 'react'
import type { BlockData } from '../../data/types'
import { colors, motionConfig } from '../../theme/swiss'
import EditableText from '../editor/EditableText'
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

export default function BlockRenderer({ data }: BlockRendererProps) {
  switch (data.type) {
    case 'title-body':
      return <TitleBodyBlock data={data} />
    case 'grid-item':
      return <DiagramWrapper><GridItemDiagram items={data.items} variant={data.variant} columns={data.columns} /></DiagramWrapper>
    case 'sequence':
      return <DiagramWrapper><SequenceDiagram steps={data.steps} variant={data.variant} direction={data.direction} /></DiagramWrapper>
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
