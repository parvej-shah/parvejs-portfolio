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
import Insights from "../components/Insights";
import { getPublishedPosts, getPublishedProjects, getSection } from "@/lib/data/public";

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
    posts,
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
    getPublishedPosts(),
  ]);

  // Homepage shows only featured items: up to 5 projects, top 3 posts.
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 5);
  const featuredPosts = posts.slice(0, 3);

  return (
    <main>
      {/* 1. Hero: Clear outcome-first value proposition */}
      <HeroSection section={heroSection ?? undefined} socialLinks={socialSection?.links} />

      {/* 2. Stats */}
      <Stats section={statsSection ?? undefined} />

      {/* 3. Case Studies: Outcome-first flagship & supporting projects */}
      <Portfolio projects={featuredProjects} />

      {/* Buyer Classification (hidden) */}
      {/* <BuyerSegments /> */}

      {/* Why Us (hidden) */}
      {/* <WhyUs /> */}

      {/* 4. Testimonials: Case study proof & client recommendations */}
      <Testimonials section={testimonialsSection ?? undefined} />

      {/* 5. CTA: High-impact conversion driver */}
      <LargeCtaBanner />

      {/* 6. About: Founder authority & engineering philosophy */}
      <AboutMe section={aboutSection ?? undefined} />

      {/* 7. Process: Defined deliverables per milestone (How It Works) */}
      <Process section={processSection ?? undefined} />

      {/* 8. FAQ: Killing objections before contact */}
      <Faq />

      {/* 9. Big Statement: Production conviction */}
      <BigStatement />

      {/* 10. Contact: Free 24h technical assessment */}
      <Contact
        section={contactSection ?? undefined}
        meetingSection={meetingSection ?? undefined}
        socialLinks={socialSection?.links}
      />

      {/* 11. Insights: Published articles (last section before footer) */}
      <Insights posts={featuredPosts} />
    </main>
  );
}
