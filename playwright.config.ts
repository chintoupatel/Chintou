import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    // Deterministic screenshots: disable animations + force reduced motion.
    contextOptions: { reducedMotion: 'reduce' },
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
