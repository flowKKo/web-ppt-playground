export const colors = {
  page: '#EEEEE8',
  slide: '#F5F5F0',
  card: '#FFFFFF',
  textPrimary: '#333333',
  textSecondary: '#757575',
  textCaption: '#9E9E9E',
  accentPositive: '#4CAF50',
  accentNegative: '#E57373',
  accentNeutral: '#546E7A',
  border: 'rgba(0,0,0,0.06)',
  barTrack: '#F0F0EA',
}

export const cardStyle = {
  background: colors.card,
  border: `1px solid ${colors.border}`,
  boxShadow: '0 10px 20px rgba(0,0,0,0.04)',
}

export const echartsTheme = {
  color: ['#546E7A', '#4CAF50', '#E57373', '#78909C', '#81C784', '#EF9A9A'],
  backgroundColor: 'transparent',
  textStyle: {
    color: '#333333',
    fontFamily: 'Inter, HarmonyOS Sans, Source Han Sans, sans-serif',
  },
  categoryAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { color: '#757575', fontSize: 14 },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { show: false },
  },
  bar: {
    itemStyle: { borderRadius: [6, 6, 0, 0] },
    barMaxWidth: 60,
  },
}

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

export const motionConfig = {
  slide: {
    initial: { opacity: 0, y: 20 } as const,
    whileInView: { opacity: 1, y: 0 } as const,
    viewport: { once: true, amount: 0.15 } as const,
    transition: { duration: 0.6, ease },
  },
  stagger: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  },
  child: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  },
}
