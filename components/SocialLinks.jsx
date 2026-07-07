import { resolveSocialIcon } from "@/lib/section-rendering";

const defaultLinks = [
  { href: "https://github.com/parvej-shah", label: "Github", icon: "FaGithub" },
  { href: "https://www.linkedin.com/in/parvej-shah", label: "LinkedIn", icon: "FaLinkedinIn" },
  { href: "https://facebook.com/parvej.shahlabib", label: "Facebook", icon: "FaFacebookF" },
];

export default function SocialLinks({ className = "", links = defaultLinks }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {links.map(({ href, label, icon }) => {
        const Icon = resolveSocialIcon(icon);
        return (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-brand/50 hover:text-white"
          >
            <Icon className="size-4 text-brand transition-transform group-hover:scale-110" />
            {label}
          </a>
        );
      })}
    </div>
  );
}
