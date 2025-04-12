import Typewriter from 'typewriter-effect';
import CVButton from './CVButton';
import bannerImg from '../assets/images/banner.webp';
import SocialLinks from './SocialLinks';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import { useEffect } from 'react';
const HeroSection = () => {
  useEffect(() => {AOS.init({ once: false,delay:"50",duration:"1000"});}, []);
  return (
    <div id='/' className="hero  bg-gray text-white pb-10">
      <div className="hero-content flex-col lg:flex-row-reverse">
        {/* Right Side Image */}
        <div data-aos="fade-left" data-aos-duration="5000" className="avatar">
          <div className="w-96 rounded-full ring ring-offset-base-100 ring-offset-2">
            <img
              src={bannerImg}
              alt="Profile"
              className="rounded-full"
            />
          </div>
        </div>
        {/* Left Side Content */}
        <div data-aos="fade-right" data-aos-duration="5000" className="max-w-lg text-center lg:text-left">
          <h1 className="text-5xl font-bold leading-tight text-gray-950">
            Hi, I&apos;m <span className="text-gray-950">Parvej Shah</span>
          </h1>
          <h2 className="text-4xl mt-4 font-medium text-secondary">
            <Typewriter
              options={{
                strings: ['Front-End Developer','React Specialist','Problem Solver'],
                autoStart: true,
                loop: true,
              }}
            />
          </h2>
          <p className="py-6 text-gray-600">
          Crafting elegant interfaces with React, where every component sings, every pixel dances, and every line of code tells a story of precision and care. Explore my work — let’s build something beautiful together.
          </p>
          <div className="flex gap-4 justify-center mb-2 lg:justify-start">
            <CVButton/>
            <button className="btn btn-outline ">Contact Me</button>
          </div>
          <SocialLinks/>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
