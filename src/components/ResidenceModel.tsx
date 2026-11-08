import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { Residence } from '../data/residences'

type Props = { residence: Residence; openTop: boolean }
type Palette = { wall: string; trim: string; roof: string; accent: string; glass: string; floor: string; grass: string }
const palettes: Record<Residence['visual']['tone'], Palette> = {
  sand: { wall: '#e5d7bb', trim: '#fff1d9', roof: '#554943', accent: '#9a6041', glass: '#69969b', floor: '#d8c8a8', grass: '#829170' },
  ivory: { wall: '#eee9dc', trim: '#fffaf0', roof: '#454746', accent: '#8c674d', glass: '#72999b', floor: '#d8d0c1', grass: '#7b8d73' },
  terracotta: { wall: '#d9c2a1', trim: '#f5e9d2', roof: '#985a3f', accent: '#aa6545', glass: '#71969a', floor: '#cfb18d', grass: '#75866c' },
  leaf: { wall: '#d8dfc9', trim: '#f5f2df', roof: '#42594a', accent: '#9a6544', glass: '#71969a', floor: '#c9d0b6', grass: '#748967' },
}

function buildHouse(residence: Residence, openTop: boolean) {
  const id = residence.id
  const palette = palettes[residence.visual.tone]
  const root = new THREE.Group()
  const mat = (color: string, roughness = .78) => new THREE.MeshStandardMaterial({ color, roughness })
  const materials = {
    wall: mat(palette.wall), trim: mat(palette.trim), roof: mat(palette.roof), accent: mat(palette.accent),
    glass: new THREE.MeshPhysicalMaterial({ color: palette.glass, roughness: .18, metalness: .08, transparent: true, opacity: .78 }),
    dark: mat('#333936', .45), floor: mat(palette.floor), wood: mat('#98704e'), fabric: mat('#d8cfbd'), green: mat('#536f4f'),
    white: mat('#f1eee5'), stone: mat('#aaa395'), grass: mat(palette.grass),
  }
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, material: THREE.Material, parent = root) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh
  }
  const sphere = (radius: number, x: number, y: number, z: number, material: THREE.Material, parent = root) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 12), material)
    mesh.position.set(x, y, z); mesh.castShadow = true; parent.add(mesh); return mesh
  }
  const cylinder = (r1: number, r2: number, h: number, x: number, y: number, z: number, material: THREE.Material, parent = root) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, 12), material)
    mesh.position.set(x, y, z); mesh.castShadow = true; parent.add(mesh); return mesh
  }
  const floor = (w: number, d: number, x: number, z: number) => box(w, .22, d, x, .08, z, materials.floor)
  const wallX = (x: number, z: number, length: number, height = 2.65, material = materials.wall) => box(.18, height, length, x, height / 2 + .2, z, material)
  const wallZ = (x: number, z: number, length: number, height = 2.65, material = materials.wall) => box(length, height, .18, x, height / 2 + .2, z, material)
  const windowX = (x: number, z: number, width: number, height = 1.35) => {
    box(.09, height, width, x, 1.38, z, materials.dark)
    box(.06, height - .12, width - .12, x - .06, 1.38, z, materials.glass)
    box(.14, .045, width, x - .025, 1.38, z, materials.trim)
    box(.14, height, .045, x - .025, 1.38, z - width * .24, materials.dark)
    box(.14, height, .045, x - .025, 1.38, z + width * .24, materials.dark)
  }
  const windowZ = (x: number, z: number, width: number, height = 1.35) => {
    box(width, height, .09, x, 1.38, z, materials.dark)
    box(width - .12, height - .12, .06, x, 1.38, z + .06, materials.glass)
    box(width, .045, .14, x, 1.38, z + .025, materials.trim)
    box(.045, height, .14, x - width * .24, 1.38, z + .025, materials.dark)
    box(.045, height, .14, x + width * .24, 1.38, z + .025, materials.dark)
  }
  const door = (x: number, z: number) => {
    box(1.05, 2.2, .1, x, 1.3, z, materials.accent)
    box(.75, 1.85, .06, x, 1.31, z - .07, materials.wood)
    sphere(.045, x + .3, 1.28, z - .14, materials.trim)
  }
  const bed = (x: number, z: number, angle = 0) => {
    const g = new THREE.Group(); g.position.set(x, .25, z); g.rotation.y = angle; root.add(g)
    box(1.9, .32, 2.35, 0, .28, 0, materials.wood, g)
    box(1.78, .18, 2.15, 0, .53, -.02, materials.white, g)
    box(1.82, .13, .78, 0, .68, .65, materials.fabric, g)
    box(.68, .13, .42, -.43, .77, .75, materials.white, g); box(.68, .13, .42, .43, .77, .75, materials.white, g)
    box(1.95, .48, .12, 0, .55, 1.18, materials.wood, g)
  }
  const sofa = (x: number, z: number, angle = 0) => {
    const g = new THREE.Group(); g.position.set(x, .22, z); g.rotation.y = angle; root.add(g)
    box(2.6, .34, .88, 0, .35, 0, materials.fabric, g); box(2.6, .85, .22, 0, .72, -.35, materials.fabric, g)
    for (const dx of [-.85, 0, .85]) box(.68, .52, .2, dx, .76, -.2, materials.white, g)
    for (const dx of [-1, 1]) cylinder(.055, .055, .28, dx, .12, .22, materials.wood, g)
  }
  const table = (x: number, z: number, round = false) => {
    if (round) cylinder(.78, .78, .12, x, .78, z, materials.wood)
    else box(1.65, .12, 1.35, x, .78, z, materials.wood)
    cylinder(.08, .12, .7, x, .38, z, materials.dark)
    for (const [dx, dz] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      box(.42, .08, .42, x + dx * .72, .48, z + dz * .72, materials.accent)
      box(.42, .38, .08, x + dx * .72, .7, z + dz * .82, materials.accent)
    }
  }
  const tree = (x: number, z: number, scale = 1) => {
    cylinder(.13 * scale, .2 * scale, 1.4 * scale, x, .8 * scale, z, materials.wood)
    sphere(.72 * scale, x, 1.65 * scale, z, materials.green)
    sphere(.48 * scale, x - .28 * scale, 1.55 * scale, z + .18 * scale, mat('#71855d'), root)
  }
  const shrub = (x: number, z: number) => { sphere(.27, x, .34, z, materials.green); sphere(.22, x + .18, .31, z + .08, mat('#788d63')) }
  const roofGroup = new THREE.Group(); root.add(roofGroup); roofGroup.visible = !openTop
  const roofBox = (w: number, h: number, d: number, x: number, y: number, z: number) => box(w, h, d, x, y, z, materials.roof, roofGroup)
  const gable = (w: number, d: number, x = 0, z = 0, ridgeHeight = 1.0) => {
    const shape = new THREE.Shape(); shape.moveTo(-w / 2, 0); shape.lineTo(0, ridgeHeight); shape.lineTo(w / 2, 0); shape.lineTo(w / 2, -.2); shape.lineTo(-w / 2, -.2); shape.closePath()
    const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false }), materials.roof)
    mesh.position.set(x, 2.93, z - d / 2); mesh.castShadow = true; roofGroup.add(mesh)
    roofBox(w + .18, .11, .12, x, 2.84, z - d / 2); roofBox(w + .18, .11, .12, x, 2.84, z + d / 2)
  }
  const monoRoof = (w: number, d: number, x: number, z: number, rise: number) => {
    const shape = new THREE.Shape(); shape.moveTo(-w / 2, 0); shape.lineTo(w / 2, rise); shape.lineTo(w / 2, rise - .2); shape.lineTo(-w / 2, -.2); shape.closePath()
    const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false }), materials.roof)
    mesh.position.set(x, 2.94, z - d / 2); mesh.castShadow = true; roofGroup.add(mesh)
  }

  // Site, planted edges and a raised, readable house plinth.
  box(22, .18, 17, 0, -.18, 0, mat(palette.grass))
  box(16.5, .25, 12.2, 0, .05, 0, materials.stone)
  for (let i = -8; i <= 8; i += 2) { shrub(i, -6.9); shrub(i, 6.9) }
  tree(-9, -5.7, 1.05); tree(9, 5.6, .95)

  if (id === 'casa-1') {
    // Buriti: compact one-storey home; integrated social wing and two sleeping rooms.
    floor(12, 9.2, 0, 0)
    wallZ(0, -4.55, 12); wallZ(-5.9, 0, 9.1); wallZ(5.9, 0, 9.1)
    wallX(-2.1, 4.55, 7.8); wallX(4.95, 4.55, 1.9)
    wallX(2.7, -4.55, 6.4); wallX(-4.8, -4.55, 2.2)
    wallZ(-1.65, -1.8, 5.4, 2.4); wallZ(1.6, -1.8, 5.4, 2.4); wallX(0, 1.0, 3.1, 2.35)
    windowZ(-4.2, 4.55, 1.65); windowZ(3.5, 4.55, 1.8); windowX(-5.9, -1.7, 1.65); windowX(5.9, -1.5, 2.4)
    door(4.95, 4.55); bed(-3.9, -.35); bed(3.9, -.35); sofa(-3.6, 3.05); table(.4, 2.75); box(2.7, .92, .65, 3.8, .72, -3.35, materials.wood)
    box(1.2, .12, .8, -4.3, .75, -3.25, materials.white); cylinder(.38, .38, .12, -4.3, .84, -3.25, materials.dark)
    gable(12.6, 9.8, 0, 0, 1.2)
  } else if (id === 'casa-2') {
    // Rio Corrente: elongated plan, three private rooms across the quiet wing.
    floor(18, 8.6, 0, 0)
    wallZ(0, -4.25, 18); wallX(-8.9, 0, 8.5); wallX(8.9, 0, 8.5)
    wallZ(-5.2, 4.25, 7.4); wallZ(2.7, 4.25, 3.1); wallZ(7.8, 4.25, 2.2)
    wallX(-1.5, -2.0, 4.4, 2.4); wallX(3, -2, 4.4, 2.4); wallX(-5.3, .4, 4.1, 2.4)
    wallZ(-5.3, 2.25, 4.0, 2.4); wallZ(0, 2.25, 4.0, 2.4); wallZ(5.3, 2.25, 4.0, 2.4)
    windowZ(-6.4, 4.25, 1.9); windowZ(-2.4, 4.25, 1.8); windowZ(1.1, 4.25, 1.8); windowZ(6.4, 4.25, 1.9); windowX(8.9, -1.6, 2.8)
    door(4.4, 4.25); bed(-6.8, -.1, Math.PI); bed(-2.55, -.1, Math.PI); bed(1.75, -.1, Math.PI)
    sofa(5.35, -2.5); table(6.9, 1.15); box(3.5, .92, .68, -6.4, .72, -3.2, materials.wood)
    roofBox(18.7, .35, 9.2, 0, 3.18, 0); roofBox(19, .28, .18, 0, 3.0, -4.55); roofBox(19, .28, .18, 0, 3.0, 4.55)
    for (const x of [-7.5, -3.8, 0, 3.8, 7.5]) roofBox(.12, .18, 9.2, x, 3.42, 0)
  } else {
    // Vereda: U-shaped wings embracing a planted patio; room labels/counts are intentionally unasserted.
    floor(14, 12, 0, 0)
    floor(5.1, 4.5, -7.3, 0); floor(5.1, 4.5, 7.3, 0)
    wallZ(0, -5.9, 14); wallZ(-6.9, -3.7, 4.4); wallZ(6.9, -3.7, 4.4)
    wallX(-6.9, 0, 12); wallX(6.9, 0, 12); wallX(-6.9, 4.6, 2.6); wallX(6.9, 4.6, 2.6)
    wallX(-4.5, 5.9, 4.8); wallX(4.5, 5.9, 4.8)
    wallZ(-4.45, -1.7, 4.4, 2.4); wallZ(4.45, -1.7, 4.4, 2.4)
    wallX(-4.5, .55, 4.8, 2.4); wallX(4.5, .55, 4.8, 2.4)
    windowX(-6.9, -3.65, 2.1); windowX(6.9, -3.65, 2.1); windowZ(-3.1, 5.9, 2.0); windowZ(3.1, 5.9, 2.0)
    door(0, -5.9); bed(-4.6, 3.25); bed(4.6, 3.25); sofa(0, -3.4); table(0, .5, true)
    box(3.4, .12, 3.2, 0, .25, 1.7, materials.grass); tree(-.8, 1.7, .52); shrub(.8, 2.6); shrub(-1.3, .7)
    monoRoof(6.2, 12.4, -4.25, 0, .75); monoRoof(6.2, 12.4, 4.25, 0, .75); roofBox(8.2, .32, 12.4, 0, 3.14, 0)
  }

  // Outdoor living details: entry path, low lights, planters and terrace furniture.
  for (let i = 0; i < 4; i++) box(1.25, .09, .72, 0, .13, 7.15 + i * .95, materials.trim)
  for (const x of [-5.4, 5.4]) { cylinder(.16, .2, .35, x, .34, 5.2, materials.accent); shrub(x, 5.2) }
  const lamp = mat('#e9cf91', .3)
  for (const x of [-7.9, 7.9]) { cylinder(.045, .045, .75, x, .38, 5.7, materials.dark); sphere(.12, x, .82, 5.7, lamp) }
  return root
}

