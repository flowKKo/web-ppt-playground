import { useState, useRef, useEffect } from 'react'
import type { SlideData, ChartSlideData, GridItemSlideData, SequenceSlideData, CompareSlideData, FunnelSlideData, ConcentricSlideData, HubSpokeSlideData, VennSlideData } from '../../data/types'
import { colors, COLOR_PALETTES } from '../../theme/swiss'
import ArrayEditor from './ArrayEditor'

interface SlideDataEditorProps {
  data: SlideData
  onChange: (data: SlideData) => void
  isBlock?: boolean
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] text-gray-500 font-medium">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md mt-1 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 outline-none transition-colors"
      />
    </label>
  )
}

function NumberInput({ label, value, onChange, min, max, step }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <label className="block">
      <span className="text-[11px] text-gray-500 font-medium">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md mt-1 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 outline-none transition-colors"
      />
    </label>
  )
}

function OptionalNumberInput({ label, value, onChange, placeholder, min, max, step }: { label: string; value?: number; onChange: (v: number | undefined) => void; placeholder?: string; min?: number; max?: number; step?: number }) {
  return (
    <label className="block">
      <span className="text-[11px] text-gray-500 font-medium">{label}</span>
      <input
        type="number"
        value={value ?? ''}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md mt-1 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 outline-none transition-colors"
      />
    </label>
  )
}

function SelectInput<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] text-gray-500 font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md mt-1 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 outline-none transition-colors"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}

function CheckboxInput({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-[11px] text-gray-500 font-medium">{label}</span>
    </label>
  )
}

function CompactColorInput({ label, value, onChange, defaultValue }: { label: string; value?: string; onChange: (v: string | undefined) => void; defaultValue: string }) {
  const displayColor = value || defaultValue
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative">
        <input
          type="color"
          value={displayColor}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded-md border border-gray-200 cursor-pointer p-0.5"
        />
        {value && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onChange(undefined) }}
            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-gray-400 hover:bg-red-500 text-white flex items-center justify-center text-[8px] leading-none cursor-pointer transition-colors"
          >
            ×
          </button>
        )}
      </div>
      <span className="text-[11px] text-gray-500 font-medium">{label}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase flex items-center gap-2">
        <span>{title}</span>
        <span className="flex-1 h-px bg-gray-100" />
      </div>
      {children}
    </div>
  )
}

const paletteKeys = Object.keys(COLOR_PALETTES)

function PaletteRow({ pal, label }: { pal: string[]; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5 shrink-0">
        {pal.map((c, i) => (
          <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
        ))}
      </div>
      <span className="text-[11px] text-gray-600 font-medium truncate">{label}</span>
    </div>
  )
}

