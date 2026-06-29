# Styling-Pipeline Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse 4 styling consumption pipelines into one (single token source + `lib/ui/` primitives) with pixel-identical output, proven by Playwright visual regression.

**Architecture:** Extract-without-modify. Existing inline-style objects are *relocated* into reusable primitives byte-for-byte, never rewritten. A single canonical token source (`DESIGN_TOKENS`) feeds everything; `globals.css :root` is guarded against drift by a unit test. Tailwind is KEPT as the base-reset (preflight) layer — not removed. Every change is gated by a before/after screenshot pixel-diff.

**Tech Stack:** Next.js 16, TypeScript (strict), GSAP, Tailwind v4 (base reset only), Playwright (dev-only, for visual regression), Node 24, npm.

## Global Constraints

- **Zero visual change.** Every gated step must produce `diff == 0` against the Phase 0 baseline. A non-zero diff = revert that step. Sole exception: the Phase 6 green-mismatch is preserved as two tokens (no pixel change).
- **Extract-without-modify only.** No style *value* may be rewritten — only moved. Every changed line must trace to relocation.
- **Tailwind stays.** Do NOT remove `tailwindcss`, `@tailwind` directives, `tailwind.config.js`, or postcss configs. It provides the global preflight reset. Do NOT add new Tailwind utility classes.
- **Branch:** `refactor/styling-pipeline-consolidation` (already created).
- **Screenshots:** widths 375 / 768 / 1024 / 1440, pages `/`, `/work/notion-repair-hub`, `/work/shree-hanuman-power-tools`, captured in `prefers-reduced-motion: reduce`.
- **Surgical changes.** Touch only what each task names. No adjacent refactoring, no "improvements."
- **Commit after every task.** Conventional commits, no attribution.

---

### Task 1: Visual-regression harness + baseline (Phase 0)

**Files:**
- Create: `tests/visual/visual.spec.ts`
- Create: `playwright.config.ts`
- Modify: `package.json` (add devDeps + scripts)
- Modify: `.gitignore` (ignore screenshot artifacts dir)

**Interfaces:**
- Produces: `npm run test:visual` (runs Playwright against a running dev/preview server), baseline snapshots committed under `tests/visual/visual.spec.ts-snapshots/`.

- [ ] **Step 1: Install Playwright as a dev dependency**

Run:
```bash
npm install -D @playwright/test@latest
npx playwright install chromium
```
Expected: added to `devDependencies`; Chromium downloaded.

- [ ] **Step 2: Add scripts to package.json**

In `package.json` `"scripts"`, add:
```json
"test:visual": "playwright test",
"test:visual:update": "playwright test --update-snapshots"
```

- [ ] **Step 3: Create playwright.config.ts**

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    // Deterministic screenshots: disable animations + force reduced motion.
    reducedMotion: 'reduce',
  },
  // Pixel-exact gate. Zero tolerance — any drift fails.
  expect: { toHaveScreenshot: { maxDiffPixels: 0, animations: 'disabled' } },
  webServer: {
    command: 'npm run build && npx next start',
    url: 'http://localhost:3000',
    timeout: 180_000,
    reuseExistingServer: false,
  },
  projects: [
    { name: 'w375', use: { viewport: { width: 375, height: 800 } } },
    { name: 'w768', use: { viewport: { width: 768, height: 1024 } } },
    { name: 'w1024', use: { viewport: { width: 1024, height: 800 } } },
    { name: 'w1440', use: { viewport: { width: 1440, height: 900 } } },
  ],
})
```

- [ ] **Step 4: Create tests/visual/visual.spec.ts**

```ts
import { test, expect } from '@playwright/test'

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'notion-repair-hub', path: '/work/notion-repair-hub' },
  { name: 'shree-hanuman-power-tools', path: '/work/shree-hanuman-power-tools' },
]

