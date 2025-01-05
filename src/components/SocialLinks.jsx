import { FaLinkedin, FaGithub, FaFacebook, } from 'react-icons/fa';

export default function SocialLinks() {
  return (
    <div className="flex gap-6 justify-center lg:justify-start mt-4">
            <a
              href="https://www.linkedin.com/in/parvej-shah"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-gray-400 hover:text-secondary transition-all duration-200"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/parvej-shah"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-gray-400 hover:text-secondary transition-all duration-200"
            >
              <FaGithub />
            </a>
            <a
              href="https://facebook.com/parvej.shahlabib"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-gray-400 hover:text-secondary transition-all duration-200"
            >
              <FaFacebook />
            </a>
          </div>
  )
}
