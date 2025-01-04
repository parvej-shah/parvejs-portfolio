import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


export default function MainLayout() {
  return (
    <div>
        <Navbar/>
        <Outlet/>
        <Footer/>
        <div className="min-h-screen bg-gray-100">

        </div>
    </div>
  )
}
