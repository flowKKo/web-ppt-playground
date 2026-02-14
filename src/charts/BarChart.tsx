import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { BarChart as EBarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { echartsTheme, colors, chartPalette, getChartPalette } from '../theme/swiss'

echarts.use([EBarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])
echarts.registerTheme('swiss', echartsTheme)

const semanticColorMap: Record<string, string> = {
  positive: colors.accentPositive,
  negative: colors.accentNegative,
  neutral: colors.accentNeutral,
}

interface BarChartProps {
  categories: string[]
  series: { name: string; data: number[]; color?: string }[]
  height?: number
  colorPalette?: string
}

export default function BarChart({ categories, series, height, colorPalette }: BarChartProps) {
  const pal = getChartPalette(colorPalette)
  const hasLegend = series.length > 1
  const option = {
    tooltip: { trigger: 'axis' as const },
    legend: {
      show: hasLegend,
      bottom: 0,
    },
    grid: {
      left: 12,
      right: 12,
      top: 24,
      bottom: hasLegend ? 40 : 12,
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      data: categories,
    },
    yAxis: {
      type: 'value' as const,
    },
    series: series.map((s, i) => {
      const baseColor = s.color
        ? (semanticColorMap[s.color] || s.color)
        : pal[i % pal.length]

      return {
        name: s.name,
        type: 'bar' as const,
        data: s.data,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: baseColor },
            { offset: 1, color: `${baseColor}88` },
          ]),
          borderRadius: [6, 6, 0, 0],
        },
        barMaxWidth: 56,
        barGap: '20%',
        emphasis: {
          itemStyle: { shadowBlur: 12, shadowColor: `${baseColor}40` },
        },
        label: {
          show: true,
          position: 'top' as const,
          color: colors.textPrimary,
          fontSize: 13,
          fontWeight: 600,
        },
      }
    }),
    animationEasing: 'cubicOut' as const,
    animationDuration: 800,
  }

  return (
    <ReactECharts
      option={option}
      theme="swiss"
      style={{ height: height ?? '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  )
}
