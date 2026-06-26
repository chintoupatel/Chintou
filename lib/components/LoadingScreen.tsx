'use client'

import { useEffect, useState } from 'react'
import { DESIGN_TOKENS } from '@/lib/config/designTokens'
import { useTypewriterScrub } from '../hooks/useTypewriterScrub'

const { colors, fonts, motion } = DESIGN_TOKENS

const COUNT_MS = 1400 // number climbs 0→100 (shortened for faster LCP)
const TYPE_MS = 1100 // text types out (finishes early so it's readable)
const HOLD_MS = 500 // pause at 100% so the line can be read
const FADE_MS = 400 // fade-out

const TYPE_TEXT = 'PS: I can make a latte Art.'

export function LoadingScreen() {
  const [pct, setPct] = useState(0)
  const [counted, setCounted] = useState(false)
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)
  const typeRef = useTypewriterScrub({ text: TYPE_TEXT, duration: TYPE_MS / 1000 })

  // Count 0 → 100 linearly. Reduced motion → duration 0, resolves first frame.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduced ? 0 : COUNT_MS
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = duration <= 0 ? 1 : Math.min((now - start) / duration, 1)
      setPct(Math.round(t * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setCounted(true)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // At 100%, hold so the text is readable, then start fading.
  useEffect(() => {
    if (!counted) return
    const t = setTimeout(() => setFading(true), HOLD_MS)
    return () => clearTimeout(t)
  }, [counted])

  // After the fade completes, unmount + signal the site so above-fold
  // entrance animations fire exactly when the loader reveals the page.
  useEffect(() => {
    if (!fading) return
    const t = setTimeout(() => {
      document.documentElement.classList.add('loaded')
      setGone(true)
    }, FADE_MS)
    return () => clearTimeout(t)
  }, [fading])

  // Fail-safe: if the loader sequence ever stalls (backgrounded tab pausing
  // rAF on mobile, etc.) the `loaded` class would never set and every
  // [data-reveal-up] element — including the header buttons — would stay
  // invisible + unclickable. Force it after a hard cap no matter what.
  useEffect(() => {
    const MAX_MS = COUNT_MS + HOLD_MS + FADE_MS + 1500
    const t = setTimeout(() => {
      document.documentElement.classList.add('loaded')
      setGone(true)
    }, MAX_MS)
    return () => clearTimeout(t)
  }, [])

  // Lock scroll while the overlay is mounted.
  useEffect(() => {
    document.body.style.overflow = gone ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [gone])

  if (gone) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: colors.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '36px',
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? 'none' : 'auto',
        transition: `opacity ${FADE_MS}ms ${motion.easeStandard}`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/coffee-cup.svg"
        alt=""
        aria-hidden="true"
        width={240}
        className="loader-cup"
        style={{ height: 'auto', filter: 'drop-shadow(0 12px 28px rgba(0, 0, 0, 0.12))' }}
      />

      {/* Typewriter line */}
      <div
        ref={typeRef}
        style={{
          fontFamily: fonts.body,
          fontSize: '30px',
          letterSpacing: '0.5px',
          color: colors.textSecondary,
          textAlign: 'center',
          minHeight: '1.5em',
        }}
      />

      {/* Bottom progress bar */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '2px', background: colors.borderAlt }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: colors.text,
            transition: 'width 80ms linear',
          }}
        />
      </div>

      {/* Percentage */}
      <div
        style={{
          position: 'absolute',
          bottom: '18px',
          right: '24px',
          fontFamily: fonts.body,
          fontSize: '30px',
          color: colors.textSecondary,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {pct}%
      </div>

      <span role="status" aria-live="polite" className="sr-only">
        Loading {pct} percent
      </span>
    </div>
  )
}
