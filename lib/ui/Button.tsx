'use client'

import { DESIGN_TOKENS } from '@/lib/config/designTokens'

const { colors, fonts, typography, spacing, motion } = DESIGN_TOKENS

// Shared props for anchor rendering
type AnchorProps = {
  as: 'a'
  href: string
  target?: string
  rel?: string
  children: React.ReactNode
}

type BorderedProps = AnchorProps & { variant: 'bordered' }
type SolidProps = AnchorProps & { variant: 'solid' }

export type ButtonProps = BorderedProps | SolidProps

export function Button(props: ButtonProps) {
  const { variant, href, target, rel, children } = props

  if (variant === 'bordered') {
    return (
      <a
        className="btn"
        href={href}
        target={target}
        rel={rel}
        style={{
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
        }}
      >
        {children}
      </a>
    )
  }

  // variant === 'solid'
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      style={{
        alignSelf: 'flex-start',
        fontFamily: fonts.label,
        fontSize: typography.label.fontSize,
        fontWeight: typography.label.fontWeight,
        letterSpacing: typography.label.letterSpacing,
        textTransform: 'uppercase',
        color: colors.darkText,
        background: colors.text,
        border: `2px solid ${colors.text}`,
        padding: '16px 32px',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing.smallGap,
        textDecoration: 'none',
        transition: `transform ${motion.base} ${motion.easeStandard}, box-shadow ${motion.base} ${motion.easeStandard}, background ${motion.base} ${motion.easeStandard}, color ${motion.base} ${motion.easeStandard}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translate(-3px, -3px)'
        e.currentTarget.style.boxShadow = `6px 6px 0 ${colors.borderAlt}`
        e.currentTarget.style.background = colors.background
        e.currentTarget.style.color = colors.text
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.background = colors.text
        e.currentTarget.style.color = colors.darkText
      }}
    >
      {children}
    </a>
  )
}
