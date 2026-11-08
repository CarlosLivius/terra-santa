import { lazy, Suspense, useCallback, useEffect, useRef, useState, type CSSProperties, type TouchEvent, type WheelEvent } from 'react';
import { ArrowLeft, ArrowUpRight, Check, GitCompareArrows, Heart, Home, House, Menu, RotateCcw, Sparkles } from 'lucide-react';
import Brand from './components/Brand';
import Topography from './components/Topography';
import HouseScene from './components/HouseScene';
import Modal from './components/Modal';
import useMotion from './components/useMotion';
import { getConfirmedFeatureLabel, getResidenceSummary, residences as catalogResidences, residenceById, type ResidenceId } from './data/residences';
import { getRecommendation, loadSession, recordSignal, resetSession, saveSession, toggleFavorite, type PreferenceSignalInput } from './state/preferences';

const Explorer = lazy(() => import('./ResidenceLanding'));
type View = 'origin' | 'territory' | 'residence' | 'comparison' | 'recommendation';
const residences = catalogResidences.filter(residence => residence.id !== 'casa-4');

export default function App() {
  const [view, setView] = useState<View>('origin');
  const [impactWord,setImpactWord]=useState(0);
  const [active, setActive] = useState<ResidenceId>('casa-1');
  const [session, setSession] = useState(loadSession);
  const [menu, setMenu] = useState(false);
  const [interest, setInterest] = useState(false);
  const [pair, setPair] = useState<[ResidenceId, ResidenceId]>(['casa-1', 'casa-2']);
  const mainRef = useRef<HTMLElement>(null);
  const territoryWheelAt = useRef(0);
  const territoryTouchY = useRef<number | null>(null);
  const territoryRef = useRef<HTMLElement>(null);
  const [mobileReveal, setMobileReveal] = useState(0);
  const reduced = useMotion();
  useEffect(() => { saveSession(session); }, [session]);
  useEffect(() => {
    if (view !== 'origin') return;
    const timer = setTimeout(() => setView('territory'), 3200);
    return () => clearTimeout(timer);
  }, [view]);
  useEffect(()=>{
    if(view!=='territory')return
    const timer=window.setInterval(()=>setImpactWord(word=>(word+1)%4),2200)
    return()=>window.clearInterval(timer)
  },[view])
  useEffect(() => {
    if (view !== 'territory') return;
    const updateReveal = () => {
      if (window.innerWidth > 760 || !territoryRef.current) { setMobileReveal(0); return; }
      const section = territoryRef.current;
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      setMobileReveal(Math.min(1, Math.max(0, -section.getBoundingClientRect().top / range)));
    };
    updateReveal();
    window.addEventListener('scroll', updateReveal, { passive: true });
    window.addEventListener('resize', updateReveal);
    return () => { window.removeEventListener('scroll', updateReveal); window.removeEventListener('resize', updateReveal); };
  }, [view]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (view !== 'origin') mainRef.current?.focus({ preventScroll: true });
  }, [view]);
  const onSignal = useCallback((signal: PreferenceSignalInput) => setSession(previous => recordSignal(previous, signal)), []);
  const go = (next: View) => { setMenu(false); setView(next); };
  const open = (id: ResidenceId) => { setActive(id); onSignal({ residenceId: id, type: 'view' }); go('residence'); };
  const rotateResidences = (direction: number) => {
    setActive(current => {
      const index = residences.findIndex(residence => residence.id === current);
      return residences[(index + direction + residences.length) % residences.length].id;
    });
  };
  const handleTerritoryWheel = (event: WheelEvent<HTMLElement>) => {
    if (window.matchMedia('(max-width: 760px)').matches) return;
    if ((event.target as HTMLElement).closest('.wheel-info-scroll')) return;
    const now = performance.now();
    if (Math.abs(event.deltaY) < 12 || now - territoryWheelAt.current < 360) return;
    territoryWheelAt.current = now;
    rotateResidences(event.deltaY > 0 ? 1 : -1);
  };
  const handleTerritoryTouchStart = (event: TouchEvent<HTMLElement>) => {
    if (window.matchMedia('(max-width: 760px)').matches) { territoryTouchY.current = null; return; }
    territoryTouchY.current = (event.target as HTMLElement).closest('.wheel-info-scroll') ? null : event.touches[0]?.clientY ?? null;
  };
  const handleTerritoryTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const start = territoryTouchY.current;
    const end = event.changedTouches[0]?.clientY;
    territoryTouchY.current = null;
    if (start == null || end == null || Math.abs(start - end) < 28) return;
    rotateResidences(start > end ? 1 : -1);
  };
  const favorite = (id: ResidenceId) => setSession(previous => toggleFavorite(previous, id));
  const compare = () => {
    const other = residences.find(r => r.id !== active)!.id;
    setPair([active, other]);
    setSession(previous => recordSignal(recordSignal(previous, { residenceId: active, type: 'compare' }), { residenceId: other, type: 'compare' }));
    go('comparison');
  };
  const choosePair = (index: 0 | 1, id: ResidenceId) => {
    const next: [ResidenceId, ResidenceId] = [...pair]; next[index] = id;
    if (next[0] === next[1]) next[index === 0 ? 1 : 0] = residences.find(r => r.id !== id)!.id;
    setPair(next);
    setSession(previous => recordSignal(recordSignal(previous, { residenceId: next[0], type: 'compare' }), { residenceId: next[1], type: 'compare' }));
  };
  const restart = () => { setSession(resetSession()); setInterest(false); setActive('casa-1'); go('territory'); };
  const recommendation = getRecommendation(session);
  const recommended = recommendation && residenceById[recommendation.residenceId];
  const contentResidence = recommended || residenceById[active];
  const renderFavorite = (id: ResidenceId) => {
    const selected = session.favorites.includes(id);
    return <button className={`favorite-button ${selected ? 'is-favorite' : ''}`} data-testid={`favorite-${id}`} aria-label={`${selected ? 'Desfavoritar' : 'Favoritar'} ${residenceById[id].name}`} aria-pressed={selected} onClick={() => favorite(id)}><Heart size={18} fill={selected ? 'currentColor' : 'none'} />{selected ? 'Favorita' : 'Favoritar'}</button>;
  };

  return <>
    <a className="skip-link" href="#main">Ir para conteúdo</a>
    <div className={reduced ? 'app reduced-motion' : 'app'} data-motion={reduced ? 'reduced' : 'full'}>
    <header className="site-header"><button className="brand-button" aria-label="Terra Santa — voltar ao território" onClick={() => go('territory')}><Brand /></button><span className="header-note">UM LUGAR PARA CHAMAR DE SEU</span><button className="icon-button" data-testid="menu-button" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(true)}><Menu /></button></header>
    <main id="main" ref={mainRef} tabIndex={-1}>
{view === 'origin' && <section className="origin origin-splash" data-testid="origin" aria-label="Carregando Terra Santa"><div className="splash-mark"><Brand large /><span className="splash-progress" aria-hidden="true"><i /></span></div></section>}
    {view === 'territory' && (() => {
      const activeIndex = residences.findIndex(residence => residence.id === active);
      const viewportHeight = typeof window === 'undefined' ? 844 : window.innerHeight;
      const mobileStyle = {
        '--mobile-reveal': mobileReveal.toFixed(3),
        '--mobile-chrome-opacity': Math.max(0, 1 - mobileReveal * 1.7).toFixed(3),
        '--mobile-sheet-y': `${Math.round((1 - mobileReveal) * Math.max(0, viewportHeight - 392))}px`,
        '--mobile-sheet-edge': `${Math.round((1 - mobileReveal) * 12)}px`,
        '--mobile-sheet-radius': `${Math.round((1 - mobileReveal) * 28)}px`,
        '--mobile-house-y': `${Math.round(mobileReveal * -150)}px`,
      } as CSSProperties;
      return <section ref={territoryRef} className="territory territory-wheel" data-testid="territory" data-sheet-expanded={mobileReveal > .96 ? 'true' : 'false'} tabIndex={0} onWheel={handleTerritoryWheel} onTouchStart={handleTerritoryTouchStart} onTouchEnd={handleTerritoryTouchEnd} onKeyDown={event => { if (event.key === 'ArrowDown') rotateResidences(1); if (event.key === 'ArrowUp') rotateResidences(-1); }}>
        <div className="territory-wheel-viewport" style={mobileStyle}>
        <Topography />
        <h1 className="wheel-impact">Escolha seu próximo <span key={impactWord}>{['lar','empreendimento','investimento','capítulo'][impactWord]}</span></h1>
        <div className="wheel-selector" aria-label="Seletor de residências">
          <span className="wheel-orbit" aria-hidden="true" />
          {residences.map((residence, index) => <button key={residence.id} type="button" className={index === activeIndex ? 'is-active' : ''} aria-label={`Selecionar ${residence.name}`} aria-pressed={index === activeIndex} onClick={() => setActive(residence.id)}><span>0{index + 1}</span></button>)}
        </div>
        <div className="wheel-stage" aria-live="polite">
          {residences.map((residence, index) => {
            let offset = index - activeIndex;
            if (offset > residences.length / 2) offset -= residences.length;
            if (offset < -residences.length / 2) offset += residences.length;
            return <button key={residence.id} type="button" className={`wheel-house ${offset === 0 ? 'is-active' : ''}`} style={{ '--wheel-offset': offset } as CSSProperties} data-testid={`model-${residence.id}`} aria-label={offset === 0 ? `Conhecer ${residence.name}` : `Selecionar ${residence.name}`} onClick={() => offset === 0 ? open(residence.id) : setActive(residence.id)}>
              <span className="wheel-house-model wheel-plan-model"><img src={residence.media.hero} alt={`Vista panorâmica externa de ${residence.name}`} /></span>
              <span className="wheel-house-label"><small>0{index + 1}</small><strong>{residence.name}</strong><em>{residence.id === 'casa-1' ? 'A CASA-PILOTO' : 'UM NOVO OLHAR'}</em><ArrowUpRight aria-hidden="true" /></span>
            </button>;
          })}
        </div>
        <aside className="wheel-caption" aria-label={`Informações sobre ${residences[activeIndex].name}`}>
          <div className="wheel-info-scroll">
            <header><span>Planta e referências</span><h2>{residences[activeIndex].name}</h2><p>{residences[activeIndex].tagline}</p></header>
            <section><span className="wheel-info-kicker">A residência</span><p>{residences[activeIndex].description}</p><p className="wheel-info-notice">{residences[activeIndex].conceptualNotice}</p></section>
            <div className="wheel-info-facts">
              <div><span>Quartos</span><strong>{getConfirmedFeatureLabel(residences[activeIndex].features.bedrooms, '')}</strong></div>
              <div><span>Banheiros</span><strong>{getConfirmedFeatureLabel(residences[activeIndex].features.bathrooms, '')}</strong></div>
              <div><span>Área construída</span><strong>{getConfirmedFeatureLabel(residences[activeIndex].features.builtAreaM2, 'm²')}</strong></div>
              <div><span>Perfil familiar</span><strong>{residences[activeIndex].profile.household.value ? `${residences[activeIndex].profile.household.value} · hipótese` : 'A definir com o cliente'}</strong></div>
              <div><span>Faixa ideal de renda</span><strong>{residences[activeIndex].profile.incomeRange.value ?? 'Sob análise financeira'}</strong></div>
            </div>
            <button className="wheel-info-cta" type="button" onClick={() => open(residences[activeIndex].id)}>Ver detalhes da casa <ArrowUpRight size={17} /></button>
            <section><span className="wheel-info-kicker">Para imaginar</span><p>{getResidenceSummary(residences[activeIndex])}. Uma leitura inicial para conversar sobre rotina, orçamento e possibilidades de implantação.</p></section>
          </div>
        </aside>
        </div>
      </section>;
    })()}
    {view === 'residence' && <Suspense fallback={<div className="loading" role="status">Preparando seu lugar…</div>}><Explorer key={active} residence={residenceById[active]} favorite={session.favorites.includes(active)} onFavorite={() => favorite(active)} onBack={() => go('territory')} onCompare={compare} onRecommend={() => go('recommendation')} onSignal={onSignal} reduced={reduced} /></Suspense>}
    {view === 'comparison' && <section className="comparison section-page" data-testid="comparison"><button className="text-button" onClick={() => go('territory')}><ArrowLeft size={17} /> Voltar ao território</button><div className="section-heading"><p className="eyebrow">DOIS OLHARES, UMA ESCOLHA</p><h1>O que faz sentido<br /><em>para você?</em></h1><p>Compare as informações confirmadas.<br />O restante será construído com o cliente.</p></div><div className="comparison-models">{pair.map((id, i) => <div className="comparison-model" key={i}><label className="eyebrow" htmlFor={`compare-${i}`}>RESIDÊNCIA {i + 1}</label><select id={`compare-${i}`} aria-label={`Modelo ${i === 0 ? 'esquerdo' : 'direito'}`} data-testid={i === 0 ? 'compare-left' : 'compare-right'} value={id} onChange={e => choosePair(i as 0 | 1, e.target.value as ResidenceId)}>{residences.filter(r => r.id !== 'casa-4').map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select><figure className="comparison-real-image"><img src={residenceById[id].media.hero} alt={`Vista externa realista de ${residenceById[id].name}`} /></figure>{renderFavorite(id)}</div>)}</div><div className="comparison-facts">{(['bedrooms', 'suites', 'bathrooms', 'builtAreaM2', 'parkingSpaces'] as const).map((field, i) => <div className="comparison-row" key={field}><span className="eyebrow">{['QUARTOS', 'SUÍTES', 'BANHEIROS', 'ÁREA', 'VAGAS'][i]}</span>{pair.map(id => <span key={id}>{getConfirmedFeatureLabel(residenceById[id].features[field], field === 'builtAreaM2' ? 'm²' : '')}</span>)}</div>)}</div><p className="small">Imagens externas conceituais em estilo fotográfico. Implantação, materiais e proporções a confirmar.</p><button className="primary-button" onClick={() => go('recommendation')}>Ver minha recomendação <ArrowUpRight size={18} /></button></section>}
    {view === 'recommendation' && <section className="recommendation section-page" data-testid="recommendation"><Topography /><button className="text-button" onClick={() => go('territory')}><ArrowLeft size={17} /> Voltar ao território</button>{recommended && recommendation ? <><div className="recommendation-layout"><div className="recommendation-copy"><p className="eyebrow">SEU MODO DE VIVER</p><h1>Um lugar que<br /><em>combina com você.</em></h1><p className="recommendation-name">{recommended.name} <span>{getResidenceSummary(recommended)}</span></p><div className="recommendation-reasons" data-testid="recommendation-reasons">{recommendation.reasons.map((reason, i) => <p key={reason}><span>0{i + 1}</span>{reason}</p>)}</div><p className="small">Uma sugestão baseada nas suas escolhas nesta sessão. As atmosferas são conceituais.</p></div><div className="recommended-house"><HouseScene residence={recommended} /><button className="text-button" onClick={() => open(recommended.id)}>Rever esta residência <ArrowUpRight size={18} /></button></div></div><div className="interest-block"><img src="/assets/brand-tree.webp" alt="" width="100" height="76" /><h2>Sua próxima história<br /><em>pode começar aqui.</em></h2><button className="primary-button" onClick={() => setInterest(true)}>Tenho interesse <ArrowUpRight size={18} /></button><p className="small">Nesta demonstração, o interesse é uma simulação.</p></div></> : <div className="empty-recommendation"><p className="eyebrow">SEU MODO DE VIVER</p><h1>Seu lugar merece<br /><em>um pouco de tempo.</em></h1><p>Explore os ambientes ou guarde uma favorita.<br />Suas escolhas ajudam a revelar uma afinidade.</p><button className="primary-button" onClick={() => go('territory')}>Explorar residências <ArrowUpRight size={18} /></button></div>}<div className="recommendation-footer"><button className="text-button" onClick={() => go('territory')}>Rever alternativas <ArrowLeft size={16} /></button><button className="text-button" onClick={restart}><RotateCcw size={16} /> Reiniciar experiência</button></div></section>}
      </main>

      {view !== 'origin' && (
        <nav className="bottom-nav" aria-label="Navegação principal">
          <button type="button" onClick={() => go('origin')}>
            <Home aria-hidden="true" /><span>Início</span>
          </button>
          <button type="button" aria-current={view === 'territory' || view === 'residence' ? 'page' : undefined} onClick={() => go('territory')}>
            <House aria-hidden="true" /><span>Casas</span>
          </button>
          <button type="button" aria-current={view === 'comparison' ? 'page' : undefined} onClick={compare}>
            <GitCompareArrows aria-hidden="true" /><span>Comparar</span>
          </button>
          <button type="button" aria-current={view === 'recommendation' ? 'page' : undefined} onClick={() => go('recommendation')}>
            <Sparkles aria-hidden="true" /><span>Afinidade</span>
          </button>
        </nav>
      )}
    {view !== 'origin' && <footer className="site-footer"><Brand /><span className="small">Cada residência nasce da terra.</span><span className="eyebrow">PROTÓTIPO CONCEITUAL · 2026</span></footer>}
    </div>
    {menu && <Modal title="Navegação" className="menu-modal" testId="menu-panel" onClose={() => setMenu(false)}><p className="eyebrow">TERRA SANTA</p><h2>Seu lugar<br /><em>começa aqui.</em></h2><nav><button data-testid="nav-territory" onClick={() => go('territory')}>As residências <ArrowUpRight /></button><button data-testid="nav-comparison" onClick={compare}>Comparar modelos <ArrowUpRight /></button><button data-testid="nav-recommendation" onClick={() => go('recommendation')}>Ver minha recomendação <ArrowUpRight /></button><button data-testid="nav-reset" onClick={restart}>Reiniciar experiência <RotateCcw /></button></nav><p className="small">{session.favorites.length} {session.favorites.length === 1 ? 'favorita' : 'favoritas'} · Preferências guardadas somente nesta sessão.</p></Modal>}
    {interest && <Modal title="Interesse simulado" className="interest-modal" testId="interest-confirmation" onClose={() => setInterest(false)}><div className="confirmation-icon"><Check /></div><p className="eyebrow">UM COMEÇO</p><h2>Seu interesse<br /><em>ganhou um lugar.</em></h2><p>Você escolheu conhecer melhor a {contentResidence.name}.</p><p className="small">Esta é uma confirmação simulada. Nenhum dado ou mensagem foi enviado. O contato com um consultor será configurado na versão final.</p><button className="primary-button" onClick={() => setInterest(false)}>Continuar explorando <ArrowUpRight size={18} /></button><button className="text-button" onClick={restart}>Reiniciar experiência <RotateCcw size={16} /></button></Modal>}
  </>;
}
