# Design: Kill the Styling-Pipeline Root Cause — Zero Visual Change

**Date:** 2026-06-29
**Status:** Spec — awaiting user review
**Scope path:** A (honest scope — see Non-Goals)

## Problem

The codebase has **one architectural decision that was never made**: how a value gets from token to pixel. Because it was skipped, four parallel styling pipelines coexist:

| Path | Mechanism | Usage |
|------|-----------|-------|
| 1 | `globals.css :root` var → CSS class (`.btn`, `.label`) | ~7 |
| 2 | `designTokens.ts` object → inline `style={{}}` | ~350 |
| 3 | raw hex / px literal → inline `style={{}}` | 42 hex |
| 4 | local page helper (`B()`, `D()`, `LABEL`) → inline `style={{}}` | 2 work pages |

Six audit findings are **mechanical symptoms** of this one root: dual token source (7 values duplicated literally in `:root` AND the JS object), 42 raw hex, no `ui/` primitive layer, four button idioms, the "In Progress"/"Available for work" pill copied twice, `B()/D()/LABEL/Reveal` copy-pasted across both 500+-line case-study pages, and Tailwind installed but dead (7 `className` vs 350 `style`).

**Why this is THE root cause:** it is the only finding that *compounds per feature*. Each new section adds another hand-rolled button, another raw hex, another inline block. The codebase degrades per feature instead of improving.

## Goal

Collapse 4 styling pipelines → 1, with **pixel-identical output**, proven by automated visual regression. Eliminate the styling root cause and its 6 symptoms.

## Core Technique: Extract-Without-Modify

The refactor is **mechanically value-preserving**. Styles are *relocated*, never rewritten.

```
BEFORE:  <button style={{ padding:'13px 25px', border:`1px solid ${colors.text}`, ... }}>
AFTER:   <Button variant="bordered">   // Button.tsx holds the SAME object, byte-for-byte
```

Same object → same computed style → same pixels. This is the lowest-risk refactor class that exists. The diff gate *proves* equivalence rather than assuming it.

## Decisions (locked with user)

1. **Target pipeline:** single JS token source (`designTokens.ts`) + `lib/ui/` primitives. Keep inline-style approach (lowest visual risk). Delete dead Tailwind.
2. **Proof gate:** Playwright full-page screenshots, pixel-diff, at widths 375 / 768 / 1024 / 1440, across 3 pages (home, notion-repair-hub, shree-hanuman-power-tools). Non-zero diff on a step = revert that step.
3. **Scope:** Path A — fix styling root only. Layout root and structure root are explicit Non-Goals.

## Phases

Each phase = its own commit(s), each gated by `diff == 0` (except the one flagged node in Phase 3).

### Phase 0 — Baseline + safety net
- Branch off `main`.
- Add Playwright as a **dev-only** dependency (not shipped to the bundle). Add `npm run test:visual` script + a `capture`/`compare` harness.
- Capture `baseline/` screenshots: 4 widths × 3 pages = 12 shots, in **reduced-motion mode** (animations off → deterministic; see Animation Handling).
- This baseline is the contract. Nothing proceeds without it.

### Phase 1 — Single token source (kills drift root)
- `DESIGN_TOKENS` in `designTokens.ts` is canonical.
- The 7 values currently duplicated in `globals.css :root` (`#F7F7F7`, `#101010`, `#606060`, `#AAAAAA`, `120ms`, `200ms`, `cubic-bezier(0.2,0,0,1)`) stay in `:root` (CSS classes `.btn`/`.label`/keyframes need them) BUT a unit test `tokens.test.ts` asserts the `:root` values === `DESIGN_TOKENS` values. **Drift becomes a failing test, not a silent visual bug.**
- No component touched → gate must be a clean `diff == 0`.
- **Known residual (accepted):** a test asserting two files stay equal is a seam, not a true single source. A future auditor may say "generate one from the other." Accepted as the minimal-change fix per the zero-risk mandate.

### Phase 2 — `lib/ui/` primitives (kills duplication + pipelines 3/4 surface)
One primitive per step, each its own commit + diff gate:
1. **`Button`** — absorbs Projects' hard-shadow button, Connect links, `.btn`. Variants (`solid` / `bordered` / `link`) map to the *existing* idioms verbatim. **NOTE:** this wraps current idioms; it does not redesign them (see Known New Finding #1).
2. **`Tag` / `Pill`** — the "In Progress" + "Available for work" copies → one component, props for label + dot.
3. **`SectionShell`** — the `maxWidth: container / margin: 0 auto / padding` block repeated ~8×.
4. **`lib/case-study/`** — lift the duplicated `B()`, `D()`, `LABEL`, `Hi`, `Reveal`, `PullQuote` helpers out of both work pages into one shared module; import in both.
- Each step: replace call sites → run diff → 0 or revert. Drift is caught at the step that caused it.

### Phase 3 — Semantic color slots (kills 42 raw hex)
- Add `semantic.{positive, negative, raised, …}` to tokens, using the **exact hex already in the pages** (`#7BC99B`, `#CC4444`, `#F9F9F9`, `#2A2A2A`, etc.).
- **The one intentional inconsistency:** "after-green" is `#5FC08D` in notion-repair-hub but `#7BC99B` in shree-hanuman-power-tools. True zero-change is impossible here — the design is *already* inconsistent. Resolution: keep BOTH as `positiveNotion` / `positiveShree` to preserve exact pixels (zero-change), OR unify to one (1px change, requires explicit sign-off). **Default: preserve both (zero-change).**
- Gate: `diff == 0`.

