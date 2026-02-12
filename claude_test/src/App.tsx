import SlideDeck from './components/SlideDeck'
import Slide from './components/Slide'
import { slides } from './data/slides'
import type { SlideData } from './data/types'

import TitleSlide from './components/slides/TitleSlide'
import DataComparisonSlide from './components/slides/DataComparisonSlide'
import KeyPointSlide from './components/slides/KeyPointSlide'
import ComparisonSlide from './components/slides/ComparisonSlide'
import GridSlide from './components/slides/GridSlide'
import ChartSlide from './components/slides/ChartSlide'
import PlayerCardSlide from './components/slides/PlayerCardSlide'
import DiagramSlide from './components/slides/DiagramSlide'
import ListSlide from './components/slides/ListSlide'
import PlaceholderSlide from './components/slides/PlaceholderSlide'

function SlideContent({ data }: { data: SlideData }) {
  switch (data.type) {
    case 'title': return <TitleSlide {...data} />
    case 'data-comparison': return <DataComparisonSlide {...data} />
    case 'key-point': return <KeyPointSlide {...data} />
    case 'comparison': return <ComparisonSlide {...data} />
    case 'grid': return <GridSlide {...data} />
    case 'chart': return <ChartSlide {...data} />
    case 'player-card': return <PlayerCardSlide {...data} />
    case 'diagram': return <DiagramSlide {...data} />
    case 'list': return <ListSlide {...data} />
    case 'placeholder': return <PlaceholderSlide {...data} />
  }
}

export default function App() {
  return (
    <SlideDeck>
      {slides.map((slide, i) => (
        <Slide key={i} number={i + 1}>
          <SlideContent data={slide} />
        </Slide>
      ))}
    </SlideDeck>
  )
}
