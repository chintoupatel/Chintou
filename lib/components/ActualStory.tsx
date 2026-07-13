'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DESIGN_TOKENS } from '@/lib/config/designTokens'
import { SectionLabel } from './SectionLabel'
import { useParallax, useMediaQuery } from '@/lib/hooks'

gsap.registerPlugin(ScrollTrigger)

const { typography, dimensions, colors, fonts, images } = DESIGN_TOKENS

const narrative = {
  fontFamily: fonts.body,
  fontSize: typography.darkNarrative.fontSize,
  fontWeight: typography.darkNarrative.fontWeight,
  lineHeight: typography.darkNarrative.lineHeight,
  color: colors.darkText,
} as const

// Bento cell chrome — hairline border, zero radius, matches the mono/serif dark
// system.
const CELL_BORDER = '1px solid rgba(255, 255, 255, 0.12)'
const cell = {
  border: CELL_BORDER,
  background: 'rgba(255, 255, 255, 0.015)',
  padding: '28px',
} as const

// Per-character spans so the typewriter scrub can brighten them one at a time.
// Spaces render as plain (breakable) text nodes so lines wrap between words;
// the char spans themselves never break mid-word.
function TypewriterText({ text }: { text: string }) {
  return (
    <>
      {text.split('').map((ch, i) =>
        ch === ' ' ? (
          <span key={i}> </span>
        ) : (
          <span key={i} data-char>
            {ch}
          </span>
        )
      )}
    </>
  )
}

// Each word sits in an overflow-clip mask; the flip-word scroll effect drives
// the inner span up from below into place. Inline-block words keep normal
// wrapping; the clip hides the pre-flip position.
function FlipWords({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i}>
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
            <span data-flip style={{ display: 'inline-block' }}>
              {word}
            </span>
          </span>{' '}
        </span>
      ))}
    </>
  )
}

