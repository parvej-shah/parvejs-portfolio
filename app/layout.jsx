import "./globals.css";
import Script from "next/script";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RevealProvider from "../components/RevealProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

// Single source of truth for the site's canonical origin.
// When the custom domain goes live, change it here only.
const siteUrl = "https://parvejshah.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Parvej Shah — Full Stack Web Developer | Dhaka, Bangladesh",
  description:
    "Full-stack developer building fast, scalable web products with React, Next.js, Node.js and MongoDB. Based in Dhaka — available for freelance projects worldwide.",
  authors: [{ name: "Parvej Shah Labib" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Parvej Shah — Full Stack Web Developer",
    description:
      "Fast, scalable web products with React, Next.js, Node.js and MongoDB — from the first wireframe to the final deploy.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Parvej Shah — Full Stack Web Developer" }],
    locale: "en_US",
    siteName: "Parvej Shah — Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parvej Shah — Full Stack Web Developer",
    description:
      "Fast, scalable web products with React, Next.js, Node.js and MongoDB — from the first wireframe to the final deploy.",
    images: ["/og.jpg"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Parvej Shah Labib",
  alternateName: "Parvej Shah",
  url: siteUrl,
  image: `${siteUrl}/og.jpg`,
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
    "Full-Stack Web Development",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "JavaScript",
    "Tailwind CSS",
  ],
  sameAs: ["https://github.com/parvej-shah", "https://www.linkedin.com/in/parvej-shah"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Parvej Shah — Portfolio",
  url: siteUrl,
  description:
    "Portfolio of Parvej Shah — Full Stack Web Developer based in Dhaka, Bangladesh",
  author: { "@type": "Person", name: "Parvej Shah" },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Parvej Shah Web Development Services",
  description:
    "Full-stack web development services — React, Next.js, Node.js and MongoDB",
  url: siteUrl,
  provider: { "@type": "Person", name: "Parvej Shah" },
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Web Development Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Full-Stack Web Development" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "React & Next.js Development" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "API & Backend Development" } },
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
