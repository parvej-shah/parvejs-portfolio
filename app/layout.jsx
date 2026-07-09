import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import AppNavbar from "../components/AppNavbar";
import Footer from "../components/Footer";
import RevealProvider from "../components/RevealProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { getSection } from "@/lib/data/public";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const defaultSeo = {
  title: "Parvej Shah — Full Stack Web Developer | Dhaka, Bangladesh",
  description:
    "Full-stack developer building fast, scalable web products with React, Next.js, Node.js and MongoDB. Based in Dhaka — available for freelance projects worldwide.",
  ogImage: "/og.jpg",
  siteUrl: "https://parvejshah.vercel.app",
};

export async function generateMetadata() {
  const seoSection = await getSection("seo");
  const seo = { ...defaultSeo, ...seoSection };

  return {
    metadataBase: new URL(seo.siteUrl),
    title: seo.title,
    description: seo.description,
    authors: [{ name: "Parvej Shah Labib" }],
    robots: { index: true, follow: true },
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: seo.siteUrl,
      title: seo.title,
      description: seo.description,
      images: [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.title }],
      locale: "en_US",
      siteName: "Parvej Shah — Portfolio",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
    },
  };
}

export default async function RootLayout({ children }) {
  const seoSection = await getSection("seo");
  const seo = { ...defaultSeo, ...seoSection };

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Parvej Shah Labib",
    alternateName: "Parvej Shah",
    url: seo.siteUrl,
    image: new URL(seo.ogImage, seo.siteUrl).toString(),
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
    url: seo.siteUrl,
    description: seo.description,
    author: { "@type": "Person", name: "Parvej Shah" },
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Parvej Shah Web Development Services",
    description:
      "Full-stack web development services — React, Next.js, Node.js and MongoDB",
    url: seo.siteUrl,
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

  return (
    <html
      lang="en"
      data-theme="dark"
      data-scroll-behavior="smooth"
      className={cn("font-sans", geist.variable)}
    >
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
        <AppNavbar />
        {children}
        <Footer />
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-D6W1SP6Y6H"
        />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D6W1SP6Y6H');
          `}
        </Script>
        <Analytics />
      </body>
    </html>
  );
}
