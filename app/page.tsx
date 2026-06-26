'use client'

import {
  LoadingScreen,
  Header,
  Hero,
  Story,
  Process,
  Projects,
  Certifications,
  Connect,
} from '@/lib/components'

export default function Home() {
  return (
    <main className="bg-bg-primary text-text-primary">
      <LoadingScreen />
      <Header />
      <Hero />
      <Story />
      <Process />
      <Projects />
      <Certifications />
      <Connect />
    </main>
  )
}
