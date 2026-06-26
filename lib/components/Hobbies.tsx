'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { DESIGN_TOKENS } from '@/lib/config/designTokens'

const { images } = DESIGN_TOKENS

// Canvas is client-only — load without SSR
const InfiniteGallery = dynamic(
  () => import('./InfiniteGallery').then((m) => m.InfiniteGallery),
  { ssr: false }
)

const hobbyImages = [
  { src: images.hobbyWhale2 },
  { src: images.hobbyBoatSneakers },
  { src: images.hobbyBoatCloud },
  { src: images.hobbyWhale },
  { src: images.hobbyMatcha },
  { src: images.hobbyPlate },
  { src: '/images/IMG_0588.jpeg' },
  { src: '/images/IMG_6734.JPG' }, // hikes
  { src: '/images/IMG_6950.JPG' }, // hikes
]

// Titles crossfade as you scroll; each centers on the given image index.
const galleryTitles = ['Hobbies', 'My Creation', 'Hikes']
const galleryTitleStops = [0, 4, 7]

// vh of scroll per image. Taller = slower, more cinematic pass (camera travel
// is fixed; this just spreads it over more scroll). Mobile gets more so each
// image lingers. Breakpoint matches the rest of the site (1024px).
const VH_PER_IMAGE_DESKTOP = 68
const VH_PER_IMAGE_MOBILE = 90
const MOBILE_BREAKPOINT = 1024

export function Hobbies() {
  const [vhPerImage, setVhPerImage] = useState(VH_PER_IMAGE_DESKTOP)

  useEffect(() => {
    const handleResize = () => {
      setVhPerImage(
        window.innerWidth < MOBILE_BREAKPOINT
          ? VH_PER_IMAGE_MOBILE
          : VH_PER_IMAGE_DESKTOP
      )
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <InfiniteGallery
      images={hobbyImages}
      headings={galleryTitles}
      headingStops={galleryTitleStops}
      zSpacing={6}
      vhPerImage={vhPerImage}
    />
  )
}
