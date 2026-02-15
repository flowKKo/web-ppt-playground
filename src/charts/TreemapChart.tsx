import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { TreemapChart as TreemapChartType } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { echartsTheme, getChartPalette } from '../theme/swiss'
import type { TreemapNode } from '../data/types'

echarts.use([TreemapChartType, TooltipComponent, CanvasRenderer])
echarts.registerTheme('swiss', echartsTheme)

interface TreemapChartProps {
  data: TreemapNode[]
  height?: number
  colorPalette?: string
}

export default function TreemapChart({ data, height, colorPalette }: TreemapChartProps) {
  const pal = getChartPalette(colorPalette)

  const option = {
    tooltip: {
      formatter: (info: { name: string; value: number; treePathInfo: { name: string }[] }) => {
        const path = info.treePathInfo.map(n => n.name).filter(Boolean).join(' / ')
        return `<b>${path}</b><br/>值: ${info.value}`
      },
    },
    series: [
      {
        type: 'treemap' as const,
        data,
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: {
          show: true,
          formatter: '{b}',
          fontSize: 13,
          fontWeight: 500,
        },
        upperLabel: {
          show: true,
          height: 24,
          fontSize: 12,
          fontWeight: 600,
          color: '#fff',
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
          gapWidth: 2,
        },
        levels: [
          {
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 4,
              gapWidth: 4,
            },
            upperLabel: { show: false },
            color: pal,
          },
          {
            colorSaturation: [0.35, 0.6],
            itemStyle: {
              borderColorSaturation: 0.6,
              borderWidth: 2,
              gapWidth: 2,
            },
          },
        ],
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
