import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { RadarChart as ERadarChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { echartsTheme, colors, chartPalette, getChartPalette } from '../theme/swiss'

echarts.use([ERadarChart, TooltipComponent, LegendComponent, CanvasRenderer])
echarts.registerTheme('swiss', echartsTheme)

interface RadarChartProps {
  indicators: { name: string; max: number }[]
  series: { name: string; values: number[] }[]
  height?: number
  colorPalette?: string
}

export default function RadarChart({ indicators, series, height, colorPalette }: RadarChartProps) {
  const pal = getChartPalette(colorPalette)
  const hasLegend = series.length > 1

  const option = {
    tooltip: {},
    legend: {
      show: hasLegend,
      bottom: 0,
      icon: 'circle',
    },
    radar: {
      indicator: indicators,
      shape: 'polygon' as const,
      splitNumber: 4,
      radius: '68%',
      center: ['50%', hasLegend ? '46%' : '50%'],
      axisName: {
        color: colors.textPrimary,
        fontSize: 12,
        fontWeight: 500,
        padding: [2, 6],
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(84,110,122,0.02)', 'rgba(84,110,122,0.05)'],
        },
      },
      splitLine: { lineStyle: { color: 'rgba(0,0,0,0.06)' } },
      axisLine: { lineStyle: { color: 'rgba(0,0,0,0.08)' } },
    },
    series: [{
      type: 'radar' as const,
      data: series.map((s, i) => {
        const color = pal[i % pal.length]
        return {
          name: s.name,
          value: s.values,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${color}30` },
              { offset: 1, color: `${color}10` },
            ]),
          },
          lineStyle: { width: 2.5, color },
          itemStyle: {
            color,
            borderColor: '#fff',
            borderWidth: 2,
          },
          symbolSize: 6,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: `${color}40`,
            },
          },
        }
      }),
    }],
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
