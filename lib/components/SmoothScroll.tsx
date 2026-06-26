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

    // duration raised 1.1 → 1.7 for a slower, more deliberate cinematic glide.
    const lenis = new Lenis({ duration: 1.7, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
