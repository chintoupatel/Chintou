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

    // Recalculate all trigger start/end positions once layout settles.
    // Without this, ScrollTrigger measures during init — before fonts/images
    // and the mobile stacked reflow land — so triggers point at stale scroll
    // positions and reveals never fire on mobile. Refresh on load + after a
    // beat, and on resize/orientation change.
    const refresh = () => ScrollTrigger.refresh()
    const refreshTimer = setTimeout(refresh, 400)
    window.addEventListener('load', refresh)
    window.addEventListener('orientationchange', refresh)

    const cleanupBase = () => {
      clearTimeout(refreshTimer)
      window.removeEventListener('load', refresh)
      window.removeEventListener('orientationchange', refresh)
    }

    // Touch-primary devices (phones/tablets) scroll natively — Lenis only
    // smooths the wheel, so running it there is pure per-frame overhead
    // (rAF loop + lagSmoothing(0) disabling GSAP's frame-drop recovery).
    // ScrollTrigger listens to native scroll by itself; skip Lenis entirely.
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouch) return cleanupBase

    const lenis = new Lenis({ duration: 1.2, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    // Lenis hijacks scroll, so native anchor jumps (#top, #connect, #about,
    // #work) don't work — clicking a nav link does nothing. Intercept in-page
    // hash links and drive them through Lenis instead.
    const onAnchorClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href^="#"]')
      if (!link) return
      const hash = link.getAttribute('href')
      if (!hash || hash === '#') return
      const target = document.querySelector(hash)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: 0 })
    }
    document.addEventListener('click', onAnchorClick)

    return () => {
      cleanupBase()
      document.removeEventListener('click', onAnchorClick)
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
