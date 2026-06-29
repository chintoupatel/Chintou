'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { DESIGN_TOKENS } from '@/lib/config/designTokens'
import { useMediaQuery } from '@/lib/hooks'
import { B, D, LABEL } from '@/lib/case-study/styles'
import { Hi, useReveal } from '@/lib/case-study/components'

const { colors, fonts, semantic } = DESIGN_TOKENS

// ─── pull-quote ───────────────────────────────────────────────────────────
// NOTE: PullQuote is kept local — it differs from shree's version.
// notion: border `dark ? '#444' : colors.text`, font-size 38px
// shree:  border CRIMSON, font-size 36px
function PullQuote({ quote, dark = false }: { quote: string; dark?: boolean }) {
  const ref = useRef<HTMLQuoteElement>(null)
  useReveal(ref as React.RefObject<HTMLElement | null>, { y: 30 })
  return (
    <blockquote ref={ref} style={{
      borderLeft: `4px solid ${dark ? semantic.quoteBorder : colors.text}`,
      paddingLeft: '40px',
      margin: '72px 0',
    }}>
      <p style={D('38px', 300, dark ? colors.darkText : colors.text)}>{quote}</p>
    </blockquote>
  )
}

// ─── role badge ───────────────────────────────────────────────────────────
function RoleBadge({ label: lbl, owned }: { label: string; owned: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '16px 20px',
      background: owned ? colors.text : 'transparent',
      border: `1.5px solid ${owned ? colors.text : colors.border}`,
    }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: owned ? colors.background : colors.textMuted, flexShrink: 0 }} />
      <span style={{ fontFamily: fonts.body, fontSize: '14px', color: owned ? colors.background : colors.textSecondary }}>{lbl}</span>
    </div>
  )
}

// ─── section number heading ───────────────────────────────────────────────
function SectionTag({ n, title }: { n: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '24px' }}>
      <span style={{ ...LABEL, color: colors.text }}>{n}</span>
      <span style={{ width: '32px', height: '1px', background: colors.border }} />
      <span style={LABEL}>{title}</span>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────
