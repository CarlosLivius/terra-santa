import { useId } from 'react'
import { pilotSequence } from '../data/pilotSequence'

type Props = { progress: number; angle: number; zoom: number; openTop: boolean; dusk: boolean }
type Point = readonly [number, number, number]
const clamp = (n: number) => Math.max(0, Math.min(1, n))

export default function PilotSequenceScene({ progress, angle, zoom, openTop, dusk }: Props) {
  const id = useId().replace(/:/g, '')
  const material = pilotSequence.materials
  const finish = clamp((progress - 20) / 65)
  const texture = (name: string) => `url(#${id}-${name})`
  const wallProgress = clamp(progress / 50)
  const openingProgress = clamp((progress - 30) / 20)
  const roofProgress = openTop ? 0 : clamp((progress - 55) / 30)
  const landscape = clamp((progress - 75) / 25)
  const stage = Math.min(4, Math.floor((progress + 12.5) / 25))
  const a = (openTop ? -5 : angle * .45) * Math.PI / 180
  const elevation = openTop ? 1 : .86 - clamp(progress / 100) * .36
  const s = .83 * zoom
  const project = ([x, y, z]: Point) => [500 + ((x - 500) * Math.cos(a) - (z - 100) * Math.sin(a)) * s, 325 + ((x - 500) * Math.sin(a) * elevation + (z - 100) * Math.cos(a) * elevation - y) * s] as const
  const points = (ps: readonly Point[]) => ps.map(p => project(p).join(',')).join(' ')
  const depth = (ps: readonly Point[]) => ps.reduce((sum, [x, , z]) => sum + (x - 500) * Math.sin(a) + (z - 100) * Math.cos(a), 0) / ps.length
  const origin = project([0, 0, 0])
  const matrix = `${Math.cos(a) * s} ${Math.sin(a) * elevation * s} ${-Math.sin(a) * s} ${Math.cos(a) * elevation * s} ${origin[0]} ${origin[1]}`
  const h = openTop ? 10 : 72 * wallProgress
  const polygons: { key: string; ps: Point[]; fill: string; opacity: number; d: number }[] = []
  const face = (key: string, ps: Point[], fill: string, opacity = 1, offset = 0) => polygons.push({ key, ps, fill, opacity, d: depth(ps) + offset })
  for (const [i, [x1, z1, x2, z2]] of pilotSequence.walls.entries()) {
    const horizontal = z1 === z2
    const ox = horizontal ? 0 : 3, oz = horizontal ? 3 : 0
    face(`wall-${i}`, [[x1, 0, z1], [x2, 0, z2], [x2, h, z2], [x1, h, z1]], texture(horizontal ? 'plaster' : 'plaster-shade'), wallProgress)
    face(`wall-top-${i}`, [[x1, h, z1], [x2, h, z2], [x2 + ox, h, z2 + oz], [x1 + ox, h, z1 + oz]], 'var(--white)', wallProgress, .2)
  }
  for (const [i, [x1, z1, x2, z2]] of pilotSequence.windows.entries()) {
    const y1 = Math.min(h, 9), y2 = Math.min(h, 57)
    face(`glass-${i}`, [[x1, y1, z1 + .5], [x2, y1, z2 + .5], [x2, y2, z2 + .5], [x1, y2, z1 + .5]], texture('glass'), openTop ? 0 : openingProgress, 5)
  }
  for (const [i, [x1, z1, x2, z2]] of pilotSequence.roofs.entries()) {
    const y = 74 + (1 - roofProgress) * 45
    face(`roof-${i}`, [[x1 - 4, y + 8, z1 - 4], [x2 + 4, y, z1 - 4], [x2 + 4, y, z2 + 4], [x1 - 4, y + 8, z2 + 4]], texture('roof'), roofProgress, 10)
  }

  return <div className="house-scene pilot-sequence-scene" data-testid="house-scene" data-stage={progress < 25 ? 'terrain' : progress < 55 ? 'plan' : progress < 90 ? 'structure' : 'complete'} data-pilot-state={pilotSequence.chapters[stage].key} data-open-top={openTop} data-angle={angle} data-atmosphere={dusk ? 'dusk' : 'day'}>
    <svg viewBox="0 0 1000 600" role="img" aria-label={`${pilotSequence.referenceAlt} Estado: ${pilotSequence.chapters[stage].label}.`}>
      <defs>
        <clipPath id={`${id}-plan`}><rect width={pilotSequence.referenceSize.width} height={pilotSequence.referenceSize.height} /></clipPath>
        <linearGradient id={`${id}-light`} x2=".25" y2="1"><stop stopColor="#ffffff" stopOpacity=".5" /><stop offset="1" stopColor="#253530" stopOpacity=".18" /></linearGradient>
        <linearGradient id={`${id}-glass`} x2=".8" y2="1"><stop stopColor="#dae9e9" /><stop offset=".4" stopColor={material.glass} /><stop offset=".43" stopColor="#dce7e3" /><stop offset=".49" stopColor="#8ba6a4" /><stop offset="1" stopColor="#3e605f" /></linearGradient>
        {['plaster', 'plaster-shade', 'soil', 'lawn'].map((name, index) => <pattern key={name} id={`${id}-${name}`} width="19" height="19" patternUnits="userSpaceOnUse">
          <rect width="19" height="19" fill={[material.plaster, material.plasterShade, material.soil, material.lawn][index]} />
          {Array.from({ length: 14 }, (_, n) => <path key={n} d={`M${(n * 7) % 19} ${(n * 11) % 19} l${index === 3 ? 1 : .5} ${index === 3 ? -2 : .3}`} stroke={n % 2 ? '#ffffff' : '#354438'} strokeWidth=".55" opacity={index > 1 ? .22 : .13} />)}
        </pattern>)}
        <pattern id={`${id}-roof`} width="14" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(-16)"><rect width="14" height="30" fill={material.roof} /><path d="M1 0V30 M13 0V30" stroke={material.roofSeam} strokeWidth=".6" /><path d="M3 0V30" stroke="#263334" strokeWidth="1.5" /><path d="M0 29H14" stroke="#a8afab" opacity=".25" /></pattern>
        <pattern id={`${id}-paving`} width="24" height="16" patternUnits="userSpaceOnUse"><rect width="24" height="16" fill={material.paving} /><path d="M0 0H24V16H0Z M12 0V8 M0 8H24" fill="none" stroke="#a2a99f" strokeWidth=".7" /></pattern>
        <radialGradient id={`${id}-canopy`} cx=".32" cy=".25"><stop stopColor="#a4b67d" /><stop offset=".5" stopColor="#6f8755" /><stop offset="1" stopColor="#3e583e" /></radialGradient>
        <filter id={`${id}-shadow`} x="-30%" y="-60%" width="170%" height="240%"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>
      <g transform={`matrix(${matrix})`} data-testid="pilot-environment" data-finish={finish}>
        <rect x="-500" y="-550" width="2000" height="1200" fill={texture('soil')} />
        <rect x="-500" y="-550" width="2000" height="1200" fill={texture('lawn')} opacity={finish} />
        <path d="M-500 340H1500" stroke={material.road} strokeWidth="92" />
        <path d="M-500 340H1500" stroke="#e3e4ce" strokeWidth="2" strokeDasharray="30 35" opacity={finish} />
        <rect x="-65" y="235" width="1130" height="52" fill={texture('paving')} opacity={finish} />
        <path d="M-65 288H1065" stroke="#eeeae0" strokeWidth="5" opacity={finish} />
        <rect x="-20" y="-20" width="1040" height="242" rx="3" fill={texture('soil')} />
        <rect x="-20" y="-20" width="1040" height="242" rx="3" fill={texture('paving')} opacity={finish} />
        <path d="M778 202V264H991V202" fill={texture('paving')} opacity={finish} />
        <rect x="8" y="15" width="1020" height="206" fill="#26372b" opacity={wallProgress * .3} filter={texture('shadow')} />
        <rect x="-500" y="-550" width="2000" height="1200" fill={texture('light')} />
      </g>
      <g opacity={finish}>{pilotSequence.environmentTrees.map(([x, z], i) => {
        const [cx, cy] = project([x, 40, z]); const [bx, by] = project([x, 0, z])
        return <g key={i}><ellipse cx={bx + 18} cy={by + 8} rx="30" ry="9" fill="#233b2d" opacity=".2" filter={texture('shadow')} /><path d={`M${bx},${by}L${cx},${cy - 12}`} stroke="#766451" strokeWidth="3" />{Array.from({ length: 7 }, (_, j) => <circle key={j} cx={cx + Math.cos(j * 2.4) * 13} cy={cy - 15 + Math.sin(j * 2.4) * 12} r={13 + j % 3} fill={texture('canopy')} />)}</g>
      })}</g>
      <g className="pilot-reference-underlay" data-testid="pilot-reference-underlay" transform={`matrix(${matrix})`} clipPath={`url(#${id}-plan)`} opacity={openTop ? 1 : 1 - roofProgress * .4}>
        <image href={pilotSequence.foundation.src} x={pilotSequence.foundation.x} y={pilotSequence.foundation.y} width={pilotSequence.foundation.width} height={pilotSequence.foundation.height} preserveAspectRatio="xMidYMid meet" />
      </g>
      <g className="pilot-trace-layer" opacity={1 - roofProgress * .6} fill="none" stroke="var(--clay)" strokeWidth="1.4">{pilotSequence.walls.map(([x1, z1, x2, z2], i) => <path key={i} d={`M${project([x1, 0, z1]).join(',')} L${project([x2, 0, z2]).join(',')}`} />)}</g>
      {polygons.sort((one, two) => one.d - two.d).map(p => <g key={p.key} opacity={p.opacity}><polygon points={points(p.ps)} fill={p.fill} stroke="#666e65" strokeWidth=".45" strokeLinejoin="round" /><polygon points={points(p.ps)} fill={texture('light')} opacity=".65" />{p.key.startsWith('wall-') && !p.key.startsWith('wall-top') && <path d={`M${project(p.ps[0]).join(',')}L${project(p.ps[1]).join(',')}`} stroke="#555f55" strokeWidth="1.8" opacity=".4" />}</g>)}
      <g data-testid="pilot-landscape-overlay" opacity={landscape}>{pilotSequence.trees.map(([x, z], i) => {
        const [cx, cy] = project([x, 23, z]); const base = project([x, 0, z])
        return <g key={i}><ellipse cx={base[0] + 10} cy={base[1] + 5} rx="20" ry="6" fill="#263c2e" opacity=".2" /><path d={`M${base.join(',')} L${cx},${cy}`} stroke="#79654c" strokeWidth="2" />{Array.from({ length: 5 }, (_, j) => <circle key={j} cx={cx + Math.cos(j * 2.4) * 7} cy={cy - 10 + Math.sin(j * 2.4) * 9} r="10" fill={texture('canopy')} />)}</g>
      })}</g>
    </svg>
  </div>
}
