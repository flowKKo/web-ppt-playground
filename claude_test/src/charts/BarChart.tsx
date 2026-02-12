import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { BarChart as EBarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { echartsTheme, colors } from '../theme/swiss'

echarts.use([EBarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])
echarts.registerTheme('swiss', echartsTheme)

interface BarChartProps {
  categories: string[]
  series: { name: string; data: number[]; color?: string }[]
  height?: number
}

const colorMap: Record<string, string> = {
  positive: colors.accentPositive,
  negative: colors.accentNegative,
  neutral: colors.accentNeutral,
}

export default function BarChart({ categories, series, height = 300 }: BarChartProps) {
  const option = {
    tooltip: { trigger: 'axis' as const },
    legend: { show: series.length > 1, bottom: 0, textStyle: { color: colors.textSecondary, fontSize: 14 } },
    grid: { left: 20, right: 20, top: 20, bottom: series.length > 1 ? 40 : 20, containLabel: true },
    xAxis: { type: 'category' as const, data: categories },
    yAxis: { type: 'value' as const },
    series: series.map((s) => ({
      name: s.name,
      type: 'bar' as const,
      data: s.data,
      itemStyle: {
        color: s.color ? (colorMap[s.color] || s.color) : undefined,
        borderRadius: [6, 6, 0, 0],
      },
      barMaxWidth: 60,
      label: { show: true, position: 'top' as const, color: colors.textPrimary, fontSize: 14, fontWeight: 600 },
    })),
  }

  return <ReactECharts option={option} theme="swiss" style={{ height, width: '100%' }} opts={{ renderer: 'canvas' }} />
}
