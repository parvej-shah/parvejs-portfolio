import AboutMe from "../components/AboutMe";
import HeroSection from "../components/Banner";
import Education from "../components/Education";
import Skills from "../components/Skills";

export default function Home() {
  return (
    <div>
        <HeroSection/>
        <AboutMe/>
        <Skills/>
        <Education/>
    </div>
  )
}
