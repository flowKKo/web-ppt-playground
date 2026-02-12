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

function renderChart(data: ChartSlideData) {
  const h = data.chartHeight

  switch (data.chartType) {
    case 'pie':
      return <PieChart data={data.slices ?? []} innerRadius={data.innerRadius} height={h} />
    case 'line':
      return <LineChart categories={data.categories ?? []} series={data.lineSeries ?? []} height={h} />
    case 'radar':
      return <RadarChart indicators={data.indicators ?? []} series={data.radarSeries ?? []} height={h} />
    case 'bar':
    default: {
      const bars = data.bars ?? []
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
      return <BarChart categories={categories} series={series} height={h} />
    }
  }
}

export default function ChartSlide(data: ChartSlideData) {
  const { title, body, highlight } = data

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
            style={{ color: colors.textPrimary }}
            variants={motionConfig.child}
          />
          {body && (
            <EditableText
              value={body}
              field="body"
              as="p"
              className="text-lg mt-2"
              style={{ color: colors.textSecondary }}
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
