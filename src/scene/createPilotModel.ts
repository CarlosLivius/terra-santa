import * as T from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { pilotSequence } from '../data/pilotSequence'
import { pilotInterior, type FurnitureKind } from '../data/pilotInterior'

export const worldX = (x: number) => (x - 500) * .04
export const worldZ = (z: number) => (z - 100) * .04
const ease = (v: number) => { const t = T.MathUtils.clamp(v, 0, 1); return t * t * (3 - 2 * t) }

export function createPilotModel() {
  const root = new T.Group()
  root.name = 'Casa 1 — estudo da planta recebida'
  const walls = new T.Group(), openings = new T.Group(), roof = new T.Group(), furniture = new T.Group(), landscape = new T.Group()
  root.add(walls, openings, roof, furniture, landscape)
  const textures: T.Texture[] = []
  let seed = 3187
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }
  function surface(color: string, kind: 'noise' | 'oak' | 'tile' | 'fabric' = 'noise') {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = color; ctx.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 9000; i++) {
      const x = random() * 256, y = random() * 256
      ctx.fillStyle = `rgba(${i % 2 ? '255,255,255' : '15,20,15'},${random() * .085})`
      ctx.fillRect(x, y, kind === 'oak' ? random() * 42 : 1, kind === 'oak' ? .7 : 1)
    }
    if (kind === 'oak') {
      ctx.strokeStyle = '#79644755'; ctx.lineWidth = 1
      for (let y = 0; y < 256; y += 32) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke()
        ctx.beginPath(); ctx.moveTo((y * 3) % 256, y); ctx.lineTo((y * 3) % 256, y + 32); ctx.stroke()
      }
    }
    if (kind === 'tile') { ctx.strokeStyle = '#83847755'; ctx.lineWidth = 1; ctx.strokeRect(0, 0, 256, 256) }
    if (kind === 'fabric') {
      ctx.strokeStyle = '#786f5d18'
      for (let n = 0; n < 256; n += 3) { ctx.beginPath(); ctx.moveTo(n, 0); ctx.lineTo(n, 256); ctx.moveTo(0, n); ctx.lineTo(256, n); ctx.stroke() }
    }
    const texture = new T.CanvasTexture(canvas)
    texture.colorSpace = T.SRGBColorSpace; texture.wrapS = texture.wrapT = T.RepeatWrapping; texture.anisotropy = 8
    textures.push(texture); return texture
  }
  const plasterTex = surface('#e7e3d8'), oakTex = surface('#af895c', 'oak'), stoneTex = surface('#d6d4c8', 'tile'), fabricTex = surface('#d7cec0', 'fabric')
  const plaster = new T.MeshStandardMaterial({ map: plasterTex, roughness: .92, bumpMap: plasterTex, bumpScale: .016 })
  const oak = new T.MeshStandardMaterial({ map: oakTex, roughness: .49, bumpMap: oakTex, bumpScale: .015 })
  const stone = new T.MeshStandardMaterial({ map: stoneTex, roughness: .77, bumpMap: stoneTex, bumpScale: .006 })
  const fabric = new T.MeshStandardMaterial({ map: fabricTex, roughness: 1, bumpMap: fabricTex, bumpScale: .035 })
  const white = new T.MeshStandardMaterial({ color: '#f5f0e6', roughness: .7 })
  const linen = new T.MeshStandardMaterial({ color: '#b4b4a0', roughness: 1, bumpMap: fabricTex, bumpScale: .025 })
  const dark = new T.MeshStandardMaterial({ color: '#303a38', metalness: .55, roughness: .36 })
  const metal = new T.MeshStandardMaterial({ color: '#a0a5a3', metalness: .85, roughness: .24 })
  const ceramic = new T.MeshPhysicalMaterial({ color: '#f1f0e9', roughness: .22, clearcoat: .5 })
  const glass = new T.MeshPhysicalMaterial({ color: '#c7e1dd', metalness: .05, roughness: .08, transparent: true, opacity: .28, depthWrite: false, side: T.DoubleSide, envMapIntensity: 1.3 })
  const soil = new T.MeshStandardMaterial({ map: surface('#877b64'), roughness: 1 })
  const grass = new T.MeshStandardMaterial({ map: surface('#8e9977'), roughness: 1 })
  grass.map!.repeat.set(80,80)
  const gravel = new T.MeshStandardMaterial({ map: surface('#b6b1a1'), roughness: 1 })
  const paving = new T.MeshStandardMaterial({ map: surface('#bdbeb6', 'tile'), roughness: .95 })
  const rug = new T.MeshStandardMaterial({ map: surface('#c3b7a2', 'fabric'), roughness: 1 })
  const roofTexture = surface('#765747', 'tile'); roofTexture.repeat.set(7, 3)
  const roofMat = new T.MeshStandardMaterial({ map: roofTexture, color: '#8b6753', metalness: .02, roughness: .82, bumpMap: roofTexture, bumpScale: .035 })
  const materials = { plaster, oak, stone, fabric, white, linen, dark, metal, ceramic, glass, soil, grass, gravel, paving, rug, roofMat }
  const boxGeometry = new T.BoxGeometry(1, 1, 1)
  const rounded = new Map<string, T.BufferGeometry>()
  const sphere = new T.SphereGeometry(1, 16, 10)
  function box(parent: T.Object3D, w: number, h: number, d: number, x: number, y: number, z: number, mat: T.Material, radius = 0) {
    let geometry: T.BufferGeometry = boxGeometry
    if (radius) {
      const key = [w, h, d, radius].join(',')
      if (!rounded.has(key)) rounded.set(key, new RoundedBoxGeometry(w, h, d, 3, Math.min(radius, w / 3, h / 3, d / 3)))
      geometry = rounded.get(key)!
    }
    const mesh = new T.Mesh(geometry, mat)
    if (!radius) mesh.scale.set(w, h, d)
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh
  }
  function orb(parent: T.Object3D, x: number, y: number, z: number, sx: number, sy: number, sz: number, mat: T.Material) {
    const mesh = new T.Mesh(sphere, mat); mesh.scale.set(sx, sy, sz); mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh
  }
  function cylinder(parent: T.Object3D, radius: number, height: number, x: number, y: number, z: number, mat: T.Material, top = radius) {
    const mesh = new T.Mesh(new T.CylinderGeometry(top, radius, height, 16), mat); mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh
  }
  function segment(parent: T.Object3D, p: readonly number[], h: number, y: number, mat: T.Material, thickness = .16) {
    const [x1,z1,x2,z2] = p; const dx = (x2 - x1) * .04, dz = (z2 - z1) * .04
    const mesh = box(parent, Math.hypot(dx, dz), h, thickness, worldX((x1 + x2) / 2), y, worldZ((z1 + z2) / 2), mat)
    mesh.rotation.y = -Math.atan2(dz, dx); return mesh
  }
  function floor(parent: T.Object3D, rect: readonly number[], mat: T.Material, y: number, thickness = .04) {
    const [x1,z1,x2,z2] = rect
    return box(parent, (x2-x1)*.04, thickness, (z2-z1)*.04, worldX((x1+x2)/2), y, worldZ((z1+z2)/2), mat)
  }
  // One shared coordinate system for plan, physical walls and furnishings.
  floor(root, [0,0,1000,202], stone, -.19, .34)
  for (const [i, patch] of pilotInterior.floors.entries()) {
    const map = { stone, oak, gravel, grass, paver: paving }
    const mat = map[patch.material].clone()
    if (mat.map) { mat.map = mat.map.clone(); mat.map.repeat.set((patch.rect[2]-patch.rect[0])*.02, (patch.rect[3]-patch.rect[1])*.02); mat.map.needsUpdate = true; textures.push(mat.map) }
    floor(root, patch.rect, mat, .004 + i * .004)
  }
  const traces = new T.Group(); root.add(traces)
  const traceMat = new T.MeshBasicMaterial({ color: '#9a633f', transparent: true, opacity: .75 })
  for (const p of pilotSequence.walls) {
    segment(traces, p, .015, .045, traceMat, .055)
    const perimeter = p[0] === 4 && p[2] === 4 || p[0] === 994 && p[2] === 994 || p[1] === 196 && p[3] === 196
    const height = perimeter ? 1.05 : 2.65
    segment(walls, p, height, height / 2 + .025, plaster)
    segment(walls, p, .045, height + .052, stone, .19)
    segment(walls, p, .11, .08, stone, .19)
  }
  for (const p of pilotSequence.windows) {
    segment(openings, p, 2.25, 1.15, glass, .028)
    segment(openings, p, .055, .06, dark, .09)
    segment(openings, p, .065, 2.29, dark, .09)
    const [x1,z1,x2,z2] = p
    const count = Math.max(1, Math.ceil(Math.hypot(x2-x1,z2-z1) / 30))
    for (let i = 0; i <= count; i++) box(openings, .045, 2.25, .045, worldX(x1+(x2-x1)*i/count), 1.16, worldZ(z1+(z2-z1)*i/count), dark)
    segment(walls, p, .3, 2.51, plaster, .17)
  }
  // The garden boundary stays low; enclosed room fronts continue up to the roof.
  for (const p of [[218,196,330,196],[423,196,774,196],[4,4,4,119]]) {
    segment(walls,p,1.6,1.875,plaster)
    segment(walls,p,.045,2.702,stone,.19)
  }
  for (const [x1,z1,x2,z2] of pilotInterior.doors) {
    const width = Math.hypot(x2-x1,z2-z1)*.04
    segment(walls, [x1,z1,x2,z2], .4, 2.47, plaster)
    const pivot = new T.Group(); pivot.position.set(worldX(x1), 0, worldZ(z1)); pivot.rotation.y = -Math.atan2(z2-z1, x2-x1) + Math.PI*.36; openings.add(pivot)
    box(pivot, width, 2.17, .045, width/2, 1.11, 0, oak, .015)
    box(pivot, .15, .025, .045, width-.13, 1.05, .055, metal, .01)
    box(pivot, .035, .15, .025, width-.13, 1.05, .035, metal)
  }
  for (const [x1,z1,x2,z2] of pilotSequence.roofs) {
    const tile = floor(roof, [x1-3,z1-3,x2+3,z2+3], roofMat, 2.82, .15)
    tile.rotation.z = 0
    for (let x=x1; x<x2; x+=13) floor(roof, [x,z1-3,x+.9,z2+3], roofMat, 2.92, .055)
    for (let z=z1; z<z2; z+=12) segment(roof,[x1-3,z,x2+3,z],.025,2.925,dark,.032)
    segment(roof, [x1-3,z2+3,x2+3,z2+3], .14, 2.78, dark, .09)
  }
  // Slatted parking pergola follows the uncovered right-hand bay.
  for (const x of [780, 987]) for (const z of [10,116]) box(roof,.11,2.7,.11,worldX(x),1.35,worldZ(z),oak)
  for (let x=780; x<993; x+=22) floor(roof,[x,8,x+3,118],oak,2.77,.18)
  const plantLeaf = new T.MeshStandardMaterial({ color: '#536d39', roughness: .88, side: T.DoubleSide })
  function plant(parent: T.Object3D, x: number, y: number, z: number, size = .4, pot = true) {
    if (pot) cylinder(parent,size*.4,size*.5,x,y+size*.25,z,stone,size*.47)
    for (let n=0;n<9;n++) {
      const leaf=orb(parent,x+Math.sin(n*2.4)*size*.38,y+size*.65+random()*size*.3,z+Math.cos(n*2.4)*size*.38,size*.13,size*.55,size*.08,plantLeaf)
      leaf.rotation.z=Math.sin(n*2.4)*.65; leaf.rotation.x=Math.cos(n*2.4)*.65
    }
  }
  function chair(parent: T.Object3D, x: number, z: number, rotation: number) {
    const g=new T.Group();g.position.set(x,0,z);g.rotation.y=rotation;parent.add(g)
    for(const a of [-.23,.23])for(const b of [-.22,.22])box(g,.045,.46,.045,a,.23,b,oak,.01)
    box(g,.58,.10,.55,0,.5,0,fabric,.045)
    const back=box(g,.58,.49,.08,0,.8,-.25,oak,.04);back.rotation.x=-.08
    box(g,.5,.3,.05,0,.81,-.2,fabric,.025)
  }
  function makeFurniture(kind: FurnitureKind) {
    const g = new T.Group(); g.name=kind
    if (kind==='bed' || kind==='single-bed') {
      const w=kind==='bed'?1.85:1.02, d=2.08
      box(g,w+.15,.24,d+.1,0,.24,0,oak,.05)
      for(const x of [-w/2+.13,w/2-.13])for(const z of [-.8,.8])box(g,.09,.15,.09,x,.075,z,dark)
      box(g,w,.24,d,0,.47,0,white,.09)
      box(g,w+.05,.09,1.32,0,.62,.3,linen,.04)
      for(let i=0;i<(kind==='bed'?2:1);i++) {
        const x=kind==='bed'?(i-.5)*.83:0
        box(g,kind==='bed'?.73:.8,.14,.43,x,.66,-.72,fabric,.08)
        box(g,kind==='bed'?.76:.84,.055,.46,x,.59,-.72,white,.02)
      }
      box(g,w+.22,1.1,.09,0,.57,-1.07,oak,.04)
      box(g,w+.05,.7,.075,0,.68,-1.0,fabric,.025)
      box(g,w+.06,.035,.35,0,.68,.63,fabric,.015)
      box(g,w+.7,.018,d+.75,0,.033,.2,rug,.025)
    } else if(kind==='nightstand') {
      box(g,.5,.47,.45,0,.27,0,oak,.025);box(g,.44,.19,.012,0,.37,.232,linen,.006)
      cylinder(g,.07,.02,0,.52,0,metal);cylinder(g,.018,.24,0,.65,0,metal)
      cylinder(g,.13,.19,0,.83,0,fabric,.1)
    } else if(kind==='wardrobe') {
      box(g,.6,2.3,2.6,0,1.17,0,oak,.025)
      for(let z=-.84;z<1;z+=.84) {box(g,.025,2.2,.8,-.314,1.17,z,linen,.009);box(g,.035,.28,.025,-.35,1.13,z+.3,metal)}
    } else if(kind==='sofa') {
      box(g,2.7,.22,.95,0,.25,0,oak,.07)
      box(g,2.82,.57,.21,0,.58,-.4,fabric,.09)
      for(const x of [-1.32,1.32])box(g,.22,.48,.92,x,.5,.01,fabric,.09)
      for(const x of [-.84,0,.84]) {
        box(g,.8,.21,.73,x,.48,.065,fabric,.09)
        const cushion=box(g,.78,.43,.17,x,.75,-.24,linen,.065);cushion.rotation.x=-.12
      }
      for(const x of [-1.1,1.1])for(const z of [-.33,.33])cylinder(g,.035,.18,x,.09,z,dark)
      box(g,3.3,.016,2.1,0,.03,.9,rug,.045)
      box(g,1.2,.075,.65,0,.46,1.23,oak,.14)
      for(const x of [-.42,.42])box(g,.08,.4,.4,x,.23,1.23,oak,.02)
      box(g,.3,.025,.23,-.25,.52,1.22,linen)
      plant(g,.28,.5,1.23,.22)
    } else if(kind==='dining') {
      box(g,1.62,.10,1.12,0,.88,0,oak,.07)
      for(const x of [-.61,.61])for(const z of [-.38,.38])box(g,.09,.8,.09,x,.42,z,oak,.015)
      for(const x of [-.49,.49]){chair(g,x,-.94,0);chair(g,x,.94,Math.PI)}
      chair(g,-1.11,0,Math.PI/2);chair(g,1.11,0,-Math.PI/2)
      cylinder(g,.18,.045,0,.965,0,ceramic);plant(g,0,.98,0,.22)
    } else if(kind==='console') {
      box(g,2.6,.42,.43,0,.27,0,oak,.025)
      for(const x of [-.84,0,.84])box(g,.8,.31,.015,x,.29,.226,linen,.008)
      box(g,1.6,.92,.055,-.25,1.04,0,dark,.02)
      box(g,1.52,.84,.009,-.25,1.04,-.033,new T.MeshStandardMaterial({color:'#1b292a',roughness:.18,metalness:.35}))
      box(g,.5,.035,.2,-.25,.52,.05,dark)
      plant(g,.99,.5,0,.25)
    } else if(kind==='kitchen') {
      const counterWidth=4.74, counterX=-.5
      box(g,counterWidth,.82,.65,counterX,.43,0,linen,.025)
      box(g,counterWidth+.1,.065,.73,counterX,.89,0,stone,.02)
      for(let x=-2.55;x<1.55;x+=.64){box(g,.61,.7,.02,x,.47,-.338,oak,.015);box(g,.23,.018,.032,x,.72,-.36,metal)}
      box(g,counterWidth+.03,.1,.07,counterX,.95,.34,stone)
      box(g,.68,.023,.47,-1.73,.94,0,dark,.025)
      for(const x of [-1.9,-1.58])for(const z of [-.12,.12]){const ring=new T.Mesh(new T.TorusGeometry(.10,.008,6,20),metal);ring.rotation.x=-Math.PI/2;ring.position.set(x,.958,z);g.add(ring)}
      box(g,.65,.025,.45,.4,.94,0,metal,.07);box(g,.51,.022,.33,.4,.951,0,dark,.065)
      cylinder(g,.018,.29,.4,1.1,.24,metal);box(g,.02,.02,.16,.4,1.245,.16,metal)
      // Standalone refrigerator: floor-mounted with a visible installation
      // gap; it never intersects the cabinet or countertop volumes.
      const fridge=new T.Group()
      box(fridge,.86,1.86,.72,0,.96,0,metal,.065)
      box(fridge,.012,1.7,.025,0,.98,-.373,dark,.004)
      box(fridge,.025,.56,.035,-.16,1.16,-.392,dark,.01)
      box(fridge,.025,.56,.035,.16,1.16,-.392,dark,.01)
      box(fridge,.72,.055,.61,0,.03,.015,dark,.018)
      fridge.position.x=2.55
      g.add(fridge)
      plant(g,-.3,.94,.15,.18)
    } else if(kind==='vanity') {
      box(g,.78,.56,.45,0,.55,0,oak,.035);box(g,.84,.055,.5,0,.86,0,stone,.025)
      orb(g,0,.93,0,.25,.09,.16,ceramic);orb(g,0,.985,0,.18,.014,.105,stone)
      cylinder(g,.014,.2,.17,1,-.14,metal)
      box(g,.6,.7,.028,0,1.52,-.245,dark,.018);box(g,.55,.65,.009,0,1.52,-.226,glass,.018)
      box(g,.28,.02,.09,0,.42,-.238,dark,.008)
    } else if(kind==='toilet') {
      orb(g,0,.2,0,.19,.23,.22,ceramic);orb(g,0,.43,.08,.24,.09,.32,ceramic)
      orb(g,0,.502,.1,.16,.006,.23,stone);box(g,.41,.56,.18,0,.39,-.22,ceramic,.065)
      cylinder(g,.025,.008,0,.677,-.22,metal)
    } else if(kind==='shower' || kind==='suite-shower') {
      // Compact wet zone: tray, two glass returns and wall-mounted shower.
      const showerWidth=kind==='suite-shower'?2.04:.94
      const half=showerWidth/2
      box(g,showerWidth,.04,.9,0,.055,0,stone,.025)
      // Front glass closes only part of the span, leaving a usable entry.
      box(g,showerWidth*.56,1.78,.018,half-showerWidth*.28,.96,-.44,glass)
      box(g,.018,1.78,.88,half-.018,.96,0,glass)
      const fixtureX=kind==='suite-shower'?-half+.2:-.29
      box(g,.035,1.62,.035,fixtureX,.91,.42,metal,.008)
      box(g,.035,.035,.23,fixtureX,1.7,.32,metal,.008)
      const showerHead=cylinder(g,.115,.024,fixtureX,1.69,.2,metal)
      showerHead.rotation.z=Math.PI/2
      box(g,.095,.16,.025,fixtureX,.92,.438,dark,.012)
      box(g,.11,.012,.11,0,.082,0,metal)
    } else if(kind==='laundry') {
      box(g,.65,.86,.65,-.38,.46,0,white,.035)
      const drum=cylinder(g,.22,.03,-.38,.43,-.34,metal);drum.rotation.x=Math.PI/2
      const hole=cylinder(g,.17,.04,-.38,.43,-.36,dark);hole.rotation.x=Math.PI/2
      box(g,.62,.065,.65,.34,.92,0,stone,.02);box(g,.49,.17,.44,.34,.85,0,ceramic,.05)
    }
    return g
  }
  for (const item of pilotInterior.furniture) {
    const g=makeFurniture(item.kind);g.position.set(worldX(item.x),0,worldZ(item.z));g.rotation.y=item.rotation
    furniture.add(g)
  }
  // Full three-dimensional context: curb, stone walk, drive and vegetation.
  box(root,160,.15,160,0,-.36,0,soil)
  const grassGround=box(landscape,160,.025,160,0,-.265,0,grass)
  grassGround.castShadow=false
  floor(landscape,[-35,-30,1040,234],paving,-.15,.08)
  floor(landscape,[-100,250,1150,287],paving,-.15,.08)
  floor(landscape,[-2000,300,3000,470],new T.MeshStandardMaterial({color:'#737a76',roughness:1}),-.22,.08)
  for(let x=-1500;x<2500;x+=75)floor(landscape,[x,382,x+29,384],white,-.169,.004)
  segment(landscape,[-1500,298,2500,298],.13,-.13,stone,.2)
  for(const [x,z] of pilotSequence.trees)plant(landscape,worldX(x),.09,worldZ(z),.75,false)
  for(let x=790;x<990;x+=18)plant(landscape,worldX(x),.07,worldZ(175+random()*10),.35,false)
  const leafGeometry = new T.SphereGeometry(1,6,4)
  const treeMat = new T.MeshStandardMaterial({ color:'#607c4c',roughness:1 })
  const leaves=new T.InstancedMesh(leafGeometry,treeMat,pilotSequence.environmentTrees.length*460)
  leaves.castShadow=true;leaves.receiveShadow=true;landscape.add(leaves)
  const transform=new T.Object3D();let index=0
  for(const [x,z] of pilotSequence.environmentTrees) {
    const wx=worldX(x),wz=worldZ(z)
    cylinder(landscape,.09,2.9,wx,1.25,wz,oak,.055)
    for(let b=0;b<5;b++) {
      const branch=cylinder(landscape,.032,1.5,wx+Math.sin(b*2.4)*.25,2.3,wz+Math.cos(b*2.4)*.25,oak,.013)
      branch.rotation.z=Math.sin(b*2.4)*.6;branch.rotation.x=Math.cos(b*2.4)*.6
    }
    for(let i=0;i<460;i++) {
      const theta=random()*Math.PI*2, r=Math.sqrt(random())*1.18
      transform.position.set(wx+Math.cos(theta)*r,2.7+random()*1.35*(1-r*.35),wz+Math.sin(theta)*r)
      transform.scale.set(.12+random()*.12,.024,.055+random()*.07)
      transform.rotation.set(random(),random(),random());transform.updateMatrix();leaves.setMatrixAt(index,transform.matrix)
      leaves.setColorAt(index++,new T.Color().setHSL(.23+random()*.04,.27,.26+random()*.24))
    }
    plant(landscape,wx,-.2,wz,.5,false)
  }
  const totalFurniture=furniture.children.length
  function update(progress: number, openTop: boolean) {
    const wallT=ease((progress-3)/35), openingT=ease((progress-26)/24), roofT=ease((progress-78)/22), gardenT=ease((progress-58)/38)
    walls.scale.y=Math.max(.001,wallT);walls.visible=wallT>0
    openings.scale.y=Math.max(.001,openingT);openings.visible=openingT>0
    roof.visible=roofT>0&&!openTop;roof.position.y=(1-roofT)*3
    furniture.children.forEach((g,i)=> { const t=ease((progress-38-i*.7)/22);g.visible=t>0;g.scale.setScalar(Math.max(.001,t));g.position.y=(1-t)*.45 })
    landscape.visible=gardenT>0;landscape.scale.y=Math.max(.001,gardenT)
    traceMat.opacity=.75*(1-wallT)
    return { wallT, furnishingCount:furniture.children.filter(g=>g.visible).length, totalFurniture }
  }
  function dispose() {
    const geometries=new Set<T.BufferGeometry>(),mats=new Set<T.Material>()
    root.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m))}})
    geometries.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());textures.forEach(t=>t.dispose())
  }
  return { root, update, dispose, materials }
}
