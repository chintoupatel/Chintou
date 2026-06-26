'use client'

import { DESIGN_TOKENS } from '@/lib/config/designTokens'

const { fonts, colors } = DESIGN_TOKENS

type SectionLabelProps = {
  /** Label text (rendered uppercase) */
  children: React.ReactNode
  /** Trailing arrow glyph. Section labels use ↘ (SE); CTA links use ↗ (NE). */
  arrow?: '↘' | '↗' | 'none'
  /** Render element — use 'h2' for a real section heading */
  as?: 'h2' | 'h3' | 'div'
  /** Text color — defaults to muted gray; override per section */
  color?: string
  /** Font size of the label text */
  fontSize?: string
  /** Gap between text and arrow */
  gap?: string
}

export function SectionLabel({
  children,
  arrow = '↘',
  as = 'h2',
  color = colors.textMuted,
  fontSize = '24px',
  gap = '20px',
}: SectionLabelProps) {
  const Tag = as
  return (
    <Tag
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap,
        fontFamily: fonts.label,
        fontSize,
        fontWeight: 500,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color,
        margin: 0,
      }}
    >
      {children}
      {arrow !== 'none' && (
        <span style={{ fontWeight: 400, fontSize: `calc(${fontSize} * 0.85)` }}>{arrow}</span>
      )}
    </Tag>
  )
}
