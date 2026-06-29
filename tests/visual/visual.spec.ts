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
