import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts/core'
import { CustomChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { echartsTheme, getChartPalette } from '../theme/swiss'
import type { GanttTask } from '../data/types'

echarts.use([CustomChart, GridComponent, TooltipComponent, CanvasRenderer])
echarts.registerTheme('swiss', echartsTheme)

interface GanttChartProps {
  tasks: GanttTask[]
  height?: number
  colorPalette?: string
}

interface CustomAPI {
  value: (dim: number) => number
  coord: (val: [number, number]) => [number, number]
  size: (val: [number, number]) => [number, number]
  style: (extra?: Record<string, unknown>) => Record<string, unknown>
}

export default function GanttChart({ tasks, height, colorPalette }: GanttChartProps) {
  const pal = getChartPalette(colorPalette)

  // Display bottom-to-top: first task at top of chart
  const displayTasks = [...tasks].reverse()
  const categories = [...new Set(tasks.map(t => t.category || '默认'))]
  const taskNames = displayTasks.map(t => t.name)

  const option = {
    tooltip: {
      formatter: (params: { value: number[] }) => {
        const task = displayTasks[params.value[1]]
        if (!task) return ''
        return `<b>${task.name}</b><br/>开始: ${task.start}<br/>结束: ${task.end}<br/>时长: ${task.end - task.start}`
      },
    },
    grid: {
      left: 12,
      right: 12,
      top: 12,
      bottom: 12,
      containLabel: true,
    },
    xAxis: {
      type: 'value' as const,
      min: tasks.length > 0 ? Math.min(...tasks.map(t => t.start)) : 0,
      max: tasks.length > 0 ? Math.max(...tasks.map(t => t.end)) : 10,
    },
    yAxis: {
      type: 'category' as const,
      data: taskNames,
      axisLabel: { fontSize: 12 },
    },
    series: [
      {
        type: 'custom' as const,
        renderItem: (_params: unknown, api: CustomAPI) => {
          const yIdx = api.value(1)
          const startCoord = api.coord([api.value(0), yIdx])
          const endCoord = api.coord([api.value(0) + api.value(2), yIdx])
          const barHeight = api.size([0, 1])[1] * 0.6
          const task = displayTasks[yIdx]
          const catIdx = categories.indexOf(task?.category || '默认')
          const color = pal[catIdx % pal.length]

          return {
            type: 'rect' as const,
            shape: {
              x: startCoord[0],
              y: startCoord[1] - barHeight / 2,
              width: endCoord[0] - startCoord[0],
              height: barHeight,
              r: [4, 4, 4, 4],
            },
            style: {
              ...api.style(),
              fill: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color },
                { offset: 1, color: `${color}99` },
              ]),
            },
          }
        },
        dimensions: ['start', 'index', 'duration'],
        encode: {
          x: [0, 2],
          y: 1,
        },
        // Data uses displayTasks order (reversed), so index maps directly to yAxis category
        data: displayTasks.map((task, i) => [task.start, i, task.end - task.start]),
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
