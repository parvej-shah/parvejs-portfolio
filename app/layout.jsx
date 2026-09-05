import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AppNavbar from "../components/AppNavbar";
import Footer from "../components/Footer";
import RevealProvider from "../components/RevealProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { getSection } from "@/lib/data/public";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const defaultSeo = {
  title: "Parvej Shah — Software Engineer & AI Systems Developer",
  description:
    "Software Engineer & AI Systems Developer. I build production AI voice pipelines, reliable payment webhook infrastructure, and full-stack systems in Next.js and TypeScript, including real-time telephony and automated workflow orchestration.",
  ogImage: "/og.jpg",
  siteUrl: "https://parvejshah.com",
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
    name: "Parvej Shah",
    alternateName: ["Parvej Shah Labib", "Parvej Shah Shah Labib"],
    url: seo.siteUrl,
    image: new URL("/og.jpg", seo.siteUrl).toString(),
    jobTitle: "Software Engineer & AI Systems Developer",
    worksFor: {
      "@type": "Organization",
      name: "CoderVai",
      url: "https://www.codervai.com",
    },
    workLocation: {
      "@type": "Place",
      name: "Worldwide · Remote",
    },
    email: "parvejshahlabib007@gmail.com",
    knowsAbout: [
      "Software Engineering",
      "AI Systems Development",
      "Voice AI Pipelines",
      "Real-Time Telephony",
      "WebRTC",
      "SIP Protocol",
      "Retell AI Voice Agents",
      "LLM Orchestration",
      "n8n Workflow Automation",
      "Full-Stack Web Development",
      "React",
      "Next.js",
      "React Server Components",
      "Node.js",
      "TypeScript",
      "JavaScript",
      "PostgreSQL",
      "Prisma ORM",
      "Supabase",
      "Redis",
      "BullMQ",
      "WebSockets",
      "Payment Webhook Engineering",
      "bKash Payment Integration",
      "Nagad Payment Integration",
      "Idempotent Webhook Design",
      "Installable PWA",
      "Workbox Service Workers",
      "Cloudflare R2",
      "Vercel Edge Network",
      "Docker",
      "Competitive Programming Platforms",
      "EdTech Systems",
      "Server-Side Rendering",
      "Generative Engine Optimization",
      "Technical SEO",
      "University of Dhaka",
      "CoderVai",
      "Bangladesh",
    ],
    sameAs: [
      "https://github.com/parvej-shah",
      "https://www.linkedin.com/in/parvej-shah",
      "https://dev.to/parvejshah",
      "https://hashnode.com/@parvej-shah",
      "https://parvejshah.hashnode.dev",
      "https://medium.com/@parvejshah",
      "https://peerlist.io/parvejshah",
      "https://www.producthunt.com/@parvejshah",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Parvej Shah — Software Engineer & AI Systems Developer",
    url: seo.siteUrl,
    description: seo.description,
    author: {
      "@type": "Person",
      name: "Parvej Shah",
    },
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Parvej Shah — Engineering Services",
    description:
      "Software engineering services specialising in AI voice pipelines, production-grade full-stack systems, Next.js/TypeScript platforms, payment webhook infrastructure, and installable PWAs.",
    url: seo.siteUrl,
    provider: {
      "@type": "Person",
      name: "Parvej Shah",
    },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Engineering Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Voice Pipeline Engineering" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Full-Stack Next.js Platform Development" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Payment Webhook & Infrastructure Engineering" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Installable PWA Development" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "LLM & Multi-Agent System Architecture" } },
      ],
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who is Parvej Shah?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Parvej Shah is a Software Engineer & AI Systems Developer. He builds production AI voice pipelines, reliable full-stack systems, and real-time infrastructure, currently working with CoderVai.",
        },
      },
      {
        "@type": "Question",
        name: "What is Parvej Shah known for technically?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Parvej Shah is known for building production voice AI agents on Retell AI and n8n workflow automation, with real-time calendar and CRM booking integrations and sub-100ms cached availability lookups; designing automated multi-stage content pipelines with built-in claims-verification gates; and building idempotent payment webhook systems for bKash and Nagad at production scale.",
        },
      },
      {
        "@type": "Question",
        name: "Where is Parvej Shah based and is he available for remote work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Parvej Shah works remotely with clients worldwide across US, European, and global timezones. He is available for remote engineering contracts and collaborations.",
        },
      },
      {
        "@type": "Question",
        name: "What companies has Parvej Shah worked with?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Parvej Shah has worked on production systems for CoderVai (competitive programming LMS), Minions.AI (AI voice telephony), GenMorphics AI (enterprise workforce management), MathPro Academy (EdTech platform), SellerVai (conversational commerce), and Badhan Blood Network (emergency donor PWA).",
        },
      },
    ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Parvej Shah — Engineering & Architecture Blog"
          href="/rss.xml"
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
        <SpeedInsights />
      </body>
    </html>
  );
}
