import { useId, type ReactNode } from 'react'
import type { Residence } from '../data/residences'

type Point = readonly [x: number, y: number, z: number]
type Surface = { key: string; points: Point[]; fill: string; opacity?: number; stroke?: string; width?: number; sortDepth?: number }
type Volume = { x: number; z: number; width: number; depth: number; height: number }

export type HouseSceneProps = {
  residence: Residence
  progress?: number
  angle?: number
  openTop?: boolean
  atmosphere?: 'day' | 'dusk'
  zoom?: number
  miniature?: boolean
  onHotspot?: (id: string) => void
  moving?: boolean
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const toneColors: Record<Residence['visual']['tone'], string> = {
  sand: 'var(--wall)', ivory: 'var(--white)', terracotta: 'var(--clay)', leaf: 'var(--leaf)',
}

/** A conceptual, reversible architectural scene. Coordinates have no physical units. */
export default function HouseScene({
  residence, progress = 100, angle = -35, openTop = false,
  atmosphere = 'day', zoom = 1, miniature = false, onHotspot, moving = false,
}: HouseSceneProps) {
  const id = useId().replace(/:/g, '')
  const p = clamp(progress / 100)
  const plan = clamp(p / .33)
  const structure = clamp((p - .33) / .33)
  const finish = clamp((p - .66) / .34)
  const dusk = atmosphere === 'dusk'
  const stage = progress < 25 ? 'terrain' : progress < 55 ? 'plan' : progress < 90 ? 'structure' : 'complete'
  const rotation = (openTop ? angle * .23 : angle) * Math.PI / 180
  const scale = 1.36 * clamp(zoom, .8, 1.3)
  const elevation = openTop ? .96 : .49
  const heightScale = openTop ? .32 : 1.02
  const originY = openTop ? 290 : 350
  const project = ([x, y, z]: Point) => {
    const rx = x * Math.cos(rotation) - z * Math.sin(rotation)
    const rz = x * Math.sin(rotation) + z * Math.cos(rotation)
    return [400 + rx * scale, originY + (rz * elevation - y * heightScale) * scale] as const
  }
  const depthOf = (points: Point[]) => points.reduce((sum, [x, , z]) => sum + x * Math.sin(rotation) + z * Math.cos(rotation), 0) / points.length
  const toPoints = (points: Point[]) => points.map((point) => project(point).map((n) => n.toFixed(2)).join(',')).join(' ')
  const faces: Surface[] = []
  const worldElements: { key: string; depth: number; node: ReactNode }[] = []
  const face = (key: string, points: Point[], fill: string, opacity = 1, stroke?: string, width?: number, sortDepth?: number) => {
    faces.push({ key, points, fill, opacity, stroke, width, sortDepth })
  }
  const box = (key: string, x: number, z: number, width: number, depth: number, bottom: number, height: number, fill: string, shade = 'var(--wall-shade)', opacity = 1) => {
    const right = x + width, far = z + depth, top = bottom + height
    face(`${key}-back`, [[x, bottom, z], [right, bottom, z], [right, top, z], [x, top, z]], shade, opacity)
    face(`${key}-left`, [[x, bottom, z], [x, bottom, far], [x, top, far], [x, top, z]], shade, opacity)
    face(`${key}-right`, [[right, bottom, z], [right, bottom, far], [right, top, far], [right, top, z]], shade, opacity)
    face(`${key}-front`, [[x, bottom, far], [right, bottom, far], [right, top, far], [x, top, far]], fill, opacity)
    face(`${key}-top`, [[x, top, z], [right, top, z], [right, top, far], [x, top, far]], fill, opacity)
  }
  const plane = (key: string, x: number, z: number, width: number, depth: number, y: number, fill: string, opacity = 1) => {
    face(key, [[x, y, z], [x + width, y, z], [x + width, y, z + depth], [x, y, z + depth]], fill, opacity)
  }
  const layouts: Record<Residence['visual']['layout'], Volume[]> = {
    compact: [{ x: -120, z: -85, width: 240, depth: 170, height: 80 }],
    linear: [{ x: -165, z: -62, width: 330, depth: 124, height: 73 }],
    courtyard: [
      { x: -132, z: -96, width: 80, depth: 192, height: 76 },
      { x: -52, z: -96, width: 184, depth: 76, height: 76 },
    ],
    split: [
      { x: -132, z: -86, width: 112, depth: 172, height: 108 },
      { x: -20, z: -32, width: 154, depth: 118, height: 74 },
    ],
  }
  const volumes = layouts[residence.visual.layout]
  const pilot = residence.visual.layout === 'compact'
  const minX = Math.min(...volumes.map((v) => v.x))
  const minZ = Math.min(...volumes.map((v) => v.z))
  const maxX = Math.max(...volumes.map((v) => v.x + v.width))
  const maxZ = Math.max(...volumes.map((v) => v.z + v.depth))
  const roomPosition = (position: { x: number; y: number }) => {
    const x = minX + position.x * (maxX - minX)
    const z = minZ + position.y * (maxZ - minZ)
    // Keep conceptual hotspots in the closest built volume of an L/split study.
    const nearest = volumes.map((v) => {
      const px = clamp(x, v.x + 15, v.x + v.width - 15)
      const pz = clamp(z, v.z + 15, v.z + v.depth - 15)
      return { x: px, z: pz, distance: (px - x) ** 2 + (pz - z) ** 2 }
    }).sort((a, b) => a.distance - b.distance)[0]
    return [nearest.x, nearest.z] as const
  }
  const wall = toneColors[residence.visual.tone]
  const wallShade = residence.visual.tone === 'terracotta' ? 'var(--clay-dark)' : residence.visual.tone === 'leaf' ? 'var(--leaf)' : 'var(--wall-shade)'

  // The same footprint persists throughout terrain, plan, structure and completion.
  if (pilot) box('foundation', -130, -95, 260, 190, -9, 8, 'var(--sand)', 'var(--line)', plan)
  else volumes.forEach((v, i) => box(`foundation-${i}`, v.x - 8, v.z - 8, v.width + 16, v.depth + 16, -9, 8, 'var(--sand)', 'var(--line)', plan))
  // The ground slab is beneath every room, irrespective of its average depth.
  faces.forEach((surface) => { if (surface.key.startsWith('foundation')) surface.sortDepth = -10000 + depthOf(surface.points) })
  plane('terrace', -155, 89, 300, 43, -1, 'var(--sand)', finish)
  if (!miniature) {
    for (let i = 0; i < 11; i++) {
      plane(`terrace-joint-${i}`, -151 + i * 28, 90, .7, 41, -.7, 'var(--line)', finish)
    }
  }

  // Casa 1: two sleeping spaces, one bathroom, living room and kitchen.
  const floors: [string, number, number, number, number, string][] = pilot ? [
    ['bedroom-one', -116, -81, 105, 69, 'var(--wood)'],
    ['bedroom-two', -8, -81, 52, 69, 'var(--wood)'],
    ['bathroom', 48, -81, 68, 69, 'var(--white)'],
    ['living', -116, -8, 124, 89, 'var(--ivory)'],
    ['kitchen', 12, -8, 104, 89, 'var(--white)'],
  ] : volumes.map((v, i) => [`study-${i}`, v.x + 4, v.z + 4, v.width - 8, v.depth - 8, 'var(--ivory)'])
  if (!pilot) {
    if (residence.visual.layout === 'linear') {
      floors.push(['study-rest', -160, -58, 241, 52, 'var(--wood)'], ['study-care', 85, -58, 76, 52, 'var(--white)'])
    } else {
      const [bedX, bedZ] = roomPosition(residence.hotspots.find((h) => h.roomType === 'bedroom')?.position ?? { x: .2, y: .2 })
      floors.push(['study-rest', bedX - 24, bedZ - 28, 48, 56, 'var(--wood)'])
    }
  }
  floors.forEach(([key, x, z, width, depth, color]) => plane(`floor-${key}`, x, z, width, depth, .5, color, plan * (openTop ? 1 : .7)))
  faces.forEach((surface) => { if (surface.key.startsWith('floor-')) surface.sortDepth = -9000 + depthOf(surface.points) })

  const partitionHeight = openTop ? 8 * structure : 50 * structure
  const furniture = pilot && openTop && finish > .8 && !miniature
  if (furniture) {
    // Simple low volumes keep the drawing legible at mobile sizes.
    plane('living-rug', -90, 5, 71, 56, 1, 'var(--sand)')
    box('sofa-seat', -108, 17, 25, 54, 2, 10, 'var(--white)', 'var(--line)')
    box('sofa-back', -115, 13, 8, 62, 2, 20, 'var(--wall)', 'var(--sand)')
    box('sofa-arm-a', -108, 10, 25, 7, 2, 18, 'var(--wall)', 'var(--sand)')
    box('sofa-arm-b', -108, 71, 25, 7, 2, 18, 'var(--wall)', 'var(--sand)')
    box('coffee-table', -67, 25, 31, 25, 2, 9, 'var(--wood)', 'var(--roof)')
    plane('coffee-book', -59, 31, 10, 9, 11.5, 'var(--ivory)')
    box('bed-one-base', -100, -76, 62, 50, 2, 8, 'var(--sand)', 'var(--wood)')
    plane('bed-one-linen', -97, -73, 56, 44, 10.5, 'var(--white)')
    plane('bed-one-throw', -97, -45, 56, 16, 10.8, 'var(--clay)', .75)
    box('pillow-one', -92, -70, 20, 10, 11, 2, 'var(--ivory)', 'var(--sand)')
    box('pillow-two', -69, -70, 20, 10, 11, 2, 'var(--ivory)', 'var(--sand)')
    box('bedside', -29, -74, 12, 12, 2, 11, 'var(--wood)', 'var(--roof)')
    box('bed-two', 1, -72, 31, 49, 2, 8, 'var(--sand)', 'var(--wood)')
    plane('bed-two-linen', 3, -70, 27, 43, 10.5, 'var(--white)')
    plane('bed-two-throw', 3, -42, 27, 15, 10.8, 'var(--leaf)', .65)
    box('pillow-three', 6, -67, 21, 10, 11, 2, 'var(--ivory)', 'var(--sand)')
    box('wardrobe', -7, -79, 8, 60, 2, 19, 'var(--wood)', 'var(--roof)')
    box('bath-counter', 56, -76, 53, 15, 2, 15, 'var(--sand)', 'var(--line)')
    plane('bath-sink', 70, -74, 24, 10, 17.5, 'var(--white)')
    box('shower-glass', 91, -50, 2, 32, 1, 26, 'var(--glass)', 'var(--glass)', .45)
    plane('shower-floor', 95, -50, 16, 31, 1.4, 'var(--sand)')
    box('toilet', 59, -39, 15, 22, 2, 8, 'var(--white)', 'var(--line)')
    box('kitchen-counter', 19, 65, 88, 15, 2, 22, 'var(--wood)', 'var(--roof)')
    plane('kitchen-worktop', 18, 64, 90, 17, 24.5, 'var(--wall)')
    plane('kitchen-sink', 79, 68, 19, 10, 24.8, 'var(--glass)')
    plane('cooktop', 30, 67, 20, 11, 24.8, 'var(--ink)')
    box('kitchen-island', 39, 24, 52, 25, 2, 18, 'var(--wall)', 'var(--sand)')
    plane('island-top', 37, 22, 56, 29, 20.5, 'var(--wood)')
    for (let i = 0; i < 2; i++) box(`kitchen-stool-${i}`, 42 + i * 29, 10, 11, 11, 2, 12, 'var(--wood)', 'var(--roof)')
  }

  if (!pilot && openTop && finish > .8 && !miniature) {
    // These are replaceable spatial studies; the public copy comes from Residence.
    residence.hotspots.forEach((hotspot) => {
      const [cx, cz] = roomPosition(hotspot.position)
      if (hotspot.roomType === 'living') {
        plane(`study-rug-${hotspot.id}`, cx - 25, cz - 23, 50, 46, 1, 'var(--sand)')
        box(`study-sofa-${hotspot.id}`, cx - 27, cz - 22, 17, 44, 2, 13, 'var(--white)', 'var(--line)')
        box(`study-table-${hotspot.id}`, cx - 1, cz - 9, 22, 18, 2, 9, 'var(--wood)', 'var(--roof)')
      } else if (hotspot.roomType === 'kitchen') {
        box(`study-worktop-${hotspot.id}`, cx - 28, cz - 14, 56, 19, 2, 18, 'var(--wood)', 'var(--roof)')
        plane(`study-sink-${hotspot.id}`, cx + 9, cz - 10, 13, 11, 20.5, 'var(--glass)')
        plane(`study-hob-${hotspot.id}`, cx - 20, cz - 10, 13, 11, 20.5, 'var(--ink)')
      } else if (hotspot.roomType === 'bath') {
        plane(`study-care-${hotspot.id}`, cx - 22, cz - 23, 44, 46, 1, 'var(--white)')
        box(`study-basin-${hotspot.id}`, cx - 18, cz - 19, 36, 14, 2, 15, 'var(--sand)', 'var(--line)')
        plane(`study-sink-care-${hotspot.id}`, cx - 9, cz - 17, 18, 10, 17.5, 'var(--white)')
        box(`study-care-glass-${hotspot.id}`, cx + 8, cz + 1, 1.5, 20, 1, 24, 'var(--glass)', 'var(--glass)', .45)
      } else if (hotspot.roomType === 'bedroom') {
        const knownBedrooms = residence.features.bedrooms
        const count = residence.visual.layout === 'linear' && knownBedrooms.confidence === 'confirmed' && knownBedrooms.value !== null ? clamp(knownBedrooms.value, 1, 3) : 1
        for (let i = 0; i < count; i++) {
          const bx = count > 1 ? -141 + i * 78 : cx - 19
          const bz = count > 1 ? -52 : cz - 23
          box(`study-bed-${i}`, bx, bz, 38, 44, 2, 8, 'var(--sand)', 'var(--wood)')
          plane(`study-linen-${i}`, bx + 2, bz + 2, 34, 40, 10.5, 'var(--white)')
          plane(`study-throw-${i}`, bx + 2, bz + 28, 34, 14, 10.8, toneColors[residence.visual.tone], .8)
          box(`study-pillow-${i}`, bx + 7, bz + 4, 24, 10, 11, 2, 'var(--ivory)', 'var(--sand)')
        }
      }
    })
  }

  if (structure > 0) {
    volumes.forEach((volume, index) => {
      const { x, z, width, depth, height } = volume
      const h = openTop ? 10 * structure : height * structure
      box(`wall-${index}-back`, x, z, width, 4, 0, h, wall, wallShade)
      box(`wall-${index}-left`, x, z + 4, 4, depth - 8, 0, h, wall, wallShade)
      box(`wall-${index}-right`, x + width - 4, z + 4, 4, depth - 8, 0, h, wall, wallShade)
      box(`wall-${index}-front`, x, z + depth - 4, width, 4, 0, h, wall, wallShade)
    })
    if (pilot) {
      box('partition-sleeping', -116, -12, 232, 4, 0, partitionHeight, 'var(--wall)', 'var(--line)')
      box('partition-bedroom', -11, -81, 4, 69, 0, partitionHeight, 'var(--wall)', 'var(--line)')
      box('partition-bath', 44, -81, 4, 69, 0, partitionHeight, 'var(--wall)', 'var(--line)')
    } else if (residence.visual.layout === 'linear') {
      box('study-partition', -161, -6, 322, 4, 0, partitionHeight, 'var(--wall)', 'var(--line)')
      for (let i = 1; i < 4; i++) box(`study-partition-${i}`, -160 + i * 81, -58, 3, 52, 0, partitionHeight, 'var(--wall)', 'var(--line)')
    }
  }

  if (!openTop && finish > 0) {
    volumes.forEach((volume, index) => {
      const { x, z, width, depth, height } = volume
      const glass = dusk ? 'var(--light)' : `url(#${id}-glass)`
      const front = z + depth + .8
      const left = x - .8
      const right = x + width + .8
      const frontDepth = depthOf([[x + width / 2, 0, z + depth]]) + .2
      const frontWindow = (key: string, from: number, to: number, bottom: number, top: number) => {
        face(key, [[from, bottom, front], [to, bottom, front], [to, top, front], [from, top, front]], glass, finish, undefined, undefined, frontDepth)
        for (let i = 0; i < 4; i++) {
          const at = from + (to - from) * i / 3
          face(`${key}-frame-${i}`, [[at, bottom, front + .3], [at + 1.3, bottom, front + .3], [at + 1.3, top, front + .3], [at, top, front + .3]], 'var(--roof)', finish, undefined, undefined, frontDepth + .1)
        }
        face(`${key}-sill`, [[from - 2, bottom - 2, front], [to + 2, bottom - 2, front], [to + 2, bottom, front], [from - 2, bottom, front]], 'var(--roof)', finish, undefined, undefined, frontDepth + .1)
      }
      frontWindow(`front-glass-${index}`, x + width * .48, x + width * .92, 7, height * .83)
      frontWindow(`front-window-${index}`, x + width * .07, x + width * .32, height * .36, height * .81)
      face(`front-door-${index}`, [[x + width * .35, 1, front], [x + width * .46, 1, front], [x + width * .46, height * .83, front], [x + width * .35, height * .83, front]], 'var(--wood)', finish, undefined, undefined, frontDepth)
      for (let i = 0; i < (miniature ? 0 : 8); i++) {
        const at = x + width * .35 + i * width * .014
        face(`door-slat-${index}-${i}`, [[at, 1, front + .3], [at + .9, 1, front + .3], [at + .9, height * .83, front + .3], [at, height * .83, front + .3]], 'var(--roof)', finish * .6, undefined, undefined, frontDepth + .1)
      }
      for (const side of [left, right]) {
        const sideDepth = depthOf([[side < x ? x : x + width, 0, z + depth / 2]]) + .2
        face(`side-window-${index}-${side}`, [[side, height * .34, z + depth * .23], [side, height * .34, z + depth * .62], [side, height * .77, z + depth * .62], [side, height * .77, z + depth * .23]], glass, finish, undefined, undefined, sideDepth)
        face(`side-mullion-${index}-${side}`, [[side, height * .34, z + depth * .42], [side, height * .34, z + depth * .42 + 1.5], [side, height * .77, z + depth * .42 + 1.5], [side, height * .77, z + depth * .42]], 'var(--roof)', finish, undefined, undefined, sideDepth + .1)
      }
      face(`back-window-${index}`, [[x + width * .2, height * .4, z - .8], [x + width * .78, height * .4, z - .8], [x + width * .78, height * .74, z - .8], [x + width * .2, height * .74, z - .8]], glass, finish, undefined, undefined, depthOf([[x + width / 2, 0, z]]) + .2)
      const eave = 9
      const roofY = height + 2
      const roofFill = residence.visual.roof === 'gable' ? 'var(--roof)' : 'var(--ink)'
      if (residence.visual.roof === 'gable') {
        const ridge = height + 39
        face(`roof-left-${index}`, [[x - eave, roofY, z - eave], [x + width / 2, ridge, z - eave], [x + width / 2, ridge, z + depth + eave], [x - eave, roofY, z + depth + eave]], roofFill, finish)
        face(`roof-right-${index}`, [[x + width / 2, ridge, z - eave], [x + width + eave, roofY, z - eave], [x + width + eave, roofY, z + depth + eave], [x + width / 2, ridge, z + depth + eave]], 'var(--wood)', finish)
        face(`gable-front-${index}`, [[x, height, z + depth], [x + width, height, z + depth], [x + width / 2, ridge - 3, z + depth]], wall, finish)
        face(`gable-back-${index}`, [[x, height, z], [x + width, height, z], [x + width / 2, ridge - 3, z]], wallShade, finish)
        if (!miniature) {
          for (let i = 1; i < 15; i++) {
            const rx = x - eave + (width + eave * 2) * i / 15
            const ry = roofY + (1 - Math.abs((rx - x - width / 2) / (width / 2 + eave))) * (ridge - roofY) + .7
            const roofCenter = rx < x + width / 2 ? x + width / 4 - eave / 2 : x + width * .75 + eave / 2
            face(`roof-seam-${index}-${i}`, [[rx, ry, z - eave], [rx + .7, ry, z - eave], [rx + .7, ry, z + depth + eave], [rx, ry, z + depth + eave]], 'var(--ink)', finish * .3, undefined, undefined, depthOf([[roofCenter, 0, z + depth / 2]]) + .2)
          }
        }
      } else if (residence.visual.roof === 'mono') {
        const high = roofY + 29
        face(`mono-roof-${index}`, [[x - eave, high, z - eave], [x + width + eave, roofY, z - eave], [x + width + eave, roofY, z + depth + eave], [x - eave, high, z + depth + eave]], 'var(--roof)', finish)
        face(`mono-front-${index}`, [[x, height, z + depth], [x + width, height, z + depth], [x + width, roofY, z + depth], [x, high - 2, z + depth]], wall, finish)
        face(`mono-back-${index}`, [[x, height, z], [x + width, height, z], [x + width, roofY, z], [x, high - 2, z]], wallShade, finish)
        face(`mono-side-${index}`, [[x, height, z], [x, height, z + depth], [x, high - 2, z + depth], [x, high - 2, z]], wallShade, finish)
        if (!miniature) for (let i = 1; i < 10; i++) {
          const at = x - eave + (width + eave * 2) * i / 10
          const y = high - 29 * i / 10 + .5
          face(`mono-seam-${index}-${i}`, [[at, y, z - eave], [at + .8, y, z - eave], [at + .8, y, z + depth + eave], [at, y, z + depth + eave]], 'var(--ink)', finish * .26, undefined, undefined, depthOf([[x + width / 2, 0, z + depth / 2]]) + .2)
        }
      } else {
        box(`flat-roof-${index}`, x - eave, z - eave, width + eave * 2, depth + eave * 2, roofY, 6, roofFill, 'var(--roof)', finish)
      }
    })
  }

  const tree = (key: string, x: number, z: number, size: number) => {
    const [px, py] = project([x, 0, z])
    const [tx, ty] = project([x, size * .64, z])
    worldElements.push({ key, depth: depthOf([[x, 0, z]]), node: (
      <g opacity={finish}>
        <ellipse cx={px + size * .4} cy={py + size * .1} rx={size * .66} ry={size * .18} fill="var(--ink)" opacity=".1" />
        <path d={`M${px},${py} L${tx},${ty} M${tx},${ty + 12} l${-size * .15},${-size * .2} M${tx},${ty + 8} l${size * .2},${-size * .25}`} stroke="var(--wood)" strokeWidth={size * .06} fill="none" />
        <ellipse cx={tx} cy={ty - size * .2} rx={size * .45} ry={size * .55} fill="var(--leaf)" />
        <ellipse cx={tx - size * .2} cy={ty - size * .08} rx={size * .3} ry={size * .4} fill="var(--leaf)" />
        <ellipse cx={tx + size * .17} cy={ty - size * .24} rx={size * .3} ry={size * .43} fill="var(--lawn)" opacity=".52" />
        {!miniature && <path d={`M${tx - 9},${ty + 4} q8,-28 6,-49 M${tx + 3},${ty - 5} l14,-20`} stroke="var(--lawn)" strokeWidth="1" opacity=".5" fill="none" />}
      </g>
    ) })
  }
  tree('tree-back', -171, -112, 62)
  tree('tree-right', 181, 76, 47)
  if (!miniature) tree('tree-small', 156, -117, 32)
  for (let i = 0; i < (miniature ? 3 : 10); i++) {
    const x = -156 + i * 31
    const z = -125
    const [sx, sy] = project([x, 4, z])
    worldElements.push({ key: `plant-${i}`, depth: depthOf([[x, 0, z]]), node: <ellipse cx={sx} cy={sy} rx="12" ry="8" fill="var(--leaf)" opacity={finish * .72} /> })
  }

  const sceneLayers = [
    ...faces.map((surface) => ({ key: surface.key, depth: surface.sortDepth ?? (openTop ? depthOf(surface.points) * .1 + surface.points.reduce((sum, [, y]) => sum + y, 0) / surface.points.length * 20 : depthOf(surface.points)), node: (
      <polygon points={toPoints(surface.points)} fill={surface.fill} opacity={surface.opacity} stroke={surface.stroke} strokeWidth={surface.width} strokeLinejoin="round" />
    ) })),
    ...worldElements,
  ].sort((a, b) => a.depth - b.depth)

  const outlinePath = volumes.map(({ x, z, width, depth }) => {
    const outline: Point[] = [[x, 1, z], [x + width, 1, z], [x + width, 1, z + depth], [x, 1, z + depth], [x, 1, z]]
    return `M${outline.map((point) => project(point).join(',')).join(' L')}`
  }).join(' ')
  const hotspotVisible = openTop && !miniature && !moving && progress >= 95 && !!onHotspot
  const planReferenceOpacity = residence.id === 'casa-1'
    ? (openTop ? .9 : p < .34 ? .88 : clamp((.9 - p) / .56) * .88)
    : 0

  return (
    <div className={`house-scene${miniature ? ' house-scene-miniature' : ''}`} data-testid="house-scene" data-art-style="architectural-study" data-stage={stage} data-source-plan={residence.id === 'casa-1' ? 'reference-received' : 'procedural'} data-angle={angle} data-open-top={openTop} data-atmosphere={atmosphere}>
      <svg viewBox="0 0 800 560" role="img" aria-label={`Estudo conceitual de ${residence.name}: ${openTop ? 'planta aberta' : 'exterior'}, ${dusk ? 'entardecer' : 'dia'}. Representação visual sem medidas.`}>
        <defs>
          <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--night)" />
            <stop offset=".55" stopColor="var(--glass)" />
            <stop offset="1" stopColor="var(--ivory)" />
          </linearGradient>
          <radialGradient id={`${id}-aura`}>
            <stop offset="0" stopColor={dusk ? 'var(--clay)' : 'var(--white)'} stopOpacity={dusk ? '.17' : '.65'} />
            <stop offset="1" stopColor={dusk ? 'var(--night)' : 'var(--ivory)'} stopOpacity="0" />
          </radialGradient>
          <filter id={`${id}-shadow`} x="-40%" y="-50%" width="180%" height="200%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        <ellipse cx="400" cy="284" rx="353" ry="225" fill={`url(#${id}-aura)`} />
        {!miniature && [0, 1, 2].map((i) => (
          <path key={`contour-${i}`} d={`M${58 - i * 14},${385 + i * 33} C${94 - i * 20},${156 - i * 12} ${665 + i * 34},${160 - i * 22} ${722 + i * 16},${350 + i * 28} C${780 + i * 14},${470 + i * 17} ${328 - i * 20},${553 + i * 7} ${58 - i * 14},${385 + i * 33}`} fill="none" stroke="var(--clay)" strokeWidth=".8" opacity=".13" />
        ))}
        <polygon points={toPoints([[-205, -11, -150], [205, -11, -150], [205, -11, 158], [-205, -11, 158]])} fill={dusk ? 'var(--night)' : 'var(--lawn)'} opacity={dusk ? '.8' : '.42'} />
        <polygon points={toPoints([[-205, -11, 158], [205, -11, 158], [205, -21, 158], [-205, -21, 158]])} fill="var(--sand)" opacity=".9" />
        <polygon points={toPoints([[-205, -11, -150], [-205, -11, 158], [-205, -21, 158], [-205, -21, -150]])} fill="var(--line)" />
        {planReferenceOpacity > .01 && !miniature && <g className="plan-reference-layer" opacity={planReferenceOpacity}>
          <rect x="78" y="156" width="644" height="244" rx="2" fill="var(--white)" opacity=".92" />
          <image href="/assets/floor-plan-reference-provisional.webp" x="88" y="166" width="624" height="224" preserveAspectRatio="xMidYMid meet" />
          <text x="94" y="183" fill="var(--clay-dark)" fontFamily="var(--sans)" fontSize="8" fontWeight="600" letterSpacing="1.4">PLANTA RECEBIDA · SEM ESCALA</text>
        </g>}
        <polygon points={toPoints([[-138, -10, -83], [157, -10, -83], [179, -10, 119], [-94, -10, 144]])} fill="var(--ink)" opacity={.15 * structure} filter={`url(#${id}-shadow)`} />
        <polygon points={toPoints([[27, -10, 132], [58, -10, 132], [58, -10, 159], [27, -10, 159]])} fill="var(--ivory)" opacity={finish * .85} />
        {sceneLayers.map((layer) => <g key={layer.key}>{layer.node}</g>)}
        {!miniature && <g className="art-study" opacity={.35 + structure * .65}>
          <polyline points={toPoints([[-150, 0, -112], [-150, 82, -112], [150, 82, -112], [150, 0, -112]])} fill="none" stroke="var(--art-orange)" strokeWidth="3" />
          <polyline points={toPoints([[-150, 0, 104], [-150, 82, 104], [150, 82, 104], [150, 0, 104]])} fill="none" stroke="var(--art-orange)" strokeWidth="3" />
          <line x1={project([-150, 82, -112])[0]} y1={project([-150, 82, -112])[1]} x2={project([-150, 82, 104])[0]} y2={project([-150, 82, 104])[1]} stroke="var(--art-orange)" strokeWidth="3" />
          <line x1={project([150, 82, -112])[0]} y1={project([150, 82, -112])[1]} x2={project([150, 82, 104])[0]} y2={project([150, 82, 104])[1]} stroke="var(--art-orange)" strokeWidth="3" />
          <line x1={project([-150, 0, -112])[0]} y1={project([-150, 0, -112])[1]} x2={project([150, 82, 104])[0]} y2={project([150, 82, 104])[1]} stroke="var(--art-gray)" strokeWidth="2" />
          <line x1={project([150, 0, -112])[0]} y1={project([150, 0, -112])[1]} x2={project([-150, 82, 104])[0]} y2={project([-150, 82, 104])[1]} stroke="var(--art-gray)" strokeWidth="2" />
          <line x1={project([-108, 32, 106])[0]} y1={project([-108, 32, 106])[1]} x2={project([-42, 32, 106])[0]} y2={project([-42, 32, 106])[1]} stroke="var(--art-blue)" strokeWidth="9" opacity=".82" />
          <line x1={project([18, 26, 106])[0]} y1={project([18, 26, 106])[1]} x2={project([88, 26, 106])[0]} y2={project([88, 26, 106])[1]} stroke="var(--art-pink)" strokeWidth="9" opacity=".82" />
          <line x1={project([-112, 52, 105])[0]} y1={project([-112, 52, 105])[1]} x2={project([112, 52, 105])[0]} y2={project([112, 52, 105])[1]} stroke="var(--art-orange)" strokeWidth="2" />
        </g>}
        {!openTop && finish < .35 && <path d={outlinePath} fill="none" stroke="var(--clay)" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - plan} />}
      </svg>
      {hotspotVisible && residence.hotspots.map((hotspot, index) => {
        const [roomX, roomZ] = pilot ? [-120 + hotspot.position.x * 240, -85 + hotspot.position.y * 170] : roomPosition(hotspot.position)
        const [x, y] = project([roomX, openTop ? 8 : 57, roomZ])
        return (
          <button key={hotspot.id} className="scene-hotspot" data-testid={`hotspot-${hotspot.id}`} aria-label={`Explorar ${hotspot.label}`} style={{ left: `${x / 8}%`, top: `${y / 5.6}%` }} onClick={() => onHotspot?.(hotspot.id)}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          </button>
        )
      })}
    </div>
  )
}
