import {
  FaJs, FaReact, FaNodeJs, FaGit, FaFigma,
} from "react-icons/fa";
import {
  SiMongodb, SiExpress, SiTailwindcss, SiShadcnui,
  SiReactquery, SiAxios, SiFirebase, SiJsonwebtokens, SiBootstrap,
} from "react-icons/si";
import Reveal from "./Reveal";

const skills = [
  { icon: <FaReact />, name: "React" },
  { icon: <FaJs />, name: "JavaScript" },
  { icon: <SiTailwindcss />, name: "Tailwind CSS" },
  { icon: <SiShadcnui />, name: "shadcn/ui" },
  { icon: <SiBootstrap />, name: "Bootstrap" },
  { icon: <FaNodeJs />, name: "Node.js" },
  { icon: <SiExpress />, name: "Express.js" },
  { icon: <SiMongodb />, name: "MongoDB" },
  { icon: <SiFirebase />, name: "Firebase" },
  { icon: <SiReactquery />, name: "React Query" },
  { icon: <SiAxios />, name: "Axios" },
  { icon: <SiJsonwebtokens />, name: "JWT" },
  { icon: <FaGit />, name: "Git" },
  { icon: <FaFigma />, name: "Figma" },
];

export default function Skills() {
  return (
    <section id="skills" className="border-b border-line py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mb-12 max-w-xl">
          <span className="eyebrow mb-4">Tech Stack</span>
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            A battle-tested stack for the modern web.
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {skills.map((s, i) => (
            <Reveal
              key={s.name}
              delay={(i % 7) * 60}
              className="card-surface flex flex-col items-center gap-3 p-5 text-center"
            >
              <span className="text-3xl text-brand">{s.icon}</span>
              <span className="text-sm font-medium text-white/90">{s.name}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