export default function NotionRepairHub() {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const heroRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = heroRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from(el.children, { opacity: 0, y: 60, duration: 1, stagger: 0.14, ease: 'power3.out', delay: 0.1 })
    }, el)
    return () => ctx.revert()
  }, [])

  const tldrRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const oldFlowRef = useRef<HTMLDivElement>(null)
  const img1Ref = useRef<HTMLDivElement>(null)
  const frictionRef = useRef<HTMLDivElement>(null)
  const solutionRef = useRef<HTMLDivElement>(null)
  const beforeAfterRef = useRef<HTMLDivElement>(null)
  const rolesRef = useRef<HTMLDivElement>(null)
  const img2Ref = useRef<HTMLDivElement>(null)
  const screensRef = useRef<HTMLDivElement>(null)
  const outcomeRef = useRef<HTMLDivElement>(null)
  const learnRef = useRef<HTMLDivElement>(null)

  useReveal(tldrRef as React.RefObject<HTMLElement | null>, { y: 20 })
  useReveal(storyRef as React.RefObject<HTMLElement | null>, { y: 40 })
  useReveal(oldFlowRef as React.RefObject<HTMLElement | null>, { x: 40 })
  useReveal(img1Ref as React.RefObject<HTMLElement | null>, { y: 50 })
  useReveal(frictionRef as React.RefObject<HTMLElement | null>, { y: 40 })
  useReveal(solutionRef as React.RefObject<HTMLElement | null>, { y: 40 })
  useReveal(beforeAfterRef as React.RefObject<HTMLElement | null>, { y: 50 })
  useReveal(rolesRef as React.RefObject<HTMLElement | null>, { y: 30 })
  useReveal(img2Ref as React.RefObject<HTMLElement | null>, { y: 40 })
  useReveal(screensRef as React.RefObject<HTMLElement | null>, { y: 40 })
  useReveal(outcomeRef as React.RefObject<HTMLElement | null>, { y: 40 })
  useReveal(learnRef as React.RefObject<HTMLElement | null>, { y: 40 })

  return (
    <main style={{ background: colors.background, color: colors.text, overflowX: 'hidden' }}>

      {/* ── NAV ──────────────────────────────────────────────────────── */}
      <nav style={{ padding: isMobile ? '20px 24px' : '28px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.border}` }}>
        <Link href="/" style={{ ...LABEL, textDecoration: 'none' }}>← Chintan Patel</Link>
        <span style={LABEL}>Case Study, 2025</span>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '88vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: isMobile ? '0 24px 64px' : '0 64px 96px', background: colors.darkBg, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `url('/Project-1/notion1.png') center/cover no-repeat`,
          opacity: 0.12,
        }} />
        <div ref={heroRef} style={{ position: 'relative', maxWidth: '980px' }}>
          <p style={{ ...LABEL, marginBottom: '28px' }}>Notion API &nbsp;·&nbsp; Node.js &nbsp;·&nbsp; One Week</p>
          <h1 style={{ ...D('clamp(48px, 7.5vw, 100px)', 700, colors.darkText), marginBottom: '4px', letterSpacing: '-3px' }}>
            Notion
          </h1>
          <h1 style={{ ...D('clamp(48px, 7.5vw, 100px)', 300, semantic.headingLight), marginBottom: '44px', letterSpacing: '-3px' }}>
            Repair Hub
          </h1>
          <p style={{ ...B('24px', semantic.narrativeMuted), maxWidth: '600px', marginBottom: '56px', lineHeight: 1.5 }}>
            They hired me to design a brand. I found a quieter problem costing them an hour a day, and I solved that first.
          </p>
          <div style={{ display: 'flex', gap: '56px', flexWrap: 'wrap' }}>
            {[
              { label: 'My Role', value: 'Product & UX Designer' },
              { label: 'Timeline', value: 'One Week' },
              { label: 'Scope', value: 'IA, Automation, DB Design' },
            ].map(({ label: lbl, value }) => (
              <div key={lbl}>
                <p style={{ ...LABEL, marginBottom: '8px' }}>{lbl}</p>
                <p style={{ ...B('16px', semantic.narrativeText) }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TL;DR BANNER ─────────────────────────────────────────────── */}
      <section ref={tldrRef} style={{
        padding: isMobile ? '40px 24px' : '64px', background: colors.text, color: colors.background,
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 3fr', gap: isMobile ? '32px' : '64px', alignItems: 'start',
      }}>
        <div>
          <p style={{ ...LABEL, color: semantic.labelMuted, marginBottom: '12px' }}>The Short Version</p>
          <p style={{ fontFamily: fonts.body, fontSize: '13px', color: semantic.labelMuted, lineHeight: 1.7 }}>
            Three numbers if you have ten seconds. The full story sits below.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '40px' }}>
          {[
            { n: '95%', t: 'Less admin work', d: 'Six manual steps per repair collapsed into one status change.' },
            { n: '0', t: 'Duplicate records', d: 'A live cache plus name cleanup wiped out every duplicate profile.' },
            { n: '1 week', t: 'Idea to launch', d: 'Designed, built, and shipped inside the tools they already owned.' },
          ].map(({ n, t, d }) => (
            <div key={t}>
              <p style={{ fontFamily: fonts.display, fontSize: '52px', fontWeight: 700, lineHeight: 1, color: colors.background, margin: '0 0 10px' }}>{n}</p>
              <p style={{ fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, color: semantic.metaStrong, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>{t}</p>
              <p style={{ fontFamily: fonts.body, fontSize: '14px', color: semantic.captionMuted, lineHeight: 1.65, margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE STORY ────────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '80px 24px' : '120px 64px', maxWidth: '1200px', margin: '0 auto' }}>
        <SectionTag n="01" title="Context" />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '56px' : '96px', alignItems: 'start' }}>
          <div ref={storyRef}>
            <h2 style={{ ...D('54px', 700), marginBottom: '36px', lineHeight: 1.12 }}>
              Hired for one project.<br />Fixed a more urgent one first.
            </h2>
            <p style={B('20px')}>
              Hired for a brand project, I spent week one watching the shop work. The same scene kept repeating: a repair finishes, then <Hi>five minutes of copy, paste, and search</Hi> just to file it.
            </p>
            <br />
            <p style={B('20px')}>
              The most expensive friction is the kind <Hi>nobody complains about.</Hi> I fixed it first.
            </p>
          </div>
          <div ref={oldFlowRef}>
            <p style={{ ...LABEL, marginBottom: '28px' }}>The workflow before I touched it</p>
            {[
              { n: '01', t: 'Technician marks the repair complete' },
              { n: '02', t: 'Copies name, phone, and machine details by hand' },
              { n: '03', t: 'Opens a separate archive page' },
              { n: '04', t: 'Searches for the customer, if they exist' },
              { n: '05', t: 'Creates a new card or scrolls the old one' },
              { n: '06', t: 'Pastes, formats a row, deletes the original card' },
            ].map(({ n, t }, i) => (
              <div key={n} style={{
                display: 'flex', gap: '20px', padding: '18px 0',
                borderTop: `1px solid ${colors.border}`,
                opacity: i > 2 ? 0.55 : 1,
              }}>
                <span style={{ ...LABEL, paddingTop: '3px', flexShrink: 0 }}>{n}</span>
                <p style={B('15px', i > 2 ? colors.textMuted : colors.text)}>{t}</p>
                {i > 2 && (
                  <span style={{ marginLeft: 'auto', flexShrink: 0, fontFamily: fonts.body, fontSize: '10px', color: semantic.negative, letterSpacing: '1.5px', textTransform: 'uppercase', paddingTop: '4px' }}>
                    waste
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <PullQuote quote="The most dangerous UX debt is the workaround nobody complains about, because they already forgot there was a better way." />
      </section>

      {/* ── SCREENSHOT 1 ─────────────────────────────────────────────── */}
      <div ref={img1Ref} style={{ maxWidth: '900px', margin: isMobile ? '0 24px 8px' : '0 auto 8px', overflow: 'hidden', border: `2px solid ${colors.border}` }}>
        <Image src="/Project-1/notion1.png" alt="Notion Repair Hub, active tracker view" width={1535} height={919} sizes="(max-width: 900px) 100vw, 900px" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>
      <div style={{ maxWidth: '900px', margin: isMobile ? '0 24px 80px' : '0 auto 80px', padding: '16px 0', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between' }}>
        <span style={LABEL}>Active Repair Tracker, the daily working view</span>
        <span style={{ ...LABEL, color: colors.text }}>Figure 01</span>
      </div>

      {/* ── FRICTION ZONES ───────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '64px 24px' : '100px 64px', background: semantic.surfaceTint }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }} ref={frictionRef}>
          <SectionTag n="02" title="The Three Problems" />
          <h2 style={{ ...D('54px'), marginBottom: '64px', maxWidth: '700px', lineHeight: 1.12 }}>
            Three friction zones. Twenty wasted minutes. Every single repair.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '2px', background: colors.border }}>
            {[
              {
                n: '01',
                title: 'The Context Switch',
                body: (<>Every repair pushed the technician into a separate archive. <Hi>More clicks, more errors.</Hi></>),
                tag: 'High',
              },
              {
                n: '02',
                title: 'The Race Condition',
                body: (<>Notion&apos;s search index lagged for seconds, so <Hi>duplicate profiles appeared</Hi> before the first one registered.</>),
                tag: 'High',
              },
              {
                n: '03',
                title: 'The Spacing Bug',
                body: (<>One trailing space made &quot;Keshav Tile&quot; two people. It <Hi>silently split the history.</Hi></>),
                tag: 'Medium',
              },
            ].map(({ n, title, body: txt, tag }) => (
              <div key={n} style={{ background: colors.background, padding: '48px 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <span style={{ ...D('56px', 200, colors.border) }}>{n}</span>
                  <span style={{ fontFamily: fonts.body, fontSize: '10px', color: semantic.negative, letterSpacing: '1.5px', textTransform: 'uppercase', border: `1px solid ${semantic.tagBorder}`, padding: '4px 8px' }}>{tag}</span>
                </div>
                <h3 style={{ ...D('22px'), marginBottom: '16px' }}>{title}</h3>
                <p style={B('15px')}>{txt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION / IA ────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '80px 24px' : '120px 64px', maxWidth: '1200px', margin: '0 auto' }}>
        <SectionTag n="03" title="The Design" />
        <div ref={solutionRef} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '56px' : '96px', alignItems: 'start' }}>
          <div>
            <h2 style={{ ...D('54px'), marginBottom: '36px', lineHeight: 1.12 }}>
              One page.<br />Two databases.<br />Zero manual steps.
            </h2>
            <p style={B('20px')}>
              <Hi>Two databases, one page.</Hi> Active repairs and customer archive, unified so technicians never leave the hub.
            </p>
            <br />
            <p style={B('20px')}>
              Then I made archiving <Hi>invisible.</Hi> No button, no form. It files itself the moment a status flips to done.
            </p>
          </div>
          <div>
            <p style={{ ...LABEL, marginBottom: '28px' }}>System architecture</p>
            {[
              { label: 'Repair Hub Portal', sub: 'One parent page, one source of truth', indent: 0 },
              { label: 'Database A, Active Tracker', sub: 'Current pipeline, received to repairing to done', indent: 1 },
              { label: 'Database B, Customer Archive', sub: 'Each card is one unique customer profile', indent: 1 },
              { label: 'Repair History Table', sub: 'Nested per customer, a chronological machine log', indent: 2 },
            ].map(({ label: lbl, sub, indent }) => (
              <div key={lbl} style={{
                padding: '16px 0', paddingLeft: `${indent * 28}px`,
                borderTop: `1px solid ${colors.border}`,
              }}>
                <p style={{ fontFamily: fonts.body, fontSize: '15px', fontWeight: 600, color: colors.text, marginBottom: '4px' }}>{lbl}</p>
                <p style={B('13px', colors.textMuted)}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ───────────────────────────────────────────── */}
      <section ref={beforeAfterRef} style={{ margin: isMobile ? '0 0 80px' : '0 64px 80px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2px', background: colors.border }}>
        <div style={{ background: semantic.surfaceRaised, padding: '56px 48px' }}>
          <p style={{ ...LABEL, marginBottom: '36px', color: semantic.negative }}>Before</p>
          {['Six manual steps per repair', 'Constant switching between pages', 'Duplicate profiles piling up', 'Dirty data hiding real history', 'No guide for new staff'].map(t => (
            <div key={t} style={{ display: 'flex', gap: '14px', marginBottom: '18px', alignItems: 'flex-start' }}>
              <span style={{ color: semantic.negative, marginTop: '2px', flexShrink: 0, fontWeight: 600 }}>✕</span>
              <p style={B('16px', colors.text)}>{t}</p>
            </div>
          ))}
        </div>
        <div style={{ background: colors.darkBg, padding: '56px 48px' }}>
          <p style={{ ...LABEL, marginBottom: '36px', color: semantic.positiveNotion }}>After</p>
          {['One action, flip the status to done', 'A single hub page, never leave it', 'A live cache that blocks every duplicate', 'Name cleanup on every write', 'A step by step guide built into the page'].map(t => (
            <div key={t} style={{ display: 'flex', gap: '14px', marginBottom: '18px', alignItems: 'flex-start' }}>
              <span style={{ color: semantic.positiveNotion, marginTop: '2px', flexShrink: 0, fontWeight: 600 }}>✓</span>
              <p style={{ ...B('16px', semantic.bodyOnDark) }}>{t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SCREENSHOTS 2 + 3 ────────────────────────────────────────── */}
      <div ref={img2Ref} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px', padding: isMobile ? '0 24px 80px' : '0 64px 80px' }}>
        <div>
          <Image src="/Project-1/notion2.png" alt="Customer archive" width={1904} height={1130} sizes="(max-width: 1200px) 50vw, 580px" style={{ width: '100%', height: 'auto', display: 'block', border: `2px solid ${colors.border}` }} />
          <p style={{ ...LABEL, padding: '14px 0', borderBottom: `1px solid ${colors.border}` }}>Customer archive, per profile view</p>
        </div>
        <div>
          <Image src="/Project-1/notion3.png" alt="Repair history table" width={1535} height={934} sizes="(max-width: 1200px) 50vw, 580px" style={{ width: '100%', height: 'auto', display: 'block', border: `2px solid ${colors.border}` }} />
          <p style={{ ...LABEL, padding: '14px 0', borderBottom: `1px solid ${colors.border}` }}>Per customer repair history table</p>
        </div>
      </div>

      {/* ── ROLE CLARITY ─────────────────────────────────────────────── */}
      <section ref={rolesRef} style={{ padding: isMobile ? '64px 24px' : '100px 64px', maxWidth: '1200px', margin: '0 auto', background: semantic.surfaceTint }}>
        <SectionTag n="04" title="My Contribution" />
        <h2 style={{ ...D('42px'), marginBottom: '40px' }}>What I owned, and what I handed off</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px' }}>
          <RoleBadge label="Information Architecture" owned={true} />
          <RoleBadge label="Interaction Design" owned={true} />
          <RoleBadge label="Database Schema Design" owned={true} />
          <RoleBadge label="Node.js Automation Script" owned={true} />
          <RoleBadge label="Coworker Onboarding Guide" owned={true} />
          <RoleBadge label="Notion API Integration" owned={true} />
          <RoleBadge label="Hardware Repair Operations" owned={false} />
          <RoleBadge label="Production Deployment, IT" owned={false} />
        </div>
        <p style={{ ...B('14px', colors.textMuted), marginTop: '18px' }}>
          Filled badges are my work. Outlined badges sat with the client.
        </p>
      </section>

      {/* ── FULL SCREENSHOTS ─────────────────────────────────────────── */}
      <section ref={screensRef} style={{ padding: isMobile ? '64px 24px' : '100px 64px', maxWidth: '900px', margin: '0 auto' }}>
        <SectionTag n="05" title="System in Action" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <Image src="/Project-1/hub-portal.png" alt="Full hub portal" width={1920} height={1192} sizes="(max-width: 900px) 100vw, 900px" style={{ width: '100%', height: 'auto', display: 'block', border: `2px solid ${colors.border}` }} />
            <p style={{ ...LABEL, padding: '14px 0', borderBottom: `1px solid ${colors.border}` }}>Hub portal, full operational layout</p>
          </div>
          <div>
            <Image src="/Project-1/daemon-sync.png" alt="Daemon sync output" width={1920} height={1201} sizes="(max-width: 900px) 100vw, 900px" style={{ width: '100%', height: 'auto', display: 'block', border: `2px solid ${colors.border}` }} />
            <p style={{ ...LABEL, padding: '14px 0', borderBottom: `1px solid ${colors.border}` }}>Background daemon, the live sync console</p>
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ───────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '0 24px' : '0 64px', maxWidth: '980px', margin: '0 auto' }}>
        <PullQuote quote="The best feature I designed is the one you never see. The automation that makes filing disappear." />
      </section>

      {/* ── OUTCOME ──────────────────────────────────────────────────── */}
      <section ref={outcomeRef} style={{ padding: isMobile ? '64px 24px' : '100px 64px', background: colors.darkBg, color: colors.darkText }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionTag n="06" title="Outcome" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '56px' : '96px', alignItems: 'start' }}>
            <div>
              <h2 style={{ ...D('54px', 700, colors.darkText), marginBottom: '36px', lineHeight: 1.12 }}>
                The team closed their first repair on the new system without asking a single question.
              </h2>
              <p style={B('20px', semantic.narrativeSubtle)}>
                <Hi dark>Nobody needed training.</Hi> The system was clear enough that they just used it.
              </p>
            </div>
            <div>
              {[
                { metric: '95%', detail: 'fewer admin steps on every completed repair' },
                { metric: '0', detail: 'duplicate customer profiles since launch' },
                { metric: '1 week', detail: 'from first observation to live system' },
                { metric: 'Minutes', detail: 'to onboard new staff, down from days' },
              ].map(({ metric, detail }) => (
                <div key={metric} style={{
                  padding: '24px 0', borderTop: `1px solid ${semantic.divider}`,
                  display: 'flex', gap: '32px', alignItems: 'baseline',
                }}>
                  <span style={{ ...D('40px', 700, colors.darkText), minWidth: '140px' }}>{metric}</span>
                  <p style={B('15px', semantic.narrativeSubtle)}>{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LEARNINGS ────────────────────────────────────────────────── */}
      <section ref={learnRef} style={{ padding: isMobile ? '80px 24px' : '120px 64px', maxWidth: '920px', margin: '0 auto' }}>
        <SectionTag n="07" title="What I Learned" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            {
              n: '01',
              title: 'Watching beats interviewing',
              body: (<>The client never mentioned the problem. I found it by <Hi>observing, not asking.</Hi></>),
            },
            {
              n: '02',
              title: 'UX lives in the data layer',
              body: (<>My most impactful decision was not a screen. It was a <Hi>live cache</Hi> that killed a race condition.</>),
            },
            {
              n: '03',
              title: 'The best feature is the one you remove',
              body: (<>Six steps became one. <Hi>Every removed step is a removed failure point.</Hi></>),
            },
          ].map(({ n, title, body: txt }) => (
            <div key={n} style={{ padding: '48px 0', borderTop: `1px solid ${colors.border}`, display: 'grid', gridTemplateColumns: '72px 1fr', gap: '40px', alignItems: 'start' }}>
              <span style={{ ...D('48px', 200, colors.border) }}>{n}</span>
              <div>
                <h3 style={{ ...D('26px'), marginBottom: '16px' }}>{title}</h3>
                <p style={B()}>{txt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer style={{ padding: isMobile ? '48px 24px' : '80px 64px', background: colors.darkBg, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '24px' : undefined, borderTop: `1px solid ${semantic.footerBorder}` }}>
        <Link href="/" style={{ ...LABEL, color: semantic.headingLight, textDecoration: 'none' }}>← All Projects</Link>
        <div style={{ textAlign: 'right' }}>
          <p style={{ ...LABEL, marginBottom: '10px' }}>Next Case Study</p>
          <Link href="/work/shree-hanuman-power-tools" style={{ ...D('24px', 400, colors.darkText), textDecoration: 'none' }}>Shree Hanuman Power Tools →</Link>
        </div>
      </footer>

    </main>
  )
}
