'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DESIGN_TOKENS } from '@/lib/config/designTokens'

gsap.registerPlugin(ScrollTrigger)

const { typography, colors, fonts } = DESIGN_TOKENS

const OPENING_QUOTE =
  "I used to plate food like every dish deserved its own photoshoot. Now I design products with the same obsession. The details most people never notice but always feel, that's where I live. I don't stop at shipping. I watch how people actually use what I build, their hesitation, the moment something finally clicks, and I keep refining until it works. The goal: products people enjoy using, on a team that sweats the details as much as I do."

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
