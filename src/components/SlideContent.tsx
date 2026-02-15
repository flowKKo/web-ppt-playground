import type { SlideData } from '../data/types'

import TitleSlide from './slides/TitleSlide'
import KeyPointSlide from './slides/KeyPointSlide'
import ChartSlide from './slides/ChartSlide'
import GridItemEngine from './engines/GridItemEngine'
import SequenceEngine from './engines/SequenceEngine'
import CompareEngine from './engines/CompareEngine'
import FunnelPyramidEngine from './engines/FunnelPyramidEngine'
import ConcentricEngine from './engines/ConcentricEngine'
import HubSpokeEngine from './engines/HubSpokeEngine'
import VennEngine from './engines/VennEngine'
import CycleEngine from './engines/CycleEngine'
import TableEngine from './engines/TableEngine'
import RoadmapEngine from './engines/RoadmapEngine'
import SwotEngine from './engines/SwotEngine'
import MindmapEngine from './engines/MindmapEngine'
import StackEngine from './engines/StackEngine'
import BlockSlideRenderer from './blocks/BlockSlideRenderer'

export default function SlideContent({ data, slideIndex }: { data: SlideData; slideIndex?: number }) {
  switch (data.type) {
    case 'title': return <TitleSlide {...data} />
    case 'key-point': return <KeyPointSlide {...data} />
    case 'chart': return <ChartSlide {...data} />
    case 'grid-item': return <GridItemEngine {...data} />
    case 'sequence': return <SequenceEngine {...data} />
    case 'compare': return <CompareEngine {...data} />
    case 'funnel': return <FunnelPyramidEngine {...data} />
    case 'concentric': return <ConcentricEngine {...data} />
    case 'hub-spoke': return <HubSpokeEngine {...data} />
    case 'venn': return <VennEngine {...data} />
    case 'cycle': return <CycleEngine {...data} />
    case 'table': return <TableEngine {...data} />
    case 'roadmap': return <RoadmapEngine {...data} />
    case 'swot': return <SwotEngine {...data} />
    case 'mindmap': return <MindmapEngine {...data} />
    case 'stack': return <StackEngine {...data} />
    case 'block-slide': return <BlockSlideRenderer data={data} slideIndex={slideIndex ?? 0} />
  }
}
