'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { SPOTS, SPOT_ORDER, type SpotId } from './spots';
import { AboutMePanel, ContactPanel, ExperiencePanel, GamePanel, ProjectsPanel, ShellPanel } from './Panels';

const BenchScene = dynamic(() => import('./BenchScene'), {
  ssr: false,
  loading: () => <p className="absolute inset-0 flex items-center justify-center font-pixel text-[#E8E4DA]">Setting up the bench…</p>,
});

const card = 'bg-[#F7F5F0] text-[#1D2127] border-2 border-[#1D2127] shadow-[4px_4px_0_#1D2127]';

export default function LabBench() {
  const [active, setActive] = useState<SpotId | null>(null);
  const [hovered, setHovered] = useState<SpotId | null>(null);
  const [visited, setVisited] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [pointerOnScene, setPointerOnScene] = useState(false);
  const tipRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const [dockThumb, setDockThumb] = useState<{ left: number; width: number } | null>(null);

  // Size and place the dock's scroll thumb; null when everything fits.
  const updateDockThumb = useCallback(() => {
    const el = dockRef.current;
    if (!el || el.scrollWidth <= el.clientWidth + 1) {
      setDockThumb(null);
      return;
    }
    setDockThumb({ left: (el.scrollLeft / el.scrollWidth) * 100, width: (el.clientWidth / el.scrollWidth) * 100 });
  }, []);

  useEffect(() => {
    const el = dockRef.current;
    if (!el) return;
    updateDockThumb();
    const ro = new ResizeObserver(updateDockThumb);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateDockThumb]);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    setTouch(window.matchMedia('(pointer: coarse)').matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const select = useCallback((id: SpotId | null) => {
    setActive((prev) => {
      if (id && !prev) returnFocus.current = document.activeElement as HTMLElement | null;
      return id;
    });
    if (id) {
      setVisited(true);
      setHovered(null);
      document.body.style.cursor = '';
    }
  }, []);

  const close = useCallback(() => {
    setActive(null);
    returnFocus.current?.focus?.({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  useEffect(() => {
    if (active && active !== 'laptop') {
      const t = setTimeout(() => backRef.current?.focus({ preventScroll: true }), reduceMotion ? 0 : 400);
      return () => clearTimeout(t);
    }
  }, [active, reduceMotion]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (tipRef.current) tipRef.current.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 16}px)`;
    if (!pointerOnScene && e.pointerType === 'mouse') setPointerOnScene(true);
  };

  const showTip = hovered && !active && pointerOnScene;
  const spot = active ? SPOTS[active] : null;

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#2A2E35] font-sans" onPointerMove={onPointerMove} onPointerLeave={() => setPointerOnScene(false)}>
      <div className="absolute inset-0" aria-hidden="true">
        <BenchScene active={active} hovered={hovered} onHover={setHovered} onSelect={select} reduceMotion={reduceMotion} />
      </div>

      <header className={`${card} absolute left-4 top-[calc(16px+env(safe-area-inset-top,0px))] max-w-[calc(100%-32px)] px-4 py-3 ${active ? 'max-sm:hidden' : ''}`}>
        <h1 className="font-pixel text-xl sm:text-2xl leading-none">Carlos Rojas</h1>
        <p className="mt-1.5 text-xs sm:text-sm text-[#5B6270]">ECE at UT Austin. SDE intern at Amazon.</p>
        <Link href="/classic" className="mt-1.5 inline-block text-xs sm:text-sm font-semibold text-[#2F6470] underline underline-offset-4">
          View the classic site
        </Link>
      </header>

      {!visited && (
        <p className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[calc(96px+env(safe-area-inset-bottom,0px))] whitespace-nowrap bg-[#151A21]/80 px-3 py-1.5 font-pixel text-sm text-[#F2EFE8]">
          {touch ? 'Tap anything on the bench' : 'Click anything on the bench'}
        </p>
      )}

      <div
        ref={tipRef}
        className={`pointer-events-none fixed left-0 top-0 bg-[#1D2127] px-3 py-2 text-[#F7F5F0] border-2 border-[#F7F5F0] ${showTip ? '' : 'hidden'}`}
      >
        {hovered && (
          <>
            <b className="block font-pixel text-sm">{SPOTS[hovered].name}</b>
            <span className="text-xs">{SPOTS[hovered].role}</span>
          </>
        )}
      </div>

      <nav
        aria-label="Objects on the bench"
        className={`${card} absolute bottom-[calc(16px+env(safe-area-inset-bottom,0px))] left-4 right-4 sm:right-auto flex flex-col ${active ? 'max-sm:hidden' : 'sm:left-1/2 sm:-translate-x-1/2'}`}
      >
        <div ref={dockRef} onScroll={updateDockThumb} className="flex gap-1 p-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SPOT_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => select(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              aria-current={active === id}
              className={`flex flex-col items-start gap-0.5 whitespace-nowrap px-2.5 sm:px-3 py-2 text-left hover:bg-[#EDE9E0] ${active === id ? 'bg-[#1D2127] text-[#F7F5F0] hover:bg-[#1D2127]' : ''}`}
            >
              <b className="font-pixel text-sm">{SPOTS[id].name}</b>
              <span className={`text-xs ${active === id ? 'text-[#C9CED6]' : 'text-[#5B6270]'}`}>{SPOTS[id].role}</span>
            </button>
          ))}
        </div>
        {/* Phones hide native scrollbars, so draw one to show the dock scrolls sideways. */}
        {dockThumb && (
          <div aria-hidden="true" className="relative mx-2 mb-1.5 h-1.5 bg-[#DAD6CC]">
            <div className="absolute inset-y-0 bg-[#1D2127]" style={{ left: `${dockThumb.left}%`, width: `${dockThumb.width}%` }} />
          </div>
        )}
      </nav>

      <aside
        role="dialog"
        aria-modal="false"
        aria-labelledby="lab-panel-title"
        aria-hidden={!active}
        className={`${card} absolute flex flex-col overflow-hidden transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none
          left-4 right-4 bottom-[calc(16px+env(safe-area-inset-bottom,0px))] h-[64%]
          sm:left-auto sm:right-4 sm:top-[calc(16px+env(safe-area-inset-top,0px))] sm:h-auto sm:w-[min(480px,calc(100%-32px))]
          ${active ? 'translate-y-0 sm:translate-x-0' : 'translate-y-[calc(100%+40px)] sm:translate-y-0 sm:translate-x-[calc(100%+40px)] invisible'}`}
      >
        <div className="flex items-start justify-between gap-4 bg-[#2F6470] px-4 py-3 text-[#F7F5F0]">
          <div>
            <h2 id="lab-panel-title" className="font-pixel text-2xl leading-tight">{spot?.title}</h2>
            <p className="mt-1 text-sm text-[#D9E6E8]">{spot?.sub}</p>
          </div>
          <button
            ref={backRef}
            type="button"
            onClick={close}
            className="shrink-0 border-2 border-[#F7F5F0] px-3 py-1.5 font-pixel text-sm hover:bg-[#F7F5F0] hover:text-[#2F6470]"
          >
            Back to the bench
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {active === 'pegboard' && <ProjectsPanel onOpen={select} />}
          {active === 'laptop' && <ShellPanel />}
          {active === 'scope' && <ExperiencePanel />}
          {active === 'launchpad' && <GamePanel />}
          {active === 'phone' && <AboutMePanel onOpen={select} />}
          {active === 'clipboard' && <ContactPanel />}
        </div>
      </aside>
    </div>
  );
}
