
import { FaJs, FaReact, FaNodeJs, FaGit, FaFigma } from "react-icons/fa";
import { SiMongodb,  SiExpress, SiTailwindcss,  SiDaisyui, SiReactquery, SiAxios, SiFirebase, SiJsonwebtokens, SiBootstrap } from "react-icons/si";
import SectionTitle from "./SectionTitle";

const Skills = () => {
  const skills = [
      { icon: <SiTailwindcss className="text-blue-500" />, name: "Tailwindcss" },
      { icon: <SiDaisyui className="text-[#1ad1a5]" />, name: "DaisyUi" },
      { icon: <SiBootstrap className="text-[#760fe9]" />, name: "Bootstrap" },
      { icon: <FaJs className="text-yellow-500" />, name: "Javascript" },
      { icon: <FaReact className="text-blue-400" />, name: "React" },
      { icon: <FaGit className="text-orange-500" />, name: "Git" },
      { icon: <SiFirebase className="text-orange-600" />, name: "FireBase" },
      { icon: <SiAxios className="text-blue-400" />, name: "Axios" },
      { icon: <SiReactquery className="text-blue-400" />, name: "React Query" },
      { icon: <FaNodeJs className="text-green-500" />, name: "Node.js" },
      { icon: <SiExpress className="text-gray-600" />, name: "Express.js" },
      { icon: <SiMongodb className="text-green-600" />, name: "MongoDB" },
      { icon: <SiJsonwebtokens className="text-gray-800" />, name: "JWT" },
    { icon: <FaFigma className="text-purple-500" />, name: "Figma" },
  ];

  return (
    <div className="bg-gray text-gray-700 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
         <SectionTitle title={"Skills"}/>
          <h1 className="text-2xl text-gray-900 font-bold mt-4">The skills, tools, and technologies I am really good at:</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {skills.map((skill, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-2">
              <div className="text-4xl">{skill.icon}</div>
              <p className="text-sm font-medium">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
