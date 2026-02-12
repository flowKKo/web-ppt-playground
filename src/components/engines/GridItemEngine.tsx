import { motion } from 'framer-motion'
import type { GridItemSlideData, GridItemEntry } from '../../data/types'
import { colors, motionConfig, generateGradientColors } from '../../theme/swiss'
import EngineTitle from './shared/EngineTitle'
import EditableText from '../editor/EditableText'

const colorMap: Record<string, string> = {
  positive: colors.accentPositive,
  negative: colors.accentNegative,
  neutral: colors.accentNeutral,
}

function getColumns(count: number, override?: number): number {
  if (override) return override
  if (count <= 3) return count
  if (count <= 6) return 3
  return 4
}

function CardContent({ item, index }: { item: GridItemEntry; index: number }) {
  return (
    <>
      {item.value && (
        <EditableText
          value={item.value}
          field={`items.${index}.value`}
          as="div"
          className="text-3xl font-extrabold mb-1"
          style={{ color: item.valueColor ? colorMap[item.valueColor] : colors.accentNeutral }}
        />
      )}
      <EditableText
        value={item.title}
        field={`items.${index}.title`}
        as="div"
        className="text-base font-semibold"
        style={{ color: colors.textPrimary }}
      />
      {item.description && (
        <EditableText
          value={item.description}
          field={`items.${index}.description`}
          as="div"
          className="text-sm mt-1"
          style={{ color: colors.textSecondary }}
        />
      )}
    </>
  )
}

function SolidCard({ item, index }: { item: GridItemEntry; index: number }) {
  return (
    <motion.div
      variants={motionConfig.child}
      className="rounded-xl p-5"
      style={{ background: colors.card, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
    >
      <CardContent item={item} index={index} />
    </motion.div>
  )
}

function OutlineCard({ item, index }: { item: GridItemEntry; index: number }) {
  return (
    <motion.div
      variants={motionConfig.child}
      className="rounded-xl p-5"
      style={{ border: `2px solid ${colors.border}` }}
    >
      <CardContent item={item} index={index} />
    </motion.div>
  )
}

function SidelineCard({ item, index, color }: { item: GridItemEntry; index: number; color: string }) {
  return (
    <motion.div
      variants={motionConfig.child}
      className="rounded-lg p-5"
      style={{ borderLeft: `4px solid ${color}`, background: colors.card }}
    >
      <CardContent item={item} index={index} />
    </motion.div>
  )
}

function ToplineCard({ item, index, color }: { item: GridItemEntry; index: number; color: string }) {
  return (
    <motion.div
      variants={motionConfig.child}
      className="rounded-lg p-5"
      style={{ borderTop: `4px solid ${color}`, background: colors.card }}
    >
      <CardContent item={item} index={index} />
    </motion.div>
  )
}

function TopCircleCard({ item, index, color }: { item: GridItemEntry; index: number; color: string }) {
  return (
    <motion.div variants={motionConfig.child} className="flex flex-col items-center text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3"
        style={{ backgroundColor: color }}
      >
        {index + 1}
      </div>
      <CardContent item={item} index={index} />
    </motion.div>
  )
}

export default function GridItemEngine({ title, body, items, variant, columns }: GridItemSlideData) {
  const cols = getColumns(items.length, columns)
  const palette = generateGradientColors(items.length)

  return (
    <motion.div
      className="flex flex-col gap-6 h-full justify-center"
      variants={motionConfig.stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <EngineTitle title={title} body={body} />
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {items.map((item, i) => {
          switch (variant) {
            case 'outline':
              return <OutlineCard key={i} item={item} index={i} />
            case 'sideline':
              return <SidelineCard key={i} item={item} index={i} color={palette[i]} />
            case 'topline':
              return <ToplineCard key={i} item={item} index={i} color={palette[i]} />
            case 'top-circle':
              return <TopCircleCard key={i} item={item} index={i} color={palette[i]} />
            default: // solid + all others fallback
              return <SolidCard key={i} item={item} index={i} />
          }
        })}
      </div>
    </motion.div>
  )
}
