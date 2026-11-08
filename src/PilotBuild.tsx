import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Layers, Move, RotateCcw, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react'
import PilotThreeScene from './components/PilotThreeScene'
import type { ExplorerProps } from './Explorer'
import { pilotInterior } from './data/pilotInterior'

export default function PilotBuild({ onBack, reduced }: ExplorerProps) {
  // The completed presentation starts as a cutaway so the 3D furniture is
  // immediately readable. The cover control can restore the exterior roof.
  const [progress,setProgress]=useState(0),[openTop,setOpenTop]=useState(true),[exploring,setExploring]=useState(true)
  const [view,setView]=useState(0),[reset,setReset]=useState(0),[turn,setTurn]=useState(0),[zoom,setZoom]=useState(0)
  const [introPlaying,setIntroPlaying]=useState(true),[guideStep,setGuideStep]=useState(0)
  const story=useRef<HTMLDivElement>(null)
  const phase=progress<5?'A planta':progress<38?'Paredes e estrutura':progress<60?'Esquadrias e interiores':progress<80?'Móveis e jardim':'A casa completa'
  useEffect(()=>{
    let raf=0
    const update=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{
      if(exploring||!story.current)return
      const bounds=story.current.getBoundingClientRect(),range=story.current.offsetHeight-window.innerHeight
      setProgress(Math.round(Math.max(0,Math.min(100,-bounds.top/Math.max(1,range)*100))*10)/10)
    })}
    update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update)
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',update);window.removeEventListener('resize',update)}
  },[exploring])
  useEffect(()=>{
    const duration=reduced?450:3000,start=performance.now();let raf=0
    const animate=(now:number)=>{
      const linear=Math.min(1,(now-start)/duration),eased=linear<.5?2*linear*linear:1-Math.pow(-2*linear+2,2)/2
      setProgress(Math.round(eased*1000)/10)
      if(linear<1)raf=requestAnimationFrame(animate)
      else{setProgress(100);setExploring(true);setIntroPlaying(false)}
    }
    raf=requestAnimationFrame(animate)
    return()=>cancelAnimationFrame(raf)
  },[reduced])
  const seek=(next:number)=>{
    setProgress(next)
    if(!exploring&&story.current){const top=window.scrollY+story.current.getBoundingClientRect().top;window.scrollTo({top:top+(story.current.offsetHeight-window.innerHeight)*next/100,behavior:'instant'})}
  }
  const selectView=(index:number)=>{setView(index);setExploring(true);if(index>0)seek(100)}
  const guide=[
    {number:'01',title:'Veja a casa nascer',copy:'A apresentação percorre a obra da planta até a residência concluída.'},
    {number:'02',title:'Explore livremente',copy:'Arraste a casa para girar. Use + e − para entrar ou se afastar.'},
    {number:'03',title:'Entre nos ambientes',copy:'Escolha um cômodo. O teto se afasta automaticamente quando necessário.'},
  ]
  return <div className="pilot-real" data-testid="pilot-build" data-mode={exploring?'explore':'build'} data-intro={introPlaying?'playing':'complete'}>
    <div className="pilot-real-story" ref={story}>
      <section className="pilot-real-stage" data-testid="residence-scene" data-progress={progress}>
        <PilotThreeScene progress={progress} openTop={openTop} exploring={exploring} view={view} reset={reset} turn={turn} zoom={zoom} reduced={reduced}/>
        <div className="pilot-real-heading"><button onClick={onBack} aria-label="Voltar ao território"><ArrowLeft size={18}/></button><span> TERRA SANTA <small>CASA 01</small></span></div>
        <div className="pilot-real-tools">
          <button data-testid="explore-toggle" aria-pressed={exploring} onClick={()=>setExploring(v=>!v)}><Move size={16}/>{exploring?'Explorando 360°':'Explorar 360°'}</button>
          <button data-testid="roof-toggle" aria-pressed={!openTop} onClick={()=>setOpenTop(v=>!v)}><Layers size={16}/>Cobrir</button>
          <button aria-label="Restaurar vista" onClick={()=>{setView(0);setReset(v=>v+1)}}><RotateCcw size={16}/></button>
        </div>
        {exploring&&<div className="pilot-camera-tools" aria-label="Controles de câmera">
          <button aria-label="Girar para a esquerda" onClick={()=>setTurn(v=>v-1)}><ChevronLeft size={18}/></button>
          <button aria-label="Girar para a direita" onClick={()=>setTurn(v=>v+1)}><ChevronRight size={18}/></button>
          <button aria-label="Aproximar" onClick={()=>setZoom(v=>v+1)}><Plus size={18}/></button>
          <button aria-label="Afastar" onClick={()=>setZoom(v=>v-1)}><Minus size={18}/></button>
        </div>}
        <div className="pilot-real-bottom">
          {exploring&&<div className="pilot-room-views">{pilotInterior.roomViews.map((room,i)=><button key={room.label} aria-pressed={view===i} onClick={()=>selectView(i)}>{room.label}</button>)}</div>}
          <div className="pilot-real-caption"><span data-testid="construction-stage">{phase}</span><span>{exploring?'Arraste para girar · aproxime para explorar':'Role para construir'} · {Math.round(progress)}%</span></div>
          <input aria-label="Progresso da construção" data-testid="construction-progress" type="range" min="0" max="100" step="1" value={progress} onChange={e=>seek(Number(e.target.value))}/>
          <small>Estudo visual da referência · materiais e medidas a confirmar</small>
        </div>
        {guideStep<3&&<aside className="pilot-guide" data-testid="pilot-guide" aria-label={`Orientação ${guideStep+1} de 3`}>
          <div className="pilot-guide-count"><strong>{guide[guideStep].number}</strong><span>de 03</span></div>
          <div className="pilot-guide-copy"><p>PASSO {guideStep+1}</p><h2>{guide[guideStep].title}</h2><span>{guide[guideStep].copy}</span></div>
          <div className="pilot-guide-actions"><button type="button" onClick={()=>setGuideStep(3)}>Pular</button><button type="button" data-testid="guide-next" onClick={()=>setGuideStep(step=>step+1)}>{guideStep===2?'Começar':'Próximo'}<ChevronRight size={16}/></button></div>
          <div className="pilot-guide-dots" aria-hidden="true">{guide.map((_,index)=><i key={index} className={index===guideStep?'is-active':''}/>)}</div>
        </aside>}
      </section>
    </div>
  </div>
}
