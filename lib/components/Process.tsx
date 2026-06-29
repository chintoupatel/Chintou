'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DESIGN_TOKENS } from '@/lib/config/designTokens'
import { useParallax } from '@/lib/hooks/useParallax'
import { useMediaQuery } from '@/lib/hooks'
import { SectionShell } from '@/lib/ui/SectionShell'

gsap.registerPlugin(ScrollTrigger)

const { typography, colors, fonts, spacing } = DESIGN_TOKENS

// Layout rework: each box steps down to the right for diagonal rhythm,
// and a hard-offset shadow gives static depth against the thick border.
const STAGGER_STEP = 110
const HARD_SHADOW = `9px 9px 0 ${colors.borderAlt}`
const INDEX_SIZE = '52px'

const boxes = [
  {
    title: 'What I look for',
    description:
      'Where people hesitate, repeat themselves, ask for help, abandon the task, or use a workaround. Those moments usually reveal the real design problem.',
  },
  {
    title: 'What I avoid',
    description:
      'Pretty screens with no argument. If I cannot explain the user need, the tradeoff, and the expected effect, the design is not ready.',
  },
  {
    title: 'What I bring',
    description:
      'Curiosity without ego. I am comfortable saying I do not know yet. I am also comfortable going to find out.',
  },
]

export function Process() {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  // Parallax drift — title floats vertically as the section scrolls past.
  const titleRef = useParallax<HTMLHeadingElement>({ distance: 120 })
  const rowRef = useRef<HTMLDivElement>(null)

  // Boxes rise + fade in, staggered, when the row scrolls into view.
  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.set(row.children, { opacity: 0, y: 90, scale: 0.92, rotateX: 12 })
      gsap.to(row.children, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        transformOrigin: 'center top',
        duration: 1.8,
        ease: 'power4.out',
        stagger: 0.4,
        scrollTrigger: { trigger: row, start: 'top 80%', toggleActions: 'play none none reverse' },
      })
    }, row)

    return () => ctx.revert()
  }, [])

  return (
    <SectionShell isMobile={isMobile} background={colors.background}>
      <h2
        ref={titleRef}
        style={{
          fontFamily: fonts.display,
          fontSize: 'clamp(48px, 12vw, 96px)',
          fontWeight: 700,
          lineHeight: 1,
          color: colors.text,
          textAlign: 'left',
          margin: isMobile ? '0 0 40px' : `0 0 ${spacing.xxlargeGap}`,
          willChange: 'transform',
        }}
      >
        My Process
      </h2>

      <div
        ref={rowRef}
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'stretch',
          gap: spacing.largeGap,
          perspective: '1200px',
        }}
      >
        {boxes.map((box, i) => (
          <div
            key={box.title}
            style={{
              // Mobile: size to content (was flex:1 1 0 + fixed minHeight,
              // which capped height and let long text spill past the border).
              // Desktop keeps equal-height row cards.
              flex: isMobile ? '0 0 auto' : '1 1 0',
              // Leave room on mobile for the 9px hard shadow so the card +
              // shadow don't spill past the viewport edge (was clipping right).
              maxWidth: isMobile ? 'calc(100% - 12px)' : '360px',
              minHeight: isMobile ? 'auto' : '340px',
              marginTop: isMobile ? '0px' : `${i * STAGGER_STEP}px`,
              border: `5px solid ${colors.text}`,
              boxShadow: HARD_SHADOW,
              background: colors.background,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: isMobile ? spacing.mediumGap : undefined,
              padding: spacing.largeGap,
            }}
          >
            <span
              style={{
                fontFamily: fonts.display,
                fontSize: INDEX_SIZE,
                fontWeight: typography.processTitle.fontWeight,
                lineHeight: 1,
                color: colors.textMuted,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            <div>
              <h3
                style={{
                  fontFamily: fonts.display,
                  fontSize: typography.processBoxTitle.fontSize,
                  fontWeight: typography.processBoxTitle.fontWeight,
                  letterSpacing: typography.processBoxTitle.letterSpacing,
                  textDecoration: typography.processBoxTitle.textDecoration,
                  textUnderlineOffset: typography.processBoxTitle.textDecorationOffset,
                  color: colors.text,
                  margin: `0 0 ${spacing.mediumGap}`,
                }}
              >
                {box.title}
              </h3>
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: typography.processBoxText.fontSize,
                  fontWeight: typography.processBoxText.fontWeight,
                  lineHeight: typography.processBoxText.lineHeight,
                  letterSpacing: typography.processBoxText.letterSpacing,
                  color: colors.textSecondary,
                  margin: 0,
                }}
              >
                {box.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
