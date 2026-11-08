import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Heart, Moon, Plus, Sun } from 'lucide-react';
import Modal from './components/Modal';
import Topography from './components/Topography';
import { ConceptImage } from './components/ConceptImage';
import { getResidenceSummary, type Residence } from './data/residences';
import type { PreferenceSignalInput } from './state/preferences';

export type ExplorerProps = { residence: Residence; favorite: boolean; onFavorite: () => void; onBack: () => void; onCompare: () => void; onRecommend: () => void; onSignal: (signal: PreferenceSignalInput) => void; reduced: boolean };
const stages = ['Terreno', 'Planta', 'Estrutura', 'Residência'];

export default function Explorer({ residence, favorite, onFavorite, onBack, onCompare, onRecommend, onSignal, reduced }: ExplorerProps) {
  const [progress, setProgress] = useState(0);
  const [openTop, setOpenTop] = useState(false);
  const [dusk, setDusk] = useState(false);
  const [room, setRoom] = useState<string | null>(null);
  const [reference, setReference] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [slideIndex, setSlideIndex] = useState(1);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const activeRoom = residence.hotspots.find(h => h.id === room);
  const slides = [residence.media.hero, ...residence.media.gallery.filter(src => src !== residence.media.hero && src !== residence.media.planImage), residence.media.planImage].filter(Boolean) as string[];
  const stage = progress < 25 ? 0 : progress < 55 ? 1 : progress < 90 ? 2 : 3;
  useEffect(() => {
    let seconds = 0;
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        seconds += 15;
        onSignal({ residenceId: residence.id, type: 'time-spent', key: String(seconds) });
      }
    }, 15000);
    return () => { clearInterval(timer); if (idle.current) clearTimeout(idle.current); };
  }, [residence.id, onSignal]);
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = gallery.current?.getBoundingClientRect().top ?? 0;
        setOffset(Math.max(-30, Math.min(30, (window.innerHeight / 2 - y) * .045)));
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => { window.removeEventListener('scroll', update); cancelAnimationFrame(frame); };
  }, [reduced]);
  useEffect(() => {
    const elements = gallery.current?.querySelectorAll('.gallery-image, .exterior-editorial') ?? [];
    if (reduced) { elements.forEach(element => element.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    elements.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [reduced]);
  const openRoom = (id: string) => { setRoom(id); onSignal({ residenceId: residence.id, type: 'hotspot-open', key: id }); };

  return <div className="explorer" data-testid="explorer">
    <div className="explorer-top"><button className="text-button" onClick={onBack}><ArrowLeft size={17} /> Voltar ao território</button><span className="eyebrow">RESIDÊNCIAS / {residence.name.toUpperCase()}</span></div>
    <section className="residence-intro">
      <div><p className="eyebrow">DA TERRA AO SEU LUGAR</p><h1>{residence.name}<em> / </em><span>{residence.tagline}</span></h1><p className="facts">{getResidenceSummary(residence)}</p></div>
      <button className={`favorite-button ${favorite ? 'is-favorite' : ''}`} data-testid={`favorite-${residence.id}`} aria-label={`${favorite ? 'Desfavoritar' : 'Favoritar'} ${residence.name}`} aria-pressed={favorite} onClick={onFavorite}><Heart size={19} fill={favorite ? 'currentColor' : 'none'} /><span>{favorite ? 'Favorita' : 'Guardar favorita'}</span></button>
    </section>
    <section className={`exploration-scene ${dusk ? 'is-dusk' : ''}`} data-testid="residence-scene" data-atmosphere={dusk ? 'dusk' : 'day'} data-progress={progress}>
      <Topography /><div className="scene-meta"><span className="eyebrow">{openTop ? '02 — POR DENTRO' : '01 — NASCIMENTO'}</span><span className="eyebrow">{dusk ? 'ENTARDECER' : 'LUZ DO DIA'}</span></div>
      <div className="scene-wrap editorial-house-image residence-slideshow"><img src={slides[slideIndex]} alt={slideIndex === 0 ? `Planta de referência de ${residence.name}` : `Vista da ${residence.name}`} /><div className="residence-landing-overlay"><span className="eyebrow">TERRA SANTA · RESIDÊNCIA</span><h1>{residence.name}</h1><p>{residence.tagline}</p><strong>{residence.id === 'casa-1' ? 'Um lar que acolhe os seus dias.' : residence.id === 'casa-2' ? 'Espaço para viver perto do que importa.' : 'Natureza, presença e tempo para a família.'}</strong><button type="button" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>Conhecer a residência <ArrowUpRight size={18} /></button></div><div className="slide-controls" aria-label="Imagens da residência">{slides.map((src, index) => <button key={src} type="button" className={index === slideIndex ? 'is-active' : ''} aria-label={`Mostrar imagem ${index + 1}`} onClick={() => setSlideIndex(index)} />)}</div></div>
      <div className="scene-caption"><span>{slideIndex === 0 ? 'Planta de referência · primeiro olhar' : 'Uma casa para imaginar vivendo.'}</span><span className="concept-chip">{slideIndex === 0 ? 'PLANTA' : 'AMBIENTAÇÃO'}</span></div>
      <div className="construction-controls">
        <div className="construction-head"><span className="eyebrow">CONSTRUÇÃO</span><span data-testid="construction-stage" aria-live="polite">{stages[stage]} <small>0{stage + 1} / 04</small></span></div>
        <input type="range" min="0" max="100" step="1" aria-label="Progresso da construção" data-testid="construction-progress" value={progress} onChange={e => { setProgress(+e.target.value); if (+e.target.value < 90) setOpenTop(false); }} />
        <div className="construction-steps"><button data-testid="construction-back" className="text-button" onClick={() => { setProgress([0, 33, 66, 100][Math.max(0, stage - 1)]); setOpenTop(false); }} disabled={stage === 0}><ArrowLeft size={15} /> Recuar construção</button><button data-testid="construction-forward" className="text-button" onClick={() => setProgress([0, 33, 66, 100][Math.min(3, stage + 1)])} disabled={stage === 3}>Avançar construção <ArrowRight size={15} /></button></div>
      </div>
    </section>
    <section className="landing-plan-section"><div className="landing-plan-copy"><p className="eyebrow">A PLANTA DA RESIDÊNCIA</p><h2>Um desenho pensado<br /><em>para a vida acontecer.</em></h2><p>Veja como os ambientes se conectam, onde a luz entra e como a casa organiza os momentos do dia.</p></div><figure><img src={residence.media.planImage || residence.media.hero} alt={`Planta de referência da ${residence.name}`} /><figcaption>Planta de referência · proporções e materiais a confirmar</figcaption></figure></section>
    <section className="landing-story-section"><p className="eyebrow">UM JEITO DE MORAR</p><h2>{residence.id === 'casa-1' ? 'A casa que acompanha o ritmo da família.' : residence.id === 'casa-2' ? 'Espaços que aproximam o cotidiano.' : 'Uma pausa verde no meio da vida.'}</h2><p>Ambientes conectados, luz natural e uma escala acolhedora para transformar todos os dias em momentos de presença.</p></section>
    <section className="landing-family-section"><figure><img src={residence.media.gallery.find(src => src.includes('familia')) || residence.media.gallery[1] || residence.media.hero} alt={`Família vivendo a ${residence.name}`} /></figure><div><p className="eyebrow">VIDA REAL</p><h2>Mais do que metros quadrados.<br /><em>Um lugar para pertencer.</em></h2><p>Da primeira manhã ao jantar em família, cada espaço foi pensado para caber histórias verdadeiras.</p></div></section>
    <div className="explore-toolbar"><button data-testid="atmosphere-toggle" aria-pressed={dusk} onClick={() => setDusk(!dusk)}>{dusk ? <Sun size={18} /> : <Moon size={18} />}{dusk ? 'Dia' : 'Entardecer'}</button></div>
    <p className="concept-notice">{residence.conceptualNotice} {openTop ? 'Esquema ilustrativo, sem escala.' : ''}</p>
    {residence.media.referenceFloorPlan && <button className="reference-button" onClick={() => setReference(true)}>Ver a referência recebida <ArrowUpRight size={17} /><span>Associação a confirmar</span></button>}

    <section className="gallery-section" ref={gallery} style={{ '--parallax': `${offset}px` } as CSSProperties}>
      <figure className="exterior-editorial"><ConceptImage src={residence.media.hero} alt={residence.mediaMetadata.alt} /><figcaption><span>A LUZ MUDA. A CASA TAMBÉM.</span><span>INTERPRETAÇÃO CONCEITUAL</span></figcaption></figure>
      <div className="gallery-heading"><span className="eyebrow">OS DETALHES DÃO SENTIDO</span><h2>Imagine seu<br /><em>modo de viver.</em></h2><p>Entre a luz, os encontros e as pausas.<br />Uma atmosfera para descobrir.</p></div>
      <div className="editorial-gallery">
        <button className="gallery-image image-tall" onClick={() => openRoom(residence.hotspots[0].id)}><ConceptImage src={residence.hotspots[0].image} alt={`Estudo conceitual de ${residence.hotspots[0].label.toLowerCase()}`} /><span>01 / {residence.hotspots[0].label}<ArrowUpRight /></span></button>
        <button className="gallery-image image-small" onClick={() => openRoom(residence.hotspots[1].id)}><ConceptImage src={residence.hotspots[1].image} alt={`Estudo conceitual de ${residence.hotspots[1].label.toLowerCase()}`} /><span>02 / {residence.hotspots[1].label}<ArrowUpRight /></span></button>
        <button className="gallery-image image-wide" onClick={() => openRoom(residence.hotspots[2].id)}><ConceptImage src={residence.hotspots[2].image} alt={`Estudo conceitual de ${residence.hotspots[2].label.toLowerCase()}`} /><span>03 / {residence.hotspots[2].label}<ArrowUpRight /></span></button>
        <div className="gallery-quote"><span className="eyebrow">UM ESTUDO DE POSSIBILIDADES</span><p>Uma casa é feita<br />dos seus dias.</p><button className="text-button" onClick={() => openRoom(residence.hotspots[3].id)}>Explore {residence.hotspots[3].label.toLowerCase()} <ArrowUpRight size={18} /></button></div>
      </div>
      <p className="small">Imagens conceituais. Ambientes, materiais e configuração a confirmar.</p>
    </section>
    <section className="lifestyle"><p className="eyebrow">O QUE TOCA VOCÊ?</p><h2>Leve com você<br /><em>uma preferência.</em></h2><p className="small">{residence.tagNotice}</p><div className="tag-buttons">{residence.lifestyleTags.map(tag => <button key={tag} data-testid={`feature-${tag}`} aria-pressed={tags.includes(tag)} disabled={tags.includes(tag)} className={tags.includes(tag) ? 'selected' : ''} onClick={() => { if (!tags.includes(tag)) { setTags([...tags, tag]); onSignal({ residenceId: residence.id, type: 'feature-focus', key: tag }); } }}>{tag}<Plus size={15} /></button>)}</div></section>
    <div className="decision-links"><button className="text-button" onClick={onCompare}>Compare duas formas de viver <ArrowUpRight /></button><button className="primary-button" onClick={onRecommend}>Ver minha recomendação <ArrowUpRight /></button></div>
    {activeRoom && <Modal title={`Ambiente ${activeRoom.label}`} className="room-modal" testId="room-panel" onClose={() => setRoom(null)}><ConceptImage src={activeRoom.image} alt={`Estudo conceitual de ${activeRoom.label.toLowerCase()}`} loading="eager" /><div className="room-copy"><p className="eyebrow">{residence.name} · INTERPRETAÇÃO CONCEITUAL</p><h2>{activeRoom.label}</h2><p>{activeRoom.description}</p><button className="text-button" onClick={() => { setRoom(null); setOpenTop(true); setProgress(100); }}><ArrowLeft size={17} /> Voltar à planta</button></div></Modal>}
    {reference && residence.media.referenceFloorPlan && <Modal title="Planta de referência" testId="reference-plan" className="reference-modal" onClose={() => setReference(false)}><p className="eyebrow">{residence.media.referenceFloorPlan.caption}</p><h2>Um olhar sobre<br /><em>a referência.</em></h2><img src={residence.media.referenceFloorPlan.src} alt="Planta humanizada recebida, com ambientes de dormir, áreas sociais e vegetação aparentes; associação e configuração não confirmadas." /><p className="small">Imagem de referência recebida. Sua associação a esta residência e suas características ainda precisam ser confirmadas pelo cliente.</p></Modal>}
  </div>;
}

