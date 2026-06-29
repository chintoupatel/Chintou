import { DESIGN_TOKENS } from '@/lib/config/designTokens'

const { colors, fonts, spacing, typography } = DESIGN_TOKENS

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing.smallGap,
        fontFamily: fonts.label,
        fontSize: typography.labelSmall.fontSize,
        fontWeight: typography.labelSmall.fontWeight,
        letterSpacing: typography.labelSmall.letterSpacing,
        textTransform: 'uppercase',
        color: colors.text,
        border: `1.5px solid ${colors.borderAlt}`,
        borderRadius: '999px',
        padding: '6px 14px',
      }}
    >
      <span
        className="pill-dot"
        style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.text, display: 'inline-block' }}
      />
      {children}
    </span>
  )
}
