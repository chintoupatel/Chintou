'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type ParallaxOptions = {
  /** Total vertical travel in px across the element's scroll pass. Subtle: 40–80. */
  distance?: number
  /** Scrub smoothing in seconds (true = tied 1:1 to scroll). */
  scrub?: number | boolean
}

/**
 * Returns a ref. As the element scrolls through the viewport it drifts
 * vertically by `distance` px (starts +distance/2, ends -distance/2) for a
 * subtle depth effect. No-op under prefers-reduced-motion.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>({
  distance = 60,
  scrub = 2,
}: ParallaxOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: distance / 2 },
        {
          y: -distance / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [distance, scrub])

  return ref
}