export function ActualStory() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const hookRef = useRef<HTMLParagraphElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const middleTextRef = useRef<HTMLParagraphElement>(null)
  const emphasisRef = useRef<HTMLParagraphElement>(null)
  const proofRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const isMobile = useMediaQuery('(max-width: 1024px)')

  // Portrait parallax drift (reuses existing hook)
  const portraitRef = useParallax<HTMLDivElement>({ distance: 50, scrub: 2 })

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // JSX ships things hidden/dim expecting GSAP to reveal them. Force the
      // resting state so reduced-motion users see the finished layout.
      gsap.set([labelRef.current, proofRef.current, ctaRef.current].filter(Boolean), {
        opacity: 1,
        y: 0,
      })
      section.querySelectorAll('[data-char]').forEach((c) => {
        ;(c as HTMLElement).style.color = colors.darkText
      })
      gsap.set(section.querySelectorAll('[data-flip]'), { yPercent: 0 })
      if (lineRef.current) gsap.set(lineRef.current, { scaleX: 1 })
      return
    }

    const ctx = gsap.context(() => {
      // ── Label fade-up reveal ──
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 48, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 2.0,
            ease: 'power3.out',
            scrollTrigger: { trigger: labelRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        )
      }

      // ── Flip-words: intro + value paragraphs. Each word flips up from its
      // clip mask on scroll-in, staggered left→right. ──
      ;[introRef.current, middleTextRef.current].filter(Boolean).forEach((el) => {
        const words = el!.querySelectorAll('[data-flip]')
        gsap.fromTo(
          words,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.025,
            scrollTrigger: { trigger: el!, start: 'top 82%', toggleActions: 'play none none reverse' },
          }
        )
      })

      // ── Typewriter scrub: hook + emphasis brighten char-by-char on scroll ──
      ;[hookRef.current, emphasisRef.current].filter(Boolean).forEach((el) => {
        const chars = el!.querySelectorAll('[data-char]')
        gsap.fromTo(
          chars,
          { color: colors.darkQuoteText },
          {
            color: colors.darkText,
            ease: 'none',
            // Scrub maps this whole staggered timeline onto the scroll window.
            // Small per-char stagger + wide window = a visible left→right
            // cascade instead of a snap. Window ends well above the pin so the
            // reveal finishes before ActualStory freezes.
            stagger: { each: 0.04, from: 'start' },
            scrollTrigger: { trigger: el!, start: 'top 92%', end: 'top 42%', scrub: 0.5 },
          }
        )
      })

      // ── Section label line draw ──
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.0,
            delay: 0.25,
            ease: 'power4.inOut',
            scrollTrigger: { trigger: labelRef.current!, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        )
      }

      // ── Proof + CTA cells fade up ──
      ;[proofRef.current, ctaRef.current].filter(Boolean).forEach((el) => {
        gsap.fromTo(
          el!,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: { trigger: el!, start: 'top 90%', toggleActions: 'play none none reverse' },
          }
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} style={{ maxWidth: '720px', margin: '0 auto' }}>
      {/* Section label */}
      <div ref={labelRef} style={{ marginBottom: '40px', opacity: 0 }}>
        <SectionLabel as="h2" arrow="↘" color={colors.textMuted}>
          My Actual Story
        </SectionLabel>
        <span
          ref={lineRef}
          style={{
            display: 'block',
            marginTop: '12px',
            height: '1px',
            width: '100%',
            maxWidth: '280px',
            background: `rgba(255, 255, 255, 0.3)`,
            transformOrigin: 'left',
            transform: 'scaleX(0)',
          }}
        />
      </div>

      {/* ── BENTO: hook (wide cell) ── */}
      <div style={{ ...cell, padding: '36px', marginBottom: '20px' }}>
        <p
          ref={hookRef}
          style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: 'clamp(28px, 4vw, 40px)',
            lineHeight: 1.12,
            letterSpacing: '-0.5px',
            color: colors.darkQuoteText,
            margin: 0,
          }}
        >
          <TypewriterText text="Every designer adds. I got good at taking away." />
        </p>
      </div>

      {/* ── BENTO: intro (text) | portrait (image) ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '20px',
          alignItems: 'stretch',
          marginBottom: '20px',
        }}
      >
        <div ref={introRef} style={{ ...cell, flex: 1 }}>
          <p style={{ ...narrative, fontSize: '19px', margin: 0 }}>
            <FlipWords text="I grew up in Gujarat and moved to Canada at eighteen. Over almost six years I trained in web design in Montreal and led service teams, where problems showed up fast and nobody explained them cleanly. I learned to read people before they said a word." />
          </p>
        </div>
        <div
          ref={portraitRef}
          role="img"
          aria-label="Chintan Patel on the street"
          style={{
            flex: 'none',
            width: isMobile ? '100%' : dimensions.portraitStory.width,
            minHeight: dimensions.portraitStory.height,
            border: CELL_BORDER,
            background: `url('${images.portraitStreet}') center/cover no-repeat`,
          }}
        />
      </div>

      {/* ── BENTO: value (wide cell) ── */}
      <div style={{ ...cell, marginBottom: '20px' }}>
        <p ref={middleTextRef} style={{ ...narrative, fontSize: '19px', margin: 0 }}>
          <FlipWords text="In 2025 I came home to India and turned that instinct into a job. I design digital products for real businesses. I sit with the people who use them, find the moment they hesitate, and cut whatever is standing in the way." />
        </p>
      </div>

      {/* ── BENTO: emphasis (wide cell, the loud moment) ── */}
      <div style={{ ...cell, padding: '36px', marginBottom: '20px' }}>
        <p
          ref={emphasisRef}
          style={{
            fontFamily: fonts.body,
            fontWeight: typography.darkEmphasis.fontWeight,
            fontSize: 'clamp(24px, 3.4vw, 34px)',
            lineHeight: typography.darkEmphasis.lineHeight,
            color: colors.darkQuoteText,
            margin: 0,
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          <TypewriterText text="My best design decisions are the things I removed." />
        </p>
      </div>

      {/* ── BENTO: two proof cells side by side, big mono stat anchors ── */}
      <div
        ref={proofRef}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '20px',
          marginBottom: '20px',
          opacity: 0,
        }}
      >
        <div style={cell}>
          <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: '56px', lineHeight: 1, color: colors.darkText }}>
            0
          </div>
          <div style={{ ...narrative, fontSize: '13px', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '1px', margin: '8px 0 16px' }}>
            checkout steps
          </div>
          <p style={{ ...narrative, fontSize: '16px', margin: 0 }}>
            A power tools shop wanted an online store. Research said their customers never check out,
            they call. So I threw out the cart and handed the order to WhatsApp.
          </p>
        </div>
        <div style={cell}>
          <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: '56px', lineHeight: 1, color: colors.darkText }}>
            95%
          </div>
          <div style={{ ...narrative, fontSize: '13px', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '1px', margin: '8px 0 16px' }}>
            admin work gone
          </div>
          <p style={{ ...narrative, fontSize: '16px', margin: 0 }}>
            A repair shop bled five minutes of paperwork on every job. I rebuilt the flow until closing
            a repair took one tap.
          </p>
        </div>
      </div>

      {/* ── BENTO: CTA (wide cell) ── */}
      <div ref={ctaRef} style={{ ...cell, marginBottom: '100px', opacity: 0 }}>
        <p style={{ ...narrative, fontSize: '19px', margin: 0 }}>
          Got a step in your product nobody should have to take? Let&apos;s find it and cut it. Ready to
          collaborate?{' '}
          <a href="#connect" style={{ color: colors.darkText, textDecoration: 'underline', textUnderlineOffset: '4px' }}>
            Let&apos;s chat
          </a>
          .
        </p>
      </div>
    </div>
  )
}