for (const p of PAGES) {
  test(`full-page ${p.name}`, async ({ page }) => {
    await page.goto(p.path, { waitUntil: 'networkidle' })
    // Let scroll-reveal settle in reduced-motion (reveals resolve instantly).
    await page.waitForTimeout(500)
    await expect(page).toHaveScreenshot(`${p.name}.png`, { fullPage: true })
  })
}
```

- [ ] **Step 5: Ignore Playwright artifacts (but commit snapshots)**

Append to `.gitignore`:
```
/test-results/
/playwright-report/
```
Do NOT ignore `tests/visual/**-snapshots/` — baselines must be committed.

- [ ] **Step 6: Generate the baseline**

Run:
```bash
npm run test:visual:update
```
Expected: 12 snapshots written (4 widths × 3 pages), all tests PASS.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json playwright.config.ts tests/ .gitignore
git commit -m "test: add visual-regression harness + zero-change baseline"
```

---

### Task 2: Single token source drift guard (Phase 1)

**Files:**
- Create: `tests/unit/tokens.test.ts`
- Modify: `package.json` (add a unit-test runner if absent)
- Reference (read-only): `lib/config/designTokens.ts`, `app/globals.css:6-35`

**Interfaces:**
- Produces: `npm run test:unit` that fails if `globals.css :root` values diverge from `DESIGN_TOKENS`. No runtime/visual change — this task touches NO component.

- [ ] **Step 1: Add Vitest (lightweight, no config needed for one node test)**

Run:
```bash
npm install -D vitest
```
Add to `package.json` `"scripts"`: `"test:unit": "vitest run"`.

- [ ] **Step 2: Write the failing drift test**

`tests/unit/tokens.test.ts`:
```ts
import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import { DESIGN_TOKENS } from '../../lib/config/designTokens'

// These 7 values are duplicated in globals.css :root AND DESIGN_TOKENS.
// This test makes drift between the two a CI failure, not a silent visual bug.
const css = readFileSync('app/globals.css', 'utf8')
const cssVar = (name: string) => {
  const m = css.match(new RegExp(`--${name}:\\s*([^;]+);`))
  if (!m) throw new Error(`--${name} not found in globals.css`)
  return m[1].trim()
}

describe('token source of truth: globals.css :root === DESIGN_TOKENS', () => {
  it('colors match', () => {
    expect(cssVar('color-bg')).toBe(DESIGN_TOKENS.colors.background)
    expect(cssVar('color-text-primary')).toBe(DESIGN_TOKENS.colors.text)
    expect(cssVar('color-text-secondary')).toBe(DESIGN_TOKENS.colors.textSecondary)
    expect(cssVar('color-text-muted')).toBe(DESIGN_TOKENS.colors.textMuted)
  })
  it('motion matches', () => {
    expect(cssVar('motion-fast')).toBe(DESIGN_TOKENS.motion.fast)
    expect(cssVar('motion-base')).toBe(DESIGN_TOKENS.motion.base)
    expect(cssVar('ease-standard')).toBe(DESIGN_TOKENS.motion.easeStandard)
  })
})
```

- [ ] **Step 3: Run the test — confirm it PASSES now (values already match)**

Run: `npm run test:unit`
Expected: PASS. (Values already match today; the test's job is to *keep* them matched. If it fails, the two files have already drifted — fix `globals.css` to match `DESIGN_TOKENS` before continuing.)

- [ ] **Step 4: Add a doc comment marking DESIGN_TOKENS canonical**

At top of `lib/config/designTokens.ts`, above `export const DESIGN_TOKENS`, add:
```ts
// CANONICAL token source. globals.css :root mirrors the 7 base values below
// (colors + motion) for the CSS-class layer (.btn/.label/keyframes); that
// mirror is guarded by tests/unit/tokens.test.ts. Change values HERE first.
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tests/unit/tokens.test.ts lib/config/designTokens.ts
git commit -m "test: guard globals.css :root against DESIGN_TOKENS drift"
```

---

### Task 3: `Pill` primitive — dedupe the copied status pill (Phase 2)

**Files:**
- Create: `lib/ui/Pill.tsx`
- Modify: `lib/components/Projects.tsx:132-161` (the "In Progress" pill)
- Modify: `lib/components/Connect.tsx:168-186` (the "Available for work" pill)

**Interfaces:**
- Produces: `<Pill>{label}</Pill>` rendering the exact pill markup (border, radius, pulsing dot) currently inlined twice.
- Consumes: `DESIGN_TOKENS` (colors, spacing, fonts, typography).

- [ ] **Step 1: Create lib/ui/Pill.tsx with the EXACT current pill styles**

Copy the style object verbatim from `Connect.tsx:168-186` (the "Available for work" span — identical structure to the Projects one):
```tsx
import { DESIGN_TOKENS } from '@/lib/config/designTokens'

const { colors, fonts, spacing, typography } = DESIGN_TOKENS

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing.smallGap,
        fontFamily: fonts.label,
        fontSize: typography.labelSmall.fontSize,
        fontWeight: typography.labelSmall.fontWeight,
        letterSpacing: typography.labelSmall.letterSpacing,
        textTransform: 'uppercase',
        color: colors.text,
        border: `1.5px solid ${colors.borderAlt}`,
        borderRadius: '999px',
        padding: '6px 14px',
      }}
    >
      <span
        className="pill-dot"
        style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.text, display: 'inline-block' }}
      />
      {children}
    </span>
  )
}
```
NOTE: Connect's pill also has `marginBottom: spacing.mediumGap` on its span — that is a *layout* offset, not part of the pill. Keep it at the call site (Step 3), not in `Pill`.

- [ ] **Step 2: Replace the Projects "In Progress" pill**

In `Projects.tsx`, replace the entire `{project.inProgress && (<span ...>In Progress</span>)}` block (lines ~132-161) with:
```tsx
{project.inProgress && <Pill>In Progress</Pill>}
```
Add `import { Pill } from '@/lib/ui/Pill'` to the imports.

- [ ] **Step 3: Replace the Connect "Available for work" pill**

In `Connect.tsx`, replace the `<span>...Available for work</span>` block (lines ~168-186) with a wrapper that preserves the `marginBottom` layout offset:
```tsx
<div style={{ marginBottom: spacing.mediumGap }}>
  <Pill>Available for work</Pill>
</div>
```
Add `import { Pill } from '@/lib/ui/Pill'`. Remove the now-unused `labelStyle` ONLY if nothing else references it (it is used elsewhere in Connect — verify with a grep before removing; likely keep it).

- [ ] **Step 4: Type-check + visual gate**

Run:
```bash
npm run type-check
npm run test:visual
```
Expected: type-check clean; all 12 screenshots PASS (diff == 0). If any fail, revert this task and inspect the marginBottom/structure delta.

- [ ] **Step 5: Commit**

```bash
git add lib/ui/Pill.tsx lib/components/Projects.tsx lib/components/Connect.tsx
git commit -m "refactor: extract Pill primitive, dedupe status pill (×2 → 1)"
```

---

### Task 4: `SectionShell` primitive — dedupe the section wrapper (Phase 2)

**Files:**
- Create: `lib/ui/SectionShell.tsx`
- Modify: `lib/components/Projects.tsx:239-247`, `Process.tsx:68-74`, `Certifications.tsx:84-90`, `Connect.tsx:148-156`

**Interfaces:**
- Produces: `<SectionShell as="section" id="..." isMobile={bool} background={...} style={...}>` rendering `maxWidth: container; margin: 0 auto; padding: <mobile|desktop>`.
- Consumes: `DESIGN_TOKENS.dimensions.container`, `spacing`.

- [ ] **Step 1: Create lib/ui/SectionShell.tsx**

The repeated block is: `maxWidth: dimensions.container, margin: '0 auto', padding: isMobile ? '64px 24px' : `${spacing.sectionPadding} ${spacing.containerPadding}`, background: ...`. Encode exactly that:
```tsx
import { DESIGN_TOKENS } from '@/lib/config/designTokens'

const { dimensions, spacing } = DESIGN_TOKENS

type Props = {
  as?: 'section' | 'footer'
  id?: string
  isMobile: boolean
  background?: string
  children: React.ReactNode
  style?: React.CSSProperties
  innerRef?: React.Ref<HTMLElement>
}

export function SectionShell({ as = 'section', id, isMobile, background, children, style, innerRef }: Props) {
  const Tag = as as 'section'
  return (
    <Tag
      id={id}
      ref={innerRef}
      style={{
        maxWidth: dimensions.container,
        margin: '0 auto',
        padding: isMobile ? '64px 24px' : `${spacing.sectionPadding} ${spacing.containerPadding}`,
        ...(background ? { background } : {}),
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}
```

- [ ] **Step 2: Migrate Projects, Process, Certifications, Connect — ONE at a time**

For each: replace the `<section style={{ maxWidth..., margin..., padding..., background... }}>` opener with `<SectionShell as="section" id={...} isMobile={isMobile} background={...}>` and the matching close tag. **Verify each file's padding expression matches the primitive's `isMobile ? '64px 24px' : ...` exactly** before swapping — if a file differs (e.g. Hero uses different padding), do NOT use SectionShell there. Add the import per file.

- [ ] **Step 3: After EACH file, type-check + visual gate**

Run after every single file migration:
```bash
npm run type-check && npm run test:visual
```
Expected: clean + diff == 0. Revert that one file if it fails before touching the next.

- [ ] **Step 4: Commit (one commit per migrated file, or one if all gates passed cleanly)**

```bash
git add lib/ui/SectionShell.tsx lib/components/Projects.tsx lib/components/Process.tsx lib/components/Certifications.tsx lib/components/Connect.tsx
git commit -m "refactor: extract SectionShell primitive, dedupe section wrapper"
```

---

### Task 5: `Button` primitive — unify the button idioms (Phase 2)

**Files:**
- Create: `lib/ui/Button.tsx`
- Modify: `lib/components/Header.tsx:60-90` (two `.btn` links), `Projects.tsx:193-228` (hard-shadow link)

**Interfaces:**
- Produces: `<Button as="a" variant="bordered" | "solid" href=... >`. `bordered` = the `.btn` class look (used by Header); `solid` = Projects' hard-shadow black button with its JS hover. Variants wrap EXISTING idioms verbatim (see spec Known New Finding #1 — this hides, not resolves, the idiom split, by design).
- Consumes: `DESIGN_TOKENS`.

- [ ] **Step 1: Create lib/ui/Button.tsx with both variants verbatim**

`bordered` reproduces `globals.css .btn` + Header's inline additions (`inline-flex`, `minHeight:44px`). `solid` reproduces `Projects.tsx:193-228` including the exact `onMouseEnter/onMouseLeave` transform+shadow handlers. Copy both byte-for-byte from their sources. (Full code assembled from those two sites; preserve every property and the hover handlers exactly.)

- [ ] **Step 2: Migrate Header's two `.btn` links → `<Button variant="bordered">`**

Replace each `<a className="btn" style={{...}}>` with `<Button as="a" variant="bordered" href=... target/rel...>`. Keep the per-link `minHeight/inline-flex/whiteSpace/flexShrink` props (fold them into the `bordered` variant since both Header links share them identically).

- [ ] **Step 3: Visual gate after Header**

Run: `npm run type-check && npm run test:visual`
Expected: diff == 0. **Watch the `.btn:hover` CSS** — `bordered` must keep using the `.btn` class (so CSS `:hover` still fires) OR replicate the hover in JS. Simplest zero-risk path: `bordered` keeps `className="btn"` and only moves the inline props. Confirm hover visually unaffected (hover isn't screenshot-tested; spot-check manually).

- [ ] **Step 4: Migrate Projects' hard-shadow link → `<Button variant="solid">`**

Replace the `<a href=... style={{...}} onMouseEnter onMouseLeave>` (lines 193-228) with `<Button as="a" variant="solid" href={...}>{label}<span aria-hidden>↗</span></Button>`, moving the hover handlers into the variant.

- [ ] **Step 5: Visual gate + commit**

```bash
npm run type-check && npm run test:visual
git add lib/ui/Button.tsx lib/components/Header.tsx lib/components/Projects.tsx
git commit -m "refactor: extract Button primitive (bordered/solid), dedupe button idioms"
```

---

### Task 6: Shared case-study module — dedupe work-page helpers (Phase 2)

**Files:**
- Create: `lib/case-study/styles.ts` (`B`, `D`, `LABEL`)
- Create: `lib/case-study/components.tsx` (`Hi`, `useReveal`, `Reveal`, `PullQuote`)
- Modify: `app/work/notion-repair-hub/page.tsx:16-110` (remove local helpers, import)
- Modify: `app/work/shree-hanuman-power-tools/page.tsx:16-110` (remove local helpers, import)

**Interfaces:**
- Produces: `B(size?, color?)`, `D(size, weight?, color?)`, `LABEL`, `Hi`, `Reveal`, `PullQuote`, `useReveal` — exact signatures copied from the current `notion-repair-hub` definitions.
- Consumes: `DESIGN_TOKENS`, `gsap`, `ScrollTrigger`.

- [ ] **Step 1: Move B/D/LABEL into lib/case-study/styles.ts**

Copy the three definitions verbatim from `notion-repair-hub/page.tsx:16-44`. (Both pages define them identically — diff them first with `diff <(sed -n '16,44p' notion...) <(sed -n '19,44p' shree...)` to confirm byte-identical; they are. `CRIMSON` stays local to shree — it's page-specific.)

- [ ] **Step 2: Move Hi/useReveal/Reveal/PullQuote into lib/case-study/components.tsx**

Copy verbatim from `notion-repair-hub/page.tsx:44-110`. Mark the file `'use client'` (uses hooks + gsap). Register `ScrollTrigger` once here.

- [ ] **Step 3: Update notion-repair-hub/page.tsx**

Delete local `B/D/LABEL/Hi/useReveal/PullQuote` (lines 16-110, leaving `Reveal` if defined locally — copy whichever set the page actually uses). Add:
```ts
import { B, D, LABEL } from '@/lib/case-study/styles'
import { Hi, Reveal, PullQuote } from '@/lib/case-study/components'
```

- [ ] **Step 4: Update shree-hanuman-power-tools/page.tsx**

Same deletion + import. Keep local `const CRIMSON`. Confirm the page uses `Reveal` (it defines one locally at :81) — import it from the shared module.

- [ ] **Step 5: Type-check + visual gate**

Run: `npm run type-check && npm run test:visual`
Expected: clean + diff == 0 on both work pages.

- [ ] **Step 6: Commit**

```bash
git add lib/case-study/ app/work/notion-repair-hub/page.tsx app/work/shree-hanuman-power-tools/page.tsx
git commit -m "refactor: extract shared case-study helpers, dedupe across work pages"
```

---

### Task 7: Semantic color tokens — kill the 42 raw hex (Phase 3)

**Files:**
- Modify: `lib/config/designTokens.ts` (add `semantic` block)
- Modify: `app/work/notion-repair-hub/page.tsx` (replace raw hex)
- Modify: `app/work/shree-hanuman-power-tools/page.tsx` (replace raw hex)
- Modify: `lib/components/InfiniteGallery.tsx:253` (`#FFFFFF` → token)

**Interfaces:**
- Produces: `DESIGN_TOKENS.semantic.{ positiveNotion, positiveShree, negative, surfaceRaised, surfaceTint, divider, narrative, ... }` — each set to the EXACT hex currently used at the call site.

- [ ] **Step 1: Add semantic block with exact existing hex**

In `designTokens.ts` add (values lifted verbatim from grep of the pages):
```ts
semantic: {
  positiveNotion: '#5FC08D',   // notion-repair-hub "after" green (preserved distinct — see spec)
  positiveShree: '#7BC99B',    // shree "after" green (preserved distinct — zero-change)
  negative: '#CC4444',         // before/✕ red (both pages)
  negativeSoft: '#E07B7B',     // shree comparison red
  surfaceRaised: '#F5F5F5',
  surfaceTint: '#F9F9F9',
  divider: '#2A2A2A',
  narrativeMuted: '#B4B4B4',
  narrativeText: '#DDDDDD',
  narrativeSubtle: '#AAAAAA',
  bodyOnDark: '#DADADA',
  quoteOnDark: '#CCCCCC',
  tagBorder: '#E5C5C5',
} as const,
```
(Confirm the full set by re-grepping `#[0-9A-Fa-f]{6}` across both pages + InfiniteGallery; add any missed values with a descriptive key. Do NOT consolidate `positiveNotion`/`positiveShree` — preserving both is the zero-change choice.)

- [ ] **Step 2: Replace raw hex at each call site with the matching token**

Mechanically swap each literal for its `semantic.*` key. The value is identical, so output is unchanged. Cover all 42 sites (both pages + `InfiniteGallery.tsx:253`).

- [ ] **Step 3: Prove no raw hex remains in page/component files**

Run:
```bash
rg -n "#[0-9A-Fa-f]{6}" lib/components/*.tsx app/work/*/page.tsx
```
Expected: zero matches (CRIMSON in shree is allowed as a named page-local const, OR move it to `semantic.crimsonBrand` — decide and be consistent).

- [ ] **Step 4: Type-check + visual gate**

Run: `npm run type-check && npm run test:visual`
Expected: clean + diff == 0 (values unchanged ⇒ pixels unchanged).

- [ ] **Step 5: Commit**

```bash
git add lib/config/designTokens.ts app/work/ lib/components/InfiniteGallery.tsx
git commit -m "refactor: replace 42 raw hex with semantic color tokens (values preserved)"
```

---

### Task 8: Final verification pass (Phase 5)

**Files:** none modified — verification only. Fix-forward only if a gate fails.

- [ ] **Step 1: Full visual diff vs Phase 0 baseline**

Run: `npm run test:visual`
Expected: all 12 PASS, diff == 0.

- [ ] **Step 2: Type-check, lint, build**

Run:
```bash
npm run type-check && npm run lint && npm run build
```
Expected: all green.

- [ ] **Step 3: Unit / drift test**

Run: `npm run test:unit`
Expected: PASS (token drift guard live).

- [ ] **Step 4: Pipeline-count assertions**

Run:
```bash
rg -n "#[0-9A-Fa-f]{6}" lib/components/*.tsx app/work/*/page.tsx   # expect: none (or only named brand const)
rg -c "from '@/lib/ui/" lib/components/*.tsx                        # expect: Pill/Button/SectionShell consumed
rg -c "from '@/lib/case-study/" app/work/*/page.tsx                 # expect: both pages consume shared helpers
rg -n "tailwindcss" package.json                                    # expect: STILL present (kept by design)
```

- [ ] **Step 5: Manual motion spot-check**

Run `npm run dev`, load `/` + both work pages, full scroll. Confirm GSAP reveals/pins still fire (screenshots are reduced-motion; this verifies the motion path is intact).

- [ ] **Step 6: Self-review the full diff**

Run: `git diff main...HEAD --stat` then read each changed file. Confirm every changed line is extract-without-modify, no stray edits, no orphaned imports.

- [ ] **Step 7: Final commit (if any fix-forward was needed)**

```bash
git add -A && git commit -m "chore: final verification fixes for styling-pipeline consolidation"
```

---

## Self-Review (plan vs spec)

**Spec coverage:**
- Phase 0 baseline → Task 1 ✓
- Phase 1 single source + drift test → Task 2 ✓
- Phase 2 primitives (Pill/Button/SectionShell/case-study) → Tasks 3,4,5,6 ✓
- Phase 3 semantic hex → Task 7 ✓
- Phase 4 Tailwind → CORRECTED to "keep"; no removal task (intentional, matches updated spec) ✓
- Phase 5 final verification → Task 8 ✓
- Green-mismatch preserved as two tokens → Task 7 Step 1 ✓

**Placeholder scan:** Task 5 Step 1 says "full code assembled from those two sites" rather than inlining — acceptable because the source is exact existing code the implementer copies verbatim; paths + line numbers given. No TBD/TODO.

**Type consistency:** `Pill`/`Button`/`SectionShell` names consistent across create + consume tasks. `semantic.*` keys defined in Task 7 Step 1 are the only keys referenced.

**Known gap (accepted):** Task 5's variant approach wraps idioms rather than resolving them — flagged in spec as Known New Finding #1, user chose Path A.