### Phase 4 — Tailwind: keep as base-reset layer (CORRECTED)
**Plan-writing correction (2026-06-29):** the audit's "Tailwind is dead, just delete it" was **wrong**. Investigation found:
- `@tailwind base` is active → Tailwind **preflight (global CSS reset)** is live. It resets more than `globals.css` does (h1–h6 margins, button font inheritance, `img` display:block, etc.). Removing it WOULD shift pixels → breaks zero-visual-change.
- `app/page.tsx` consumes Tailwind **color classes** (`bg-bg-primary text-text-primary`) mapped in `tailwind.config.js` — not just the 7 component `className`s.

**Decision (user-approved):** do NOT remove Tailwind. Keep it as the **base-reset layer only**. The root cause still dies: a single token source (`DESIGN_TOKENS`) + `lib/ui/` primitives collapse the 4 *consumption* pipelines into one. Tailwind stops being a competing styling channel and becomes only the preflight base. No preflight-removal risk. Phase 4 removal is **dropped**.
- No gate (no change made). The Success Criteria line about removing `tailwindcss` is struck.

### Phase 5 — Final verification pass (the "no mistakes" gate)
After all phases, a full correctness sweep before declaring done:
1. **Full visual diff** — re-capture all 12 screenshots, compare to Phase 0 baseline. Every diff must be 0 (except a Phase-3-flagged node if user approved a unify).
2. **`npm run type-check`** — passes clean.
3. **`npm run lint`** — passes clean.
4. **`npm run build`** — production build succeeds.
5. **`tokens.test.ts`** — passes (drift guard live).
6. **Pipeline-count assertion** — grep proves: one token source consumed, no raw hex left in component/page files (all via `semantic.*`), no `tailwindcss` in deps, `lib/ui/` primitives consumed at every former duplication site.
7. **Manual spot-check** — load home + both work pages in browser, full scroll, confirm animations still fire (screenshots are reduced-motion; this confirms motion path intact).
8. **Self-review of the diff** — read every changed file; confirm each changed line traces to extract-without-modify, no stray "improvements," no orphaned imports.

A failure in any step blocks "done" and is fixed before sign-off.

## Animation Handling

Scroll-triggered GSAP states are non-deterministic to screenshot. Mitigation:
- Baseline + all diffs captured in **`prefers-reduced-motion: reduce`** mode → animations disabled → stable, deterministic DOM.
- Animated frames are not part of "the design"; the final resting layout is. Phase 5 step 7 manually confirms motion still fires.
- This is the fuzziest part of the gate and is called out honestly.

## Non-Goals (explicit — Path A)

- **Pixel-layout root NOT fixed.** Hero/Story use absolute pixel offsets (`top:'800px'`, `left:'300px'`, `minHeight:'1100px'`) that float between 1024–1440px. This is a real bug but fixing it *changes render* — incompatible with zero-visual-change. Separate future task.
- **`lib/components/` NOT regrouped.** Plan adds `lib/ui/` but does not split sections/ vs ui/ for existing components. Structural finding survives.
- **30+ typography tokens NOT collapsed.** Token-per-call-site is a quality smell; deferred. Can follow once the pipeline is single.
- **No Tailwind migration.** Higher drift risk; rejected by user.

## Known New Findings This Plan Introduces (accepted)

Per the re-audit honesty check, this plan trades 6 compounding symptom-findings for ~2 non-compounding design-level findings:
1. **Primitive variants may encode legacy drift.** `Button` with 3 variants wraps the old idioms rather than resolving whether they *should* have been one design. The duplication is hidden, not designed away. (User chose A; not adding a Phase to resolve button design.)
2. **Inline-object-as-component persists the "why not Tailwind?" question.** Staying inline (the safe choice) means a framework-standard auditor will still flag it. Permanent consequence of the zero-change constraint.

Both are higher-altitude and non-compounding. Acceptable trade.

## Success Criteria

- [ ] One token source; `globals.css :root` guarded by `tokens.test.ts`.
- [ ] `lib/ui/` primitives consumed at every former duplication site (button ×4 → 1, pill ×2 → 1, section shell, case-study helpers).
- [ ] Zero raw hex in component/page files — all via `semantic.*`.
- [ ] Tailwind kept as base-reset layer only (NOT removed); no new Tailwind utility classes added beyond existing.
- [ ] All 12 screenshots `diff == 0` vs baseline (or 1 flagged+approved node).
- [ ] type-check, lint, build all green.
- [ ] Final self-review confirms every changed line is extract-without-modify.

## Verdict (does it work?)

**Yes, with one asterisk. Confidence ~85%.** The pixel-diff gate makes "zero design change" falsifiable per step, not aspirational — a bad step turns a screenshot red and is reverted. Extract-without-modify is the lowest-risk refactor class. The styling root genuinely dies: after Phase 1+4 there is one token source and one pipeline.

**Asterisk:** the `#5FC08D`/`#7BC99B` mismatch means true zero-change requires keeping both hexes (default) — the design is already inconsistent and this plan refuses to alter design. GSAP screenshot timing is handled via reduced-motion but is the fuzziest gate element.
