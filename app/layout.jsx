import "./globals.css";
import Script from "next/script";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RevealProvider from "../components/RevealProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const siteUrl = "https://parvej-shah.netlify.app/";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Parvej Shah - Full Stack Web Developer | MERN Developer | Web Developer Bangladesh",
  description:
    "Parvej Shah - Professional Full Stack Web Developer from Dhaka University (IIT DU). Expert in building modern, scalable web applications with React, Node.js, Express, and MongoDB. Bangladesh's top web developer offering freelance web development services.",
  keywords: [
    "Parvej Shah",
    "web developer Bangladesh",
    "full stack web developer",
    "MERN stack developer",
    "React developer",
    "IIT DU",
    "Dhaka University",
    "software engineering student",
    "freelance web developer BD",
    "JavaScript developer",
    "responsive web design",
    "web developer Dhaka",
    "React specialist Bangladesh",
    "portfolio website developer",
  ],
  authors: [{ name: "Parvej Shah Labib" }],
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
  icons: { icon: "/banner.jpg" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Parvej Shah - Full Stack Web Developer | MERN Stack Bangladesh",
    description:
      "Professional Full Stack Web Developer from Dhaka University. Expert in React, Node.js, Express, MongoDB, and modern web development. Available for freelance projects.",
    images: ["/banner.jpg"],
    locale: "en_US",
    siteName: "Parvej Shah Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parvej Shah - Full Stack Web Developer | MERN Stack",
    description:
      "Professional Full Stack Web Developer from Dhaka University. Expert in React, Node.js, Express, MongoDB, and modern web development.",
    images: ["/banner.jpg"],
  },
  other: {
    "geo.region": "BD-C",
    "geo.placename": "Dhaka",
    "geo.position": "23.8103;90.4125",
    ICBM: "23.8103, 90.4125",
    "revisit-after": "7 days",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Parvej Shah Labib",
  alternateName: "Parvej Shah",
  url: "https://parvejshah.com",
  image: "https://parvej-shah.netlify.app/banner.jpg",
  jobTitle: "Full Stack Web Developer",
  worksFor: { "@type": "Organization", name: "Freelance" },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Dhaka University",
    sameAs: "https://www.du.ac.bd/",
  },
  address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
  email: "parvejshahlabib007@gmail.com",
  knowsAbout: [
    "React",
    "JavaScript",
    "Front-End Development",
    "Web Development",
    "UI/UX",
    "Tailwind CSS",
    "Node.js",
    "MongoDB",
  ],
  sameAs: ["https://github.com/parvej-shah", "https://www.linkedin.com/in/parvej-shah"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Parvej Shah Portfolio",
  url: "https://parvej-shah.netlify.app",
  description: "Professional portfolio of Parvej Shah - Full Stack Web Developer from Bangladesh",
  author: { "@type": "Person", name: "Parvej Shah" },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://parvej-shah.netlify.app/?s={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Parvej Shah Web Development Services",
  description: "Professional web development and React development services in Bangladesh",
  provider: { "@type": "Person", name: "Parvej Shah" },
  areaServed: { "@type": "Country", name: "Bangladesh" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Web Development Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "React Development" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Front-End Development" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Responsive Web Design" } },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" className={cn("font-sans", geist.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      </head>
      <body>
        <RevealProvider />
        <Navbar />
        {children}
        <Footer />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-D6W1SP6Y6H"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D6W1SP6Y6H');
          `}
        </Script>
      </body>
    </html>
  );
}
