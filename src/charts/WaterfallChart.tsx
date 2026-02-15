import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { echartsTheme, colors, getChartPalette } from '../theme/swiss'
import type { WaterfallItem } from '../data/types'

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])
echarts.registerTheme('swiss', echartsTheme)

interface WaterfallChartProps {
  items: WaterfallItem[]
  height?: number
  colorPalette?: string
}

export default function WaterfallChart({ items, height, colorPalette }: WaterfallChartProps) {
  const pal = getChartPalette(colorPalette)
  const increaseColor = pal[0] || '#4CAF50'
  const decreaseColor = pal[2] || '#E57373'
  const totalColor = pal[3] || '#42A5F5'

  // Compute cumulative values and invisible base for each bar
  const categories: string[] = []
  const baseData: number[] = []    // transparent bar (support)
  const valueData: (number | { value: number; itemStyle: { color: unknown } })[] = []

  let running = 0
  items.forEach((item) => {
    categories.push(item.name)
    if (item.type === 'total') {
      baseData.push(0)
      valueData.push({
        value: item.value,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: totalColor },
            { offset: 1, color: `${totalColor}88` },
          ]),
        },
      })
      running = item.value
    } else {
      const isIncrease = item.type === 'increase' || (!item.type && item.value >= 0)
      const absVal = Math.abs(item.value)
      if (isIncrease) {
        baseData.push(running)
        running += absVal
        valueData.push({
          value: absVal,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: increaseColor },
              { offset: 1, color: `${increaseColor}88` },
            ]),
          },
        })
      } else {
        running -= absVal
        baseData.push(running)
        valueData.push({
          value: absVal,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: decreaseColor },
              { offset: 1, color: `${decreaseColor}88` },
            ]),
          },
        })
      }
    }
  })

  const option = {
    tooltip: {
      trigger: 'axis' as const,
      formatter: (params: { name: string; value: number; seriesName: string }[]) => {
        const visible = params.find(p => p.seriesName === '值')
        if (!visible) return ''
        const item = items.find(i => i.name === visible.name)
        const sign = item?.type === 'decrease' || (item && !item.type && item.value < 0) ? '-' : item?.type === 'total' ? '' : '+'
        return `<b>${visible.name}</b><br/>${sign}${visible.value}`
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
      data: categories,
    },
    yAxis: {
      type: 'value' as const,
    },
    series: [
      {
        name: '基础',
        type: 'bar' as const,
        stack: 'waterfall',
        data: baseData,
        itemStyle: { color: 'transparent' },
        emphasis: { itemStyle: { color: 'transparent' } },
        silent: true,
      },
      {
        name: '值',
        type: 'bar' as const,
        stack: 'waterfall',
        data: valueData,
        barMaxWidth: 48,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
        },
        label: {
          show: true,
          position: 'top' as const,
          color: colors.textPrimary,
          fontSize: 13,
          fontWeight: 600,
        },
      },
    ],
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
