'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileDown, Github, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';

const EMAIL = 'rojasdamiancarlos@gmail.com';

const details = [
  { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, icon: Mail },
  { label: 'Phone', value: '+1 (956) 326-0367', href: 'tel:+19563260367', icon: Phone },
  { label: 'Location', value: 'Austin, TX', icon: MapPin },
];

const profiles = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/carlos-d-rojas/', icon: Linkedin },
  { label: 'GitHub', href: 'https://github.com/carlosdrojas', icon: Github },
  { label: 'Résumé', href: '/resume.pdf', icon: FileDown },
];

const field =
  'w-full rounded-xl bg-(--c-bg) px-4 py-3 text-[17px] text-(--c-ink) shadow-[inset_0_0_0_1px_var(--c-line)] outline-none placeholder:text-(--c-sub) focus:shadow-[inset_0_0_0_2px_var(--c-accent)]';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSent(false);
  };

  // No backend: hand the message to the visitor's email app, already filled in.
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" className="scroll-mt-14 bg-(--c-bg) px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-[18px] text-center">
        <p className="text-[15px] font-semibold text-(--c-accent)">Contact</p>
        <h2 className="text-[clamp(2.5rem,7vw,4rem)] font-bold leading-[1.05] tracking-[-0.025em] text-(--c-ink)">
          Let&apos;s build something.
        </h2>
        <p className="inline-flex items-center gap-2.5 rounded-full bg-(--c-band) px-4 py-2 text-[15px] font-medium text-(--c-ink)">
          <span className="h-2 w-2 flex-none rounded-full bg-[#30d158]" aria-hidden="true" />
          Open to Spring and Summer internships and new-grad roles
        </p>
        <p className="max-w-[560px] text-[clamp(1.0625rem,2vw,1.3125rem)] leading-[1.45] text-(--c-sub)">
          Have a role, a project, or a question? Send me a note.
        </p>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1120px] flex-wrap gap-5">
        <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-5">
          <ul className="overflow-hidden rounded-3xl bg-(--c-band)">
            {details.map(({ label, value, href, icon: Icon }, i) => {
              const inner = (
                <>
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-(--c-card) text-(--c-accent)">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-[13px] text-(--c-sub)">{label}</span>
                    <span className="truncate text-[17px] text-(--c-ink)">{value}</span>
                  </span>
                </>
              );
              return (
                <li key={label} className={i > 0 ? 'mx-5 border-t border-(--c-line)' : 'mx-5'}>
                  {href ? (
                    <a href={href} className="flex items-center gap-4 py-4 transition-opacity active:opacity-60">
                      {inner}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 py-4">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap gap-3">
            {profiles.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-(--c-card) px-5 text-[15px] font-medium text-(--c-ink) shadow-[inset_0_0_0_1px_var(--c-line)] transition-transform duration-100 active:scale-[0.97]"
              >
                <Icon size={17} aria-hidden="true" />
                {label}
              </a>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex min-w-0 flex-[999_1_480px] flex-col gap-4 rounded-3xl bg-(--c-band) p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-left">
              <span className="text-[13px] font-semibold text-(--c-sub)">Name</span>
              <input name="name" required autoComplete="name" value={form.name} onChange={onChange} className={field} />
            </label>
            <label className="flex flex-col gap-2 text-left">
              <span className="text-[13px] font-semibold text-(--c-sub)">Email</span>
              <input name="email" type="email" required autoComplete="email" value={form.email} onChange={onChange} className={field} />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-left">
            <span className="text-[13px] font-semibold text-(--c-sub)">Message</span>
            <textarea name="message" required rows={5} value={form.message} onChange={onChange} className={`${field} resize-y`} />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-(--c-sub)" aria-live="polite">
              {sent ? 'Your email app should open with the message filled in.' : 'Sends from your own email app.'}
            </p>
            <button
              type="submit"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-(--c-inv-bg) px-6 text-[17px] font-medium text-(--c-inv-fg) transition-transform duration-100 active:scale-[0.97]"
            >
              <Send size={17} aria-hidden="true" />
              Send message
            </button>
          </div>
        </form>
      </div>

      <footer className="mx-auto mt-24 flex max-w-[1120px] flex-wrap justify-between gap-4 border-t border-(--c-line) pt-5 text-[13px] text-(--c-sub)">
        <span>© {new Date().getFullYear()} Carlos Rojas. Built with Next.js.</span>
        <div className="flex gap-5">
          <a href="https://x.com/carlosroja5_" target="_blank" rel="noopener noreferrer" className="hover:text-(--c-ink)">
            X
          </a>
          <Link href="/" className="hover:text-(--c-ink)">
            Lab view
          </Link>
          <a href="#home" className="hover:text-(--c-ink)">
            Back to top
          </a>
        </div>
      </footer>
    </section>
  );
}
