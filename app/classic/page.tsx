import type { Metadata } from 'next';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Resume from '../components/Resume';
import Contact from '../components/Contact';

export const metadata: Metadata = {
  title: 'Carlos Rojas | Classic',
  description: 'Carlos Rojas: projects, experience, skills, and resume on one scrolling page.',
};

export default function ClassicHome() {
  return (
    <Layout>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Resume />
      <Contact />
    </Layout>
  );
}
