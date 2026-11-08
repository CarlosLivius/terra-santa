import { useEffect, type RefObject } from 'react';

export default function usePageMotion(root: RefObject<HTMLElement | null>, reduced: boolean, version: unknown) {
  useEffect(() => {
    const page = root.current;
    if (!page) return;
    document.documentElement.classList.add('residence-scroll-story');
    const sections = [...page.querySelectorAll<HTMLElement>('section:not(.res-hero)')];
    const hero = page.querySelector<HTMLElement>('.res-hero');
    sections.forEach(section => section.classList.add('motion-reveal'));
    if (reduced) {
      sections.forEach(section => section.classList.add('motion-visible'));
      return () => {
        document.documentElement.classList.remove('residence-scroll-story');
        sections.forEach(section => section.classList.remove('motion-reveal', 'motion-visible'));
      };
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('motion-visible'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    sections.forEach(section => observer.observe(section));
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!hero) return;
      const bounds = hero.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < innerHeight) hero.style.setProperty('--parallax-y', `${Math.max(-35, Math.min(65, -bounds.top * .12))}px`);
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', scroll, { passive: true }); update();
    return () => { observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll);sections.forEach(s=>s.classList.remove('motion-reveal','motion-visible'));hero?.style.removeProperty('--parallax-y');document.documentElement.classList.remove('residence-scroll-story'); };
  }, [root, reduced, version]);
}
