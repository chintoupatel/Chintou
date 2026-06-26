'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DESIGN_TOKENS } from '@/lib/config/designTokens'
import { SectionLabel } from './SectionLabel'
import { useParallax, useMediaQuery } from '@/lib/hooks'

gsap.registerPlugin(ScrollTrigger)

const { typography, dimensions, colors, fonts, spacing, images } = DESIGN_TOKENS

const narrative = {
  fontFamily: fonts.body,
  fontSize: typography.darkNarrative.fontSize,
  fontWeight: typography.darkNarrative.fontWeight,
  lineHeight: typography.darkNarrative.lineHeight,
  color: colors.darkText,
} as const

export function ActualStory() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const introRef = useRef<HTMLParagraphElement>(null)
  const middleTextRef = useRef<HTMLParagraphElement>(null)
  const emphasisRef = useRef<HTMLParagraphElement>(null)
  const closingRef1 = useRef<HTMLParagraphElement>(null)
  const closingRef2 = useRef<HTMLParagraphElement>(null)

  const isMobile = useMediaQuery('(max-width: 1024px)')

  // Effect 2: Portrait parallax drift (reuses existing hook)
  const portraitRef = useParallax<HTMLDivElement>({ distance: 50, scrub: 2 })

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // ── Effect 1: Fade-up reveals ──
      // Each block rises 48px + eases up to full opacity with a subtle scale settle.
      // Reverses on scroll-up. Per-element trigger so each fires when it enters view.
      const fadeUpElements = [
        labelRef.current,
        introRef.current,
        middleTextRef.current,
      ].filter(Boolean)

      fadeUpElements.forEach((el) => {
        gsap.fromTo(
          el!,
          { opacity: 0, y: 48, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 2.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el!,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      // ── Effect 5: Section label line draw ──
      // Thin line wipes left→right beneath the label, slightly after it lands.
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.0,
            delay: 0.25,
            ease: 'power4.inOut',
            scrollTrigger: {
              trigger: labelRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // ── Effect 3: Emphasis line horizontal slide-in ──
      // "That is where design clicked for me." slides further in from the right.
      if (emphasisRef.current) {
        gsap.fromTo(
          emphasisRef.current,
          { opacity: 0, x: 80 },
          {
            opacity: 1,
            x: 0,
            duration: 1.7,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: emphasisRef.current,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // ── Effect 4: Closing paragraphs opacity + drift scrub ──
      // Opacity tied to scroll — reader "pulls" words into existence over a
      // wider, more readable window, with a gentle upward drift.
      const closingEls = [closingRef1.current, closingRef2.current].filter(Boolean)

      closingEls.forEach((el, i) => {
        gsap.fromTo(
          el!,
          { opacity: 0.12, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: el!,
              // Wider scrub window than before so the reveal is slow + legible.
              start: i === 0 ? 'top 95%' : 'top 90%',
              end: i === 0 ? 'top 45%' : 'top 40%',
              scrub: 2,
            },
          }
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef}>
      {/* Section label — h2, top-left, with trailing ↘ arrow */}
      <div
        ref={labelRef}
        style={{
          marginBottom: '48px',
          position: 'relative',
          left: isMobile ? '0px' : '-300px',
          opacity: 0,
        }}
      >
        <SectionLabel as="h2" arrow="↘" color={colors.textMuted}>
          My Actual Story
        </SectionLabel>
        {/* Effect 5: Horizontal line draw beneath the label */}
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

      {/* Intro lines */}
      <p
        ref={introRef}
        style={{
          ...narrative,
          maxWidth: '550px',
          margin: '0 0 28px',
          fontSize: '20px',
          position: 'relative',
          left: isMobile ? '0px' : '-100px',
          opacity: 0,
        }}
      >
        I did not enter product design from a perfect straight line.
        I came from operations, where problems show up fast and people rarely explain them neatly.
      </p>

      {/* Portrait + text */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: spacing.xlargeGap, alignItems: 'flex-start', marginBottom: isMobile ? '48px' : '100px' }}>
        <div style={{ flex: 1, paddingTop: '8px' }}>
          <p
            ref={middleTextRef}
            style={{
              ...narrative,
              margin: '0 0 28px',
              fontSize: '20px',
              maxWidth: '550px',
              position: 'relative',
              left: isMobile ? '0px' : '100px',
              opacity: 0,
            }}
          >
            A customer looks confused before they complain. A team member repeats the same workaround until it
            becomes normal. A small handoff breaks, and suddenly the whole experience feels harder than it should.
          </p>
          {/* Effect 2: Portrait with parallax drift */}
          <div
            ref={portraitRef}
            role="img"
            aria-label="Chintan Patel on the street"
            style={{
              flex: 'none',
              width: dimensions.portraitStory.width,
              height: dimensions.portraitStory.height,
              borderRadius: dimensions.portraitStory.borderRadius,
              background: `url('${images.portraitStreet}') center/cover no-repeat`,
              position: 'relative',
              right: isMobile ? '0px' : '-150px',
              margin: isMobile ? '0 auto' : undefined,
            }}
          />
          {/* Effect 3: Emphasis — horizontal slide-in */}
          <p
            ref={emphasisRef}
            style={{
              fontFamily: fonts.body,
              fontWeight: typography.darkEmphasis.fontWeight,
              fontSize: '30px',
              lineHeight: typography.darkEmphasis.lineHeight,
              color: colors.darkText,
              margin: isMobile ? '40px 0 26px' : '0 0 26px',
              position: 'relative',
              right: isMobile ? '0px' : '-400px',
              top: isMobile ? '0px' : '-180px',
              textAlign: isMobile ? 'center' : 'left',
              opacity: 0,
            }}
          >
            <u>That is where design clicked for me.</u>
          </p>
        </div>
      </div>

      {/* Effect 4: Closing paragraphs — opacity scrub */}
      <p
        ref={closingRef1}
        style={{
          ...narrative,
          maxWidth: '550px',
          margin: '0 0 36px',
          fontSize: '20px',
          position: 'relative',
          left: isMobile ? '0px' : '500px',
          top: isMobile ? '0px' : '-100px',
          opacity: 0.15,
        }}
      >
        I spent years in operations obsessing over friction then discovered UX was the missing tool.
        Now I design interfaces that feel invisible because they solve real problems before users hit them.
        Operations taught me to see what&apos;s breaking. Design taught me to fix it beautifully.
      </p>
      <p
        ref={closingRef2}
        style={{
          ...narrative,
          maxWidth: '550px',
          margin: '0 0 100px',
          fontSize: '20px',
          position: 'relative',
          left: isMobile ? '0px' : '650px',
          top: isMobile ? '0px' : '-100px',
          opacity: 0.15,
        }}
      >
        I design for the person using the product, but I also think about the team behind it, the process around it,
        and the business outcome it needs to support.
      </p>
    </div>
  )
}
