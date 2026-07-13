'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DESIGN_TOKENS } from '@/lib/config/designTokens'

gsap.registerPlugin(ScrollTrigger)

const { typography, colors, fonts } = DESIGN_TOKENS

const OPENING_QUOTE =
  "I spend more time watching people than drawing screens. I study what they do, not what they say, and I build for the truth."

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
          // End at center — all words fully white by the time the quote
          // reaches its resting (pinned) position, before ActualStory wipes
          // over it. The old 'bottom 95%' end left the last words grey when
          // the pin froze the element mid-scrub.
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'center 55%', scrub: true },
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
        // 24-word quote in a 700px slide: fills the space at the 64px token on
        // desktop, scales down to 30px on phones via clamp. No media queries —
        // vw term handles tablet between the two caps.
        fontSize: 'clamp(30px, 6vw, 64px)',
        lineHeight: 1.15,
        letterSpacing: '-0.5px',
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
