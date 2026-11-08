import { useEffect, useRef, useState } from 'react'
import * as T from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { createPilotModel, worldX, worldZ } from '../scene/createPilotModel'
import { pilotInterior } from '../data/pilotInterior'
import PilotSequenceScene from './PilotSequenceScene'

type Props = { progress: number; openTop: boolean; exploring: boolean; view: number; reset: number; turn: number; zoom: number; reduced: boolean }
type Runtime = { update: (p: number, roof: boolean) => void; explore: (enabled: boolean) => void; frame: (view: number) => void; turn: (delta: number) => void; zoom: (delta: number) => void; dispose: () => void }

export default function PilotThreeScene(props: Props) {
  const host = useRef<HTMLDivElement>(null), runtime = useRef<Runtime | null>(null), latest = useRef(props)
  const [fallback, setFallback] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => { latest.current = props })
  useEffect(() => {
    // StrictMode mounts effects twice in development. Defer GPU allocation so
    // the cancelled rehearsal cannot compile a second house/context.
    const initialize=window.setTimeout(()=>{
    const element=host.current!
    setFallback(false)
    element.dataset.ready='false'
    element.dataset.renderer='initializing'
    let renderer: T.WebGLRenderer
    try { renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'}) }
    catch { element.dataset.renderer='unavailable';setFallback(true); return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,innerWidth<700?1:1.5))
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap
    renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true
    renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;renderer.outputColorSpace=T.SRGBColorSpace
    renderer.domElement.setAttribute('aria-label','Casa 1 tridimensional. Ative Explorar para girar e aproximar.');renderer.domElement.setAttribute('role','img')
    element.appendChild(renderer.domElement)
    const scene=new T.Scene()
    const skyCanvas=document.createElement('canvas');skyCanvas.width=32;skyCanvas.height=512
    const skyContext=skyCanvas.getContext('2d')!,skyGradient=skyContext.createLinearGradient(0,0,0,512)
    skyGradient.addColorStop(0,'#9fb8c0');skyGradient.addColorStop(.48,'#dce1d7');skyGradient.addColorStop(1,'#c6bda9');skyContext.fillStyle=skyGradient;skyContext.fillRect(0,0,32,512)
    const skyTexture=new T.CanvasTexture(skyCanvas);skyTexture.colorSpace=T.SRGBColorSpace;scene.background=skyTexture;scene.fog=new T.Fog('#c8c7b8',105,210)
    const camera=new T.PerspectiveCamera(36,1,.1,250), controls=new OrbitControls(camera,renderer.domElement)
    controls.enableDamping=!latest.current.reduced;controls.dampingFactor=.12;controls.maxPolarAngle=Math.PI*.475;controls.minDistance=3;controls.maxDistance=115
    controls.enablePan=true;controls.enableRotate=true;controls.enableZoom=true;controls.panSpeed=.6;controls.rotateSpeed=.72;controls.zoomSpeed=.9
    renderer.domElement.style.pointerEvents='auto';renderer.domElement.style.cursor='grab'
    const environment=new RoomEnvironment(), generator=new T.PMREMGenerator(renderer)
    const env=generator.fromScene(environment,.04);scene.environment=env.texture;scene.environmentIntensity=.35
    environment.dispose();generator.dispose();scene.add(new T.HemisphereLight('#eaf4ff','#8f8065',1.15))
    const sun=new T.DirectionalLight('#fff0d4',2.4);sun.position.set(-24,38,18);sun.castShadow=true
    sun.shadow.mapSize.set(innerWidth<700?1024:2048,innerWidth<700?1024:2048);Object.assign(sun.shadow.camera,{left:-29,right:29,top:22,bottom:-22,near:1,far:100})
    sun.shadow.bias=-.0003;sun.shadow.normalBias=.025;sun.shadow.radius=3;scene.add(sun)
    const model=createPilotModel();scene.add(model.root)
    // Render the complete physical model once per visible change. Extra full
    // scene SSAO passes made software/mobile GPUs stall during interaction.
    let dirty=true,previousProgress=-1,previousRoof: boolean | undefined
    let currentView=latest.current.view, active=true, disposed=false, animation=0,currentProgress=latest.current.progress,requestedOpenTop=latest.current.openTop
    function frame(view: number) {
      currentView=view
      const room=pilotInterior.roomViews[view] || pilotInterior.roomViews[0], target=new T.Vector3(worldX(room.x),.7,worldZ(room.z))
      controls.target.copy(target)
      if(view===0) {
        const portrait=element.clientWidth<700, direction=new T.Vector3(portrait?1.45:.48,portrait?1.65:1.25,portrait?.35:1.55).normalize()
        camera.position.copy(target).add(direction.clone().multiplyScalar(50));camera.lookAt(target);camera.updateMatrixWorld()
        const inverse=new T.Matrix4().copy(camera.matrixWorld).invert(), vertical=Math.tan(T.MathUtils.degToRad(camera.fov/2)),horizontal=vertical*camera.aspect
        let distance=0
        for(const x of [-22,22])for(const y of [0,4.5])for(const z of [-5.5,5.5]) {
          const p=new T.Vector3(x,y,z).applyMatrix4(inverse)
          distance=Math.max(distance,Math.abs(p.x)/horizontal+p.z+50,Math.abs(p.y)/vertical+p.z+50)
        }
        camera.position.copy(target).add(direction.multiplyScalar(distance*(portrait?1.22:1.02)))
      } else {
        const suiteBathroom=room.label==='Banheiro da suíte'
        const direction=suiteBathroom?new T.Vector3(-.16,2.1,.12):new T.Vector3(.22,1.45,.75)
        camera.position.copy(target).add(direction.normalize().multiplyScalar(room.distance*(camera.aspect<1?1.4:1)))
      }
      camera.lookAt(target);controls.update()
    }
    const applyModel=()=>{
      const distance=camera.position.distanceTo(controls.target),autoOpen=!requestedOpenTop&&distance<24
      const visibleOpenTop=requestedOpenTop||autoOpen
      if(previousProgress!==currentProgress||previousRoof!==visibleOpenTop){renderer.shadowMap.needsUpdate=true;previousProgress=currentProgress;previousRoof=visibleOpenTop}
      const stats=model.update(currentProgress,requestedOpenTop||autoOpen)
      dirty=true
      element.dataset.progress=String(currentProgress);element.dataset.furniture=String(stats.furnishingCount)
      element.dataset.roof=requestedOpenTop?'open':autoOpen?'auto-open':'closed'
      element.dataset.distance=distance.toFixed(2)
    }
    controls.mouseButtons={LEFT:T.MOUSE.ROTATE,MIDDLE:T.MOUSE.DOLLY,RIGHT:T.MOUSE.PAN}
    controls.touches={ONE:T.TOUCH.ROTATE,TWO:T.TOUCH.DOLLY_PAN}
    controls.addEventListener('start',()=>{renderer.domElement.style.cursor='grabbing'})
    controls.addEventListener('end',()=>{renderer.domElement.style.cursor='grab'})
    const update=(p:number,open:boolean)=> {currentProgress=p;requestedOpenTop=open;applyModel()}
    const explore=(enabled:boolean)=> {controls.enabled=enabled;controls.enableRotate=enabled;controls.enableZoom=enabled;renderer.domElement.style.pointerEvents=enabled?'auto':'none';renderer.domElement.style.touchAction=enabled?'none':'pan-y';renderer.domElement.style.cursor=enabled?'grab':'default';element.dataset.exploring=String(enabled)}
    let previousWidth=0,previousHeight=0
    function resize(){
      const w=element.clientWidth,h=element.clientHeight
      if(!w||!h||w===previousWidth&&h===previousHeight)return
      previousWidth=w;previousHeight=h;renderer.setSize(w,h)
      const top=w<700?180:120,bottom=w<700?260:245
      const availableHeight=Math.max(h*.35,h-top-bottom)
      // Frame inside the unobstructed region while still rendering the
      // environment behind all UI, without a visible rectangular viewport.
      camera.setViewOffset(w,availableHeight,0,-top,w,h)
      camera.updateProjectionMatrix();frame(currentView);dirty=true
    }
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(element)
    const observer=new IntersectionObserver(([entry])=> {active=entry.isIntersecting;dirty=true});observer.observe(element)
    const contextLost=(event:Event)=>{event.preventDefault();active=false;element.dataset.ready='false';element.dataset.renderer='unavailable';setFallback(true)}
    renderer.domElement.addEventListener('webglcontextlost',contextLost)
    controls.addEventListener('change',()=>{element.dataset.azimuth=controls.getAzimuthalAngle().toFixed(3);applyModel()})
    let slowFrames=0
    function render(){if(disposed)return;animation=requestAnimationFrame(render);if(active&&document.visibilityState==='visible'){
      controls.update();
      if(dirty){
        const start=performance.now();renderer.render(scene,camera);dirty=false
        if(performance.now()-start>85)slowFrames++
        if(slowFrames===3){renderer.setPixelRatio(1);sun.shadow.mapSize.set(1024,1024);sun.shadow.map?.dispose();sun.shadow.map=null;renderer.shadowMap.needsUpdate=true;dirty=true;slowFrames++}
        element.dataset.frames=String(Number(element.dataset.frames||0)+1)
        element.dataset.renderer='webgl';element.dataset.ready='true'
      }
    }}
    const turn=(delta:number)=>{const v=camera.position.clone().sub(controls.target);v.applyAxisAngle(new T.Vector3(0,1,0),delta);camera.position.copy(controls.target).add(v);controls.update()}
    const zoom=(delta:number)=>{const v=camera.position.clone().sub(controls.target);v.setLength(T.MathUtils.clamp(v.length()*delta,3,115));camera.position.copy(controls.target).add(v);controls.update()}
    runtime.current={update,explore,frame,turn,zoom,dispose:()=>{
      disposed=true;cancelAnimationFrame(animation);resizeObserver.disconnect();observer.disconnect();controls.dispose();model.dispose();env.dispose();skyTexture.dispose();sun.shadow.dispose();renderer.domElement.removeEventListener('webglcontextlost',contextLost);renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove()
    }}
    resize();update(latest.current.progress,latest.current.openTop);explore(latest.current.exploring);render();element.dataset.ready='true'
    },0)
    return ()=>{window.clearTimeout(initialize);runtime.current?.dispose();runtime.current=null}
  }, [attempt])
  useEffect(()=>{runtime.current?.update(props.progress,props.openTop)},[props.progress,props.openTop])
  useEffect(()=>{runtime.current?.explore(props.exploring)},[props.exploring])
  useEffect(()=>{runtime.current?.frame(props.view)},[props.view,props.reset])
  const lastTurn=useRef(props.turn),lastZoom=useRef(props.zoom)
  useEffect(()=>{runtime.current?.turn((props.turn-lastTurn.current)*Math.PI/6);lastTurn.current=props.turn},[props.turn])
  useEffect(()=>{runtime.current?.zoom(Math.pow(.8,props.zoom-lastZoom.current));lastZoom.current=props.zoom},[props.zoom])
  return <div className="pilot-three-scene" ref={host} data-testid="pilot-three-scene">
    {fallback&&<div className="pilot-three-fallback"><PilotSequenceScene progress={props.progress} openTop={props.openTop} angle={-35} zoom={1} dusk={false}/><div role="status"><p>O navegador interrompeu a visualização 3D. A prévia abaixo é estática.</p><button onClick={()=>setAttempt(n=>n+1)}>Tentar carregar o modelo 3D</button></div></div>}
  </div>
}
