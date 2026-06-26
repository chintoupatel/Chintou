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

    // Recalculate all trigger start/end positions once layout settles.
    // Without this, ScrollTrigger measures during init — before fonts/images
    // and the mobile stacked reflow land — so triggers point at stale scroll
    // positions and reveals never fire on mobile. Refresh on load + after a
    // beat, and on resize/orientation change.
    const refresh = () => ScrollTrigger.refresh()
    const refreshTimer = setTimeout(refresh, 400)
    window.addEventListener('load', refresh)
    window.addEventListener('orientationchange', refresh)

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
      clearTimeout(refreshTimer)
      document.removeEventListener('click', onAnchorClick)
      window.removeEventListener('scroll', ScrollTrigger.update)
      window.removeEventListener('load', refresh)
      window.removeEventListener('orientationchange', refresh)
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
