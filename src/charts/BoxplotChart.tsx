import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { BoxplotChart as BoxplotChartType } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { echartsTheme, getChartPalette } from '../theme/swiss'
import type { BoxplotItem } from '../data/types'

echarts.use([BoxplotChartType, GridComponent, TooltipComponent, CanvasRenderer])
echarts.registerTheme('swiss', echartsTheme)

interface BoxplotChartProps {
  items: BoxplotItem[]
  height?: number
  colorPalette?: string
}

export default function BoxplotChart({ items, height, colorPalette }: BoxplotChartProps) {
  const pal = getChartPalette(colorPalette)
  const mainColor = pal[0] || '#3b82f6'

  const option = {
    tooltip: {
      trigger: 'item' as const,
      // ECharts boxplot tooltip: params.value = [categoryIndex, min, Q1, median, Q3, max]
      formatter: (params: { name: string; value: number[] }) => {
        const v = params.value
        return `<b>${params.name}</b><br/>
最大: ${v[5]}<br/>
Q3: ${v[4]}<br/>
中位数: ${v[3]}<br/>
Q1: ${v[2]}<br/>
最小: ${v[1]}`
      },
    },
    grid: {
      left: 12,
      right: 12,
      top: 24,
      bottom: 12,
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      data: items.map(i => i.name),
      axisLabel: { fontSize: 12 },
    },
    yAxis: {
      type: 'value' as const,
    },
    series: [
      {
        type: 'boxplot' as const,
        data: items.map(i => i.values),
        itemStyle: {
          color: `${mainColor}22`,
          borderColor: mainColor,
          borderWidth: 2,
        },
        emphasis: {
          itemStyle: {
            color: `${mainColor}44`,
            borderColor: mainColor,
            borderWidth: 3,
          },
        },
        boxWidth: ['30%', '60%'],
      },
    ],
    animationDuration: 800,
    animationEasing: 'cubicOut' as const,
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
