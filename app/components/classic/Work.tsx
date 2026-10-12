'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { projects, type Project, type ProjectCategory } from '../../data/projects';
import ShellDemoModal from '../ShellDemoModal';
import { fade, spring } from './motion';

const filters: { id: 'all' | ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'systems', label: 'Systems' },
  { id: 'hardware', label: 'Hardware' },
  { id: 'ml', label: 'ML' },
  { id: 'apps', label: 'Apps' },
];

const featured = projects.filter((p) => p.featured);
const rest = projects.filter((p) => !p.featured);
const byId = (id: number) => featured.find((p) => p.id === id);

type Open = (p: Project) => void;

function ProjectLinks({ p, size = 'text-[14px]', onDemo }: { p: Project; size?: string; onDemo?: () => void }) {
  const cls = `relative z-10 font-semibold text-(--c-accent) hover:text-(--c-accent-hover) ${size}`;
  return (
    <div className="flex flex-wrap gap-4">
      {p.liveUrl && (
        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className={cls}>
          Live
        </a>
      )}
      {p.githubUrl && (
        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className={cls}>
          Code
        </a>
      )}
      {p.videoUrl && (
        <a href={p.videoUrl} target="_blank" rel="noopener noreferrer" className={cls}>
          Watch
        </a>
      )}
      {p.hasDemo && onDemo && (
        <button type="button" onClick={onDemo} className={cls}>
          Try the demo
        </button>
      )}
    </div>
  );
}

// Card shell: the whole card opens the details sheet; links inside sit above that button.
function Card({
  p,
  onOpen,
  className,
  children,
}: {
  p: Project;
  onOpen: Open;
  className: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      layoutId={reduce ? undefined : `project-${p.id}`}
      transition={spring}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      className={`relative overflow-hidden ${className}`}
    >
      <button
        type="button"
        onClick={() => onOpen(p)}
        aria-label={`Show details for ${p.title}`}
        className="absolute inset-0 z-0 rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--c-accent)"
      />
      {children}
    </motion.article>
  );
}

function ImageCard({ p, onOpen, className, big }: { p: Project; onOpen: Open; className: string; big?: boolean }) {
  return (
    <Card p={p} onOpen={onOpen} className={`rounded-[28px] bg-(--c-placeholder) shadow-[0_24px_48px_-28px_var(--c-shadow)] ${className}`}>
      <Image src={p.image} alt="" fill sizes={big ? '(min-width: 1024px) 740px, 100vw' : '(min-width: 1024px) 360px, 100vw'} className="pointer-events-none object-cover" />
      <div
        className={`glass-card pointer-events-none absolute flex ${
          big ? 'inset-x-4 bottom-4 flex-col gap-4 rounded-[20px] px-[22px] py-5 sm:flex-row sm:items-end sm:gap-5' : 'inset-x-3.5 bottom-3.5 flex-col gap-1.5 rounded-[18px] px-5 py-[18px]'
        }`}
      >
        <div className="flex min-w-0 flex-auto flex-col gap-1.5">
          {p.kicker && <p className="text-[13px] font-semibold text-(--c-sub)">{p.kicker}</p>}
          <h3 className={`font-bold text-(--c-ink) ${big ? 'text-[28px] tracking-[-0.015em]' : 'text-[22px] tracking-[-0.01em]'}`}>{p.title}</h3>
          <p className={`leading-[1.45] text-(--c-body) ${big ? 'text-[15px]' : 'text-[14px]'}`}>{p.summary}</p>
        </div>
        <div className="pointer-events-auto flex-none whitespace-nowrap">
          <ProjectLinks p={p} size={big ? 'text-[15px]' : 'text-[14px]'} />
        </div>
      </div>
    </Card>
  );
}

