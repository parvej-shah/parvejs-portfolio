import { z } from "zod";

// Strategy pattern: each section key owns its own Zod shape. `sectionSchemas` is the
// dispatch table — look up by key instead of branching on a giant catch-all schema.

const heroSchema = z.object({
  eyebrow: z.string().min(1),
  headlineLines: z.array(z.string().min(1)).min(1),
  description: z.string().min(1),
  primaryCta: z.object({ label: z.string().min(1), href: z.string().min(1) }),
  secondaryCta: z.object({ label: z.string().min(1), href: z.string().min(1) }),
  trustLabel: z.string().min(1),
  trustStats: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) })),
  portraitImage: z.string().min(1),
  portraitAlt: z.string().min(1),
  experienceBadge: z.object({ value: z.string().min(1), label: z.string().min(1) }),
});

const servicesSchema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  description: z.string().min(1),
  tagline: z.string().min(1),
  items: z.array(
    z.object({
      icon: z.string().min(1),
      title: z.string().min(1),
      desc: z.string().min(1),
    })
  ),
});

const statsSchema = z.object({
  items: z.array(
    z.object({
      value: z.string().min(1),
      suffix: z.string().min(1),
      label: z.string().min(1),
    })
  ),
});

const processSchema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  description: z.string().min(1),
  steps: z.array(
    z.object({
      icon: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      deliverable: z.string().min(1),
    })
  ),
});

const aboutSchema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  image: z.string().min(1),
  imageAlt: z.string().min(1),
  quote: z.string().min(1),
  quoteAuthor: z.string().min(1),
  quoteRole: z.string().min(1),
  points: z.array(z.string().min(1)),
  badgeValue: z.string().min(1),
  badgeLabel: z.string().min(1),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
});

const skillsSchema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  items: z.array(z.object({ name: z.string().min(1), icon: z.string().min(1) })),
});

const testimonialsSchema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  items: z.array(
    z.object({
      quote: z.string().min(1),
      name: z.string().min(1),
      role: z.string().min(1),
      initials: z.string().min(1),
      avatarUrl: z.string().optional(),
      rating: z.number().min(1).max(5).default(5),
      href: z.string().optional(),
    })
  ),
  clients: z.array(z.string().min(1)),
});

const ctaSchema = z.object({
  rating: z.string().min(1),
  ratingLabel: z.string().min(1),
  heading: z.string().min(1),
  description: z.string().min(1),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
});

const contactSchema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  description: z.string().min(1),
  info: z.array(
    z.object({
      icon: z.string().min(1),
      label: z.string().min(1),
      value: z.string().min(1),
      href: z.string().nullable().optional(),
    })
  ),
});

const meetingSchema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  description: z.string().min(1),
  durationLabel: z.string().min(1),
  notes: z.array(z.string().min(1)),
});

const socialSchema = z.object({
  links: z.array(
    z.object({
      icon: z.string().min(1),
      label: z.string().min(1),
      href: z.string().url(),
    })
  ),
});

const footerSchema = z.object({
  tagline: z.string().min(1),
  email: z.string().email(),
  location: z.string().min(1),
  newsletterHeading: z.string().min(1),
  newsletterDescription: z.string().min(1),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
  copyrightName: z.string().min(1),
  copyrightRole: z.string().min(1),
});

const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  ogImage: z.string().min(1),
  siteUrl: z.string().url(),
});

export const sectionSchemas = {
  hero: heroSchema,
  services: servicesSchema,
  stats: statsSchema,
  process: processSchema,
  about: aboutSchema,
  skills: skillsSchema,
  testimonials: testimonialsSchema,
  cta: ctaSchema,
  contact: contactSchema,
  meeting: meetingSchema,
  social: socialSchema,
  footer: footerSchema,
  seo: seoSchema,
} as const;

export type SectionKey = keyof typeof sectionSchemas;

export const sectionKeys = Object.keys(sectionSchemas) as SectionKey[];

export function getSectionSchema<K extends SectionKey>(key: K) {
  return sectionSchemas[key];
}
