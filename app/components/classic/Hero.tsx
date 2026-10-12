'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { projects } from '../../data/projects';
import { fade, spring } from './motion';

const featured = projects.filter((p) => p.featured).slice(0, 3);

export default function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: fade }
      : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { ...spring, duration: 0.6, delay } };

  return (
    <section id="home" className="scroll-mt-14 overflow-hidden bg-(--c-bg) px-4 pb-16 pt-[104px] sm:px-6 sm:pb-0">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center text-center">
        <motion.div {...rise(0)}>
          <Image
            src="/CarlosRojasHeadshot_justhead.png"
            alt="Portrait of Carlos Rojas"
            width={208}
            height={208}
            priority
            className="h-[104px] w-[104px] rounded-full bg-(--c-placeholder) object-cover shadow-[0_12px_32px_-12px_var(--c-shadow),0_0_0_4px_var(--c-card)]"
          />
        </motion.div>
        <motion.p {...rise(0.05)} className="mt-6 text-[15px] font-semibold tracking-[0.01em] text-(--c-accent)">
          Electrical &amp; Computer Engineering · UT Austin
        </motion.p>
        <motion.h1
          {...rise(0.1)}
          className="mt-3 text-[clamp(3rem,9vw,5rem)] font-bold leading-[1.05] tracking-[-0.025em] text-(--c-ink)"
        >
          Carlos Rojas
        </motion.h1>
        <motion.p
          {...rise(0.15)}
          className="mt-4 max-w-[640px] text-[clamp(1.125rem,2.4vw,1.5rem)] leading-[1.35] tracking-[-0.005em] text-(--c-sub)"
        >
          Full-stack, systems, and ML engineer. I build software, and sometimes the board it runs on.
        </motion.p>
        <motion.div {...rise(0.2)} className="mt-8 flex flex-wrap items-center justify-center gap-5">
          <a
            href="#work"
            className="inline-flex h-12 items-center rounded-full bg-(--c-inv-bg) px-[26px] text-[17px] font-medium text-(--c-inv-fg) transition-transform duration-100 active:scale-[0.97]"
          >
            View my work
          </a>
          <a
            href="#contact"
            className="inline-flex h-12 items-center gap-1 text-[17px] font-medium text-(--c-accent) hover:text-(--c-accent-hover)"
          >
            Get in touch
            <ChevronRight size={16} strokeWidth={2.4} aria-hidden="true" />
          </a>
        </motion.div>
      </div>

      <div className="mx-auto mt-[52px] grid max-w-[1120px] grid-cols-1 gap-5 sm:grid-cols-3">
        {featured.map((p, i) => (
          <motion.a
            key={p.id}
            href="#work"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 64 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: i === 1 ? -24 : 0 }}
            transition={reduce ? fade : { ...spring, duration: 0.7, delay: 0.25 + i * 0.06 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            className={`relative block h-[200px] overflow-hidden rounded-3xl bg-(--c-placeholder) shadow-[0_24px_48px_-24px_var(--c-shadow)] sm:h-[260px] ${
              i > 0 ? 'hidden sm:block' : ''
            }`}
          >
            <Image src={p.image} alt={`${p.title} screenshot`} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
            <span className="glass-card absolute left-3.5 top-3.5 inline-flex h-[30px] items-center rounded-full px-3 text-[13px] font-semibold text-(--c-ink)">
              {p.title}
              {p.kicker?.includes('Hackathon') ? ' · Hackathon' : ''}
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
