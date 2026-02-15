import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { SunburstChart as SunburstChartType } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { echartsTheme, getChartPalette } from '../theme/swiss'
import type { SunburstNode } from '../data/types'

echarts.use([SunburstChartType, TooltipComponent, CanvasRenderer])
echarts.registerTheme('swiss', echartsTheme)

interface SunburstChartProps {
  data: SunburstNode[]
  height?: number
  colorPalette?: string
}

export default function SunburstChart({ data, height, colorPalette }: SunburstChartProps) {
  const pal = getChartPalette(colorPalette)

  const option = {
    tooltip: {
      trigger: 'item' as const,
      formatter: (params: { name: string; value: number; treePathInfo: { name: string }[] }) => {
        const path = params.treePathInfo.map(n => n.name).filter(Boolean).join(' / ')
        return `<b>${path}</b><br/>值: ${params.value}`
      },
    },
    series: [
      {
        type: 'sunburst' as const,
        data,
        radius: ['12%', '90%'],
        nodeClick: false,
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 500,
          rotate: 'radial' as const,
          minAngle: 15,
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
          borderRadius: 4,
        },
        levels: [
          {},
          {
            r0: '12%',
            r: '40%',
            itemStyle: { borderWidth: 3 },
            label: { fontSize: 14, fontWeight: 600, rotate: 'tangential' as const },
          },
          {
            r0: '40%',
            r: '65%',
            label: { fontSize: 12, rotate: 'radial' as const },
          },
          {
            r0: '65%',
            r: '90%',
            label: { fontSize: 11, rotate: 'radial' as const },
            itemStyle: { borderWidth: 1 },
          },
        ],
        emphasis: {
          focus: 'ancestor' as const,
        },
        animationDuration: 800,
        animationEasing: 'cubicOut' as const,
      },
    ],
    color: pal,
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
