'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DESIGN_TOKENS } from '@/lib/config/designTokens'
import { useMediaQuery } from '@/lib/hooks'
import { OpeningQuote } from './OpeningQuote'
import { ActualStory } from './ActualStory'
import { Hobbies } from './Hobbies'

gsap.registerPlugin(ScrollTrigger)

const { colors } = DESIGN_TOKENS

export function Story() {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Refs for pinning and parallax
  const quoteSectionRef = useRef<HTMLDivElement>(null)
  const quoteInnerRef = useRef<HTMLDivElement>(null)
  
  const actualStorySectionRef = useRef<HTMLDivElement>(null)
  const actualStoryInnerRef = useRef<HTMLDivElement>(null)
  
  const hobbiesSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Live check (not the isMobile state, which lags one render behind on
    // first paint) + isMobile in deps so pins are killed/created when the
    // viewport crosses the breakpoint (tablet rotation, window resize).
    if (window.matchMedia('(max-width: 1024px)').matches) return

    const ctx = gsap.context(() => {
      // 1. Pin OpeningQuote so ActualStory wipes over it
      if (quoteSectionRef.current) {
        ScrollTrigger.create({
          trigger: quoteSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          pin: true,
          pinSpacing: false, // ActualStory will scroll right over it
        })
      }

      // Parallax OpeningQuote out as ActualStory scrolls in.
      // Drifts down, scales back, and fades so it recedes behind the incoming slide.
      if (quoteInnerRef.current && actualStorySectionRef.current) {
        gsap.to(quoteInnerRef.current, {
          y: '30vh',
          scale: 0.94,
          opacity: 0.35,
          ease: 'none',
          scrollTrigger: {
            trigger: actualStorySectionRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
          },
        })
      }

      // 2. Pin ActualStory so Hobbies wipes over it
      // ActualStory is tall, so we pin it when its BOTTOM reaches the viewport bottom
      if (actualStorySectionRef.current && hobbiesSectionRef.current) {
        ScrollTrigger.create({
          trigger: actualStorySectionRef.current,
          start: 'bottom bottom',
          endTrigger: hobbiesSectionRef.current,
          end: 'bottom bottom',
          pin: true,
          pinSpacing: false,
        })
      }

      // Parallax ActualStory out as Hobbies scrolls in — same recede treatment.
      if (actualStoryInnerRef.current && hobbiesSectionRef.current) {
        gsap.to(actualStoryInnerRef.current, {
          y: '30vh',
          scale: 0.94,
          opacity: 0.35,
          ease: 'none',
          scrollTrigger: {
            trigger: hobbiesSectionRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
          },
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isMobile])

  return (
    <section ref={containerRef} style={{ background: colors.darkBg, color: colors.darkText }}>
      
      {/* --- SLIDE 1: Opening Quote --- */}
      <div
        ref={quoteSectionRef}
        style={{
          // minHeight (not fixed height): if the quote ever outgrows the
          // viewport the slide stretches instead of clipping lines top+bottom
          // (overflow: hidden below is needed for the parallax recede).
          minHeight: isMobile ? '60vh' : '100vh',
          height: isMobile ? 'auto' : undefined,
          padding: isMobile ? '80px 0' : '96px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 0,
          background: colors.darkBg,
          overflow: 'hidden',
        }}
      >
        <div ref={quoteInnerRef} style={{ maxWidth: '1000px', width: '100%', padding: isMobile ? '0 24px' : '0 64px' }}>
          <OpeningQuote />
        </div>
      </div>

      {/* --- SLIDE 2: Actual Story --- */}
      <div
        ref={actualStorySectionRef}
        style={{
          position: 'relative',
          zIndex: 1,
          background: colors.darkBg,
          minHeight: '100vh',
        }}
      >
        <div 
          ref={actualStoryInnerRef} 
          style={{ 
            maxWidth: '1000px',
            margin: '0 auto',
            padding: isMobile ? '64px 24px' : '120px 64px',
            background: colors.darkBg
          }}
        >
          <ActualStory />
        </div>
      </div>

      {/* --- SLIDE 3: Hobbies --- */}
      <div 
        ref={hobbiesSectionRef}
        style={{ 
          position: 'relative', 
          zIndex: 2, 
          background: colors.darkBg 
        }}
      >
        <Hobbies />
      </div>

    </section>
  )
}