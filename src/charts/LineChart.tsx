import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { LineChart as ELineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { echartsTheme, colors, chartPalette, getChartPalette } from '../theme/swiss'

echarts.use([ELineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])
echarts.registerTheme('swiss', echartsTheme)

interface LineChartProps {
  categories: string[]
  series: { name: string; data: number[]; area?: boolean }[]
  height?: number
  colorPalette?: string
}

export default function LineChart({ categories, series, height, colorPalette }: LineChartProps) {
  const pal = getChartPalette(colorPalette)
  const hasLegend = series.length > 1

  const option = {
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'cross' as const, lineStyle: { color: colors.border } },
    },
    legend: {
      show: hasLegend,
      bottom: 0,
      icon: 'roundRect',
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
      boundaryGap: false,
    },
    yAxis: {
      type: 'value' as const,
    },
    series: series.map((s, i) => {
      const color = pal[i % pal.length]
      return {
        name: s.name,
        type: 'line' as const,
        data: s.data,
        smooth: 0.4,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { width: 2.5, color },
        itemStyle: {
          color,
          borderColor: '#fff',
          borderWidth: 2,
        },
        areaStyle: s.area
          ? {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: `${color}30` },
                { offset: 1, color: `${color}05` },
              ]),
            }
          : undefined,
        emphasis: {
          itemStyle: {
            symbolSize: 10,
            shadowBlur: 10,
            shadowColor: `${color}40`,
          },
        },
      }
    }),
    animationEasing: 'cubicOut' as const,
    animationDuration: 1000,
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
