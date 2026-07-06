import HeroSection from "../components/Banner";
import Services from "../components/Services";
import Stats from "../components/Stats";
import Portfolio from "../components/Portfolio";
import AboutMe from "../components/AboutMe";
import Skills from "../components/Skills";
import CtaBand from "../components/CtaBand";
import Testimonials from "../components/Testimonials";
import Insights from "../components/Insights";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Services />
      <Stats />
      <Portfolio />
      <AboutMe />
      <Skills />
      <CtaBand />
      <Testimonials />
      <Insights />
      <Contact />
    </main>
  );
}