function PalettePicker({ value, onChange }: { value?: string; onChange: (v: string | undefined) => void }) {
  const current = value || 'default'
  const currentPalette = COLOR_PALETTES[current] || COLOR_PALETTES.default
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="w-full flex items-center justify-between px-2.5 py-1.5 border border-gray-200 rounded-md cursor-pointer hover:border-gray-300 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <PaletteRow pal={currentPalette.colors} label={currentPalette.name} />
        <svg className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto">
          {paletteKeys.map((key) => {
            const p = COLOR_PALETTES[key]
            const active = current === key
            return (
              <button
                key={key}
                type="button"
                className="w-full px-2.5 py-1.5 cursor-pointer transition-colors hover:bg-gray-50"
                style={{ background: active ? '#EFF6FF' : undefined }}
                onClick={() => { onChange(key === 'default' ? undefined : key); setOpen(false) }}
              >
                <PaletteRow pal={p.colors} label={p.name} />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

const paletteTypes = new Set(['grid-item', 'sequence', 'compare', 'funnel', 'concentric', 'hub-spoke', 'venn', 'chart'])

const defaultTitleSizes: Record<string, number> = {
  title: 60, 'key-point': 48, chart: 36,
  'grid-item': 36, sequence: 36, compare: 36,
  funnel: 36, concentric: 36, 'hub-spoke': 36, venn: 36,
}
const defaultBodySizes: Record<string, number> = {
  title: 24, 'key-point': 20, chart: 18,
  'grid-item': 18, sequence: 18, compare: 18,
  funnel: 18, concentric: 18, 'hub-spoke': 18, venn: 18,
}
const defaultTitleColors: Record<string, string> = Object.fromEntries(
  ['title', 'key-point', 'chart', 'grid-item', 'sequence', 'compare', 'funnel', 'concentric', 'hub-spoke', 'venn'].map(k => [k, colors.textPrimary])
)
const defaultTextColors: Record<string, string> = {
  title: colors.textSecondary, 'key-point': colors.textSecondary, chart: colors.textSecondary,
  'grid-item': '#ffffff', sequence: '#ffffff', compare: colors.textSecondary,
  funnel: '#ffffff', concentric: colors.textPrimary, 'hub-spoke': '#ffffff', venn: colors.textPrimary,
}

export default function SlideDataEditor({ data, onChange, isBlock }: SlideDataEditorProps) {
  // Font size controls — available for all slide types except block-slide
  const fontSizeFields = data.type !== 'block-slide' && 'titleSize' in data || data.type !== 'block-slide' ? (
    <Section title="字体大小">
      <div className="flex gap-2">
        <div className="flex-1">
          <OptionalNumberInput
            label="标题"
            value={'titleSize' in data ? (data as { titleSize?: number }).titleSize : undefined}
            placeholder={String(defaultTitleSizes[data.type] ?? 36)}
            onChange={(v) => onChange({ ...data, titleSize: v })}
            min={12}
            max={200}
            step={2}
          />
        </div>
        <div className="flex-1">
          <OptionalNumberInput
            label="正文/副标题"
            value={'bodySize' in data ? (data as { bodySize?: number }).bodySize : undefined}
            placeholder={String(defaultBodySizes[data.type] ?? 18)}
            onChange={(v) => onChange({ ...data, bodySize: v })}
            min={10}
            max={120}
            step={2}
          />
        </div>
      </div>
    </Section>
  ) : null

  // Unified color section — text colors + optional palette picker
  const colorFields = data.type !== 'block-slide' ? (
    <Section title="颜色">
      <div className="flex items-start gap-4">
        <CompactColorInput
          label="标题色"
          value={'titleColor' in data ? (data as { titleColor?: string }).titleColor : undefined}
          defaultValue={defaultTitleColors[data.type] ?? colors.textPrimary}
          onChange={(v) => onChange({ ...data, titleColor: v })}
        />
        <CompactColorInput
          label="内容色"
          value={'textColor' in data ? (data as { textColor?: string }).textColor : undefined}
          defaultValue={defaultTextColors[data.type] ?? colors.textSecondary}
          onChange={(v) => onChange({ ...data, textColor: v })}
        />
      </div>
      {paletteTypes.has(data.type) && (
        <PalettePicker
          value={'colorPalette' in data ? (data as { colorPalette?: string }).colorPalette : undefined}
          onChange={(v) => onChange({ ...data, colorPalette: v } as SlideData)}
        />
      )}
    </Section>
  ) : null

  // Common title/body fields — hidden in block mode
  const commonFields = isBlock ? null : (
    <Section title="基本信息">
      <TextInput label="标题" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
      {'body' in data && data.body !== undefined && (
        <TextInput label="正文" value={data.body} onChange={(v) => onChange({ ...data, body: v })} />
      )}
      {'subtitle' in data && data.subtitle !== undefined && (
        <TextInput label="副标题" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} />
      )}
    </Section>
  )

  switch (data.type) {
    case 'title':
      return (
        <div className="space-y-3">
          <Section title="标题页">
            <TextInput label="标题" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
            <TextInput label="副标题" value={data.subtitle ?? ''} onChange={(v) => onChange({ ...data, subtitle: v })} />
            <TextInput label="徽标" value={data.badge ?? ''} onChange={(v) => onChange({ ...data, badge: v })} />
          </Section>
          {fontSizeFields}
          {colorFields}
        </div>
      )

    case 'key-point':
      return (
        <div className="space-y-3">
          <Section title="关键点">
            <TextInput label="标题" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
            <TextInput label="副标题" value={data.subtitle ?? ''} onChange={(v) => onChange({ ...data, subtitle: v })} />
            <TextInput label="正文" value={data.body ?? ''} onChange={(v) => onChange({ ...data, body: v })} />
          </Section>
          {fontSizeFields}
          {colorFields}
        </div>
      )

    case 'chart':
      return <ChartEditor data={data} onChange={onChange} isBlock={isBlock} fontSizeFields={fontSizeFields} colorFields={colorFields} />

    case 'grid-item':
      return <GridItemEditor data={data} onChange={onChange} commonFields={commonFields} fontSizeFields={fontSizeFields} colorFields={colorFields} />

    case 'sequence':
      return <SequenceEditor data={data} onChange={onChange} commonFields={commonFields} fontSizeFields={fontSizeFields} colorFields={colorFields} />

    case 'compare':
      return <CompareEditor data={data} onChange={onChange} commonFields={commonFields} fontSizeFields={fontSizeFields} colorFields={colorFields} />

    case 'funnel':
      return <FunnelEditor data={data} onChange={onChange} commonFields={commonFields} fontSizeFields={fontSizeFields} colorFields={colorFields} />

    case 'concentric':
      return <ConcentricEditor data={data} onChange={onChange} commonFields={commonFields} fontSizeFields={fontSizeFields} colorFields={colorFields} />

    case 'hub-spoke':
      return <HubSpokeEditor data={data} onChange={onChange} commonFields={commonFields} fontSizeFields={fontSizeFields} colorFields={colorFields} />

    case 'venn':
      return <VennEditor data={data} onChange={onChange} commonFields={commonFields} fontSizeFields={fontSizeFields} colorFields={colorFields} />
  }
}

// ─── Chart Editor ───

function ChartEditor({ data, onChange, isBlock, fontSizeFields, colorFields }: { data: ChartSlideData; onChange: (d: SlideData) => void; isBlock?: boolean; fontSizeFields?: React.ReactNode; colorFields?: React.ReactNode }) {
  return (
    <div className="space-y-3">
      {!isBlock && (
        <Section title="图表">
          <TextInput label="标题" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
          <TextInput label="正文" value={data.body ?? ''} onChange={(v) => onChange({ ...data, body: v })} />
          <TextInput label="高亮" value={data.highlight ?? ''} onChange={(v) => onChange({ ...data, highlight: v })} />
        </Section>
      )}
      {!isBlock && fontSizeFields}
      {colorFields}

      {(data.chartType === 'bar' || data.chartType === 'horizontal-bar' || data.chartType === 'stacked-bar') && data.bars && (
        <Section title="柱状图数据">
          <ArrayEditor
            items={data.bars}
            onChange={(bars) => onChange({ ...data, bars })}
            createDefault={() => ({ category: '新类别', values: [{ name: '系列1', value: 50 }] })}
            renderRow={(bar, _, update) => (
              <div className="space-y-1">
                <TextInput label="类别" value={bar.category} onChange={(v) => update({ ...bar, category: v })} />
                <ArrayEditor
                  items={bar.values}
                  onChange={(values) => update({ ...bar, values })}
                  createDefault={() => ({ name: '系列', value: 50 })}
                  renderRow={(val, __, updateVal) => (
                    <div className="flex gap-1">
                      <div className="flex-1">
                        <TextInput label="名称" value={val.name} onChange={(v) => updateVal({ ...val, name: v })} />
                      </div>
                      <div className="w-20">
                        <NumberInput label="值" value={val.value} onChange={(v) => updateVal({ ...val, value: v })} />
                      </div>
                    </div>
                  )}
                  label="值"
                />
              </div>
            )}
          />
        </Section>
      )}

      {(data.chartType === 'pie' || data.chartType === 'donut' || data.chartType === 'rose') && data.slices && (
        <Section title="饼图数据">
          <ArrayEditor
            items={data.slices}
            onChange={(slices) => onChange({ ...data, slices })}
            createDefault={() => ({ name: '新项', value: 25 })}
            renderRow={(slice, _, update) => (
              <div className="flex gap-1">
                <div className="flex-1">
                  <TextInput label="名称" value={slice.name} onChange={(v) => update({ ...slice, name: v })} />
                </div>
                <div className="w-20">
                  <NumberInput label="值" value={slice.value} onChange={(v) => update({ ...slice, value: v })} />
                </div>
              </div>
            )}
          />
          <NumberInput label="内半径" value={data.innerRadius ?? 0} onChange={(v) => onChange({ ...data, innerRadius: v })} min={0} max={100} />
        </Section>
      )}

      {(data.chartType === 'line' || data.chartType === 'area') && data.lineSeries && (
        <Section title="折线图数据">
          <TextInput
            label="X轴类别 (逗号分隔)"
            value={(data.categories ?? []).join(', ')}
            onChange={(v) => onChange({ ...data, categories: v.split(',').map((s) => s.trim()) })}
          />
          <ArrayEditor
            items={data.lineSeries}
            onChange={(lineSeries) => onChange({ ...data, lineSeries })}
            createDefault={() => ({ name: '系列', data: [0], area: false })}
            renderRow={(series, _, update) => (
              <div className="space-y-1">
                <TextInput label="名称" value={series.name} onChange={(v) => update({ ...series, name: v })} />
                <TextInput
                  label="数据 (逗号分隔)"
                  value={series.data.join(', ')}
                  onChange={(v) => update({ ...series, data: v.split(',').map((s) => Number(s.trim()) || 0) })}
                />
                <CheckboxInput label="面积图" value={series.area ?? false} onChange={(v) => update({ ...series, area: v })} />
              </div>
            )}
          />
        </Section>
      )}

      {data.chartType === 'radar' && (
        <Section title="雷达图数据">
          <ArrayEditor
            items={data.indicators ?? []}
            onChange={(indicators) => onChange({ ...data, indicators })}
            createDefault={() => ({ name: '指标', max: 100 })}
            label="指标"
            renderRow={(ind, _, update) => (
              <div className="flex gap-1">
                <div className="flex-1">
                  <TextInput label="名称" value={ind.name} onChange={(v) => update({ ...ind, name: v })} />
                </div>
                <div className="w-20">
                  <NumberInput label="最大值" value={ind.max} onChange={(v) => update({ ...ind, max: v })} />
                </div>
              </div>
            )}
          />
          <ArrayEditor
            items={data.radarSeries ?? []}
            onChange={(radarSeries) => onChange({ ...data, radarSeries })}
            createDefault={() => ({ name: '系列', values: [50] })}
            label="系列"
            renderRow={(series, _, update) => (
              <div className="space-y-1">
                <TextInput label="名称" value={series.name} onChange={(v) => update({ ...series, name: v })} />
                <TextInput
                  label="值 (逗号分隔)"
                  value={series.values.join(', ')}
                  onChange={(v) => update({ ...series, values: v.split(',').map((s) => Number(s.trim()) || 0) })}
                />
              </div>
            )}
          />
        </Section>
      )}

      {data.chartType === 'proportion' && (
        <Section title="比例图数据">
          <ArrayEditor
            items={data.proportionItems ?? []}
            onChange={(proportionItems) => onChange({ ...data, proportionItems })}
            createDefault={() => ({ name: '新项', value: 50, max: 100 })}
            renderRow={(item, _, update) => (
              <div className="flex gap-1">
                <div className="flex-1">
                  <TextInput label="名称" value={item.name} onChange={(v) => update({ ...item, name: v })} />
                </div>
                <div className="w-16">
                  <NumberInput label="值" value={item.value} onChange={(v) => update({ ...item, value: v })} />
                </div>
                <div className="w-16">
                  <NumberInput label="满值" value={item.max ?? 100} onChange={(v) => update({ ...item, max: v })} />
                </div>
              </div>
            )}
          />
        </Section>
      )}

      {data.chartType === 'waterfall' && (
        <Section title="瀑布图数据">
          <ArrayEditor
            items={data.waterfallItems ?? []}
            onChange={(waterfallItems) => onChange({ ...data, waterfallItems })}
            createDefault={() => ({ name: '新项', value: 50, type: 'increase' as const })}
            renderRow={(item, _, update) => (
              <div className="flex gap-1">
                <div className="flex-1">
                  <TextInput label="名称" value={item.name} onChange={(v) => update({ ...item, name: v })} />
                </div>
                <div className="w-16">
                  <NumberInput label="值" value={item.value} onChange={(v) => update({ ...item, value: v })} />
                </div>
                <div className="w-20">
                  <SelectInput label="类型" value={item.type ?? 'increase'} options={['increase', 'decrease', 'total']} onChange={(v) => update({ ...item, type: v })} />
                </div>
              </div>
            )}
          />
        </Section>
      )}

      {data.chartType === 'combo' && (
        <Section title="组合图数据">
          <TextInput
            label="X轴类别 (逗号分隔)"
            value={(data.categories ?? []).join(', ')}
            onChange={(v) => onChange({ ...data, categories: v.split(',').map((s) => s.trim()) })}
          />
          <ArrayEditor
            items={data.comboSeries ?? []}
            onChange={(comboSeries) => onChange({ ...data, comboSeries })}
            createDefault={() => ({ name: '系列', data: [0], seriesType: 'bar' as const })}
            renderRow={(series, _, update) => (
              <div className="space-y-1">
                <div className="flex gap-1">
                  <div className="flex-1">
                    <TextInput label="名称" value={series.name} onChange={(v) => update({ ...series, name: v })} />
                  </div>
                  <div className="w-16">
                    <SelectInput label="类型" value={series.seriesType} options={['bar', 'line']} onChange={(v) => update({ ...series, seriesType: v })} />
                  </div>
                  <div className="w-16">
                    <SelectInput label="Y轴" value={String(series.yAxisIndex ?? 0)} options={['0', '1']} onChange={(v) => update({ ...series, yAxisIndex: Number(v) as 0 | 1 })} />
                  </div>
                </div>
                <TextInput
                  label="数据 (逗号分隔)"
                  value={series.data.join(', ')}
                  onChange={(v) => update({ ...series, data: v.split(',').map((s) => Number(s.trim()) || 0) })}
                />
              </div>
            )}
          />
        </Section>
      )}

      {data.chartType === 'scatter' && (
        <Section title="散点图数据">
          <div className="flex gap-1">
            <div className="flex-1">
              <TextInput label="X轴名称" value={data.scatterXAxis ?? ''} onChange={(v) => onChange({ ...data, scatterXAxis: v })} />
            </div>
            <div className="flex-1">
              <TextInput label="Y轴名称" value={data.scatterYAxis ?? ''} onChange={(v) => onChange({ ...data, scatterYAxis: v })} />
            </div>
          </div>
          <ArrayEditor
            items={data.scatterSeries ?? []}
            onChange={(scatterSeries) => onChange({ ...data, scatterSeries })}
            createDefault={() => ({ name: '系列', data: [[50, 50]] as [number, number][] })}
            renderRow={(series, _, update) => (
              <div className="space-y-1">
                <TextInput label="名称" value={series.name} onChange={(v) => update({ ...series, name: v })} />
                <TextInput
                  label="数据点 (x,y 每组用分号分隔)"
                  value={series.data.map((d) => d.slice(0, 2).join(',')).join('; ')}
                  onChange={(v) => update({
                    ...series,
                    data: v.split(';').map((pair) => {
                      const [x, y] = pair.split(',').map((s) => Number(s.trim()) || 0)
                      return [x, y] as [number, number]
                    }),
                  })}
                />
              </div>
            )}
          />
        </Section>
      )}

      {data.chartType === 'gauge' && (
        <Section title="仪表盘数据">
          <NumberInput label="当前值" value={data.gaugeData?.value ?? 0} onChange={(v) => onChange({ ...data, gaugeData: { ...data.gaugeData!, value: v } })} />
          <NumberInput label="最大值" value={data.gaugeData?.max ?? 100} onChange={(v) => onChange({ ...data, gaugeData: { ...data.gaugeData!, max: v } })} />
          <TextInput label="名称" value={data.gaugeData?.name ?? ''} onChange={(v) => onChange({ ...data, gaugeData: { ...data.gaugeData!, name: v } })} />
        </Section>
      )}
    </div>
  )
}

// ─── Engine Editors ───

function GridItemEditor({ data, onChange, commonFields, fontSizeFields, colorFields }: { data: GridItemSlideData; onChange: (d: SlideData) => void; commonFields: React.ReactNode; fontSizeFields?: React.ReactNode; colorFields?: React.ReactNode }) {
  return (
    <div className="space-y-3">
      {commonFields}
      {fontSizeFields}
      {colorFields}
      <Section title="网格配置">
        <NumberInput label="列数" value={data.columns ?? 0} onChange={(v) => onChange({ ...data, columns: v || undefined })} min={0} max={6} />
        <NumberInput label="间距 (px)" value={data.gap ?? 16} onChange={(v) => onChange({ ...data, gap: v })} min={0} max={64} step={2} />
      </Section>
      <Section title="项目">
        <ArrayEditor
          items={data.items}
          onChange={(items) => onChange({ ...data, items })}
          createDefault={() => ({ title: '新项目', description: '描述' })}
          renderRow={(item, _, update) => (
            <div className="space-y-1">
              <TextInput label="标题" value={item.title} onChange={(v) => update({ ...item, title: v })} />
              <TextInput label="描述" value={item.description ?? ''} onChange={(v) => update({ ...item, description: v })} />
              <TextInput label="数值" value={item.value ?? ''} onChange={(v) => update({ ...item, value: v })} />
            </div>
          )}
        />
      </Section>
    </div>
  )
}

function SequenceEditor({ data, onChange, commonFields, fontSizeFields, colorFields }: { data: SequenceSlideData; onChange: (d: SlideData) => void; commonFields: React.ReactNode; fontSizeFields?: React.ReactNode; colorFields?: React.ReactNode }) {
  return (
    <div className="space-y-3">
      {commonFields}
      {fontSizeFields}
      {colorFields}
      <Section title="序列配置">
        <SelectInput label="方向" value={data.direction ?? 'horizontal'} options={['horizontal', 'vertical']} onChange={(v) => onChange({ ...data, direction: v })} />
        <NumberInput label="间距 (px)" value={data.gap ?? 8} onChange={(v) => onChange({ ...data, gap: v })} min={0} max={64} step={2} />
      </Section>
      <Section title="步骤">
        <ArrayEditor
          items={data.steps}
          onChange={(steps) => onChange({ ...data, steps })}
          createDefault={() => ({ label: '新步骤', description: '描述' })}
          renderRow={(step, _, update) => (
            <div className="space-y-1">
              <TextInput label="标签" value={step.label} onChange={(v) => update({ ...step, label: v })} />
              <TextInput label="描述" value={step.description ?? ''} onChange={(v) => update({ ...step, description: v })} />
            </div>
          )}
        />
      </Section>
    </div>
  )
}

function CompareEditor({ data, onChange, commonFields, fontSizeFields, colorFields }: { data: CompareSlideData; onChange: (d: SlideData) => void; commonFields: React.ReactNode; fontSizeFields?: React.ReactNode; colorFields?: React.ReactNode }) {
  return (
    <div className="space-y-3">
      {commonFields}
      {fontSizeFields}
      {colorFields}
      {data.mode === 'versus' && data.sides && (
        <Section title="对比方">
          <ArrayEditor
            items={data.sides}
            onChange={(sides) => onChange({ ...data, sides })}
            createDefault={() => ({ name: '方案', items: [{ label: '特性', value: '值' }] })}
            minItems={2}
            renderRow={(side, _, update) => (
              <div className="space-y-1">
                <TextInput label="名称" value={side.name} onChange={(v) => update({ ...side, name: v })} />
                <ArrayEditor
                  items={side.items}
                  onChange={(items) => update({ ...side, items })}
                  createDefault={() => ({ label: '特性', value: '值' })}
                  renderRow={(item, __, updateItem) => (
                    <div className="flex gap-1">
                      <div className="flex-1"><TextInput label="标签" value={item.label} onChange={(v) => updateItem({ ...item, label: v })} /></div>
                      <div className="flex-1"><TextInput label="值" value={item.value} onChange={(v) => updateItem({ ...item, value: v })} /></div>
                    </div>
                  )}
                />
              </div>
            )}
          />
        </Section>
      )}
      {data.mode === 'quadrant' && (
        <Section title="象限">
          <TextInput label="X轴" value={data.xAxis ?? ''} onChange={(v) => onChange({ ...data, xAxis: v })} />
          <TextInput label="Y轴" value={data.yAxis ?? ''} onChange={(v) => onChange({ ...data, yAxis: v })} />
          <ArrayEditor
            items={data.quadrantItems ?? []}
            onChange={(quadrantItems) => onChange({ ...data, quadrantItems })}
            createDefault={() => ({ label: '项目', x: 50, y: 50 })}
            renderRow={(item, _, update) => (
              <div className="flex gap-1 items-end">
                <div className="flex-1"><TextInput label="标签" value={item.label} onChange={(v) => update({ ...item, label: v })} /></div>
                <div className="w-16"><NumberInput label="X" value={item.x} onChange={(v) => update({ ...item, x: v })} min={0} max={100} /></div>
                <div className="w-16"><NumberInput label="Y" value={item.y} onChange={(v) => update({ ...item, y: v })} min={0} max={100} /></div>
              </div>
            )}
          />
        </Section>
      )}
      {data.mode === 'iceberg' && (
        <Section title="冰山">
          <ArrayEditor
            items={data.visible ?? []}
            onChange={(visible) => onChange({ ...data, visible })}
            createDefault={() => ({ label: '可见项' })}
            label="可见部分"
            renderRow={(item, _, update) => (
              <TextInput label="标签" value={item.label} onChange={(v) => update({ ...item, label: v })} />
            )}
          />
          <ArrayEditor
            items={data.hidden ?? []}
            onChange={(hidden) => onChange({ ...data, hidden })}
            createDefault={() => ({ label: '隐藏项' })}
            label="隐藏部分"
            renderRow={(item, _, update) => (
              <TextInput label="标签" value={item.label} onChange={(v) => update({ ...item, label: v })} />
            )}
          />
        </Section>
      )}
    </div>
  )
}

function FunnelEditor({ data, onChange, commonFields, fontSizeFields, colorFields }: { data: FunnelSlideData; onChange: (d: SlideData) => void; commonFields: React.ReactNode; fontSizeFields?: React.ReactNode; colorFields?: React.ReactNode }) {
  return (
    <div className="space-y-3">
      {commonFields}
      {fontSizeFields}
      {colorFields}
      <Section title="层级">
        <ArrayEditor
          items={data.layers}
          onChange={(layers) => onChange({ ...data, layers })}
          createDefault={() => ({ label: '新层', description: '描述' })}
          renderRow={(layer, _, update) => (
            <div className="space-y-1">
              <TextInput label="标签" value={layer.label} onChange={(v) => update({ ...layer, label: v })} />
              <TextInput label="描述" value={layer.description ?? ''} onChange={(v) => update({ ...layer, description: v })} />
              <NumberInput label="数值" value={layer.value ?? 0} onChange={(v) => update({ ...layer, value: v })} />
            </div>
          )}
        />
      </Section>
    </div>
  )
}

function ConcentricEditor({ data, onChange, commonFields, fontSizeFields, colorFields }: { data: ConcentricSlideData; onChange: (d: SlideData) => void; commonFields: React.ReactNode; fontSizeFields?: React.ReactNode; colorFields?: React.ReactNode }) {
  return (
    <div className="space-y-3">
      {commonFields}
      {fontSizeFields}
      {colorFields}
      <Section title="环">
        <ArrayEditor
          items={data.rings}
          onChange={(rings) => onChange({ ...data, rings })}
          createDefault={() => ({ label: '新环', description: '描述' })}
          renderRow={(ring, _, update) => (
            <div className="space-y-1">
              <TextInput label="标签" value={ring.label} onChange={(v) => update({ ...ring, label: v })} />
              <TextInput label="描述" value={ring.description ?? ''} onChange={(v) => update({ ...ring, description: v })} />
            </div>
          )}
        />
      </Section>
    </div>
  )
}

function HubSpokeEditor({ data, onChange, commonFields, fontSizeFields, colorFields }: { data: HubSpokeSlideData; onChange: (d: SlideData) => void; commonFields: React.ReactNode; fontSizeFields?: React.ReactNode; colorFields?: React.ReactNode }) {
  return (
    <div className="space-y-3">
      {commonFields}
      {fontSizeFields}
      {colorFields}
      <Section title="中心">
        <TextInput label="标签" value={data.center.label} onChange={(v) => onChange({ ...data, center: { ...data.center, label: v } })} />
        <TextInput label="描述" value={data.center.description ?? ''} onChange={(v) => onChange({ ...data, center: { ...data.center, description: v } })} />
      </Section>
      <Section title="辐条">
        <ArrayEditor
          items={data.spokes}
          onChange={(spokes) => onChange({ ...data, spokes })}
          createDefault={() => ({ label: '新辐条', description: '描述' })}
          renderRow={(spoke, _, update) => (
            <div className="space-y-1">
              <TextInput label="标签" value={spoke.label} onChange={(v) => update({ ...spoke, label: v })} />
              <TextInput label="描述" value={spoke.description ?? ''} onChange={(v) => update({ ...spoke, description: v })} />
            </div>
          )}
        />
      </Section>
    </div>
  )
}

function VennEditor({ data, onChange, commonFields, fontSizeFields, colorFields }: { data: VennSlideData; onChange: (d: SlideData) => void; commonFields: React.ReactNode; fontSizeFields?: React.ReactNode; colorFields?: React.ReactNode }) {
  return (
    <div className="space-y-3">
      {commonFields}
      {fontSizeFields}
      {colorFields}
      <Section title="韦恩图配置">
        <TextInput label="交集标签" value={data.intersectionLabel ?? ''} onChange={(v) => onChange({ ...data, intersectionLabel: v })} />
      </Section>
      <Section title="集合">
        <ArrayEditor
          items={data.sets}
          onChange={(sets) => onChange({ ...data, sets })}
          createDefault={() => ({ label: '新集合', description: '描述' })}
          minItems={2}
          renderRow={(set, _, update) => (
            <div className="space-y-1">
              <TextInput label="标签" value={set.label} onChange={(v) => update({ ...set, label: v })} />
              <TextInput label="描述" value={set.description ?? ''} onChange={(v) => update({ ...set, description: v })} />
            </div>
          )}
        />
      </Section>
    </div>
  )
}
