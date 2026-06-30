'use client'

import { useEffect, useRef, useState } from 'react'
import { DESIGN_TOKENS } from '@/lib/config/designTokens'
import { useTypewriterScrub } from '../hooks/useTypewriterScrub'

const { colors, fonts, motion } = DESIGN_TOKENS

const COUNT_MS = 1400 // number climbs 0→100 (shortened for faster LCP)
const TYPE_MS = 1100 // text types out (finishes early so it's readable)
const HOLD_MS = 500 // pause at 100% so the line can be read
const FADE_MS = 400 // fade-out

const TYPE_TEXT = 'PS: I can make a latte Art.'

// Returning visitors have seen the intro — skip it for a faster re-entry.
// sessionStorage (not localStorage): the intro replays on a fresh visit but
// not on in-session navigations/reloads, which is the annoying case.
const SEEN_KEY = 'intro-seen'

// Read the seen-flag client-side only. Returns false during SSR (no window),
// so server + first client render agree (loader shown) — hydration-safe. The
// flag itself is written in an effect after mount.
function hasSeenIntro(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false // storage blocked (private mode) → show the intro
  }
}

export function LoadingScreen() {
  const skipIntro = useRef(false)
  const [pct, setPct] = useState(0)
  const [counted, setCounted] = useState(false)
  const [fading, setFading] = useState(false)
  // Starts false so the first client render matches the server (loader shown),
  // keeping hydration clean. A returning visitor is removed in the effect below.
  const [gone, setGone] = useState(false)
  const typeRef = useTypewriterScrub({ text: TYPE_TEXT, duration: TYPE_MS / 1000 })

  // Returning visitor → bypass the intro. Mark seen, then drop the overlay on
  // the next frame (rAF defers the state update out of the effect body, so it
  // doesn't cascade-render, and lets the first paint match the server HTML).
  useEffect(() => {
    const seen = hasSeenIntro()
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      // storage blocked → intro replays next time, harmless
    }
    if (!seen) return
    skipIntro.current = true
    const raf = requestAnimationFrame(() => {
      document.documentElement.classList.add('loaded')
      setGone(true)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  // Count 0 → 100 linearly. Reduced motion → duration 0, resolves first frame.
  useEffect(() => {
    if (skipIntro.current) return
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

  // Skip: bypass the intro immediately (reveals the page, fires entrance anims).
  const skip = () => {
    document.documentElement.classList.add('loaded')
    setGone(true)
  }

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
      <button
        onClick={skip}
        aria-label="Skip intro"
        style={{
          position: 'absolute',
          bottom: '32px',
          right: '32px',
          background: 'transparent',
          border: `1px solid ${colors.text}`,
          color: colors.text,
          fontFamily: fonts.label,
          fontSize: '12px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          padding: '10px 18px',
          cursor: 'pointer',
          borderRadius: '2px',
        }}
      >
        Skip →
      </button>
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
