'use client'

import { useState, useEffect } from 'react'

/**
 * SSR-safe media query hook. Returns false during SSR + first paint,
 * then syncs to the real match on mount and on change. The first-paint
 * false means components render their desktop branch on the server;
 * mobile corrects on hydration (acceptable — no layout-shift on desktop,
 * and mobile reflows once before interaction).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMatches(mql.matches)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
