import Reveal from "./Reveal";
import { resolveSkillIcon } from "@/lib/section-rendering";

const defaultSection = {
  eyebrow: "Tech Stack",
  heading: "A battle-tested stack for the modern web.",
  items: [
    { name: "React", icon: "FaReact" },
    { name: "JavaScript", icon: "FaJs" },
    { name: "Tailwind CSS", icon: "SiTailwindcss" },
    { name: "shadcn/ui", icon: "SiShadcnui" },
    { name: "Bootstrap", icon: "SiBootstrap" },
    { name: "Node.js", icon: "FaNodeJs" },
    { name: "Express.js", icon: "SiExpress" },
    { name: "MongoDB", icon: "SiMongodb" },
    { name: "Firebase", icon: "SiFirebase" },
    { name: "React Query", icon: "SiReactquery" },
    { name: "Axios", icon: "SiAxios" },
    { name: "JWT", icon: "SiJsonwebtokens" },
    { name: "Git", icon: "FaGit" },
    { name: "Figma", icon: "FaFigma" },
  ],
};

export default function Skills({ section = defaultSection }) {
  const content = { ...defaultSection, ...section };

  return (
    <section id="skills" className="border-b border-line py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mb-12 max-w-xl">
          <span className="eyebrow mb-4">{content.eyebrow}</span>
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {content.heading}
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {content.items.map((s, i) => {
            const Icon = resolveSkillIcon(s.icon);
            return (
              <Reveal
                key={s.name}
                delay={(i % 7) * 60}
                className="card-surface flex flex-col items-center gap-3 p-4 text-center sm:p-5"
              >
                <span className="text-3xl text-brand">
                  <Icon />
                </span>
                <span className="text-sm font-medium text-white/90">{s.name}</span>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
