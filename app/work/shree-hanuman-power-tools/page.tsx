'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { DESIGN_TOKENS } from '@/lib/config/designTokens'
import { useMediaQuery } from '@/lib/hooks'
import { B, D, LABEL } from '@/lib/case-study/styles'
import { Hi, Reveal, useReveal } from '@/lib/case-study/components'

const { colors, fonts } = DESIGN_TOKENS

// Project-specific accent — the industrial crimson from the build itself
const CRIMSON = '#7a0009'

// ─── pull-quote ───────────────────────────────────────────────────────────
// NOTE: PullQuote is kept local — it differs from notion's version.
// notion: border `dark ? '#444' : colors.text`, font-size 38px
// shree:  border CRIMSON, font-size 36px
function PullQuote({ quote, dark = false }: { quote: string; dark?: boolean }) {
  const ref = useRef<HTMLQuoteElement>(null)
  useReveal(ref as React.RefObject<HTMLElement | null>, { y: 30 })
  return (
    <blockquote ref={ref} style={{
      borderLeft: `4px solid ${CRIMSON}`,
      paddingLeft: '40px',
      margin: '72px 0',
    }}>
      <p style={D('36px', 300, dark ? colors.darkText : colors.text)}>{quote}</p>
    </blockquote>
  )
}

// ─── section tag ──────────────────────────────────────────────────────────
function SectionTag({ n, title }: { n: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '24px' }}>
      <span style={{ ...LABEL, color: CRIMSON }}>{n}</span>
      <span style={{ width: '32px', height: '1px', background: colors.border }} />
      <span style={LABEL}>{title}</span>
    </div>
  )
}

