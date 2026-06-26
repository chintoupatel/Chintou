'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Drives Lenis smooth-scroll and syncs it with GSAP ScrollTrigger so every
 * parallax/reveal animation runs off the same eased scroll position.
 * Disabled entirely under prefers-reduced-motion (native scroll, no inertia).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    // smoothWheel handles desktop; syncTouch routes touch scrolling through
    // Lenis too — without it, mobile touch bypasses Lenis, ScrollTrigger never
    // gets a scroll event, and NO animations fire on mobile.
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true, syncTouch: true })
    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    // Belt-and-suspenders: also update ScrollTrigger on native scroll, so
    // reveals fire even where Lenis touch sync is unavailable.
    window.addEventListener('scroll', ScrollTrigger.update, { passive: true })

    return () => {
      window.removeEventListener('scroll', ScrollTrigger.update)
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
