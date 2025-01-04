import { Link } from "react-router-dom";
import SocialLinks from "./SocialLinks";
import aboutme from "../assets/images/aboutme.jpg";
import SectionTitle from "./SectionTitle";
const AboutMe = () => {
  return (
    <div className="bg-gray-200 text-gray-800  py-12 px-4 md:px-8">
        <div className="flex justify-center items-center mb-6">
            <SectionTitle title={"About Me"}/>
        </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center relative">
          <div className="w-60 h-[500px] rounded-lg bg-secondary flex flex-col items-center justify-end relative shadow-lg">
            <img
              src={aboutme}
              alt="Parvej Shah"
              className="object-fill w-full h-96 rounded-lg mt-2 mb-4 -ml-14"
            />
                <h3 className="text-3xl font-bold mb-4 text-white">Parvej Shah</h3>
          </div>
        </div>
        {/* Point 1 */}
        <div>
            <h1 className="text-2xl font-semibold mb-2">
              Crafting Seamless Digital Experiences
            </h1>
            <div className="w-20 h-[2px] mb-4 bg-secondary"></div>
            <p className="text-gray-700">
              Hi there! I specialize in building responsive, modern, and
              user-friendly websites that provide a seamless digital experience
              for users. Every line of code I write is driven by a passion for
              creating functional and visually appealing designs.
            </p>
            <p className="text-gray-700 mt-2">
              From startups to established businesses, I aim to deliver web
              solutions that help brands stand out in a competitive digital
              world.
            </p>
            <p className="text-gray-700 mt-3">Let’s connect and create amazing web solutions together!</p>
            <Link to="mailto:parvejshahlabib007@gmail.com">
            <h1 className="mt-4 text-xl font-medium text-secondary/90">parvejshahlabib007@gmail.com</h1>
            </Link>
          </div>
        {/* Content Section */}
        <div className="space-y-8">
          {/* Point 2 */}
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              Building Future-Ready Websites
            </h1>
            <div className="w-20 h-[2px] mb-4 bg-secondary"></div>
            <p className="text-gray-700">
              Whether it’s a simple portfolio or a complex web application, I
              take pride in developing scalable and future-proof web solutions.
              My goal is to ensure that your website not only works seamlessly
              today but also evolves with your business needs.
            </p>
            <p className="text-gray-700 mt-2">
              I stay updated with the latest trends and technologies to deliver
              projects that are efficient, high-performing, and visually
              stunning.
            </p>
          </div>
          {/* Social Links */}
          <SocialLinks />
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
