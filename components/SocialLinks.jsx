import { FaLinkedinIn, FaGithub, FaFacebookF } from "react-icons/fa";

const links = [
  { href: "https://github.com/parvej-shah", label: "Github", Icon: FaGithub },
  { href: "https://www.linkedin.com/in/parvej-shah", label: "LinkedIn", Icon: FaLinkedinIn },
  { href: "https://facebook.com/parvej.shahlabib", label: "Facebook", Icon: FaFacebookF },
];

export default function SocialLinks({ className = "" }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {links.map(({ href, label, Icon }) => (
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
      ))}
    </div>
  );
}
