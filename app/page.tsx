import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Contact from './components/Contact';

export default function Home() {
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
