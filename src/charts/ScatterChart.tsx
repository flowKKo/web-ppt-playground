import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { ScatterChart as EScatterChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { echartsTheme, colors, getChartPalette } from '../theme/swiss'
import type { ScatterSeries } from '../data/types'

echarts.use([EScatterChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])
echarts.registerTheme('swiss', echartsTheme)

interface ScatterChartProps {
  series: ScatterSeries[]
  xAxisName?: string
  yAxisName?: string
  height?: number
  colorPalette?: string
}

export default function ScatterChart({ series, xAxisName, yAxisName, height, colorPalette }: ScatterChartProps) {
  const pal = getChartPalette(colorPalette)
  const hasLegend = series.length > 1
  // Check if any point has a 3rd dimension (bubble size)
  const hasBubble = series.some(s => s.data.some(d => d[2] != null))

  const option = {
    tooltip: {
      trigger: 'item' as const,
      formatter: (p: { seriesName: string; value: (number | undefined)[] }) => {
        const [x, y, size] = p.value
        let text = `<b>${p.seriesName}</b><br/>${xAxisName || 'X'}: ${x}<br/>${yAxisName || 'Y'}: ${y}`
        if (size != null) text += `<br/>大小: ${size}`
        return text
      },
    },
    legend: {
      show: hasLegend,
      bottom: 0,
    },
    grid: {
      left: 12,
      right: 20,
      top: 24,
      bottom: hasLegend ? 40 : 12,
      containLabel: true,
    },
    xAxis: {
      type: 'value' as const,
      name: xAxisName,
      nameLocation: 'center' as const,
      nameGap: 28,
      nameTextStyle: { color: colors.textSecondary, fontSize: 13 },
    },
    yAxis: {
      type: 'value' as const,
      name: yAxisName,
      nameLocation: 'center' as const,
      nameGap: 40,
      nameTextStyle: { color: colors.textSecondary, fontSize: 13 },
    },
    series: series.map((s, i) => {
      const baseColor = pal[i % pal.length]
      return {
        name: s.name,
        type: 'scatter' as const,
        data: s.data,
        symbolSize: hasBubble
          ? (val: (number | undefined)[]) => {
              const size = val[2]
              return size != null ? Math.max(Math.sqrt(size) * 4, 8) : 14
            }
          : 14,
        itemStyle: {
          color: `${baseColor}CC`,
          borderColor: baseColor,
          borderWidth: 1.5,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 12,
            shadowColor: `${baseColor}40`,
          },
        },
        label: {
          show: !hasBubble && s.data.length <= 10,
          position: 'top' as const,
          color: colors.textPrimary,
          fontSize: 11,
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
