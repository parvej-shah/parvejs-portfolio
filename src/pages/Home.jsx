import AboutMe from "../components/AboutMe";
import HeroSection from "../components/Banner";
import Contact from "../components/Contact";
import Education from "../components/Education";
import Portfolio from "../components/Portfolio";
import Skills from "../components/Skills";

export default function Home() {
  return (
    <div>
        <HeroSection id="hero"/>
        <AboutMe id="about"/>
        <Skills id="skills"/>
        <Education />
        <Portfolio id="portfolio"/>
        <Contact id="contact"/>
    </div>
  )
}
