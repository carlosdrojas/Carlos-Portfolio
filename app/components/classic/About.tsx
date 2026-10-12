import Image from 'next/image';

const stats = [
  { value: '20+', label: 'Projects shipped' },
  { value: '5+', label: 'Years coding' },
  { value: '500+', label: 'Energy drinks' },
];

const toolbox = [
  { group: 'Languages', items: 'C · Python · TypeScript · Java · Assembly' },
  { group: 'Web & cloud', items: 'React · Next.js · Node.js · FastAPI · AWS' },
  { group: 'Systems & hardware', items: 'Linux · MSPM0 · KiCad · x86 · FSMs' },
  { group: 'ML & vision', items: 'NumPy · MuJoCo · MediaPipe · YOLOv8' },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-14 bg-(--c-band) px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-14">
        <div className="flex flex-wrap items-stretch gap-14">
          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-7">
            <p className="text-[15px] font-semibold text-(--c-accent)">About</p>
            <p className="text-[clamp(1.625rem,3.4vw,2.25rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-(--c-ink)">
              High school robotics in Laredo taught me to solve hard problems with limited parts.{' '}
              <span className="text-(--c-sub)">
                Now I study ECE at UT Austin and build across full-stack, embedded, and machine learning.
              </span>
            </p>
            <p className="max-w-[560px] text-[17px] leading-[1.55] text-(--c-sub)">
              I care about software that is clear, built to last, and honest about what it does. Most of my favorite
              projects sit where code meets hardware.
            </p>
            <dl className="mt-auto grid grid-cols-3 gap-3 sm:gap-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse gap-1 rounded-[20px] bg-(--c-card) px-4 py-5 sm:px-[22px]">
                  <dt className="text-[13px] text-(--c-sub) sm:text-[14px]">{s.label}</dt>
                  <dd className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-[-0.02em] tabular-nums text-(--c-ink)">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative min-h-[440px] min-w-0 flex-[1_1_380px] overflow-hidden rounded-[28px] bg-(--c-placeholder)">
            <Image
              src="/Carlos_image.jpeg"
              alt="Carlos at a UT Austin ECE event"
              fill
              sizes="(min-width: 1024px) 400px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {toolbox.map((t) => (
            <li key={t.group} className="flex flex-col gap-3 rounded-[20px] bg-(--c-card) p-[22px]">
              <span className="text-[13px] font-semibold tracking-[0.02em] text-(--c-sub)">{t.group}</span>
              <span className="text-[15px] leading-[1.6] text-(--c-ink)">{t.items}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