// ─── image slot — placeholder until real asset dropped in /Project-2/ ─────
function ImageSlot({ src, alt, caption, w, h, sizes = '(max-width: 900px) 100vw, 560px' }: { src: string; alt: string; caption: string; w: number; h: number; sizes?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref as React.RefObject<HTMLElement | null>, { y: 40 })
  return (
    <div ref={ref}>
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        sizes={sizes}
        style={{ width: '100%', height: 'auto', display: 'block', border: `2px solid ${colors.border}` }}
      />
      <p style={{ ...LABEL, padding: '14px 0', borderBottom: `1px solid ${colors.border}` }}>{caption}</p>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────
export default function ShreeHanumanPowerTools() {
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
          background: `url('/Project-2/cover.png') center/cover no-repeat`,
          opacity: 0.18,
        }} />
        <div ref={heroRef} style={{ position: 'relative', maxWidth: '1000px' }}>
          <p style={{ ...LABEL, marginBottom: '24px' }}>UX Research &nbsp;·&nbsp; Visual Design</p>
          <h1 style={{ ...D('clamp(54px, 8vw, 108px)', 700, colors.darkText), marginBottom: '40px', letterSpacing: '-3px' }}>
            Trade First
          </h1>
          <p style={{ ...B('24px', '#B4B4B4'), maxWidth: '640px', marginBottom: '56px', lineHeight: 1.5 }}>
            A local power tools dealer had no digital presence. I researched how tradespeople actually buy, then designed around that, not around how e-commerce templates assume they do.
          </p>
          <div style={{ display: 'flex', gap: '56px', flexWrap: 'wrap' }}>
            {[
              { label: 'My Role', value: 'Researcher & Designer' },
              { label: 'Timeline', value: 'Two to Three Months' },
              { label: 'Focus', value: 'Discovery & Design System' },
            ].map(({ label: lbl, value }) => (
              <div key={lbl}>
                <p style={{ ...LABEL, marginBottom: '8px' }}>{lbl}</p>
                <p style={{ ...B('16px', '#DDDDDD') }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE SHORT VERSION ────────────────────────────────────────── */}
      <Reveal y={20}>
        <section style={{
          padding: isMobile ? '40px 24px' : '64px', background: colors.text, color: colors.background,
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 3fr', gap: isMobile ? '32px' : '64px', alignItems: 'start',
        }}>
          <div>
            <p style={{ ...LABEL, color: '#888', marginBottom: '12px' }}>At a Glance</p>
            <p style={{ fontFamily: fonts.body, fontSize: '13px', color: '#888', lineHeight: 1.7 }}>
              Three outcomes of the research and design.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '40px' }}>
            {[
              { n: '4', t: 'Key findings', d: 'Discovery research reframed the whole problem from store to inquiry.' },
              { n: '0', t: 'Payment gates', d: 'The checkout model routes through WhatsApp. One message, one conversation.' },
              { n: '1', t: 'Visual system', d: 'Industrial black, zero radius, crimson accents. Every token decided once.' },
            ].map(({ n, t, d }) => (
              <div key={t}>
                <p style={{ fontFamily: fonts.display, fontSize: '52px', fontWeight: 700, lineHeight: 1, color: colors.background, margin: '0 0 10px' }}>{n}</p>
                <p style={{ fontFamily: fonts.body, fontSize: '13px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>{t}</p>
                <p style={{ fontFamily: fonts.body, fontSize: '14px', color: '#777', lineHeight: 1.65, margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── CONTEXT ──────────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '80px 24px' : '120px 64px', maxWidth: '1200px', margin: '0 auto' }}>
        <SectionTag n="01" title="Context" />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '56px' : '96px', alignItems: 'start' }}>
          <Reveal y={40}>
            <h2 style={{ ...D('52px', 700), marginBottom: '36px', lineHeight: 1.12 }}>
              The shop was already closing sales. Just not online.
            </h2>
            <p style={B('20px')}>
              A six-year-old shop in Navsari, no website. Its customers, electricians and carpenters, were already buying over WhatsApp. <Hi>Nobody had connected the two.</Hi>
            </p>
            <br />
            <p style={B('20px')}>
              Tool buyers do not browse. They confirm, then message. So <Hi>the cart is not a cart. It is an inquiry builder.</Hi>
            </p>
          </Reveal>
          <Reveal x={40}>
            <p style={{ ...LABEL, marginBottom: '28px' }}>The old workflow for a customer</p>
            {[
              'Call the shop during business hours',
              'Describe what they need verbally',
              'Wait for the owner to check stock',
              'Negotiate price over the phone',
              'Drive to the shop or arrange pickup separately',
            ].map((t, i) => (
              <div key={t} style={{ display: 'flex', gap: '20px', padding: '18px 0', borderTop: `1px solid ${colors.border}` }}>
                <span style={{ ...LABEL, paddingTop: '3px', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                <p style={B('15px', colors.text)}>{t}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── RESEARCH — THE CENTERPIECE ───────────────────────────────── */}
      <section style={{ padding: isMobile ? '64px 24px' : '100px 64px', background: colors.darkBg, color: colors.darkText }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionTag n="02" title="UX Discovery Research" />
          <Reveal y={40}>
            <h2 style={{ ...D('52px', 700, colors.darkText), marginBottom: '36px', maxWidth: '760px', lineHeight: 1.12 }}>
              I did not start in Figma. I started by watching the shop run.
            </h2>
            <p style={{ ...B('20px', '#AAAAAA'), maxWidth: '720px' }}>
              The question shifted fast: <Hi dark>from &quot;build an online store&quot; to &quot;reduce friction between intent and inquiry.&quot;</Hi>
            </p>
            <p style={{ ...LABEL, color: '#777', marginTop: '24px' }}>
              Contextual Inquiry · Stakeholder & User Interviews · Competitive Analysis · Brand Exploration
            </p>
          </Reveal>

          {/* assumption map */}
          <div style={{ marginTop: '72px' }}>
            <p style={{ ...LABEL, color: '#777', marginBottom: '24px' }}>Assumptions, tested against reality</p>
            {[
              { a: 'Customers want to complete purchase online', s: 'Invalidated. Inquiry preferred.', bad: true },
              { a: 'WhatsApp is a secondary channel', s: 'Invalidated. It is the primary channel.', bad: true },
              { a: 'Price display builds trust', s: 'Partial. They want to negotiate, not see fixed price.', bad: false },
              { a: 'Authorized dealer status is assumed', s: 'Invalidated. Customers ask directly, repeatedly.', bad: true },
              { a: 'Mobile is the primary browsing device', s: 'Validated. All participants browsed on phone.', bad: false },
            ].map(({ a, s, bad }) => (
              <div key={a} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '8px' : '32px', padding: '20px 0', borderTop: `1px solid #2A2A2A` }}>
                <p style={{ ...B('16px', '#DDDDDD') }}>{a}</p>
                <p style={{ ...B('16px', bad ? '#E07B7B' : '#7BC99B') }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KEY FINDINGS ─────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '64px 24px' : '100px 64px', maxWidth: '1200px', margin: '0 auto' }}>
        <SectionTag n="03" title="Four Key Findings" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            {
              n: '01',
              finding: 'The purchase is a conversation, not a transaction',
              body: (<><Hi>No one wanted a cart, payment, or address field.</Hi> They confirm, then negotiate.</>),
              implication: 'Replace checkout with an inquiry builder.',
            },
            {
              n: '02',
              finding: 'Trust is stated, not assumed',
              body: (<>&quot;Are you authorized?&quot; <Hi>That should be answered before any contact starts.</Hi></>),
              implication: 'Surface dealer status on homepage, footer, and service page.',
            },
            {
              n: '03',
              finding: 'Off-hours, on mobile, is the real use case',
              body: (<><Hi>&quot;People message me at 6am before a job site.&quot;</Hi> Decisions happen when the shop is closed.</>),
              implication: 'The catalog must work fully at any hour, no human needed.',
            },
            {
              n: '04',
              finding: 'Brand and trade are the navigation axes',
              body: (<><Hi>They search by trade, or a brand they trust.</Hi> Not by price or best-seller.</>),
              implication: 'Filter by trade and brand first. Price is secondary.',
            },
          ].map(({ n, finding, body: txt, implication }) => (
            <div key={n} style={{ padding: '48px 0', borderTop: `1px solid ${colors.border}`, display: 'grid', gridTemplateColumns: '72px 1fr', gap: '40px', alignItems: 'start' }}>
              <span style={{ ...D('48px', 200, colors.border) }}>{n}</span>
              <div>
                <h3 style={{ ...D('26px'), marginBottom: '16px' }}>{finding}</h3>
                <p style={{ ...B(), marginBottom: '20px' }}>{txt}</p>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
                  <span style={{ ...LABEL, color: CRIMSON, flexShrink: 0 }}>Implication</span>
                  <p style={B('15px', colors.text)}>{implication}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <PullQuote quote="No tradesperson interviewed wanted to buy online. They wanted to confirm, then contact. That single insight replaced the entire checkout model." />
      </section>

      {/* ── WIREFRAMES / EARLY THINKING ──────────────────────────────── */}
      <section style={{ padding: isMobile ? '64px 24px' : '100px 64px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionTag n="04" title="Wireframes & Early Structure" />
          <Reveal y={30}>
            <p style={{ ...B('20px', colors.text), maxWidth: '640px', marginBottom: '56px' }}>
              Built in Figma. <Hi>Structure before style</Hi>, the flow mapped before a single color.
            </p>
          </Reveal>

          {/* desktop navigation wireframes */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <ImageSlot src="/Project-2/Navbar.png" alt="Navbar wireframe" caption="Desktop navbar, logo centered, search right" w={402} h={874} sizes="(max-width: 1200px) 50vw, 560px" />
            <ImageSlot src="/Project-2/Navbar-products.png" alt="Navbar products wireframe" caption="Navbar with product category dropdown" w={402} h={874} sizes="(max-width: 1200px) 50vw, 560px" />
          </div>

          {/* mobile screen wireframes — capped width so phones stay phone-sized */}
          <p style={{ ...LABEL, margin: '40px 0 24px' }}>Mobile-first, one-handed browse</p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 240px)', gap: '24px', justifyContent: 'center' }}>
            <ImageSlot src="/Project-2/Phone-Homepage.png" alt="Phone homepage wireframe" caption="Homepage, mobile" w={402} h={3627} sizes="240px" />
            <ImageSlot src="/Project-2/Phone-ingco.png" alt="Phone INGCO brand wireframe" caption="INGCO brand filter, mobile" w={402} h={2685} sizes="240px" />
            <ImageSlot src="/Project-2/Phone-Stanley.png" alt="Phone STANLEY brand wireframe" caption="STANLEY brand filter, mobile" w={402} h={2685} sizes="240px" />
          </div>
        </div>
      </section>

      {/* ── BRAND EXPLORATION ────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '64px 24px' : '100px 64px', background: '#F9F9F9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionTag n="05" title="Brand & Visual Exploration" />
          <Reveal y={40}>
            <h2 style={{ ...D('52px'), marginBottom: '36px', maxWidth: '760px', lineHeight: 1.12 }}>
              What does &quot;authorized, local, and reliable&quot; look like to someone who uses tools for a living?
            </h2>
            <p style={{ ...B('20px'), maxWidth: '680px' }}>
              Consumer e-commerce signals trust through softness. <Hi>Tool buyers read a different vocabulary: precise, heavy, local.</Hi>
            </p>
          </Reveal>

          {/* color directions */}
          <div style={{ marginTop: '72px' }}>
            <p style={{ ...LABEL, marginBottom: '24px' }}>Color direction, three explored</p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { name: 'A. Black + Amber', bg: '#18181b', accent: '#f59e0b', verdict: 'Rejected. Reads as "under construction."', sel: false },
                { name: 'B. Navy + White', bg: '#1e293b', accent: '#ffffff', verdict: 'Rejected. Reads as consulting, not a tool shop.', sel: false },
                { name: 'C. Black + Crimson', bg: '#09090b', accent: CRIMSON, verdict: 'Selected. Authority without shouting.', sel: true },
              ].map(({ name, bg, accent, verdict, sel }) => (
                <div key={name} style={{ border: sel ? `2px solid ${CRIMSON}` : `1px solid ${colors.border}` }}>
                  <div style={{ height: '120px', background: bg, position: 'relative' }}>
                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '40px', height: '40px', background: accent }} />
                    {sel && <span style={{ position: 'absolute', top: '12px', right: '12px', ...LABEL, color: colors.darkText }}>Selected</span>}
                  </div>
                  <div style={{ padding: '20px', background: colors.background }}>
                    <p style={{ fontFamily: fonts.body, fontSize: '14px', fontWeight: 600, color: colors.text, marginBottom: '8px' }}>{name}</p>
                    <p style={B('13px')}>{verdict}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* typography */}
          <div style={{ marginTop: '64px' }}>
            <p style={{ ...LABEL, marginBottom: '24px' }}>Typography, four pairings tested</p>
            {[
              { pair: 'Bebas Neue + Inter', verdict: 'Energy drink, not tools.', sel: false },
              { pair: 'DM Sans + DM Mono', verdict: 'Too generic. Any SaaS.', sel: false },
              { pair: 'Oswald + Source Sans', verdict: 'Softens under tracking. Reads as news.', sel: false },
              { pair: 'Archivo Black + Inter', verdict: 'Selected. Workshop signage weight, no lifestyle read.', sel: true },
            ].map(({ pair, verdict, sel }) => (
              <div key={pair} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', gap: isMobile ? '8px' : '32px', padding: '18px 0', borderTop: `1px solid ${colors.border}` }}>
                <p style={{ fontFamily: fonts.body, fontSize: '16px', fontWeight: 600, color: sel ? CRIMSON : colors.text }}>
                  {pair}{sel && ' ✓'}
                </p>
                <p style={B('15px')}>{verdict}</p>
              </div>
            ))}
          </div>

          {/* locked tokens */}
          <div style={{ marginTop: '32px' }}>
            <p style={{ ...LABEL, marginBottom: '24px' }}>System constraints, locked after exploration</p>
            <div style={{ border: `1px solid ${colors.border}` }}>
              {[
                ['Border radius', '0 globally', 'Precision signal. No softness.'],
                ['Base background', 'zinc-950', 'Maximum contrast, workshop depth.'],
                ['Brand accent', '#7a0009', 'Authority without aggression.'],
                ['WhatsApp color', '#25D366', 'Reserved. One button only.'],
                ['Heading font', 'Archivo Black, uppercase', 'Signage weight, no lifestyle read.'],
                ['Body font', 'Inter', 'Invisible. Does not compete.'],
                ['Eyebrow tracking', '0.25em', 'Visual tier without relying on color.'],
              ].map(([token, value, reason], i) => (
                <div key={token} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1.5fr', gap: isMobile ? '4px' : '24px', padding: isMobile ? '16px' : '16px 24px', borderTop: i === 0 ? 'none' : `1px solid ${colors.border}`, background: colors.background }}>
                  <span style={{ fontFamily: fonts.body, fontSize: '14px', fontWeight: 600, color: colors.text }}>{token}</span>
                  <span style={{ fontFamily: fonts.mono, fontSize: '14px', color: CRIMSON }}>{value}</span>
                  <span style={B('14px')}>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ───────────────────────────────────────────── */}
      <section style={{ margin: isMobile ? '0 0 80px' : '0 64px 80px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2px', background: colors.border }}>
        <div style={{ background: '#F5F5F5', padding: '56px 48px' }}>
          <p style={{ ...LABEL, marginBottom: '36px', color: '#CC4444' }}>Before</p>
          {[
            'Customers called during business hours to ask about stock',
            'Owner described products verbally with no reference point',
            'No way to browse by brand, trade, or category',
            'WhatsApp inquiries arrived with no context',
            'No digital record of stock or authorized brands',
          ].map(t => (
            <div key={t} style={{ display: 'flex', gap: '14px', marginBottom: '18px', alignItems: 'flex-start' }}>
              <span style={{ color: '#CC4444', marginTop: '2px', flexShrink: 0, fontWeight: 600 }}>✕</span>
              <p style={B('16px', colors.text)}>{t}</p>
            </div>
          ))}
        </div>
        <div style={{ background: colors.darkBg, padding: '56px 48px' }}>
          <p style={{ ...LABEL, marginBottom: '36px', color: '#7BC99B' }}>After</p>
          {[
            'Customers browse the full catalog at any hour, filtered by brand or trade',
            'Each product page shows specs, brand, and category before contact',
            'The inquiry cart pre-fills a WhatsApp message with items and quantities',
            'The owner receives structured inquiries instead of cold calls',
            'Authorized dealer status is visible on landing, footer, and service page',
          ].map(t => (
            <div key={t} style={{ display: 'flex', gap: '14px', marginBottom: '18px', alignItems: 'flex-start' }}>
              <span style={{ color: '#7BC99B', marginTop: '2px', flexShrink: 0, fontWeight: 600 }}>✓</span>
              <p style={{ ...B('16px', '#DADADA') }}>{t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MY CONTRIBUTION ──────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '64px 24px' : '100px 64px', maxWidth: '1200px', margin: '0 auto' }}>
        <SectionTag n="06" title="My Contribution" />
        <Reveal y={30}>
          <h2 style={{ ...D('42px'), marginBottom: '40px' }}>What I owned, and what the client provided</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
            {[
              ['Product strategy & checkout model', true],
              ['Visual system, tokens, type, color', true],
              ['Component architecture & file structure', true],
              ['All 13 pages and route layouts', true],
              ['Catalog filtering & URL state', true],
              ['Cart & WhatsApp inquiry flow', true],
              ['Responsive mobile navigation', true],
              ['Accessibility audit & aria fixes', true],
              ['Store branding & business details', false],
              ['Product photography & brand logos', false],
              ['Legal copy, privacy & terms', false],
            ].map(([lbl, owned]) => (
              <div key={lbl as string} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px',
                background: owned ? colors.text : 'transparent',
                border: `1.5px solid ${owned ? colors.text : colors.border}`,
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: owned ? colors.background : colors.textMuted, flexShrink: 0 }} />
                <span style={{ fontFamily: fonts.body, fontSize: '14px', color: owned ? colors.background : colors.textSecondary }}>{lbl}</span>
              </div>
            ))}
          </div>
          <p style={{ ...B('14px', colors.textMuted), marginTop: '18px' }}>
            Filled badges are my work. Outlined badges were provided by the client.
          </p>
        </Reveal>
      </section>

      {/* ── OPEN QUESTIONS ───────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '64px 24px' : '100px 64px', background: colors.darkBg, color: colors.darkText }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionTag n="07" title="Open Questions" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '56px' : '96px', alignItems: 'start' }}>
            <Reveal y={40}>
              <h2 style={{ ...D('52px', 700, colors.darkText), marginBottom: '36px', lineHeight: 1.12 }}>
                The research answered the big question. It raised sharper ones.
              </h2>
              <p style={{ ...B('20px', '#AAAAAA') }}>
                <Hi dark>The questions I would test next</Hi> with real users.
              </p>
            </Reveal>
            <div>
              <p style={{ ...LABEL, color: '#777', marginBottom: '24px' }}>Questions worth testing</p>
              {[
                'Do customers send the pre-filled message as-is, or edit it first?',
                'Does the visual system signal "authorized dealer" on its own?',
                'Is there a path from a warranty question back to browsing?',
                'Does an empty filter result create distrust about stock?',
              ].map((q, i) => (
                <div key={q} style={{ display: 'flex', gap: '20px', padding: '20px 0', borderTop: `1px solid #2A2A2A` }}>
                  <span style={{ ...LABEL, color: CRIMSON, flexShrink: 0, paddingTop: '2px' }}>{String(i + 1).padStart(2, '0')}</span>
                  <p style={{ ...B('15px', '#CCCCCC') }}>{q}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT I LEARNED ───────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '80px 24px' : '120px 64px', maxWidth: '920px', margin: '0 auto' }}>
        <SectionTag n="08" title="What I Learned" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            {
              n: '01',
              title: 'The channel is the product',
              body: (<>The owner already sold on WhatsApp daily. <Hi>The answer was not a better checkout. It was to hand off to WhatsApp.</Hi></>),
            },
            {
              n: '02',
              title: 'A visual system is a decision engine',
              body: (<>Zero radius. Zinc-950. Archivo Black. <Hi>Decided once, applied everywhere.</Hi></>),
            },
            {
              n: '03',
              title: 'Research reframes the brief',
              body: (<>I was asked for a store. <Hi>The research said: build an inquiry, not a checkout.</Hi></>),
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
      <footer style={{ padding: isMobile ? '48px 24px' : '80px 64px', background: colors.darkBg, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '24px' : undefined, borderTop: `1px solid #222` }}>
        <Link href="/" style={{ ...LABEL, color: '#666', textDecoration: 'none' }}>← All Projects</Link>
        <div style={{ textAlign: 'right' }}>
          <p style={{ ...LABEL, marginBottom: '10px' }}>Previous Case Study</p>
          <Link href="/work/notion-repair-hub" style={{ ...D('24px', 400, colors.darkText), textDecoration: 'none' }}>Notion Repair Hub →</Link>
        </div>
      </footer>

    </main>
  )
}
