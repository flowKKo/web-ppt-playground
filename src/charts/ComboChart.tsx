import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { echartsTheme, colors, getChartPalette } from '../theme/swiss'
import type { ComboSeries } from '../data/types'

echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])
echarts.registerTheme('swiss', echartsTheme)

interface ComboChartProps {
  categories: string[]
  series: ComboSeries[]
  height?: number
  colorPalette?: string
}

export default function ComboChart({ categories, series, height, colorPalette }: ComboChartProps) {
  const pal = getChartPalette(colorPalette)
  const hasSecondAxis = series.some(s => s.yAxisIndex === 1)

  const option = {
    tooltip: { trigger: 'axis' as const },
    legend: {
      show: series.length > 1,
      bottom: 0,
    },
    grid: {
      left: 12,
      right: 12,
      top: 24,
      bottom: series.length > 1 ? 40 : 12,
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      data: categories,
    },
    yAxis: hasSecondAxis
      ? [
          { type: 'value' as const },
          { type: 'value' as const, splitLine: { show: false } },
        ]
      : { type: 'value' as const },
    series: series.map((s, i) => {
      const baseColor = pal[i % pal.length]
      const yIdx = s.yAxisIndex ?? 0

      if (s.seriesType === 'line') {
        return {
          name: s.name,
          type: 'line' as const,
          yAxisIndex: yIdx,
          data: s.data,
          smooth: 0.4,
          symbol: 'circle',
          symbolSize: 7,
          lineStyle: { width: 2.5, color: baseColor },
          itemStyle: {
            color: baseColor,
            borderColor: '#fff',
            borderWidth: 2,
          },
          emphasis: {
            lineStyle: { width: 3.5 },
            itemStyle: { shadowBlur: 8, shadowColor: `${baseColor}40` },
          },
        }
      }

      return {
        name: s.name,
        type: 'bar' as const,
        yAxisIndex: yIdx,
        data: s.data,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: baseColor },
            { offset: 1, color: `${baseColor}88` },
          ]),
          borderRadius: [6, 6, 0, 0],
        },
        barMaxWidth: 48,
        label: {
          show: true,
          position: 'top' as const,
          color: colors.textPrimary,
          fontSize: 12,
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
