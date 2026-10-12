'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FlaskConical, Menu, X } from 'lucide-react';
import { fade, spring } from './motion';

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <nav
      aria-label="Primary"
      className={`glass fixed inset-x-0 top-0 z-40 h-[52px] transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_1px_0_var(--c-line),0_8px_24px_-16px_var(--c-shadow)]' : ''
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1120px] items-center justify-between gap-6 px-4 sm:px-6">
        <a href="#home" className="text-[17px] font-semibold tracking-[-0.01em] text-(--c-ink)">
          Carlos Rojas
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] text-(--c-ink) opacity-85 transition-opacity hover:opacity-100"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="hidden h-8 items-center gap-1.5 rounded-full bg-(--c-line) px-3.5 text-[13px] font-medium text-(--c-ink) transition-transform active:scale-[0.97] sm:inline-flex"
          >
            <FlaskConical size={14} aria-hidden="true" />
            Lab view
          </Link>
          <a
            href="/resume.pdf"
            className="inline-flex h-8 items-center rounded-full bg-(--c-inv-bg) px-3.5 text-[13px] font-medium text-(--c-inv-fg) transition-transform active:scale-[0.97]"
          >
            Résumé
          </a>

          <div ref={menuRef} className="relative md:hidden">
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="classic-menu"
              onClick={() => setOpen((o) => !o)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-(--c-ink) active:bg-(--c-line)"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  id="classic-menu"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                  transition={reduce ? fade : spring}
                  style={{ transformOrigin: 'top right' }}
                  className="absolute right-0 top-12 flex w-56 bg-(--c-card) flex-col rounded-2xl p-2 shadow-[0_0_0_1px_var(--c-line),0_24px_48px_-16px_var(--c-shadow)]"
                >
                  {links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-3 py-3 text-[17px] text-(--c-ink) active:bg-(--c-line)"
                    >
                      {l.label}
                    </a>
                  ))}
                  <Link href="/" className="rounded-xl px-3 py-3 text-[17px] text-(--c-ink) active:bg-(--c-line)">
                    Lab view
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
