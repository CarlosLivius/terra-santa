import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Modal from './components/Modal';
import MotionBand from './components/MotionBand';
import usePageMotion from './components/usePageMotion';
import type { ExplorerProps } from './Explorer';
import './styles/residence.css';
import './styles/residence-motion.css';

const Model = lazy(() => import('./components/ResidenceModel'));

type Story = { title: string; copy: string; image: string; cta: string; action: 'gallery' | 'model' };

export default function ResidenceLanding({ residence: r, onCompare, onRecommend, reduced }: ExplorerProps) {
  const [model, setModel] = useState(false);
  const [openTop, setOpenTop] = useState(false);
  const [modelKey, setModelKey] = useState(0);
  const [slide, setSlide] = useState(0);
  const [thumbProgress, setThumbProgress] = useState(0);
  const [storySlide, setStorySlide] = useState(0);
  const [filmStep, setFilmStep] = useState(0);
  const [openStory, setOpenStory] = useState<Story | null>(null);
  const [planOpen, setPlanOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const touch = useRef<number | null>(null);
  const thumbRail = useRef<HTMLDivElement>(null);
  const storyRail = useRef<HTMLDivElement>(null);
  const filmSection = useRef<HTMLElement>(null);

  usePageMotion(root, reduced, `${r.id}-${model}`);

  const images = (r.id === 'casa-1'
    // Buriti uses only its own client references in the lower gallery. The
    // generic concept image was the old slide 1 and caused the rail to drift.
    ? r.media.gallery.filter(src => src !== r.media.hero)
    : [r.media.hero, ...r.media.interiors, ...r.media.gallery]
  ).filter((src, index, all) => src !== r.media.planImage && all.indexOf(src) === index);
  const stories: Story[] = [
    {
      title: 'Momentos',
      copy: 'Uma mesa posta, uma conversa que se estende. Imagine uma casa que dá espaço para estar junto — sem pressa e com presença.',
      image: r.media.gallery.find(src => src.includes('familia')) || r.media.interiors[0] || r.media.gallery[1] || r.media.hero,
      cta: 'Percorrer imagens da casa',
      action: 'gallery',
    },
    {
      title: 'Seu ritmo',
      copy: 'Do café tranquilo ao fim de um dia cheio: descubra ambientes para desacelerar e fazer a rotina caber melhor.',
      image: r.media.gallery.find(src => src !== r.media.hero && !src.includes('planta')) || r.media.interiors[1] || r.media.hero,
      cta: 'Percorrer imagens da casa',
      action: 'gallery',
    },
    {
      title: 'Seu futuro',
      copy: 'Uma escolha de moradia também faz parte dos planos que você constrói. Conheça o modelo em outra perspectiva, sem promessas financeiras não confirmadas.',
      image: r.media.gallery.find(src => src !== r.media.hero && !src.includes('planta') && /sala|cozinha|quarto|varanda|familia|ambientacao/i.test(src)) || r.media.gallery.find(src => src !== r.media.hero && !src.includes('planta')) || r.media.hero,
      cta: 'Explorar o volume em 3D',
      action: 'model',
    },
  ];

  useEffect(() => {
    const rail = thumbRail.current;
    if (!rail) return;
    let startX = 0;
    let startScroll = 0;
    let dragging = false;
    const down = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || (event.target as HTMLElement).closest('button,input')) return;
      startX = event.clientX;
      startScroll = rail.scrollLeft;
      dragging = true;
      rail.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => { if (dragging) rail.scrollLeft = startScroll - (event.clientX - startX); };
    const up = () => { dragging = false; };
    rail.addEventListener('pointerdown', down);
    rail.addEventListener('pointermove', move);
    rail.addEventListener('pointerup', up);
    rail.addEventListener('pointercancel', up);
    return () => {
      rail.removeEventListener('pointerdown', down);
      rail.removeEventListener('pointermove', move);
      rail.removeEventListener('pointerup', up);
      rail.removeEventListener('pointercancel', up);
    };
  }, [r.id]);

  useEffect(() => {
    const section = filmSection.current;
    if (!section) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = section.getBoundingClientRect();
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -bounds.top / range));
      const step = Math.round(progress * (Math.min(3, r.media.gallery.length) - 1));
      setFilmStep(current => current === step ? current : step);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); };
  }, [r.id, reduced, r.media.gallery.length]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  const chooseSlide = (index: number) => {
    const next = (index + images.length) % images.length;
    setSlide(next);
    thumbRail.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduced ? 'auto' : 'smooth' });
  };
  const chooseStory = (index: number) => {
    const rail = storyRail.current;
    const card = rail?.querySelector<HTMLElement>('.res-story-card');
    if (!rail || !card) return;
    const gap = Number.parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap) || 0;
    const next = (index + stories.length) % stories.length;
    rail.scrollTo({ left: next * (card.offsetWidth + gap), behavior: reduced ? 'auto' : 'smooth' });
    setStorySlide(next);
  };
  const onStoryScroll = () => {
    const rail = storyRail.current;
    const card = rail?.querySelector<HTMLElement>('.res-story-card');
    if (!rail || !card) return;
    const gap = Number.parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap) || 0;
    setStorySlide(Math.min(stories.length - 1, Math.max(0, Math.round(rail.scrollLeft / (card.offsetWidth + gap)))));
  };

  if (model) return <div className="model-screen"><header><button onClick={() => setModel(false)}>← Voltar à residência</button><strong>{r.name}</strong><div className="model-actions"><button aria-pressed={openTop} onClick={() => setOpenTop(v => !v)}>{openTop ? 'Ver cobertura' : 'Ver interiores'}</button><button onClick={() => setModelKey(v => v + 1)}>Recentrar</button></div></header><Suspense fallback={<p>Preparando modelo…</p>}><Model key={`${r.id}-${openTop}-${modelKey}`} residence={r} openTop={openTop} /></Suspense><footer>Arraste para girar · Role para aproximar · Arraste com dois dedos para mover<br /><strong>Protótipo volumétrico conceitual específico desta residência.</strong> Não representa projeto executivo; layout, materiais e proporções devem ser confirmados.</footer></div>;

  return <article ref={root} className="residence-page" data-reduced={reduced}>

    <section className="res-hero"><div><p className="res-label">SEU PRÓXIMO CAPÍTULO COMEÇA AQUI</p><h1>{r.name}</h1><h2>{r.id === 'casa-1' ? 'Onde a vida ganha espaço.' : r.id === 'casa-2' ? 'A vida flui melhor aqui.' : 'Seu tempo. Mais perto do verde.'}</h2><p>Abra a porta para novos planos. Descubra os espaços e imagine a rotina que você quer viver.</p><button className="res-button" onClick={() => scrollTo('living')}>Conhecer a residência <ArrowUpRight size={17} /></button><button className="res-link" onClick={() => setModel(true)}>Explorar em 3D ↗</button></div><img src={r.media.hero} alt={`Exterior da ${r.name}`} /></section>

    <MotionBand name={r.name} />

    <section className="res-film" ref={filmSection} aria-label={`Apresentação visual da ${r.name}`}>
      <div className="res-film-stage">
        {r.media.gallery.slice(0, 3).map((src, index) => <img key={src} className={filmStep === index ? 'is-current' : ''} src={src} alt="" aria-hidden="true" />)}
        <div className="res-film-shade" />
        <div className="res-film-copy"><p className="res-label">{r.name} · {String(filmStep + 1).padStart(2, '0')} / 03</p><h2>{['Uma primeira impressão.', 'Luz para o dia a dia.', 'Espaço para estar junto.'][filmStep]}</h2><span>Role para acompanhar cada cena</span><div className="res-film-progress" aria-hidden="true"><i style={{ width: `${((filmStep + 1) / 3) * 100}%` }} /></div></div>
        <span className="res-film-index">IMAGENS CONCEITUAIS · SEQUÊNCIA GUIADA PELA ROLAGEM</span>
      </div>
    </section>

    <section id="living" className="res-life">
      <p className="res-label">01 / PERTENCER</p>
      <div className="res-life-heading"><h2>O melhor da vida<br /><em>acontece em casa.</em></h2><div className="res-life-controls"><button aria-label="Ver momento anterior" onClick={() => chooseStory(storySlide - 1)}>←</button><button aria-label="Ver próximo momento" onClick={() => chooseStory(storySlide + 1)}>→</button></div></div>
      <div className="res-cards" ref={storyRail} onScroll={onStoryScroll} aria-label="Momentos que cabem na casa">
        {stories.map((story, index) => <article className={`res-story-card${storySlide === index ? ' is-current' : ''}`} key={story.title}>
          <img src={story.image} alt={`Momento ${story.title.toLowerCase()} em ${r.name}`} loading="lazy" />
          <span className="res-card-number">0{index + 1} / VIVER BEM</span>
          <div><h3>{story.title}</h3><p>{story.copy}</p><button onClick={() => setOpenStory(story)}>{index === 2 ? 'Planejar futuro' : 'Ver este momento'} <ArrowUpRight size={15} /></button></div>
        </article>)}
      </div>
      <div className="res-story-progress" aria-label={`Momento ${storySlide + 1} de ${stories.length}`}>
        {stories.map((story, index) => <button key={story.title} aria-label={`Ir para ${story.title}`} aria-current={storySlide === index ? 'step' : undefined} onClick={() => chooseStory(index)}><span /></button>)}
        <span>{String(storySlide + 1).padStart(2, '0')} <i>/</i> {String(stories.length).padStart(2, '0')}</span>
      </div>
      <p className="res-life-hint">Deslize, use as setas ou toque em um momento para ampliar.</p>
    </section>

    <section id="gallery" className="res-gallery-section">
      <p className="res-label">02 / SENTIR</p><h2>Entre. Imagine.<br />Sinta-se em casa.</h2>
      <div className="res-gallery-stage" tabIndex={0} aria-label="Galeria de imagens. Use as setas para navegar." onKeyDown={event => { if (event.key === 'ArrowRight') chooseSlide(slide + 1); if (event.key === 'ArrowLeft') chooseSlide(slide - 1); }} onTouchStart={event => { touch.current = event.touches[0].clientX; }} onTouchEnd={event => { if (touch.current !== null) { const delta = event.changedTouches[0].clientX - touch.current; if (Math.abs(delta) > 50) chooseSlide(slide + (delta < 0 ? 1 : -1)); } touch.current = null; }}>
        <img key={images[slide]} className="res-gallery" src={images[slide]} alt={`Vista ${slide + 1} da ${r.name}`} />
        <div className="res-gallery-toolbar"><button aria-label="Imagem anterior" onClick={() => chooseSlide(slide - 1)}>←</button><span aria-live="polite">{String(slide + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span><button aria-label="Próxima imagem" onClick={() => chooseSlide(slide + 1)}>→</button></div>
      </div>
      <div className="res-thumb-rail" ref={thumbRail} onScroll={event => { const rail = event.currentTarget; setThumbProgress(rail.scrollWidth <= rail.clientWidth ? 0 : rail.scrollLeft / (rail.scrollWidth - rail.clientWidth) * 100); }} onWheel={event => { const rail = event.currentTarget; if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) rail.scrollLeft += event.deltaY; }}>
        <div className="res-thumbs">{images.map((src, index) => <button key={src} aria-label={`Ver imagem ${index + 1}`} aria-pressed={slide === index} onClick={() => chooseSlide(index)}><img src={src} alt="" loading="lazy" /></button>)}</div>
      </div>
      <div className="res-thumb-control"><span>GALERIA</span><input type="range" min="0" max="100" value={thumbProgress} style={{ '--thumb-progress': `${thumbProgress}%` } as CSSProperties} aria-label="Percorrer imagens lateralmente" onChange={event => { const rail = thumbRail.current; const value = Number(event.target.value); if (rail) rail.scrollTo({ left: (rail.scrollWidth - rail.clientWidth) * (value / 100), behavior: reduced ? 'auto' : 'smooth' }); setThumbProgress(value); }} /><span>{String(slide + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span></div>
      <small>Imagens de referência e ambientações conceituais.</small>
    </section>

    <section className="res-plan">
      <div><p className="res-label">03 / DESCOBRIR</p><h2>Cada espaço.<br /><em>Novas possibilidades.</em></h2><p>Conheça a distribuição dos ambientes e imagine como sua rotina pode acontecer aqui.</p></div>
      <button className="res-plan-open" onClick={() => setPlanOpen(true)} aria-label={`Ampliar a planta da ${r.name}`}><img src={r.media.planImage} alt={`Planta completa da ${r.name}`} /><span>Toque para ampliar <ArrowUpRight size={16} /></span></button>
    </section>

    <section className="res-digital"><p className="res-label">04 / EXPLORAR</p><h2>Um novo ponto de vista.<br />Em três dimensões.</h2><p>Gire, aproxime e descubra o volume da residência em uma tela dedicada.</p><button className="res-button" onClick={() => setModel(true)}>Abrir experiência 3D <ArrowUpRight size={17} /></button><p><small>Estudo volumétrico conceitual específico da residência.</small></p></section>

    <section id="investment" className="res-investment"><p className="res-label">05 / PLANEJAR</p><h2>Seu próximo passo<br />merece uma boa escolha.</h2><div className="res-cards res-cards-static"><div><h3>Para morar</h3><p>Escolha pensando nas pessoas, nos encontros e na rotina que deseja viver.</p></div><div><h3>Para investir</h3><p>Compare as opções e avalie condições de compra e objetivos patrimoniais antes de decidir.</p></div></div><button className="res-button" onClick={onCompare}>Comparar residências <ArrowUpRight size={17} /></button></section>

    <section className="res-close"><p className="res-label">06 / ESCOLHER</p><h2>Qual será o cenário<br />da sua próxima história?</h2><p>Encontre a casa que combina com o seu momento.</p><button className="res-button" onClick={onRecommend}>Descobrir minha casa ideal <ArrowUpRight size={17} /></button></section>

    {openStory && <Modal title={openStory.title} className="res-story-modal" onClose={() => setOpenStory(null)}><img src={openStory.image} alt={`Experiência ${openStory.title.toLowerCase()} em ${r.name}`} /><div className="res-story-modal-copy"><p className="res-label">{r.name} · UM JEITO DE VIVER</p><h2>{openStory.title}<br /><em>do seu jeito.</em></h2><p>{openStory.copy}</p><button className="res-button" onClick={() => { setOpenStory(null); if (openStory.action === 'model') setModel(true); else scrollTo('gallery'); }}>{openStory.cta} <ArrowUpRight size={17} /></button></div></Modal>}
    {planOpen && <Modal title={`Planta da ${r.name}`} className="res-plan-modal" onClose={() => setPlanOpen(false)}><p className="res-label">{r.name} · PLANTA DE REFERÊNCIA</p><img src={r.media.planImage} alt={`Planta ampliada da ${r.name}`} /><p>Planta de referência para leitura dos espaços. Proporções e configuração devem ser confirmadas.</p></Modal>}
  </article>;
}
