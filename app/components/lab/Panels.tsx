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
        Try <code className="font-mono">ls</code>, <code className="font-mono">cat README.md</code>, <code className="font-mono">sleep 30 &amp;</code> then <code className="font-mono">jobs</code>. The real yash runs fork/exec, pipes, redirection, and job control in C.
      </p>
    </div>
  );
}

export function ExperiencePanel() {
  return (
    <div className="flex flex-col">
      {experiences.map((e, i) => (
        <div key={e.id} className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 py-5 border-b border-[#DAD6CC] last:border-0 first:pt-0">
          <span className="font-pixel text-xs text-center py-1 border-2 border-[#1D2127] text-[#1D2127] h-fit" style={{ background: CHANNEL_COLORS[i % CHANNEL_COLORS.length] }}>
            CH{i + 1}
          </span>
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

const CONTACT = [
  { label: 'Email', value: 'rojasdamiancarlos@gmail.com', href: 'mailto:rojasdamiancarlos@gmail.com' },
  { label: 'LinkedIn', value: 'carlos-d-rojas', href: 'https://www.linkedin.com/in/carlos-d-rojas/' },
  { label: 'GitHub', value: 'carlosdrojas', href: 'https://github.com/carlosdrojas' },
  { label: 'Resume', value: 'PDF', href: '/resume.pdf' },
];

export function AboutPanel() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 items-center">
        <Image src="/CarlosRojasHeadshot_justhead.png" alt="Carlos Rojas" width={192} height={192} className="w-24 h-24 object-cover border-2 border-[#1D2127] [image-rendering:pixelated]" />
        <p className="text-[15px] leading-relaxed">
          Growing up in Laredo, Texas, I got into technology through high school robotics, solving hard problems with limited parts and a team under pressure. Now I study electrical and computer engineering at UT Austin.
        </p>
      </div>
      <p className="text-[15px] leading-relaxed">
        I care about software that is clear, maintainable, and built to last, whether it runs on a microcontroller or in a browser.
      </p>
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
      <div className="flex flex-col gap-2">
        {CONTACT.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="flex justify-between gap-3 px-4 py-3 border-2 border-[#1D2127] bg-white shadow-[3px_3px_0_#1D2127] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#1D2127] transition-transform"
          >
            <span className="font-pixel">{c.label}</span>
            <span className="text-[#5B6270] truncate">{c.value}</span>
          </a>
        ))}
      </div>
      <p className="text-xs leading-relaxed text-[#5B6270]">
        3D models from Poly Pizza. Soldering station and multimeter by J-Toastie (CC-BY). Lamp, chair and plant by Quaternius, soda can by Kenney, toolbox, headphones and screwdriver by CreativeTrio, circuit board by iPoly3D (all CC0).
      </p>
    </div>
  );
}
