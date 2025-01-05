import { Link } from "react-router-dom";
import SectionTitle from "./SectionTitle";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import luxeory from "../assets/images/luxeory.png";
import visasphere from "../assets/images/visasphere.jpeg";
import lingobingo from "../assets/images/lingobingo.jpeg";
import { SiGithub } from "react-icons/si";
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import { useEffect } from "react";
export default function Portfolio() {
  const projects = [
    {
      name: "Luxeory",
      description:
        "Luxeory is a modern hotel booking platform that offers users a seamless experience for discovering and reserving hotel rooms. The platform combines interactive design, robust functionality, and secure user authentication to ensure an enjoyable and trustworthy experience.",
      image: luxeory,
      tags: [
        "Tailwind CSS",
        "React",
        "Node.js",
        "MongoDB",
        "Firebase",
        "JWT",
        "JavaScript",
        "HTML",
        "CSS",
      ],
      liveLink: "https://luxeory-96d49.web.app",
      github: "https://github.com/parvej-shah/luxeory-hotel-booking",
    },
    {
      name: "VisaSphere",
      description:
        "Visa Navigator is a user-friendly web platform designed to streamline the visa application process. Users can view, apply for, and manage visa applications for various countries with ease.",
      image: visasphere,
      tags: [
        "Tailwind CSS",
        "React",
        "Node.js",
        "MongoDB",
        "Firebase",
        "JavaScript",
        "HTML",
        "CSS",
      ],
      liveLink: "https://visasphere-72d2e.web.app/",
      github: "https://github.com/parvej-shah/VisaSphere",
    },
    {
      name: "LingoBigo",
      description:
        "Lingo Bingo is an interactive web application designed to make learning Japanese both engaging and effective. The platform provides lessons, cultural insights, tutorials, and vocabulary cards to help users improve their Japanese language skills in a fun and structured way.",
      image: lingobingo,
      tags: [
        "Tailwind CSS",
        "React",
        "Firebase",
        "JavaScript",
        "HTML",
        "CSS",
      ],
      liveLink: "https://lingo-bingo-7af0a.web.app/",
      github: "https://github.com/parvej-shah/Lingo-Bingo-Japanese-Language-Learning-",
    },
  ];
  useEffect(() => {AOS.init({ once: false,delay:"50",duration:"1000"});}, []);
  return (
    <div id="portfolio" className="bg-gray py-10">
      <SectionTitle title="Portfolio" />
      <h1 className="text-2xl text-gray-900 font-bold mt-4 text-center">Some of the noteworthy projects I have built:</h1>
    <div className="space-y-10 mt-8 px-2">
        {projects.map((project, index) => (
            <div data-aos="zoom-in-up" key={index} className="card group lg:card-side rounded-xl bg-gray shadow-lg mx-auto flex w-full max-w-6xl">
                <div className="flex items-center justify-center border-gray-100 bg-gray-50 p-8 max-md:rounded-t-xl md:w-1/2 lg:p-12 md:rounded-l-xl md:border-r">
                <img
                    src={project.image}
                    alt={project.name}
                    className="rounded-xl w-full h-full shadow-lg transition-transform duration-500 group-hover:scale-105"
                />
                </div>
                <div className="card-body md:w-1/2">
                <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                    {project.name}
                </h1>
                <p className="text-normal text-base">{project.description}</p>
                <p className="flex flex-wrap gap-2 my-3">
                    {project.tags.map((tag, index) => (
                    <SectionTitle key={index} title={tag}/>
                    ))}
                </p>
                <div className="card-actions justify-start">
                    <Link to={project.liveLink}>
                    <button className="underline self-start rounded-lg p-1.5 hover:bg-gray-50 [&_svg]:stroke-gray-500 text-xl flex items-center gap-2 text-secondary" >
                        View<FaArrowUpRightFromSquare />
                    </button>
                    </Link>
                    <Link to={project.github}>
                    <button className="underline self-start rounded-lg p-1.5 hover:bg-gray-50 [&_svg]:stroke-gray-500 text-xl flex items-center gap-2 text-secondary" >
                        Repo<SiGithub/>
                    </button>
                    </Link>
                </div>
                </div>
            </div>
        ))}
    </div>
    </div>
  );
}

