import SocialLinks from "./SocialLinks";
import { getSection } from "@/lib/data/public";

const quickLinks = [
  { name: "Home", href: "/#top" },
  { name: "Services", href: "/#services" },
  { name: "Portfolio", href: "/#portfolio" },
  { name: "About", href: "/#about" },
  { name: "Insights", href: "/#insights" },
  { name: "Contact", href: "/#contact" },
];

const defaultFooter = {
  tagline:
    "High-performance web products, built with clarity, care, and code that's made to last.",
  email: "parvejshahlabib007@gmail.com",
  location: "Dhaka, Bangladesh",
  newsletterHeading: "Let's stay in touch",
  newsletterDescription: "Got an idea worth building? One message starts it — I reply within 24 hours.",
  ctaLabel: "Start a Project",
  ctaHref: "/#contact",
  copyrightName: "Parvej Shah Labib",
  copyrightRole: "Full Stack Web Developer",
};

export default async function Footer() {
  const [footerSection, socialSection] = await Promise.all([getSection("footer"), getSection("social")]);
  const content = { ...defaultFooter, ...footerSection };

  return (
    <footer className="relative overflow-hidden bg-ink pt-16">
      <div className="mx-auto max-w-7xl px-5">
        {/* top: brand + links + newsletter */}
        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-1 text-2xl font-black">
              <span className="text-brand">{"<"}</span>
              <span className="text-white">PS</span>
              <span className="text-brand">{"/>"}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {content.tagline}
            </p>
            <div className="mt-6 space-y-1 text-sm">
              <p className="text-muted-foreground">
                Email:{" "}
                <a
                  href={`mailto:${content.email}`}
                  className="text-white hover:text-brand"
                >
                  {content.email}
                </a>
              </p>
              <p className="text-muted-foreground">Location: {content.location}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.name}>
                  <a
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
              {content.newsletterHeading}
            </h4>
            <p className="mt-4 text-sm text-muted-foreground">{content.newsletterDescription}</p>
            <a
              href={content.ctaHref}
              className="mt-5 inline-flex h-11 items-center rounded-full bg-brand px-5 text-sm font-semibold text-[#05140b] transition-colors hover:bg-brand-dark"
            >
              {content.ctaLabel}
            </a>
            <div className="mt-6">
              <SocialLinks links={socialSection?.links} />
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-line py-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {content.copyrightName}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">{content.copyrightRole}</p>
        </div>
      </div>

      {/* giant outlined wordmark — sized to fit one line, bottom edge cropped for anchor */}
      <div className="pointer-events-none select-none overflow-hidden pb-8" aria-hidden>
        <div
          className="graffiti w-full whitespace-nowrap px-3 text-center text-[12vw] leading-[0.85] tracking-tight opacity-70 sm:text-[14vw] lg:text-[11.5vw]"
          style={{ transform: "none" }}
        >
          Work Together
        </div>
      </div>
    </footer>
  );
}
