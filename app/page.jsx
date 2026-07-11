import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Statement from '@/components/Statement';
import About from '@/components/About';
import Work from '@/components/Work';
import Reel from '@/components/Reel';
import Press from '@/components/Press';
import Appearances from '@/components/Appearances';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Statement />
        <About />
        <Work />
        <Reel />
        <Press />
        <Appearances />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