export default function ResidenceModel({ residence, openTop }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const controls = useRef<OrbitControls | null>(null)
  useEffect(() => {
    const element = host.current
    if (!element) return
    const scene = new THREE.Scene(); scene.background = new THREE.Color('#e8e9e2')
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100); camera.position.set(18, 15, 22)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15
    element.appendChild(renderer.domElement)
    const ambient = new THREE.HemisphereLight('#fff8e9', '#647364', 2.0); scene.add(ambient)
    const sun = new THREE.DirectionalLight('#fff1d5', 3.2); sun.position.set(-10, 18, 12); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); scene.add(sun)
    const model = buildHouse(residence, openTop); scene.add(model)
    const orbit = new OrbitControls(camera, renderer.domElement); controls.current = orbit
    orbit.target.set(0, 1.1, 0); orbit.enableDamping = true; orbit.dampingFactor = .07; orbit.minDistance = 12; orbit.maxDistance = 38; orbit.maxPolarAngle = Math.PI * .48
    const resize = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect; if (!width || !height) return
      camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false)
    })
    resize.observe(element)
    let frame = 0
    const draw = () => { frame = requestAnimationFrame(draw); orbit.update(); renderer.render(scene, camera) }
    draw()
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); orbit.dispose(); controls.current = null
      model.traverse(object => { if (object instanceof THREE.Mesh) { object.geometry.dispose(); const material = object.material; if (Array.isArray(material)) material.forEach(item => item.dispose()); else material.dispose() } })
      renderer.dispose(); renderer.domElement.remove()
    }
  }, [residence, openTop])
  return <div ref={host} className="residence-model" aria-label={`Modelo volumétrico conceitual da ${residence.name}`} />
}
