"use client";

import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import useScroll from "../hooks/useScrolls";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "About Me", link: "#about" },
  { name: "Services", link: "#services" },
  { name: "Portfolio", link: "#portfolio" },
  { name: "Insights", link: "#insights" },
  { name: "Contact", link: "#contact" },
];

export default function Navbar() {
  const scrolled = useScroll(40);
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? "bg-ink/80 backdrop-blur-xl border-b border-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-center gap-2 text-2xl font-black tracking-tight">
          <span className="text-brand">{"<"}</span>
          <span className="text-white">PS</span>
          <span className="text-brand">{"/>"}</span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.link}
              href={l.link}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-white"
            >
              {l.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className={cn(
              buttonVariants(),
              "hidden h-10 rounded-full bg-brand px-5 text-sm font-semibold text-[#05140b] hover:bg-brand-dark sm:inline-flex [&_svg]:size-4"
            )}
          >
            Start a Project
            <ArrowUpRight />
          </a>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="grid size-10 place-items-center rounded-full border border-line text-white lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="border-t border-line bg-ink/95 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
            {navLinks.map((l) => (
              <a
                key={l.link}
                href={l.link}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-muted-foreground hover:bg-ink-3 hover:text-white"
              >
                {l.name}
                <ArrowUpRight className="size-4 text-brand" />
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants(),
                "mt-2 h-11 rounded-full bg-brand font-semibold text-[#05140b] hover:bg-brand-dark"
              )}
            >
              Start a Project
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
