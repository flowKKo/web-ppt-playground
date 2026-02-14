import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { PieChart as EPieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { echartsTheme, colors, getChartPalette } from '../theme/swiss'

echarts.use([EPieChart, TooltipComponent, LegendComponent, CanvasRenderer])
echarts.registerTheme('swiss', echartsTheme)

interface PieChartProps {
  data: { name: string; value: number }[]
  innerRadius?: number
  height?: number
  colorPalette?: string
}

export default function PieChart({ data, innerRadius = 0, height, colorPalette }: PieChartProps) {
  const pal = colorPalette ? getChartPalette(colorPalette) : undefined
  const isDonut = innerRadius > 0
  const total = data.reduce((s, d) => s + d.value, 0)

  const option = {
    tooltip: {
      trigger: 'item' as const,
      formatter: (p: { name: string; value: number; percent: number }) =>
        `<b>${p.name}</b><br/>${p.value} (${p.percent.toFixed(1)}%)`,
    },
    legend: {
      bottom: 0,
      icon: 'circle',
    },
    series: [
      {
        type: 'pie' as const,
        radius: isDonut ? [`${innerRadius}%`, '72%'] : ['0%', '72%'],
        center: ['50%', '46%'],
        data: pal ? data.map((d, i) => ({ ...d, itemStyle: { color: pal[i % pal.length] } })) : data,
        label: {
          show: true,
          fontSize: 12,
          color: colors.textPrimary,
          formatter: '{b}\n{d}%',
          lineHeight: 18,
        },
        labelLine: {
          length: 16,
          length2: 10,
          lineStyle: { color: colors.textCaption },
        },
        itemStyle: {
          borderRadius: 8,
          borderColor: colors.slide,
          borderWidth: 3,
        },
        emphasis: {
          scaleSize: 8,
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0,0,0,0.12)',
          },
        },
        animationType: 'scale' as const,
        animationEasing: 'elasticOut' as const,
        animationDuration: 1000,
      },
      // Donut center label
      ...(isDonut
        ? [{
            type: 'pie' as const,
            radius: ['0%', '0%'],
            center: ['50%', '46%'],
            data: [{ value: 0, name: '' }],
            label: {
              show: true,
              position: 'center' as const,
              formatter: `{total|${total}}\n{label|总计}`,
              rich: {
                total: {
                  fontSize: 28,
                  fontWeight: 700,
                  color: colors.textPrimary,
                  lineHeight: 36,
                },
                label: {
                  fontSize: 12,
                  color: colors.textCaption,
                  lineHeight: 20,
                },
              },
            },
            silent: true,
          }]
        : []),
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
