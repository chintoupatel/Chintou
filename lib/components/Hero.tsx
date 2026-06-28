'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DESIGN_TOKENS } from '@/lib/config/designTokens'
import { useParallax, useMediaQuery } from '@/lib/hooks'

gsap.registerPlugin(ScrollTrigger)

const { typography, dimensions, colors, fonts, spacing, shadows, images } = DESIGN_TOKENS

const ABOUT_TEXT = 'About Me'

export function Hero() {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const backdropRef = useParallax<HTMLDivElement>({ distance: 40 })
  const portraitRef = useParallax<HTMLDivElement>({ distance: 70 })
  const aboutRef = useRef<HTMLHeadingElement>(null)

  // "About Me" — per-letter wave + fadeInDown, triggered on scroll into view.
  useEffect(() => {
    const el = aboutRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.set(el.querySelectorAll('span'), { opacity: 0, y: -80 })
      gsap.to(el.querySelectorAll('span'), {
        opacity: 1,
        y: 0,
        ease: 'power3.out',
        duration: 1.8,
        stagger: 0.16,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="top"
      style={{
        maxWidth: dimensions.container,
        margin: '0 auto',
        padding: isMobile ? '0 24px 64px' : '0 64px 0',
        position: 'relative',
        minHeight: isMobile ? 'auto' : '1100px',
      }}
    >
      {/* Bonjour label */}
      <div
        data-reveal-up
        style={{
          fontFamily: fonts.label,
          fontWeight: typography.label.fontWeight,
          fontSize: '20px',
          letterSpacing: typography.label.letterSpacing,
          textTransform: 'uppercase',
          color: colors.textSecondary,
          lineHeight: 1,
          marginBottom: '4px',
          textAlign: isMobile ? 'center' : 'left',
          animationDelay: '0.05s',
        }}
      >
        Bonjour, I&apos;m
      </div>

      {/* Backdrop (behind wordmark) — decorative, desktop only */}
      {!isMobile && (
        <div style={{ position: 'relative' }}>
          <div
            ref={backdropRef}
            style={{
              position: 'absolute',
              right: '20px',
              top: '10px',
              width: dimensions.heroBackdrop.width,
              height: dimensions.heroBackdrop.height,
              background: colors.surfaceContainer,
              borderRadius: dimensions.heroBackdropRadius,
              zIndex: 1,
              // Decorative only — never intercept clicks/hover (it overlaps
              // the header's right side where the nav buttons sit).
              pointerEvents: 'none',
            }}
          />
        </div>
      )}

      {/* CHINTAN wordmark */}
      <h1
        data-reveal-up
        style={{
          position: 'relative',
          zIndex: 2,
          fontFamily: typography.heroTitle.fontFamily,
          fontWeight: typography.heroTitle.fontWeight,
          fontSize: isMobile ? 'clamp(44px, 13vw, 90px)' : 'clamp(72px, 22vw, 300px)',
          lineHeight: typography.heroTitle.lineHeight,
          letterSpacing: typography.heroTitle.letterSpacing,
          margin: isMobile ? '8px 0 0' : '-28px 0 0',
          color: colors.text,
          textAlign: isMobile ? 'center' : 'left',
          animationDelay: '0.12s',
        }}
      >
        CHINTAN
      </h1>

      {/* Intro paragraph — move with left/top */}
      <p
        data-reveal-up
        style={{
          position: isMobile ? 'static' : 'absolute',
          left: isMobile ? 'auto' : '300px',
          top: isMobile ? 'auto' : '320px',
          width: isMobile ? '100%' : '500px',
          zIndex: 3,
          fontFamily: fonts.label,
          fontWeight: typography.label.fontWeight,
          fontSize: '20px',
          letterSpacing: typography.label.letterSpacing,
          textTransform: 'uppercase',
          color: colors.textSecondary,
          lineHeight: 1.75,
          margin: 0,
          marginTop: isMobile ? '24px' : 0,
          textAlign: isMobile ? 'center' : 'left',
          animationDelay: '0.28s',
        }}
      >
        I came from operations now I design for people.
      </p>

      {/* Disciplines — move with left/top */}
      <div
        data-reveal-up
        style={{
          position: isMobile ? 'static' : 'absolute',
          left: isMobile ? 'auto' : '510px',
          top: isMobile ? 'auto' : '570px',
          marginTop: isMobile ? '24px' : 0,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          gap: spacing.smallGap,
          animationDelay: '0.36s',
        }}
      >
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: '30px',
            fontWeight: 700,
            lineHeight: 1.2,
            color: colors.text,
          }}
        >
          PRODUCT DESIGN
        </span>
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: '30px',
            fontWeight: 700,
            lineHeight: 1.2,
            color: colors.text,
          }}
        >
          UI/UX DESIGN
        </span>
      </div>

      {/* About anchor — reserves hero height; holds portrait (unchanged) */}
      <div
        id="about"
        style={{
          width: isMobile ? '100%' : dimensions.aboutSection.width,
          height: isMobile ? 'auto' : dimensions.aboutSection.height,
          margin: isMobile ? '32px auto 0' : '0 auto',
          position: 'relative',
        }}
      >
        {/* Hero portrait — next/image (reserves space → no layout shift) */}
        <div
          ref={portraitRef}
          style={{
            position: isMobile ? 'relative' : 'absolute',
            top: isMobile ? '0' : '-100px',
            left: isMobile ? '0' : '700px',
            width: isMobile ? '100%' : dimensions.portraitHero.width,
            height: isMobile ? '320px' : dimensions.portraitHero.height,
            borderRadius: dimensions.portraitHero.borderRadius,
            overflow: 'hidden',
            opacity: 0.92,
            boxShadow: shadows.lg,
            zIndex: 1,
          }}
        >
          <Image
            src={images.heroPortrait}
            alt="Chintan Patel"
            fill
            priority
            sizes={isMobile ? '100vw' : '530px'}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      </div>

      {/* Scroll indicator — move with left/top
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: '700px',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: dimensions.scrollIndicator.gap,
        }}
      >
        <span
          style={{
            fontFamily: fonts.label,
            fontWeight: typography.scrollLabel.fontWeight,
            fontSize: '14px',
            letterSpacing: typography.scrollLabel.letterSpacing,
            color: colors.textSecondary,
          }}
        >
          SCROLL
        </span>
        <span
          style={{
            width: '1px',
            height: dimensions.scrollIndicator.lineHeight,
            background: colors.text,
          }}
        />
      </div> */}

      {/* About Me heading — per-letter wave fadeInDown on scroll */}
      <h2
        ref={aboutRef}
        style={{
          position: isMobile ? 'static' : 'absolute',
          left: isMobile ? 'auto' : '50%',
          transform: isMobile ? 'none' : 'translateX(-50%)',
          top: isMobile ? 'auto' : '800px',
          zIndex: 2,
          fontFamily: fonts.heroDisplay,
          fontWeight: typography.aboutHeading.fontWeight,
          fontSize: 'clamp(56px, 16vw, 200px)',
          lineHeight: typography.aboutHeading.lineHeight,
          margin: 0,
          marginTop: isMobile ? '40px' : 0,
          whiteSpace: isMobile ? 'normal' : 'nowrap',
          textAlign: isMobile ? 'center' : 'left',
          color: colors.text,
        }}
      >
        {ABOUT_TEXT.split('').map((char, i) => (
          <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
            {char}
          </span>
        ))}
      </h2>
    </section>
  )
}
