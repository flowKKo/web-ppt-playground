import { motion } from 'framer-motion'
import type { ChartSlideData } from '../../data/types'
import { colors, motionConfig } from '../../theme/swiss'
import EditableText from '../editor/EditableText'
import BarChart from '../../charts/BarChart'
import PieChart from '../../charts/PieChart'
import LineChart from '../../charts/LineChart'
import RadarChart from '../../charts/RadarChart'

const colorMap: Record<string, string> = {
  positive: colors.accentPositive,
  negative: colors.accentNegative,
  neutral: colors.accentNeutral,
}

export interface ChartDiagramProps {
  chartType: ChartSlideData['chartType']
  bars?: ChartSlideData['bars']
  slices?: ChartSlideData['slices']
  innerRadius?: number
  categories?: string[]
  lineSeries?: ChartSlideData['lineSeries']
  indicators?: ChartSlideData['indicators']
  radarSeries?: ChartSlideData['radarSeries']
  chartHeight?: number
  colorPalette?: string
}

export function ChartDiagram(props: ChartDiagramProps) {
  const h = props.chartHeight
  const cp = props.colorPalette

  switch (props.chartType) {
    case 'pie':
      return <PieChart data={props.slices ?? []} innerRadius={props.innerRadius} height={h} colorPalette={cp} />
    case 'line':
      return <LineChart categories={props.categories ?? []} series={props.lineSeries ?? []} height={h} colorPalette={cp} />
    case 'radar':
      return <RadarChart indicators={props.indicators ?? []} series={props.radarSeries ?? []} height={h} colorPalette={cp} />
    case 'bar':
    default: {
      const bars = props.bars ?? []
      const categories = bars.map(b => b.category)
      const seriesNames = [...new Set(bars.flatMap(b => b.values.map(v => v.name)))]
      const series = seriesNames.map(name => {
        const firstMatch = bars.flatMap(b => b.values).find(v => v.name === name)
        return {
          name,
          data: bars.map(b => b.values.find(v => v.name === name)?.value ?? 0),
          color: firstMatch?.color ? colorMap[firstMatch.color] : undefined,
        }
      })
      return <BarChart categories={categories} series={series} height={h} colorPalette={cp} />
    }
  }
}

function renderChart(data: ChartSlideData) {
  return <ChartDiagram {...data} />
}

export default function ChartSlide(data: ChartSlideData) {
  const { title, body, highlight, titleSize, bodySize, titleColor, textColor } = data

  return (
    <motion.div
      className="flex flex-col gap-6 h-full justify-center"
      variants={motionConfig.stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="flex items-end justify-between shrink-0">
        <div>
          <EditableText
            value={title}
            field="title"
            as="h2"
            className="text-4xl font-bold"
            style={{ color: titleColor || colors.textPrimary, fontSize: titleSize }}
            variants={motionConfig.child}
          />
          {body && (
            <EditableText
              value={body}
              field="body"
              as="p"
              className="text-lg mt-2"
              style={{ color: textColor || colors.textSecondary, fontSize: bodySize }}
              variants={motionConfig.child}
            />
          )}
        </div>
        {highlight && (
          <EditableText
            value={highlight}
            field="highlight"
            as="span"
            className="text-4xl font-extrabold"
            style={{ color: colors.accentPositive }}
            variants={motionConfig.child}
          />
        )}
      </div>
      <motion.div
        variants={motionConfig.child}
        className="flex-1 min-h-0 rounded-xl overflow-hidden"
        style={{ background: colors.card, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: '12px 8px 4px' }}
      >
        {renderChart(data)}
      </motion.div>
    </motion.div>
  )
}
