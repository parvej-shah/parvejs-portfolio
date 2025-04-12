import { useLocation } from "react-router-dom";
import useScroll from "../hooks/useScrolls";
import CVButton from "./CVButton";
import { NavHashLink } from "react-router-hash-link";

export default function Navbar() {
    const scrolled = useScroll(40);
    const location = useLocation();
    console.log(location);
      const navLinks = [
            {name: "Portfolio",link:"#portfolio"  },
            {name: "About",link:"#about"  },
            {name: "Contact",link:"#contact"  },
    ]
    const activeLink = "text-secondary";
    const inActiveLink = "hover:text-secondary text-gray-700 hover:scale-105";
    const navLink = "btn transition-all transform duration-300 btn-sm bg-transparent hover:bg-transparent border-none text-base font-semibold shadow-none";
  return (
    <div className={`sticky px-2 py-3 top-0 z-30 w-full border-b border-transparent bg-gray max-md:border-gray-100 ${scrolled ? 'bg-gray/50 backdrop-blur-xl md:border-gray-100' : ''}`}>
      <div className={`flex justify-between items-center container mx-auto`}>
        <div className="flex items-center gap-2">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
                          <NavHashLink smooth scroll={el => el.scrollIntoView({ behavior: 'instant', block: 'end' })} activeClassName={activeLink} className={`${navLink} ${inActiveLink}`} to={link.link}>{link.name}</NavHashLink>
                        </li>
                ))
            }
            </ul>
          </div>
          <h3 className="text-3xl italic font-black uppercase">{"<PS/>"}</h3>
        </div> 
        <div className="flex items-center">
        <div className="items-center gap-2 hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {
                navLinks.map((link,index)=>(
                  <li key={index}>
                      <NavHashLink smooth scroll={el => el.scrollIntoView({ behavior: 'instant', block: 'end' })} activeClassName={activeLink} className={`${navLink} ${inActiveLink}`} to={link.link}>{link.name}</NavHashLink>
                  </li>
                ))
            }
          </ul>
        </div>
          <CVButton isNav={true}/>
        </div>
      </div>
    </div>
  );
}
