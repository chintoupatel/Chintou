'use client'

import { useRef, useEffect, ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DESIGN_TOKENS } from '@/lib/config/designTokens'

gsap.registerPlugin(ScrollTrigger)

const { colors } = DESIGN_TOKENS

// ─── highlight — marks key phrases for fast scanning ───────────────────────
export function Hi({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <strong style={{
      fontWeight: 600,
      color: dark ? colors.darkText : colors.text,
      background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(16,16,16,0.05)',
      padding: '1px 5px',
      borderRadius: '3px',
      boxDecorationBreak: 'clone',
      WebkitBoxDecorationBreak: 'clone',
    }}>
      {children}
    </strong>
  )
}

// ─── scroll reveal ────────────────────────────────────────────────────────
export function useReveal(
  ref: React.RefObject<HTMLElement | null>,
  { x = 0, y = 40, delay = 0 }: { x?: number; y?: number; delay?: number } = {}
) {
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0, x, y, delay, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
      })
    }, el)
    return () => ctx.revert()
  }, [ref, x, y, delay])
}

// ─── reveal wrapper (defined only in shree; shared here for deduplication) ──
export function Reveal({ children, x = 0, y = 40 }: { children: ReactNode; x?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref as React.RefObject<HTMLElement | null>, { x, y })
  return <div ref={ref}>{children}</div>
}
