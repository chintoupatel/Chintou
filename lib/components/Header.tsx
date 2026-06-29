'use client'

import { DESIGN_TOKENS } from '@/lib/config/designTokens'
import { useMediaQuery } from '@/lib/hooks'
import { Button } from '@/lib/ui/Button'

export function Header() {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  return (
    <header
      style={{
        maxWidth: DESIGN_TOKENS.dimensions.container,
        margin: '0 auto',
        padding: isMobile ? '20px 24px' : '34px 64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        // Stack above Hero's decorative backdrop (zIndex 1) so the nav
        // buttons stay hoverable/clickable — the 660px backdrop box was
        // overlapping the header's right side and stealing pointer events.
        position: 'relative',
        zIndex: 10,
      }}
    >
      <a
        href="#top"
        data-reveal-up
        style={{
          fontSize: DESIGN_TOKENS.typography.header.fontSize,
          fontWeight: DESIGN_TOKENS.typography.header.fontWeight,
          fontStyle: DESIGN_TOKENS.typography.header.fontStyle,
          letterSpacing: DESIGN_TOKENS.typography.header.letterSpacing,
          lineHeight: DESIGN_TOKENS.typography.header.lineHeight,
          color: DESIGN_TOKENS.colors.text,
          textDecoration: 'none',
          fontFamily: DESIGN_TOKENS.fonts.logo,
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          position:'relative', left: isMobile ? '0px' : '-100px',
          animationDelay: '0.05s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.6'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
      >
        Chintou
      </a>
      <nav
        style={{
          display: 'flex',
          gap: DESIGN_TOKENS.spacing.mediumGap,
          flexWrap: 'nowrap',
          flexShrink: 0,
          justifyContent: 'flex-end',
        }}
      >
        <Button as="a" variant="bordered" href="#connect">
          Connect
        </Button>
        <Button as="a" variant="bordered" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
          Resume
        </Button>
      </nav>
    </header>
  )
}
