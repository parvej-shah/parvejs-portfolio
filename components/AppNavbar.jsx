"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function AppNavbar() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <Navbar />;
}
