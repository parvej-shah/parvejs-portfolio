import Typewriter from 'typewriter-effect';
import { FaLinkedin, FaGithub, FaFacebook, } from 'react-icons/fa';
import CVButton from './CVButton';
import bannerImg from '../assets/images/banner.jpg';
const HeroSection = () => {
  return (
    <div className="hero  bg-gradient-to-b from-gray via-gray-50 to-gray-100 text-white">
      <div className="hero-content flex-col lg:flex-row-reverse">
        {/* Right Side Image */}
        <div className="avatar">
          <div className="w-80 rounded-full ring ring-offset-base-100 ring-offset-2">
            <img
              src={bannerImg}
              alt="Profile"
              className="rounded-full"
            />
          </div>
        </div>
        {/* Left Side Content */}
        <div className="max-w-lg text-center lg:text-left">
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
          <div className="flex gap-6 justify-center lg:justify-start mt-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-gray-400 hover:text-secondary transition-all duration-200"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-gray-400 hover:text-secondary transition-all duration-200"
            >
              <FaGithub />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-gray-400 hover:text-secondary transition-all duration-200"
            >
              <FaFacebook />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
