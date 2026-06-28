'use client'
/* eslint-disable react-hooks/immutability --
   react-three-fiber mutates camera.position and material.opacity inside
   useFrame by design; that is the framework's per-frame update model. */

import { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import type { Mesh, MeshBasicMaterial } from 'three'

export type GalleryImage = { src: string; alt?: string }

type Props = {
  images: GalleryImage[]
  /** scene units between consecutive images along Z */
  zSpacing?: number
  /** plane size [width, height] in scene units */
  planeSize?: [number, number]
  /** centered titles that crossfade in sequence as you scroll through */
  headings?: string[]
  /** image index each title centers on (same length as headings) */
  headingStops?: number[]
  /** scroll distance multiplier — vh per image */
  vhPerImage?: number
  className?: string
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

// Mobile cutoff — matches Hero / Story / Process useMediaQuery('(max-width: 1024px)').
const MOBILE_BREAKPOINT = 1024

// Image is most opaque when this far in front of the camera; fades both as it
// recedes (far/small) and as it approaches (close/big). Raise FADE_PEAK to make
// images fade out smaller; widen FADE_WIDTH to keep them visible longer.
const FADE_PEAK = 9
const FADE_WIDTH = 4

// Camera dolly path: starts at CAM_START (z), travels through the whole stack
// plus TRAVEL_PAD so the last image fully passes. Shared by the scene + the
// title-timing math so titles align to when an image is focal.
const CAM_START = 9
const TRAVEL_PAD = 14

// Scattered XY + slight tilt per image, so each flies in from a different spot.
// Mirrors the original scattered hobbies arrangement. Cycles if more images.
const LAYOUT = [
  { x: -1.8, y: 0.8, rot: -0.08 },
  { x: 1.9, y: 1.0, rot: 0.07 },
  { x: -2.0, y: -0.9, rot: -0.06 },
  { x: 2.0, y: -0.8, rot: 0.09 },
  { x: -1.3, y: 1.2, rot: 0.05 },
  { x: 0.3, y: -1.3, rot: -0.04 },
  { x: 1.4, y: 1.1, rot: 0.11 },
]

/** Inside <Canvas>: dollies the camera through the image stack by scroll progress. */
function Scene({
  images,
  progressRef,
  zSpacing,
  planeSize,
}: {
  images: GalleryImage[]
  progressRef: React.MutableRefObject<number>
  zSpacing: number
  planeSize: [number, number]
}) {
  const textures = useTexture(images.map((i) => i.src))
  const meshes = useRef<(Mesh | null)[]>([])
  const { camera } = useThree()
  const last = images.length - 1

  useFrame(() => {
    const p = progressRef.current
    const total = last * zSpacing
    // Camera always travels the FULL stack across progress 0..1 so every image
    // becomes focal. "Slower" is achieved purely by a taller wrapper (vhPerImage)
    // — more scroll pixels for the same camera travel — not by shrinking travel.
    camera.position.z = CAM_START - p * (total + TRAVEL_PAD)

    meshes.current.forEach((m, i) => {
      if (!m) return
      const planeZ = -i * zSpacing
      const ahead = camera.position.z - planeZ // >0 in front of camera, <0 passed
      const mat = m.material as MeshBasicMaterial
      // Bell curve: invisible far away, peaks at a comfortable viewing size
      // (ahead ≈ FADE_PEAK), then fades out again as it keeps zooming closer —
      // so it never grows huge / fills the screen before disappearing.
      mat.opacity = clamp(1 - Math.abs(ahead - FADE_PEAK) / FADE_WIDTH, 0, 1)
    })
  })

  return (
    <>
      {images.map((img, i) => {
        const l = LAYOUT[i % LAYOUT.length]
        return (
          <mesh
            key={i}
            ref={(el) => {
              meshes.current[i] = el
            }}
            position={[l.x, l.y, -i * zSpacing]}
            rotation={[0, 0, l.rot]}
          >
            <planeGeometry args={planeSize} />
            <meshBasicMaterial map={textures[i]} transparent toneMapped={false} />
          </mesh>
        )
      })}
    </>
  )
}

export function InfiniteGallery({
  images,
  zSpacing = 6,
  planeSize = [1.8, 2.3],
  headings = ['Hobbies', 'My Creation', 'Hikes'],
  headingStops = [0, 2, 4],
  vhPerImage = 75,
  className,
}: Props) {
  const progressRef = useRef(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([])
  // State drives render-affecting values (plane size, sticky height).
  // Ref mirrors it for the rAF scroll loop (avoids stale closure).
  const [isMobile, setIsMobile] = useState(false)
  const mobileRef = useRef(false)

  // Detect mobile on mount and resize. Unified 1024px cutoff to match
  // Hero / Story / Process (was 768px here — broke the tablet zone).
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      mobileRef.current = mobile
      setIsMobile(mobile)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Bump plane size ~0.35 scene units (≈ +30-40px on screen) per request.
  // Mobile stays a touch smaller to limit blank space.
  const adjustedPlaneSize: [number, number] = isMobile
    ? [planeSize[0] - 0.1, planeSize[1] - 0.2]
    : [planeSize[0] + 0.35, planeSize[1] + 0.35]

  // Page-scroll drives progress 0..1 across the tall wrapper (sticky canvas).
  useEffect(() => {
    let raf = 0
    const total = (images.length - 1) * zSpacing
    // Scroll progress at which image `idx` is focal (at FADE_PEAK).
    const focalP = (idx: number) =>
      clamp((CAM_START - FADE_PEAK + idx * zSpacing) / (total + TRAVEL_PAD), 0, 1)
    // Mobile: wider fade window (slower crossfade). Desktop: tighter window.
    const fadeWindowSize = mobileRef.current ? 1.8 : 1.2
    // crossfade window
    const fadeP = (fadeWindowSize * zSpacing) / (total + TRAVEL_PAD)
    const update = () => {
      raf = 0
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const p = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0
      progressRef.current = p

      // Pin the canvas layer ourselves instead of relying on CSS `position:sticky`
      // (which silently fails under some ancestor layouts / Lenis on mobile).
      // Before the section: park at top. While scrolling through: fix to viewport.
      // After: park at bottom. Identical behaviour on mobile / tablet / desktop.
      const pin = pinRef.current
      if (pin) {
        if (rect.top > 0) {
          pin.style.position = 'absolute'
          pin.style.top = '0'
          pin.style.bottom = ''
        } else if (rect.bottom < window.innerHeight) {
          pin.style.position = 'absolute'
          pin.style.top = ''
          pin.style.bottom = '0'
        } else {
          pin.style.position = 'fixed'
          pin.style.top = '0'
          pin.style.bottom = ''
        }
      }

      // Each title centers on its image stop; crossfade around that point.
      headingRefs.current.forEach((h, i) => {
        if (!h) return
        const center = focalP(headingStops[i] ?? i)
        h.style.opacity = String(clamp(1 - Math.abs(p - center) / fadeP, 0, 1))
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [images.length, zSpacing, headingStops])

  return (
    <div ref={wrapRef} className={className} style={{ position: 'relative', height: `${(images.length + 1) * vhPerImage}vh` }}>
      <div
        ref={pinRef}
        style={{ position: 'absolute', top: 0, left: 0, height: '100vh', width: '100%', overflow: 'hidden' }}
      >
        <Canvas
          camera={{ position: [0, 0, 9], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ powerPreference: 'high-performance', antialias: false }}
        >
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <Scene images={images} progressRef={progressRef} zSpacing={zSpacing} planeSize={adjustedPlaneSize} />
          </Suspense>
        </Canvas>
        {/* Centered titles — all stacked at the same spot, crossfading by scroll band */}
        {headings.map((title, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <h3
              ref={(el) => {
                headingRefs.current[i] = el
              }}
              style={{
                fontFamily: 'var(--font-sofia), system-ui, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(48px, 12vw, 96px)',
                lineHeight: 1,
                margin: 0,
                color: '#FFFFFF',
                textAlign: 'center',
                padding: '0 24px',
                opacity: 0,
              }}
            >
              {title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  )
}
