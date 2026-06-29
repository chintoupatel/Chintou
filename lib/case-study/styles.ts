import { DESIGN_TOKENS } from '@/lib/config/designTokens'

const { colors, fonts } = DESIGN_TOKENS

// ─── base styles ─────────────────────────────────────────────────────────
export const D = (size: string, weight = 700, color: string = colors.text) => ({
  fontFamily: fonts.display,
  fontSize: size,
  fontWeight: weight,
  lineHeight: 1.12,
  color,
  margin: 0,
})

export const B = (size = '18px', color: string = colors.textSecondary) => ({
  fontFamily: fonts.body,
  fontSize: size,
  fontWeight: 400,
  lineHeight: 1.8,
  color,
  margin: 0,
})

export const LABEL = {
  fontFamily: fonts.label,
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  color: colors.textMuted,
}
