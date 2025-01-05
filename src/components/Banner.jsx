import Typewriter from 'typewriter-effect';
import CVButton from './CVButton';
import bannerImg from '../assets/images/banner.jpg';
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
          <div className="w-80 rounded-full ring ring-offset-base-100 ring-offset-2">
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
                strings: ['Frontend Developer','React Developer', 'MERN Enthusiast'],
                autoStart: true,
                loop: true,
              }}
            />
          </h2>
          <p className="py-6 text-gray-600">
          I love to create seamless digital experiences through responsive websites and modern web applications. Let’s turn your dream project into reality!
          </p>
          <div className="flex gap-4 justify-center lg:justify-start">
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
