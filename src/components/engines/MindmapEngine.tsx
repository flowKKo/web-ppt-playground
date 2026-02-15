import { motion } from 'framer-motion'
import type { MindmapSlideData, MindmapNode } from '../../data/types'
import { colors, motionConfig, generateGradientColors } from '../../theme/swiss'
import EngineTitle from './shared/EngineTitle'

const VB_W = 800
const VB_H = 480

interface LayoutNode {
  label: string
  x: number
  y: number
  depth: number
  branchIndex: number
  parent?: LayoutNode
  children: LayoutNode[]
}

function layoutTree(root: MindmapNode): LayoutNode[] {
  const nodes: LayoutNode[] = []
  const branches = root.children?.length ?? 0
  if (branches === 0) {
    nodes.push({ label: root.label, x: VB_W / 2, y: VB_H / 2, depth: 0, branchIndex: 0, children: [] })
    return nodes
  }

  const rootNode: LayoutNode = { label: root.label, x: VB_W / 2, y: VB_H / 2, depth: 0, branchIndex: 0, children: [] }
  nodes.push(rootNode)

  // Split branches into left and right sides
  const half = Math.ceil(branches / 2)
  const leftBranches = root.children!.slice(0, half)
  const rightBranches = root.children!.slice(half)

  const xSpread1 = 200 // depth 1 distance from center
  const xSpread2 = 150 // depth 2 additional distance

  function layoutSide(branchList: MindmapNode[], side: 'left' | 'right', parent: LayoutNode) {
    const count = branchList.length
    const totalHeight = Math.min(count * 80, VB_H - 80)
    const startY = VB_H / 2 - totalHeight / 2

    branchList.forEach((branch, bi) => {
      const globalBi = side === 'left' ? bi : half + bi
      const y1 = startY + (count === 1 ? totalHeight / 2 : bi * (totalHeight / (count - 1)))
      const x1 = side === 'left' ? VB_W / 2 - xSpread1 : VB_W / 2 + xSpread1

      const branchNode: LayoutNode = { label: branch.label, x: x1, y: y1, depth: 1, branchIndex: globalBi, parent, children: [] }
      parent.children.push(branchNode)
      nodes.push(branchNode)

      // Level 2 children
      if (branch.children) {
        const childCount = branch.children.length
        const childSpread = Math.min(childCount * 40, 140)
        const childStartY = y1 - childSpread / 2

        branch.children.forEach((child, ci) => {
          const y2 = childStartY + (childCount === 1 ? childSpread / 2 : ci * (childSpread / (childCount - 1)))
          const x2 = side === 'left' ? x1 - xSpread2 : x1 + xSpread2

          const childNode: LayoutNode = { label: child.label, x: x2, y: y2, depth: 2, branchIndex: globalBi, parent: branchNode, children: [] }
          branchNode.children.push(childNode)
          nodes.push(childNode)
        })
      }
    })
  }

  layoutSide(leftBranches, 'left', rootNode)
  layoutSide(rightBranches, 'right', rootNode)

  return nodes
}

export function MindmapDiagram({ root, textColor, colorPalette }: { root: MindmapSlideData['root']; textColor?: string; colorPalette?: string }) {
  const branches = root.children?.length ?? 0
  const palette = generateGradientColors(Math.max(branches, 1), colorPalette)
  const nodes = layoutTree(root)

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet">
      {/* Connections */}
      {nodes.filter(n => n.parent).map((n, i) => {
        const p = n.parent!
        const color = palette[n.branchIndex % palette.length]
        // Cubic bezier for organic curves
        const mx = (p.x + n.x) / 2
        return (
          <path
            key={`c-${i}`}
            d={`M ${p.x} ${p.y} C ${mx} ${p.y}, ${mx} ${n.y}, ${n.x} ${n.y}`}
            fill="none"
            stroke={color}
            strokeWidth={n.depth === 1 ? 3 : 2}
            opacity={n.depth === 1 ? 0.5 : 0.3}
          />
        )
      })}

      {/* Nodes */}
      {nodes.map((n, i) => {
        const color = n.depth === 0 ? palette[0] : palette[n.branchIndex % palette.length]
        const isRoot = n.depth === 0

        if (isRoot) {
          const w = Math.min(n.label.length * 16 + 32, 180)
          return (
            <g key={i}>
              <rect x={n.x - w / 2} y={n.y - 22} width={w} height={44} rx={22} fill={color} />
              <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={16} fontWeight="700" fill="#fff">
                {n.label}
              </text>
            </g>
          )
        }

        const isLeft = n.x < VB_W / 2
        const fontSize = n.depth === 1 ? 14 : 12
        const fontWeight = n.depth === 1 ? 600 : 400

        return (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={4} fill={color} opacity={0.6} />
            <text
              x={n.x + (isLeft ? -10 : 10)}
              y={n.y + 1}
              textAnchor={isLeft ? 'end' : 'start'}
              dominantBaseline="middle"
              fontSize={fontSize}
              fontWeight={fontWeight}
              fill={textColor || colors.textPrimary}
            >
              {n.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function MindmapEngine({ title, body, root, titleSize, bodySize, titleColor, textColor, colorPalette }: MindmapSlideData) {
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
        <MindmapDiagram root={root} textColor={textColor} colorPalette={colorPalette} />
      </motion.div>
    </motion.div>
  )
}
