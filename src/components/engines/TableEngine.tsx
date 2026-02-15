import { motion } from 'framer-motion'
import type { TableSlideData } from '../../data/types'
import { colors, motionConfig, generateGradientColors } from '../../theme/swiss'
import EngineTitle from './shared/EngineTitle'

export function TableDiagram({ headers, rows, variant, textColor, colorPalette }: { headers: TableSlideData['headers']; rows: TableSlideData['rows']; variant: TableSlideData['variant']; textColor?: string; colorPalette?: string }) {
  const palette = generateGradientColors(headers.length, colorPalette)
  const isBordered = variant === 'bordered'
  const isStriped = variant === 'striped'
  const isHighlight = variant === 'highlight'

  return (
    <div className="w-full h-full overflow-auto flex items-start justify-center p-2">
      <table className="w-full border-collapse" style={{ maxWidth: 760, color: textColor || colors.textPrimary }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-sm font-bold"
                style={{
                  backgroundColor: palette[i % palette.length],
                  color: '#fff',
                  borderRight: isBordered && i < headers.length - 1 ? '1px solid rgba(255,255,255,0.3)' : undefined,
                  borderRadius: i === 0 ? '8px 0 0 0' : i === headers.length - 1 ? '0 8px 0 0' : undefined,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const isEvenRow = ri % 2 === 0
            const rowHighlight = isHighlight && row.highlight
            let bg = 'transparent'
            if (rowHighlight) bg = `${palette[0]}18`
            else if (isStriped && isEvenRow) bg = `${colors.textCaption}08`

            return (
              <tr key={ri} style={{ backgroundColor: bg }}>
                {row.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-4 py-2.5 text-sm"
                    style={{
                      borderBottom: `1px solid ${colors.border}`,
                      borderRight: isBordered && ci < row.cells.length - 1 ? `1px solid ${colors.border}` : undefined,
                      borderLeft: isBordered && ci === 0 ? `1px solid ${colors.border}` : undefined,
                      fontWeight: rowHighlight ? 600 : 400,
                      color: rowHighlight ? palette[0] : textColor || colors.textPrimary,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function TableEngine({ title, body, headers, rows, variant, titleSize, bodySize, titleColor, textColor, colorPalette }: TableSlideData) {
  return (
    <motion.div
      className="flex flex-col gap-4 h-full"
      variants={motionConfig.stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <EngineTitle title={title} body={body} titleSize={titleSize} bodySize={bodySize} titleColor={titleColor} textColor={textColor} />
      <motion.div variants={motionConfig.child} className="flex-1 min-h-0 w-full">
        <TableDiagram headers={headers} rows={rows} variant={variant} textColor={textColor} colorPalette={colorPalette} />
      </motion.div>
    </motion.div>
  )
}
