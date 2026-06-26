<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:7c6fff,100:38d9d9&height=200&section=header&text=Chintan%20Patel%20Portfolio&fontSize=46&fontColor=ffffff&animation=fadeIn&fontAlignY=42&fontFamily=Pixelify+Sans&desc=Product%20Designer%20%C2%B7%20UX%20%C2%B7%20Strategy&descAlignY=62&descSize=18&descColor=e0e0ff" />

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=500&size=18&duration=3000&pause=800&color=7C6FFF&center=true&vCenter=true&width=620&lines=A+scroll-driven+portfolio+built+with+Next.js+%2B+GSAP;Five+years+in+ops%2C+now+designing+products+people+want+to+use" alt="Typing animation" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=flat-square&logo=greensock&logoColor=black" alt="GSAP" />
  <img src="https://img.shields.io/badge/Three.js-WebGL-000000?style=flat-square&logo=three.js" alt="Three.js" />
</p>

---

## About

My personal portfolio — a single-page, scroll-driven storytelling site with two in-depth case studies. Built to show the work *and* the craft: smooth parallax, scroll-scrubbed reveals, and a WebGL image gallery, all responsive across mobile, tablet, and desktop.

I spent five years in operations — fixing broken processes and coordinating teams under real pressure — then redirected that into product design. This site is where the work lives.

> *Good design makes complex things feel simple. That's what I build.*

**Live:** [chintou.vercel.app](https://chintou.vercel.app) · **Design:** Figma → code

---

## Tech Stack

| Layer | Tooling |
|:---|:---|
| Framework | Next.js 16 (App Router) · React 19 · TypeScript (strict) |
| Styling | Tailwind CSS v4 · inline design tokens |
| Animation | GSAP 3 + ScrollTrigger · Lenis smooth scroll · Framer Motion |
| 3D / WebGL | Three.js · React Three Fiber · Drei |
| Tooling | ESLint 9 · Prettier · webpack build |

---

## Features

- **Scroll storytelling** — pinned sections + parallax wipes drive the narrative (GSAP ScrollTrigger synced to Lenis).
- **Scrub-reveal typography** — the opening quote brightens word-by-word as you scroll.
- **WebGL hobby gallery** — a Three.js camera dollies through a scattered image stack.
- **Two case studies** — Notion Repair Hub (operational workflow tool) and Shree Hanuman Power Tools (UX research + design system).
- **Fully responsive** — clean stacked layout on mobile/tablet (≤1024px), art-directed absolute layout on desktop.
- **Performance** — `next/image`, compressed assets, static prerendering.
- **Security headers** — CSP, HSTS, X-Frame-Options, and more set in `next.config.ts`.
- **Accessible** — `prefers-reduced-motion` honored throughout, semantic landmarks, alt text.

---

## Project Structure

```
app/
  page.tsx                         # home (single-page composition)
  layout.tsx                       # metadata, fonts, OG/Twitter
  work/notion-repair-hub/          # case study 1
  work/shree-hanuman-power-tools/  # case study 2
lib/
  components/                      # Hero, Story, Process, Projects, Certifications, Connect, …
  hooks/                           # useParallax, useMediaQuery, useTypewriterScrub
  config/designTokens.ts           # colors, type, spacing, dimensions
public/                            # images, certifications
next.config.ts                     # security headers + CSP
```

---

## Run Locally

```bash
# Requires Node 18+ and npm
npm install
npm run dev          # http://localhost:3000
```

| Script | Does |
|:---|:---|
| `npm run dev` | Dev server (webpack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript, no emit |

---

## Deploy (Vercel)

1. Import this repo in Vercel — it auto-detects Next.js.
2. Optional: set `NEXT_PUBLIC_SITE_URL` to your custom domain (drives Open Graph + canonical URLs). Without it, Vercel's deployment URL is used automatically.
3. Drop a `resume.pdf` into `public/` to activate the header **Resume** button.

The animations (GSAP, Lenis, React Three Fiber) all run client-side and render identically on Vercel.

---

## Featured Work

| Project | What it is |
|:---|:---|
| **Notion Repair Hub** | A centralized dashboard simplifying a complex repair workflow for technicians and managers. |
| **Shree Hanuman Power Tools** | UX research + a cohesive design system for a power-tools dealer with no prior digital presence. |

---

## Certifications

| Certificate | Issuer |
|:---|:---|
| [UX Design](https://www.credly.com/badges/ae7d2ed1-4d79-4ad0-bc90-9aa5412af348/public_url) | Google |
| [Generative AI: Prompt Engineering](https://www.credly.com/badges/5ca460b6-4a9f-49e7-9e11-4a94fedca2d2/public_url) | IBM |
| [AI Fluency: Framework & Foundations](https://verify.skilljar.com/c/78v9u4rf8de9) | Anthropic |
| [Claude Code in Action](https://verify.skilljar.com/c/nxbqhr6f9htz) | Anthropic |

---

## Connect

<p align="left">
  <a href="https://www.linkedin.com/in/chintou/">
    <img src="https://img.shields.io/badge/LinkedIn-7C6FFF?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  &nbsp;
  <a href="mailto:chintan05patel@gmail.com">
    <img src="https://img.shields.io/badge/Email-38d9d9?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
  &nbsp;
  <a href="https://www.instagram.com/chintou.mov/">
    <img src="https://img.shields.io/badge/Instagram-E1306C?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />
  </a>
  &nbsp;
  <a href="https://github.com/chintoupatel">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
</p>

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:38d9d9,100:7c6fff&height=120&section=footer" />
