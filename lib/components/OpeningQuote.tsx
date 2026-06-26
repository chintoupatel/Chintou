'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DESIGN_TOKENS } from '@/lib/config/designTokens'

gsap.registerPlugin(ScrollTrigger)

const { typography, colors, fonts } = DESIGN_TOKENS

const OPENING_QUOTE =
  "My work really is a big part of who I am. As a designer, I'm always out in the world, soaking in everything around me. I love noticing how people connect with each other and with technology. For me, every project is more than just a job, it's a story I get to bring to life through design."

export function OpeningQuote() {
  const quoteRef = useRef<HTMLParagraphElement>(null)

  // Words brighten grey → white, scrubbed to scroll (typewriter cascade).
  useEffect(() => {
    const el = quoteRef.current
    if (!el) return
    const words = el.querySelectorAll('span')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(words, { color: colors.darkText, opacity: 1 })
      return
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { color: colors.darkQuoteText, opacity: 0.25 },
        {
          color: colors.darkText,
          opacity: 1,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 95%', scrub: true},
        }
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <p
      ref={quoteRef}
      style={{
        fontFamily: fonts.display,
        fontWeight: typography.darkQuote.fontWeight,
        fontSize: `clamp(24px, 5vw, ${typography.darkQuote.fontSize})`,
        lineHeight: typography.darkQuote.lineHeight,
        textAlign: 'center',
        color: colors.darkQuoteText,
      }}
    >
      {OPENING_QUOTE.split(' ').map((word, i) => (
        <span key={i}>{word} </span>
      ))}
    </p>
  )
}
