import HeroSection from "../components/Banner";
import MarqueeStripe from "../components/MarqueeStripe";
import BuyerSegments from "../components/BuyerSegments";
import Portfolio from "../components/Portfolio";
import BigStatement from "../components/BigStatement";
import Stats from "../components/Stats";
import WhyUs from "../components/WhyUs";
import Process from "../components/Process";
import Testimonials from "../components/Testimonials";
import LargeCtaBanner from "../components/LargeCtaBanner";
import AboutMe from "../components/AboutMe";
import Faq from "../components/Faq";
import Contact from "../components/Contact";
import { getPublishedProjects, getSection } from "@/lib/data/public";

export default async function Home() {
  const [
    heroSection,
    statsSection,
    processSection,
    aboutSection,
    testimonialsSection,
    meetingSection,
    contactSection,
    socialSection,
    projects,
  ] = await Promise.all([
    getSection("hero"),
    getSection("stats"),
    getSection("process"),
    getSection("about"),
    getSection("testimonials"),
    getSection("meeting"),
    getSection("contact"),
    getSection("social"),
    getPublishedProjects(),
  ]);

  // Homepage shows only featured items: up to 5 projects.
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 5);

  return (
    <main>
      {/* 1. Hero: Clear outcome-first value proposition */}
      <HeroSection section={heroSection ?? undefined} socialLinks={socialSection?.links} />

      {/* 2. Results: numbers land early, as credibility before the pitch */}
      <Stats section={statsSection ?? undefined} />

      {/* Dynamic tech marquee strip */}
      <MarqueeStripe />

      {/* 3. Proof of Work: Outcome-first flagship & supporting case studies */}
      <Portfolio projects={featuredProjects} />

      {/* 4. Buyer Classification: "What are you trying to build?" */}
      {/* <BuyerSegments /> */}

      {/* 5. Statement: Breathing break between density */}
      <BigStatement />

      {/* 6. Why Us: Production engineering vs. fragile demos */}
      {/* <WhyUs /> */}

      {/* 7. Testimonials: Case study proof & client logo marquee */}
      <Testimonials section={testimonialsSection ?? undefined} />

      {/* 8. Large Action Banner: High-contrast conversion driver */}
      <LargeCtaBanner />

      {/* 9. How It Works: Defined deliverables per milestone */}
      <Process section={processSection ?? undefined} />

      {/* 10. Founder Authority: IIT DU & engineering philosophy */}
      <AboutMe section={aboutSection ?? undefined} />

      {/* 11. FAQ: Killing objections before contact */}
      <Faq />

      {/* 12. Low-Friction Final CTA: Free 24h technical assessment */}
      <Contact
        section={contactSection ?? undefined}
        meetingSection={meetingSection ?? undefined}
        socialLinks={socialSection?.links}
      />
    </main>
  );
}
