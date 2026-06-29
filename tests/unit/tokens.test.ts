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
