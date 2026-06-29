'use client'

import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '@/lib/hooks'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DESIGN_TOKENS } from '@/lib/config/designTokens'
import { SectionShell } from '@/lib/ui/SectionShell'

gsap.registerPlugin(ScrollTrigger)

const { typography, colors, fonts, spacing, motion } = DESIGN_TOKENS

// Floating preview size + follow smoothing. Landscape to suit certificate art.
const PREVIEW = { width: 440, height: 320 }
const LERP = 0.12

const certs = [
  { label: 'Google : UX Design', image: '/Certifications/UX-Certifications.png', url: 'https://www.credly.com/badges/ae7d2ed1-4d79-4ad0-bc90-9aa5412af348/public_url' },
  { label: 'IBM : Generative AI : Prompt Engineering', image: '/Certifications/ibm-prompt-engineering.png', url: 'https://www.credly.com/badges/5ca460b6-4a9f-49e7-9e11-4a94fedca2d2/public_url' },
  { label: 'Anthropic : AI Certifications', image: '/Certifications/ai-fluency.png', url: 'https://verify.skilljar.com/c/78v9u4rf8de9' },
  { label: 'Anthropic : Harness Engineering', image: '/Certifications/claude-code-in-action.png', url: 'https://verify.skilljar.com/c/nxbqhr6f9htz' },
]

const lerp = (a: number, b: number, n: number) => a + (b - a) * n

export function Certifications() {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const imgRef = useRef<HTMLImageElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0, scale: 0 })
  const current = useRef({ x: 0, y: 0, scale: 0 })
  const [src, setSrc] = useState(certs[0].image)
  const [hovered, setHovered] = useState<number | null>(null)

  // Cert rows slide in from the left, staggered, on scroll into view.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      // Pre-hide all rows so they don't flash visible before ScrollTrigger fires.
      gsap.set(list.children, { opacity: 0, x: -60 })
      gsap.to(list.children, {
        opacity: 1,
        x: 0,
        duration: 1.0,
        ease: 'power3.out',
        stagger: 0.18,
        scrollTrigger: { trigger: list, start: 'top 80%', toggleActions: 'play none none reverse' },
      })
    }, list)
    return () => ctx.revert()
  }, [])

  // rAF loop: ease the floating preview toward the cursor + scale in/out.
  useEffect(() => {
    let raf = 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const factor = reduced ? 1 : LERP
    const loop = () => {
      const c = current.current
      const t = target.current
      c.x = lerp(c.x, t.x, factor)
      c.y = lerp(c.y, t.y, factor)
      c.scale = lerp(c.scale, t.scale, factor)
      const el = imgRef.current
      if (el) {
        el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) translate(-50%, -50%) scale(${c.scale})`
        el.style.opacity = String(c.scale)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onMove = (e: React.MouseEvent) => {
    if (isMobile) return
    target.current.x = e.clientX
    target.current.y = e.clientY
  }

  return (
    <SectionShell isMobile={isMobile} background={colors.background} onMouseMove={onMove}>
      <h2
        style={{
          fontFamily: fonts.display,
          fontSize: 'clamp(44px, 12vw, 96px)',
          fontWeight: 700,
          lineHeight: 1,
          color: colors.text,
          margin: `0 0 ${spacing.largeGap}`,
        }}
      >
        Certifications
      </h2>

      <div ref={listRef} style={{ borderTop: `1px solid ${colors.text}` }}>
        {certs.map((cert, i) => (
          <a
            key={cert.label}
            href={cert.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => {
              setSrc(cert.image)
              target.current.scale = 1
              setHovered(i)
            }}
            onMouseLeave={() => {
              target.current.scale = 0
              setHovered(null)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${spacing.mediumGap} 0`,
              borderBottom: `1px solid ${colors.text}`,
              color: colors.text,
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                fontFamily: fonts.display,
                fontSize: typography.certificationsLink.fontSize,
                fontWeight: typography.certificationsLink.fontWeight,
                lineHeight: typography.certificationsLink.lineHeight,
                transform: hovered === i ? 'translateX(24px)' : 'none',
                transition: `transform ${motion.base} ${motion.easeStandard}`,
              }}
            >
              {cert.label}
            </span>
            <span
              aria-hidden="true"
              style={{
                fontSize: '24px',
                lineHeight: 1,
                transform: hovered === i ? 'translateX(12px)' : 'none',
                transition: `transform ${motion.base} ${motion.easeStandard}`,
              }}
            >
              →
            </span>
          </a>
        ))}
      </div>

      {/* Floating cursor-follow preview — desktop only (no hover on touch) */}
      {!isMobile && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={imgRef}
          src={src}
          alt=""
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: `${PREVIEW.width}px`,
            height: `${PREVIEW.height}px`,
            objectFit: 'contain',
            pointerEvents: 'none',
            opacity: 0,
            zIndex: 50,
            willChange: 'transform, opacity',
          }}
        />
      )}
    </SectionShell>
  )
}
