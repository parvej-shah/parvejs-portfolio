import { FaLinkedinIn, FaGithub, FaFacebookF } from "react-icons/fa";
import { SiX } from "react-icons/si";

const quickLinks = [
  { name: "Home", href: "#top" },
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "About", href: "#about" },
  { name: "Insights", href: "#insights" },
  { name: "Contact", href: "#contact" },
];

const socials = [
  { Icon: FaGithub, href: "https://github.com/parvej-shah", label: "GitHub" },
  { Icon: FaLinkedinIn, href: "https://www.linkedin.com/in/parvej-shah", label: "LinkedIn" },
  { Icon: FaFacebookF, href: "https://facebook.com/parvej.shahlabib", label: "Facebook" },
  { Icon: SiX, href: "#", label: "X" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-16">
      <div className="mx-auto max-w-7xl px-5">
        {/* top: brand + links + newsletter */}
        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_1fr]">
          <div className="max-w-xs">
            <div className="flex items-center gap-1 text-2xl font-black">
              <span className="text-brand">{"<"}</span>
              <span className="text-white">PS</span>
              <span className="text-brand">{"/>"}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              High-performance web products, built with clarity, care, and code
              that&apos;s made to last.
            </p>
            <div className="mt-6 space-y-1 text-sm">
              <p className="text-muted-foreground">
                Email:{" "}
                <a
                  href="mailto:parvejshahlabib007@gmail.com"
                  className="text-white hover:text-brand"
                >
                  parvejshahlabib007@gmail.com
                </a>
              </p>
              <p className="text-muted-foreground">Location: Dhaka, Bangladesh</p>
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
              Let&apos;s stay in touch
            </h4>
            <p className="mt-4 text-sm text-muted-foreground">
              Got an idea worth building? One message starts it — I reply
              within 24 hours.
            </p>
            <a
              href="#contact"
              className="mt-5 inline-flex h-11 items-center rounded-full bg-brand px-5 text-sm font-semibold text-[#05140b] transition-colors hover:bg-brand-dark"
            >
              Start a Project
            </a>
            <div className="mt-6 flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-10 place-items-center rounded-full border border-line text-muted-foreground transition-colors hover:border-brand/50 hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-line py-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Parvej Shah Labib. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Full Stack Web Developer
          </p>
        </div>
      </div>

      {/* giant outlined wordmark */}
      <div className="select-none overflow-hidden" aria-hidden>
        <div className="graffiti w-full whitespace-nowrap text-center text-[22vw] leading-none">
          Work Together
        </div>
      </div>
    </footer>
  );
}
