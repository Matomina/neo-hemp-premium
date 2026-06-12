import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SELECTOR = '.product-card, .cat-card-4, .reassurance-item, .category-card, .section-title';

export function useScrollReveal(extraDep?: unknown) {
  const { pathname } = useLocation();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const siblings = Array.from(el.parentElement?.querySelectorAll(SELECTOR) ?? []);
          const idx = Math.min(siblings.indexOf(el), 8);
          el.style.transitionDelay = `${idx * 0.07}s`;
          el.classList.add('in-view');
          setTimeout(() => { el.style.transitionDelay = '0s'; }, 900 + idx * 70);
          observer.unobserve(el);
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -24px 0px' },
    );
    const timer = setTimeout(() => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (!el.classList.contains('in-view')) observer.observe(el);
      });
    }, 16);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [pathname, extraDep]);
}
