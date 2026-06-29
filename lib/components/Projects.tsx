'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DESIGN_TOKENS } from '@/lib/config/designTokens'
import { useParallax } from '@/lib/hooks/useParallax'
import { useMediaQuery } from '@/lib/hooks'
import { Pill } from '@/lib/ui/Pill'
import { SectionShell } from '@/lib/ui/SectionShell'
import { Button } from '@/lib/ui/Button'

gsap.registerPlugin(ScrollTrigger)

const { typography, dimensions, colors, fonts, spacing, motion } = DESIGN_TOKENS

const HARD_SHADOW = `12px 12px 0 ${colors.borderAlt}`
const INDEX_SIZE = '96px'

const projects = [
  {
    title: 'Notion Repair Hub',
    description:
      'A centralized dashboard for managing repair workflows. The challenge was simplifying a complex operational system without losing critical information. By applying my operations background, I created an interface that serves both technicians and managers.',
    tags: ['UI/UX', 'Workflows', 'Product Strategy'],
    inProgress: false,
  },
  {
    title: 'Shree Hanuman Power Tools',
    description:
      'UX research and a documented design system for a power tools dealer with no digital presence. Discovery reframed the brief from "build a store" to "reduce friction between intent and inquiry" — designing around how tradespeople actually buy.',
    tags: ['UX Research', 'Design Systems', 'Branding'],
    inProgress: false,
  },
]

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const articleRef = useRef<HTMLElement>(null)
  const isEven = index % 2 === 0

  useEffect(() => {
    const el = articleRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // Whole card slides in from its natural side
      gsap.set(el, { opacity: 0, x: isEven ? -80 : 80 })
      gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 1.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      })

      // Content children stagger in after the card arrives
      const content = el.querySelector('[data-project-content]')
      if (content) {
        gsap.set(content.children, { opacity: 0, y: 24 })
        gsap.to(content.children, {
          opacity: 1,
          y: 0,
          duration: 1.3,
          ease: 'power2.out',
          stagger: 0.22,
          delay: 0.7,
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        })
      }
    }, el)

    return () => ctx.revert()
  }, [isEven])

  return (
    <article
      ref={articleRef}
      style={{
        display: 'flex',
        gap: spacing.xlargeGap,
        alignItems: 'stretch',
        flexDirection: isMobile ? 'column' : (isEven ? 'row' : 'row-reverse'),
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: dimensions.projectImage.height,
          border: `${dimensions.processBoxBorder} solid ${colors.text}`,
          boxShadow: HARD_SHADOW,
          overflow: 'hidden',
          background: `url('${index === 0 ? '/Project-1/notion1.png' : '/Project-2/cover.png'}') center/cover no-repeat`,
        }}
      />

      <div
        data-project-content
        style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing.mediumGap }}
      >
        <span
          style={{
            fontFamily: fonts.display,
            fontSize: INDEX_SIZE,
            fontWeight: typography.processTitle.fontWeight,
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: `2px ${colors.borderAlt}`,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.mediumGap, flexWrap: 'wrap' }}>
          <h3
            style={{
              fontFamily: fonts.display,
              fontSize: typography.projectTitle.fontSize,
              fontWeight: typography.projectTitle.fontWeight,
              lineHeight: typography.projectTitle.lineHeight,
              color: colors.text,
              margin: 0,
            }}
          >
            {project.title}
          </h3>
          {project.inProgress && <Pill>In Progress</Pill>}
        </div>
        <p
          style={{
            fontFamily: fonts.body,
            fontSize: typography.projectDescription.fontSize,
            lineHeight: typography.projectDescription.lineHeight,
            color: colors.textSecondary,
            margin: 0,
          }}
        >
          {project.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.tinyGap }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: fonts.label,
                fontSize: typography.labelSmall.fontSize,
                fontWeight: typography.labelSmall.fontWeight,
                letterSpacing: typography.labelSmall.letterSpacing,
                textTransform: 'uppercase',
                color: colors.text,
                border: `1.5px solid ${colors.borderAlt}`,
                padding: '8px 16px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <Button
          as="a"
          variant="solid"
          href={index === 0 ? '/work/notion-repair-hub' : '/work/shree-hanuman-power-tools'}
        >
          {index === 0 ? 'Case Study' : 'View Research'}
          <span aria-hidden="true">↗</span>
        </Button>
      </div>
    </article>
  )
}

export function Projects() {
  const titleRef = useParallax<HTMLHeadingElement>({ distance: 120 })
  const isMobile = useMediaQuery('(max-width: 1024px)')

  return (
    <SectionShell id="work" isMobile={isMobile} background={colors.background}>
      <h2
        ref={titleRef}
        style={{
          fontFamily: fonts.display,
          fontSize: 'clamp(48px, 12vw, 96px)',
          fontWeight: 700,
          lineHeight: 1,
          color: colors.text,
          margin: isMobile ? '0 0 40px' : `0 0 ${spacing.xxlargeGap}`,
          willChange: 'transform',
        }}
      >
        Projects
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '48px' : spacing.xxlargeGap }}>
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </SectionShell>
  )
}
