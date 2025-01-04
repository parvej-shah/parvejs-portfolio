import { Link, NavLink } from "react-router-dom";
import useScroll from "../hooks/useScrolls";

export default function Navbar() {
    const scrolled = useScroll(40);
    const navLinks = [
        {
            name: "Home",link:"/"  },
            {name: "About me",link:"/about"  },
            {name: "Work",link:"/work"  },
            {name: "Testimonial",link:"/testimonial"  },
    ]
    const activeLink = "text-gray-950";
    const inActiveLink = "hover:text-gray-950 text-gray-700 hover:scale-105";
    const navLink = "btn transition-all transform duration-300 btn-sm bg-transparent hover:bg-transparent border-none text-base font-semibold shadow-none";
  return (
    <div className={`sticky px-2 py-3 top-0 z-30 w-full border-b border-transparent bg-gray max-md:border-gray-100 ${scrolled ? 'bg-gray/50 backdrop-blur-xl md:border-gray-100' : ''}`}>
      <div className={`flex justify-between items-center container mx-auto`}>
        <div className="flex items-center gap-2">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-gray rounded-box z-[1] mt-3 w-fit p-2 shadow"
            >
              {
                navLinks.map((link,index)=>(
                        <li key={index}>
                            <NavLink className={({isActive})=>`${navLink} ${isActive?activeLink:inActiveLink}`} to={link.link}>{link.name}
                            </NavLink>
                        </li>
                ))
            }
            </ul>
          </div>
          <h1 className="text-2xl italic font-bold uppercase">{"<PS>"}</h1>
        </div> 
        <div className="items-center gap-2 hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {
                navLinks.map((link,index)=>(
                        <li key={index}>
                            <NavLink className={({isActive})=>`${navLink} ${isActive?activeLink:inActiveLink}`} to={link.link}>{link.name}
                            </NavLink>
                        </li>
                ))
            }
          </ul>
        </div>
        <div className="flex items-center">
          <a className="btn btn-sm text-gray-950 bg-gray-50 hover:bg-gray-100 transition-all transform duration-300">Download CV</a>
        </div>
      </div>
    </div>
  );
}
