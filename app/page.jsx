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
import { getPublishedPosts, getPublishedProjects, getSection } from "@/lib/data/public";

export default async function Home() {
  const [
    heroSection,
    servicesSection,
    statsSection,
    aboutSection,
    skillsSection,
    ctaSection,
    testimonialsSection,
    contactSection,
    socialSection,
    projects,
    posts,
  ] = await Promise.all([
    getSection("hero"),
    getSection("services"),
    getSection("stats"),
    getSection("about"),
    getSection("skills"),
    getSection("cta"),
    getSection("testimonials"),
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
      <HeroSection section={heroSection ?? undefined} socialLinks={socialSection?.links} />
      <Services section={servicesSection ?? undefined} />
      <Stats section={statsSection ?? undefined} />
      <Portfolio projects={featuredProjects} />
      <AboutMe section={aboutSection ?? undefined} />
      <Skills section={skillsSection ?? undefined} />
      <CtaBand section={ctaSection ?? undefined} />
      <Testimonials section={testimonialsSection ?? undefined} />
      <Insights posts={featuredPosts} />
      <Contact section={contactSection ?? undefined} socialLinks={socialSection?.links} />
    </main>
  );
}