function ShellCard({ p, onOpen, onDemo }: { p: Project; onOpen: Open; onDemo: () => void }) {
  return (
    <Card p={p} onOpen={onOpen} className="flex h-[340px] flex-col rounded-[28px] bg-[#1d1d1f] text-[#f5f5f7] shadow-[0_24px_48px_-28px_rgba(0,0,0,0.5)] dark:bg-[#232325]">
      <div className="pointer-events-none flex gap-[7px] px-5 pt-[18px]" aria-hidden="true">
        <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
      </div>
      <pre aria-hidden="true" className="pointer-events-none px-[22px] pt-4 font-mono text-[13px] leading-[1.7] text-[#d1d1d6]">
        {'yash$ ls | grep .c > out.txt\nyash$ sleep 30 &\n[1]+ Running    sleep 30 &\nyash$ fg\nsleep 30'}
        <span className="text-[#ff9f5a]">▍</span>
      </pre>
      <div className="pointer-events-none mt-auto flex items-end gap-3 p-[22px]">
        <div className="flex flex-auto flex-col gap-1.5">
          <h3 className="text-[22px] font-bold tracking-[-0.01em]">{p.title}</h3>
          <p className="text-[14px] leading-[1.45] text-[#a1a1a6]">{p.summary}</p>
        </div>
        <button
          type="button"
          onClick={onDemo}
          className="pointer-events-auto relative z-10 h-11 whitespace-nowrap rounded-full bg-[#f5f5f7] px-4 text-[14px] font-semibold text-[#1d1d1f] transition-transform duration-100 active:scale-[0.97]"
        >
          Try it
        </button>
      </div>
    </Card>
  );
}

