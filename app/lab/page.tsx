import type { Metadata } from 'next';
import { Pixelify_Sans } from 'next/font/google';
import LabBench from '../components/lab/LabBench';

const pixel = Pixelify_Sans({ subsets: ['latin'], variable: '--font-pixel' });

export const metadata: Metadata = {
  title: 'Carlos Rojas | Lab Bench',
  description: 'An interactive 3D lab bench portfolio: projects on the pegboard, a shell on the laptop, experience on the oscilloscope, and Space Invaders on an MSPM0 LaunchPad.',
};

export default function LabPage() {
  return (
    <main className={pixel.variable}>
      <LabBench />
    </main>
  );
}
