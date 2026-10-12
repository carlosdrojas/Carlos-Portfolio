import type { Metadata } from 'next';
import Nav from '../components/classic/Nav';
import Hero from '../components/classic/Hero';
import About from '../components/classic/About';
import Experience from '../components/classic/Experience';
import Work from '../components/classic/Work';
import Contact from '../components/classic/Contact';

export const metadata: Metadata = {
  description: 'Carlos Rojas: projects, experience, skills, and resume on one scrolling page.',
};

export default function ClassicHome() {
  return (
    <div className="classic min-h-screen">
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Work />
        <Contact />
      </main>
    </div>
  );
}
