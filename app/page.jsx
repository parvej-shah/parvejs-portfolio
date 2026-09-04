import HeroSection from "../components/Banner";
import MarqueeStripe from "../components/MarqueeStripe";
import BuyerSegments from "../components/BuyerSegments";
import Portfolio from "../components/Portfolio";
import Stats from "../components/Stats";
import BigStatement from "../components/BigStatement";
import WhyUs from "../components/WhyUs";
import Process from "../components/Process";
import Testimonials from "../components/Testimonials";
import AboutMe from "../components/AboutMe";
import Faq from "../components/Faq";
import Insights from "../components/Insights";
import Contact from "../components/Contact";
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

  // Homepage shows only featured items: up to 5 projects and 6 blog posts.
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 5);
  const featuredPosts = posts.filter((post) => post.featured).slice(0, 6);

  return (
    <main>
      {/* 1. Hero: Clear outcome-first value proposition */}
      <HeroSection section={heroSection ?? undefined} socialLinks={socialSection?.links} />

      {/* Dynamic tech marquee strip */}
      <MarqueeStripe />

      {/* 2. Buyer Classification: "What are you trying to build?" */}
      <BuyerSegments />

      {/* 3. Proof of Work: Outcome-first flagship & supporting case studies */}
      <Portfolio projects={featuredProjects} />

      {/* 4. Results: Big impact numbers & benchmarks */}
      <Stats section={statsSection ?? undefined} />

      {/* 5. Statement: Breathing break between density */}
      <BigStatement />

      {/* 6. Why Us: Production engineering vs. fragile demos */}
      <WhyUs />

      {/* 7. How It Works: Defined deliverables per milestone */}
      <Process section={processSection ?? undefined} />

      {/* 8. Testimonials: Case study proof & client logo marquee */}
      <Testimonials section={testimonialsSection ?? undefined} />

      {/* 9. Founder Authority: IIT DU & engineering philosophy */}
      <AboutMe section={aboutSection ?? undefined} />

      {/* 10. FAQ: Killing objections before contact */}
      <Faq />

      {/* 11. Engineering Insights: Technical articles */}
      {featuredPosts.length > 0 && <Insights posts={featuredPosts} />}

      {/* 13. Low-Friction Final CTA: Free 24h technical assessment */}
      <Contact
        section={contactSection ?? undefined}
        meetingSection={meetingSection ?? undefined}
        socialLinks={socialSection?.links}
      />
    </main>
  );
}
