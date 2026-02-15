import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { HeatmapChart as HeatmapChartType } from 'echarts/charts'
import { GridComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { echartsTheme, getChartPalette } from '../theme/swiss'

echarts.use([HeatmapChartType, GridComponent, TooltipComponent, VisualMapComponent, CanvasRenderer])
echarts.registerTheme('swiss', echartsTheme)

interface HeatmapChartProps {
  xCategories: string[]
  yCategories: string[]
  data: [number, number, number][]  // [xIndex, yIndex, value]
  height?: number
  colorPalette?: string
}

export default function HeatmapChart({ xCategories, yCategories, data, height, colorPalette }: HeatmapChartProps) {
  const pal = getChartPalette(colorPalette)
  const values = data.map(d => d[2])
  const minVal = values.length > 0 ? Math.min(...values) : 0
  const maxVal = values.length > 0 ? Math.max(...values) : 100

  const option = {
    tooltip: {
      position: 'top' as const,
      formatter: (params: { value: [number, number, number] }) => {
        const [xi, yi, val] = params.value
        return `${xCategories[xi]} × ${yCategories[yi]}<br/><b>${val}</b>`
      },
    },
    grid: {
      left: 12,
      right: 60,
      top: 12,
      bottom: 12,
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      data: xCategories,
      splitArea: { show: true },
      axisLabel: { fontSize: 12 },
    },
    yAxis: {
      type: 'category' as const,
      data: yCategories,
      splitArea: { show: true },
      axisLabel: { fontSize: 12 },
    },
    visualMap: {
      min: minVal,
      max: maxVal,
      calculable: true,
      orient: 'vertical' as const,
      right: 0,
      top: 'center' as const,
      inRange: {
        color: [
          `${pal[0] || '#3b82f6'}22`,  // lightest (low value)
          pal[0] || '#3b82f6',          // full saturation (high value)
        ],
      },
      textStyle: { fontSize: 11 },
    },
    series: [
      {
        type: 'heatmap' as const,
        data,
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 500,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
          borderRadius: 4,
        },
        animationDuration: 800,
        animationEasing: 'cubicOut' as const,
      },
    ],
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
