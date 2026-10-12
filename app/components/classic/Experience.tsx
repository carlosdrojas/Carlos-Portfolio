'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { experiences } from '../../data/experience';
import { fade, spring } from './motion';

export default function Experience() {
  const [openId, setOpenId] = useState<number | null>(experiences[0]?.id ?? null);
  const reduce = useReducedMotion();

  return (
    <section id="experience" className="scroll-mt-14 bg-(--c-bg) px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-2.5">
            <p className="text-[15px] font-semibold text-(--c-accent)">Experience</p>
            <h2 className="text-[clamp(2.25rem,5vw,3rem)] font-bold leading-[1.08] tracking-[-0.022em] text-(--c-ink)">
              Where I&apos;ve worked.
            </h2>
          </div>
          <a href="/resume.pdf" className="text-[17px] font-medium text-(--c-accent) hover:text-(--c-accent-hover)">
            Full résumé (PDF)
          </a>
        </div>

        <ul className="overflow-hidden rounded-3xl bg-(--c-card) shadow-[0_0_0_1px_var(--c-line),0_20px_40px_-28px_var(--c-shadow)]">
          {experiences.map((exp, i) => {
            const open = openId === exp.id;
            const panelId = `exp-panel-${exp.id}`;
            const darkTile = exp.logo?.includes('White');
            return (
              <li key={exp.id} className={i > 0 ? 'border-t border-(--c-line) mx-5 sm:mx-8' : 'mx-5 sm:mx-8'}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenId(open ? null : exp.id)}
                  className="flex w-full items-center gap-4 py-6 text-left sm:gap-5"
                >
                  <span
                    className={`flex h-14 w-14 flex-none items-center justify-center rounded-[14px] ${
                      darkTile ? 'bg-[#1d1d1f] dark:bg-[#2c2c2e]' : 'bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]'
                    }`}
                  >
                    {exp.logo && (
                      <Image src={exp.logo} alt="" width={76} height={76} className="h-[38px] w-[38px] object-contain" />
                    )}
                  </span>
                  <span className="flex min-w-0 flex-auto flex-col gap-[3px]">
                    <span className="text-[17px] font-semibold tracking-[-0.01em] text-(--c-ink) sm:text-[21px]">{exp.title}</span>
                    <span className="text-[14px] text-(--c-sub) sm:text-[15px]">
                      {exp.company} · {exp.location}
                    </span>
                    <span className="text-[14px] tabular-nums text-(--c-sub) sm:hidden">{exp.duration}</span>
                  </span>
                  <span className="hidden whitespace-nowrap text-[15px] tabular-nums text-(--c-sub) sm:block">{exp.duration}</span>
                  <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={reduce ? { duration: 0 } : spring}
                    className="flex-none text-(--c-sub)"
                  >
                    <ChevronDown size={18} aria-hidden="true" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={panelId}
                      key="panel"
                      initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={reduce ? fade : spring}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-3.5 pb-7 sm:pl-[76px]">
                        <p className="text-[17px] leading-[1.5] text-(--c-ink)">{exp.description}</p>
                        {exp.achievements && (
                          <ul className="flex list-disc flex-col gap-2 pl-5 text-[15px] leading-[1.5] text-(--c-sub) marker:text-(--c-sub)">
                            {exp.achievements.map((a) => (
                              <li key={a}>{a}</li>
                            ))}
                          </ul>
                        )}
                        {exp.technologies && (
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((t) => (
                              <span key={t} className="inline-flex h-7 items-center rounded-full bg-(--c-chip) px-3 text-[13px] text-(--c-ink)">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