function SplitCard({ p, onOpen }: { p: Project; onOpen: Open }) {
  return (
    <Card p={p} onOpen={onOpen} className="flex h-auto flex-col-reverse rounded-[28px] bg-(--c-card) shadow-[0_24px_48px_-28px_var(--c-shadow)] sm:h-[260px] sm:flex-row md:col-span-2">
      <div className="pointer-events-none flex min-w-0 flex-1 flex-col gap-2 px-[30px] py-7">
        {p.kicker && <p className="text-[13px] font-semibold text-(--c-sub)">{p.kicker}</p>}
        <h3 className="text-[26px] font-bold tracking-[-0.015em] text-(--c-ink)">{p.title}</h3>
        <p className="text-[15px] leading-[1.5] text-(--c-body)">{p.summary}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {p.tags.slice(0, 3).map((t) => (
            <span key={t} className="inline-flex h-[26px] items-center rounded-full bg-(--c-chip) px-[11px] text-[12px] text-(--c-ink)">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="pointer-events-none relative h-[200px] min-w-0 flex-1 sm:h-full">
        <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 370px, 100vw" className="object-cover" />
      </div>
    </Card>
  );
}

function GridCard({ p, onOpen, onDemo }: { p: Project; onOpen: Open; onDemo: () => void }) {
  return (
    <Card p={p} onOpen={onOpen} className="flex flex-col rounded-[24px] bg-(--c-card) shadow-[0_0_0_1px_var(--c-line)]">
      <div className="pointer-events-none relative h-48 bg-(--c-placeholder)">
        <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 360px, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-auto flex-col gap-2 p-5">
        <h3 className="pointer-events-none text-[19px] font-semibold tracking-[-0.01em] text-(--c-ink)">{p.title}</h3>
        <p className="pointer-events-none line-clamp-3 text-[14px] leading-[1.5] text-(--c-sub)">{p.summary ?? p.description}</p>
        <div className="pointer-events-none flex flex-wrap gap-1.5 pt-1">
          {p.tags.map((t) => (
            <span key={t} className="inline-flex h-6 items-center rounded-full bg-(--c-chip) px-2.5 text-[12px] text-(--c-ink)">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-2">
          <ProjectLinks p={p} onDemo={onDemo} />
        </div>
      </div>
    </Card>
  );
}

function Sheet({ p, onClose, onDemo }: { p: Project; onClose: () => void; onDemo: () => void }) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={fade}
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-hidden="true"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`sheet-title-${p.id}`}
        layoutId={reduce ? undefined : `project-${p.id}`}
        initial={reduce ? { opacity: 0 } : undefined}
        animate={reduce ? { opacity: 1 } : undefined}
        exit={reduce ? { opacity: 0 } : undefined}
        transition={reduce ? fade : spring}
        className="relative flex max-h-[92vh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-[28px] bg-(--c-card) shadow-[0_40px_80px_-24px_rgba(0,0,0,0.5)] sm:rounded-[28px]"
      >
        <div className="relative h-[240px] flex-none bg-(--c-placeholder) sm:h-[320px]">
          <Image src={p.image} alt={`${p.title} screenshot`} fill sizes="720px" className="object-cover" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="glass-card absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-(--c-ink) transition-transform duration-100 active:scale-[0.94]"
          >
            <X size={18} />
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { ...fade, delay: reduce ? 0 : 0.12 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className="flex flex-col gap-4 overflow-y-auto p-7 sm:p-8"
        >
          {p.kicker && <p className="text-[13px] font-semibold text-(--c-sub)">{p.kicker}</p>}
          <h3 id={`sheet-title-${p.id}`} className="text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-(--c-ink)">
            {p.title}
          </h3>
          <p className="text-[17px] leading-[1.55] text-(--c-body)">{p.description}</p>
          {p.note && <p className="text-[15px] leading-[1.5] text-(--c-sub)">{p.note}</p>}
          <div className="flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span key={t} className="inline-flex h-7 items-center rounded-full bg-(--c-chip) px-3 text-[13px] text-(--c-ink)">
                {t}
              </span>
            ))}
          </div>
          <ProjectLinks p={p} size="text-[17px]" onDemo={onDemo} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Work() {
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all');
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<Project | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const reduce = useReducedMotion();

  const closeSheet = useCallback(() => setOpen(null), []);
  const openDemo = () => {
    setOpen(null);
    setDemoOpen(true);
  };
  const filtered = filter === 'all' ? [] : projects.filter((p) => p.categories.includes(filter));
  const [arca, fleet, fantasy, form, shell, buck] = [11, 12, 16, 1, 2, 13].map(byId);

  return (
    <section id="work" className="scroll-mt-14 bg-(--c-band) px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-2.5">
            <p className="text-[15px] font-semibold text-(--c-accent)">Selected work</p>
            <h2 className="text-[clamp(2.25rem,5vw,3rem)] font-bold leading-[1.08] tracking-[-0.022em] text-(--c-ink)">
              Things I&apos;ve built.
            </h2>
          </div>
          <div role="group" aria-label="Filter projects" className="relative inline-flex max-w-full gap-0.5 overflow-x-auto rounded-xl bg-(--c-line) p-[3px]">
            {filters.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f.id)}
                  className={`relative h-9 whitespace-nowrap rounded-[9px] px-4 text-[13px] text-(--c-ink) ${active ? 'font-semibold' : 'font-medium'}`}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-pill"
                      transition={reduce ? { duration: 0 } : spring}
                      className="absolute inset-0 rounded-[9px] bg-(--c-card) shadow-[0_1px_3px_rgba(0,0,0,0.12)] dark:bg-[#48484a]"
                    />
                  )}
                  <span className="relative">{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {filter === 'all' ? (
            <motion.div key="bento" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={fade} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {arca && <ImageCard p={arca} onOpen={setOpen} big className="h-[400px] md:col-span-2" />}
                {fleet && <ImageCard p={fleet} onOpen={setOpen} className="h-[400px]" />}
                {fantasy && <ImageCard p={fantasy} onOpen={setOpen} className="h-[340px]" />}
                {form && <ImageCard p={form} onOpen={setOpen} className="h-[340px]" />}
                {shell && <ShellCard p={shell} onOpen={setOpen} onDemo={openDemo} />}
                {buck && <SplitCard p={buck} onOpen={setOpen} />}
                <button
                  type="button"
                  aria-expanded={showAll}
                  aria-controls="more-projects"
                  onClick={() => setShowAll((s) => !s)}
                  className="flex h-[260px] flex-col gap-1.5 rounded-[28px] bg-(--c-card) px-[30px] py-7 text-left shadow-[0_0_0_1px_var(--c-line)] transition-transform duration-100 active:scale-[0.97]"
                >
                  <span className="text-[64px] font-bold leading-none tracking-[-0.03em] tabular-nums text-(--c-ink)">{projects.length}</span>
                  <span className="text-[17px] leading-[1.45] text-(--c-sub)">projects across web, systems, embedded hardware, and ML.</span>
                  <span className="mt-auto inline-flex items-center gap-1 text-[17px] font-semibold text-(--c-accent)">
                    {showAll ? 'Show fewer' : 'See all projects'}
                    <motion.span animate={{ rotate: showAll ? 90 : 0 }} transition={reduce ? { duration: 0 } : spring}>
                      <ChevronRight size={16} strokeWidth={2.4} aria-hidden="true" />
                    </motion.span>
                  </span>
                </button>
              </div>
              <AnimatePresence initial={false}>
                {showAll && (
                  <motion.div
                    id="more-projects"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                    animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={reduce ? fade : spring}
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {rest.map((p) => (
                      <GridCard key={p.id} p={p} onOpen={setOpen} onDemo={openDemo} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((p) => (
                <GridCard key={p.id} p={p} onOpen={setOpen} onDemo={openDemo} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>{open && <Sheet key={open.id} p={open} onClose={closeSheet} onDemo={openDemo} />}</AnimatePresence>
      <ShellDemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}
