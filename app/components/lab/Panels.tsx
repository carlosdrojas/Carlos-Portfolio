'use client';

import Image from 'next/image';
import { projects } from '../../data/projects';
import { experiences } from '../../data/experience';
import { skills } from '../Skills';
import TerminalDemo from '../TerminalDemo';
import InvadersGame from './InvadersGame';
import { CHANNEL_COLORS, type SpotId } from './spots';

const tag = 'text-xs font-semibold px-2 py-0.5 bg-[#EDE9E0] text-[#3A3F4A]';
const link = 'text-sm font-semibold text-[#2F6470] underline underline-offset-4 hover:text-[#1D2127]';

export function ProjectsPanel({ onOpen }: { onOpen: (id: SpotId) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {projects.map((p) => (
        <article key={p.id} className="flex flex-col gap-2">
          <Image src={p.image} alt={`${p.title} screenshot`} width={480} height={360} className="w-full aspect-[4/3] object-cover bg-[#EDE9E0] border-2 border-[#1D2127]" />
          <h3 className="font-pixel text-lg leading-tight">{p.title}</h3>
          <p className="text-sm leading-relaxed text-[#3A3F4A] line-clamp-4">{p.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span key={t} className={tag}>{t}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {p.liveUrl && <a className={link} href={p.liveUrl} target="_blank" rel="noopener noreferrer">Live site</a>}
            {p.githubUrl && <a className={link} href={p.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>}
            {p.videoUrl && <a className={link} href={p.videoUrl} target="_blank" rel="noopener noreferrer">Video</a>}
            {p.hasDemo && <button type="button" className={link} onClick={() => onOpen('laptop')}>Open it on the laptop</button>}
            {p.title.startsWith('Space Invaders') && <button type="button" className={link} onClick={() => onOpen('launchpad')}>Play it on the LaunchPad</button>}
          </div>
        </article>
      ))}
    </div>
  );
}

export function ShellPanel() {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-[420px] max-h-[55vh] border-2 border-[#1D2127]">
        <TerminalDemo />
      </div>
      <p className="text-sm text-[#5B6270] leading-relaxed">
        Try <code className="font-mono">sleep 10</code>, then Ctrl+Z to stop it, <code className="font-mono">jobs</code>, and <code className="font-mono">bg</code> or <code className="font-mono">fg</code>. Or <code className="font-mono">sleep 5 &amp;</code> and keep typing. The real yash runs fork/exec, pipes, redirection, and job control in C.
      </p>
    </div>
  );
}

// Tile behind each logo: Amazon's is black on clear, the ISO emblem is white, and UTSA's has its own navy.
const LOGO_BG: Record<string, string> = {
  '/AmazonLogo.png': '#FFFFFF',
  '/ISOEmblem--White.png': '#1D2127',
  '/utsa.png': '#0C2340',
};

export function ExperiencePanel() {
  return (
    <div className="flex flex-col">
      {experiences.map((e, i) => (
        <div key={e.id} className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 py-5 border-b border-[#DAD6CC] last:border-0 first:pt-0">
          <div className="flex flex-col gap-2">
            <span className="font-pixel text-xs text-center py-1 border-2 border-[#1D2127] text-[#1D2127]" style={{ background: CHANNEL_COLORS[i % CHANNEL_COLORS.length] }}>
              CH{i + 1}
            </span>
            {e.logo && (
              <Image src={e.logo} alt={`${e.company} logo`} width={48} height={48} className="w-12 h-12 object-contain p-1 border-2 border-[#1D2127]" style={{ background: LOGO_BG[e.logo] ?? '#FFFFFF' }} />
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-pixel text-lg leading-tight">{e.title}</h3>
            <p className="text-sm font-semibold text-[#2F6470]">{e.company}</p>
            <p className="text-sm text-[#5B6270]">{e.duration}. {e.location}.</p>
            <p className="text-sm leading-relaxed">{e.description}</p>
            {e.achievements && (
              <ul className="list-disc pl-5 text-sm leading-relaxed flex flex-col gap-1">
                {e.achievements.map((a) => <li key={a}>{a}</li>)}
              </ul>
            )}
            {e.technologies && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {e.technologies.map((t) => <span key={t} className={tag}>{t}</span>)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function GamePanel() {
  return <InvadersGame />;
}

export function AboutMePanel({ onOpen }: { onOpen: (id: SpotId) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <Image src="/Carlos_image.jpeg" alt="Carlos at a UT Austin ECE event" width={880} height={660} className="w-full aspect-[4/3] object-cover border-2 border-[#1D2127]" />
      <div className="grid grid-cols-3 gap-2 text-sm">
        {[
          ['Hometown', 'Laredo, TX'],
          ['School', 'UT Austin, ECE'],
          ['Now', 'Amazon, Seattle'],
        ].map(([k, v]) => (
          <div key={k} className="flex flex-col gap-0.5 bg-[#EDE9E0] px-3 py-2">
            <span className="text-xs text-[#5B6270]">{k}</span>
            <span className="font-semibold">{v}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-pixel text-lg">My journey</h3>
        <p className="text-[15px] leading-relaxed">
          Growing up in Laredo, Texas, I got into technology through high school robotics, where I learned to solve complex problems with limited resources and collaborate under pressure. That curiosity led me to electrical and computer engineering at UT Austin, where I’ve spent the past several years building skills across full-stack development, embedded systems, and machine learning.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-pixel text-lg">My approach</h3>
        <p className="text-[15px] leading-relaxed">
          I approach every project with a focus on clarity, scalability, and impact. Great software is intuitive, maintainable, and built to last, whether it runs on a microcontroller or in a browser.
        </p>
      </div>
      <p className="text-sm text-[#5B6270]">
        Energy drinks downed so far: 500+. One of them is on the bench.
      </p>
      <button type="button" onClick={() => onOpen('clipboard')} className="self-start px-4 py-2.5 font-pixel border-2 border-[#1D2127] bg-[#E8C547] shadow-[3px_3px_0_#1D2127] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#1D2127] transition-transform">
        Resume and contact
      </button>
    </div>
  );
}

const CONTACT = [
  { label: 'Email', value: 'rojasdamiancarlos@gmail.com', href: 'mailto:rojasdamiancarlos@gmail.com' },
  { label: 'LinkedIn', value: 'carlos-d-rojas', href: 'https://www.linkedin.com/in/carlos-d-rojas/' },
  { label: 'GitHub', value: 'carlosdrojas', href: 'https://github.com/carlosdrojas' },
  { label: 'Instagram', value: '@carlosroja5', href: 'https://www.instagram.com/carlosroja5/' },
  { label: 'Resume', value: 'PDF', href: '/resume.pdf' },
];

export function ContactPanel() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {CONTACT.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith('http') || c.href.endsWith('.pdf') ? '_blank' : undefined}
            rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="flex justify-between gap-3 px-4 py-3 border-2 border-[#1D2127] bg-white shadow-[3px_3px_0_#1D2127] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#1D2127] transition-transform"
          >
            <span className="font-pixel">{c.label}</span>
            <span className="text-[#5B6270] truncate">{c.value}</span>
          </a>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {skills.map((s) => (
          <div key={s.category}>
            <h3 className="font-pixel text-sm mb-1.5">{s.category}</h3>
            <div className="flex flex-wrap gap-1.5">
              {s.technologies.map((t) => <span key={t} className={tag}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs leading-relaxed text-[#5B6270]">
        3D models from Poly Pizza. Soldering station and multimeter by J-Toastie (CC-BY). Lamp, chair and plant by Quaternius, soda can by Kenney, toolbox, headphones and screwdriver by CreativeTrio, circuit board by iPoly3D (all CC0).
      </p>
    </div>
  );
}
