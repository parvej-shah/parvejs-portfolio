import Reveal from "./Reveal";
import { resolveSkillIcon } from "@/lib/section-rendering";

const defaultSection = {
  items: [
    { name: "Next.js 16", icon: "SiNextdotjs" },
    { name: "TypeScript", icon: "SiTypescript" },
    { name: "Python", icon: "SiPython" },
    { name: "PostgreSQL", icon: "SiPostgresql" },
    { name: "Redis", icon: "SiRedis" },
    { name: "Docker", icon: "SiDocker" },
    { name: "Prisma ORM", icon: "SiPrisma" },
  ],
};

export default function Skills({ section = defaultSection }) {
  const content = { ...defaultSection, ...section };

  return (
    <section id="skills" className="border-b border-line py-10">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 mr-1">
            Built with
          </span>
          {content.items.map((s) => {
            const Icon = resolveSkillIcon(s.icon);
            return (
              <span
                key={s.name}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink-2 px-3 py-1.5 text-xs font-medium text-white/80"
              >
                <Icon className="size-3.5 text-brand" />
                {s.name}
              </span>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
