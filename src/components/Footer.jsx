import SocialLinks from './SocialLinks'
import aboutme from "../assets/images/aboutme.webp";

export default function Footer() {
  return (
    <footer className="w-full p-6">
      <div className="max-w-6xl mx-auto glass-card rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 px-6 py-8 pr-6">
          {/* Left: image + name/title */}
          <div className="flex flex-col items-center gap-4 border-r border-gray-200 pt-10">
            <div className="w-24 h-24 md:w-60 md:h-60 rounded-full overflow-hidden ring-2 ring-secondary/40">
              <img src={aboutme} alt="Parvej Shah" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Parvej Shah</h4>
              <p className="text-sm text-gray-600">Full Stack Developer</p>
              <SocialLinks />
            </div>
          </div>


          {/* Right: content + CTA */}
          <div className="md:col-span-1 ">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
Let’s turn your good website into a great experience.
</h2>

                <p className="mt-2 text-gray-600 max-w-xl">
I mix clean code with solid UX thinking to help websites hit that sweet spot between fast and delightful. Let’s break down what’s slowing your site down and turn it into a smooth, conversion-ready experience.
</p>

              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <a href="#contact" className="btn bg-secondary text-white hover:bg-secondary/90">Get Your Site Reviewed</a>
          </div>

        </div>
        <div className="py-6">
            <p className="text-sm text-center text-gray-500">Copyright © {new Date().getFullYear()} - Parvej Shah Labib</p>
        </div>
      </div>
    </footer>
  )
}
