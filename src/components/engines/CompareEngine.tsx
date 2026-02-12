import { motion } from 'framer-motion'
import type { CompareSlideData } from '../../data/types'
import { colors, motionConfig, generateGradientColors } from '../../theme/swiss'
import EngineTitle from './shared/EngineTitle'
import EditableText from '../editor/EditableText'

function VersusMode({ sides }: { sides: CompareSlideData['sides'] }) {
  if (!sides || sides.length < 2) return null
  const palette = generateGradientColors(sides.length)
  return (
    <div className="grid grid-cols-2 gap-6 flex-1">
      {sides.map((side, si) => (
        <motion.div key={si} variants={motionConfig.child} className="rounded-xl p-5" style={{ background: colors.card, borderTop: `4px solid ${palette[si]}` }}>
          <EditableText value={side.name} field={`sides.${si}.name`} as="div" className="text-lg font-bold mb-4" style={{ color: palette[si] }} />
          <div className="flex flex-col gap-3">
            {side.items.map((item, ii) => (
              <div key={ii} className="flex justify-between items-center py-1" style={{ borderBottom: `1px solid ${colors.border}` }}>
                <EditableText value={item.label} field={`sides.${si}.items.${ii}.label`} as="span" className="text-sm" style={{ color: colors.textSecondary }} />
                <EditableText value={item.value} field={`sides.${si}.items.${ii}.value`} as="span" className="text-sm font-semibold" style={{ color: colors.textPrimary }} />
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function QuadrantMode({ quadrantItems, xAxis, yAxis }: Pick<CompareSlideData, 'quadrantItems' | 'xAxis' | 'yAxis'>) {
  if (!quadrantItems) return null
  const palette = generateGradientColors(quadrantItems.length)
  const pad = 50
  const w = 700
  const h = 400
  const vbW = w + pad * 2
  const vbH = h + pad * 2
  return (
    <motion.div variants={motionConfig.child} className="flex-1 min-h-0 w-full">
      <svg
        width="100%" height="100%"
        viewBox={`0 0 ${vbW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Quadrant background tints */}
        <rect x={pad + w / 2} y={pad} width={w / 2} height={h / 2} fill={colors.accentPositive} opacity={0.03} />
        <rect x={pad} y={pad} width={w / 2} height={h / 2} fill={colors.accentNeutral} opacity={0.03} />
        {/* Axes */}
        <line x1={pad} y1={pad + h / 2} x2={pad + w} y2={pad + h / 2} stroke={colors.textCaption} strokeWidth="1.5" />
        <line x1={pad + w / 2} y1={pad} x2={pad + w / 2} y2={pad + h} stroke={colors.textCaption} strokeWidth="1.5" />
        {/* Axis labels */}
        {xAxis && <text x={pad + w - 4} y={pad + h / 2 + 24} textAnchor="end" fontSize="14" fontWeight="500" fill={colors.textSecondary}>{xAxis}</text>}
        {yAxis && <text x={pad + w / 2 + 10} y={pad + 16} fontSize="14" fontWeight="500" fill={colors.textSecondary}>{yAxis}</text>}
        {/* Points */}
        {quadrantItems.map((item, i) => {
          const cx = pad + (item.x / 100) * w
          const cy = pad + h - (item.y / 100) * h
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={11} fill={palette[i]} opacity={0.88} />
              <text x={cx} y={cy - 18} textAnchor="middle" fontSize="14" fontWeight="600" fill={colors.textPrimary}>{item.label}</text>
            </g>
          )
        })}
      </svg>
    </motion.div>
  )
}

function IcebergMode({ visible, hidden }: Pick<CompareSlideData, 'visible' | 'hidden'>) {
  return (
    <motion.div variants={motionConfig.child} className="flex flex-col flex-1 gap-0 overflow-hidden rounded-xl">
      {/* above water */}
      <div className="p-5 flex flex-col gap-2" style={{ background: `${colors.accentPositive}18` }}>
        <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: colors.accentPositive }}>Visible</div>
        {visible?.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accentPositive }} />
            <EditableText value={item.label} field={`visible.${i}.label`} as="span" className="text-sm font-medium" style={{ color: colors.textPrimary }} />
            {item.description && (
              <>
                <span className="text-xs" style={{ color: colors.textSecondary }}>&mdash;</span>
                <EditableText value={item.description} field={`visible.${i}.description`} as="span" className="text-xs" style={{ color: colors.textSecondary }} />
              </>
            )}
          </div>
        ))}
      </div>
      {/* waterline */}
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${colors.accentNeutral}44, ${colors.accentNeutral}, ${colors.accentNeutral}44)` }} />
      {/* below water */}
      <div className="p-5 flex flex-col gap-2 flex-1" style={{ background: `${colors.accentNeutral}12` }}>
        <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: colors.accentNeutral }}>Hidden</div>
        {hidden?.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accentNeutral }} />
            <EditableText value={item.label} field={`hidden.${i}.label`} as="span" className="text-sm font-medium" style={{ color: colors.textPrimary }} />
            {item.description && (
              <>
                <span className="text-xs" style={{ color: colors.textSecondary }}>&mdash;</span>
                <EditableText value={item.description} field={`hidden.${i}.description`} as="span" className="text-xs" style={{ color: colors.textSecondary }} />
              </>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function CompareEngine(props: CompareSlideData) {
  const { title, body, mode } = props

  return (
    <motion.div
      className="flex flex-col gap-6 h-full justify-center"
      variants={motionConfig.stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <EngineTitle title={title} body={body} />
      {mode === 'versus' && <VersusMode sides={props.sides} />}
      {mode === 'quadrant' && <QuadrantMode quadrantItems={props.quadrantItems} xAxis={props.xAxis} yAxis={props.yAxis} />}
      {mode === 'iceberg' && <IcebergMode visible={props.visible} hidden={props.hidden} />}
    </motion.div>
  )
}
