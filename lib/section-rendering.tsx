import type { StaticImageData } from "next/image";
import {
  Clock,
  Code2,
  Database,
  Gauge,
  Globe,
  Layers,
  LayoutGrid,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  Rocket,
  Search,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  TerminalSquare,
  Zap,
} from "lucide-react";
import {
  FaDribbble,
  FaFacebookF,
  FaFigma,
  FaGit,
  FaGithub,
  FaInstagram,
  FaJs,
  FaLinkedinIn,
  FaNodeJs,
  FaReact,
  FaTwitch,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import {
  SiAxios,
  SiBootstrap,
  SiCss3,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiGraphql,
  SiHtml5,
  SiJsonwebtokens,
  SiMongodb,
  SiNextdotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReactquery,
  SiRedis,
  SiSass,
  SiShadcnui,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiX,
} from "react-icons/si";
import aboutImage from "@/assets/images/aboutme.webp";
import heroImage from "@/assets/images/banner-cutout.webp";

const serviceIcons = {
  Code2,
  Palette,
  Gauge,
  Rocket,
  Layers,
  Server,
  Database,
  Globe,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  TerminalSquare,
  LayoutGrid,
  Zap,
} as const;

const processIcons = {
  Search,
  LayoutGrid,
  Code2,
  Rocket,
  Sparkles,
  Gauge,
  Shield,
  Zap,
} as const;

const contactIcons = {
  Mail,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Globe,
} as const;

const socialIcons = {
  FaGithub,
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaDribbble,
  FaTwitch,
  FaWhatsapp,
  SiX,
} as const;

const skillIcons = {
  FaReact,
  FaJs,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiShadcnui,
  SiBootstrap,
  SiHtml5,
  SiCss3,
  SiSass,
  FaNodeJs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiFirebase,
  SiRedis,
  SiGraphql,
  SiReactquery,
  SiAxios,
  SiJsonwebtokens,
  SiDocker,
  SiVercel,
  SiPython,
  FaGit,
  FaFigma,
} as const;

const knownSectionImages: Record<string, StaticImageData> = {
  "/assets/images/aboutme.webp": aboutImage,
  "/assets/images/banner-cutout.webp": heroImage,
};

export const iconSets = {
  service: serviceIcons,
  process: processIcons,
  contact: contactIcons,
  social: socialIcons,
  skill: skillIcons,
} as const;

export function resolveServiceIcon(icon: string) {
  return serviceIcons[icon as keyof typeof serviceIcons] ?? Code2;
}

export function resolveProcessIcon(icon: string) {
  return processIcons[icon as keyof typeof processIcons] ?? Search;
}

export function resolveContactIcon(icon: string) {
  return contactIcons[icon as keyof typeof contactIcons] ?? Mail;
}

export function resolveSocialIcon(icon: string) {
  return socialIcons[icon as keyof typeof socialIcons] ?? FaGithub;
}

export function resolveSkillIcon(icon: string) {
  return skillIcons[icon as keyof typeof skillIcons] ?? FaReact;
}

export function resolveSectionImage(src: string) {
  return knownSectionImages[src] ?? src;
}
