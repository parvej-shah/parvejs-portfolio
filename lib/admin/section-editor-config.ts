import type { SectionData, SectionKey } from "@/lib/types";

type PrimitiveKind = "text" | "textarea" | "url" | "email";

type PrimitiveField = {
  kind: PrimitiveKind;
  label: string;
  placeholder?: string;
  description?: string;
};

type NumberField = {
  kind: "number";
  label: string;
  min?: number;
  max?: number;
};

export type IconSet = "service" | "process" | "contact" | "social" | "skill";

type IconPickerField = {
  kind: "iconPicker";
  label: string;
  iconSet: IconSet;
};

type ImageField = {
  kind: "image";
  label: string;
  description?: string;
};

type ObjectField<T extends Record<string, unknown>> = {
  kind: "object";
  label: string;
  fields: FieldMap<T>;
};

type StringArrayField = {
  kind: "stringArray";
  label: string;
  itemLabel: string;
  placeholder?: string;
};

type ObjectArrayField<T extends Record<string, unknown>> = {
  kind: "objectArray";
  label: string;
  itemLabel: string;
  fields: FieldMap<T>;
};

export type FieldConfig =
  | PrimitiveField
  | NumberField
  | IconPickerField
  | ImageField
  | ObjectField<Record<string, unknown>>
  | StringArrayField
  | ObjectArrayField<Record<string, unknown>>;

type NormalizedFieldValue<T> = NonNullable<T>;

type FieldFor<T> = NormalizedFieldValue<T> extends number
  ? NumberField
  : NormalizedFieldValue<T> extends string
    ? PrimitiveField | IconPickerField | ImageField
    : NormalizedFieldValue<T> extends string[]
      ? StringArrayField
      : NormalizedFieldValue<T> extends Array<infer U>
        ? U extends string
          ? StringArrayField
          : U extends Record<string, unknown>
            ? ObjectArrayField<U>
            : never
      : NormalizedFieldValue<T> extends Record<string, unknown>
        ? ObjectField<NormalizedFieldValue<T>>
        : never;

export type FieldMap<T> = {
  [K in keyof T]-?: FieldFor<T[K]>;
};

type SectionEditorDefinition<K extends SectionKey> = {
  label: string;
  description: string;
  fields: FieldMap<SectionData<K>>;
};

function defineSection<K extends SectionKey>(config: SectionEditorDefinition<K>) {
  return config;
}

export const sectionEditorConfig: { [K in SectionKey]: SectionEditorDefinition<K> } = {
  hero: defineSection({
    label: "Hero",
    description: "Main above-the-fold copy, CTAs, trust strip, and hero portrait settings.",
    fields: {
      eyebrow: { kind: "text", label: "Eyebrow" },
      headlineLines: { kind: "stringArray", label: "Headline lines", itemLabel: "Line" },
      description: { kind: "textarea", label: "Description" },
      primaryCta: {
        kind: "object",
        label: "Primary CTA",
        fields: {
          label: { kind: "text", label: "Label" },
          href: { kind: "text", label: "Href", placeholder: "#contact" },
        },
      },
      secondaryCta: {
        kind: "object",
        label: "Secondary CTA",
        fields: {
          label: { kind: "text", label: "Label" },
          href: { kind: "text", label: "Href", placeholder: "#portfolio" },
        },
      },
      trustLabel: { kind: "text", label: "Trust label" },
      trustStats: {
        kind: "objectArray",
        label: "Trust stats",
        itemLabel: "Stat",
        fields: {
          value: { kind: "text", label: "Value" },
          label: { kind: "text", label: "Label" },
        },
      },
      portraitImage: { kind: "image", label: "Portrait image" },
      portraitAlt: { kind: "text", label: "Portrait alt text" },
      experienceBadge: {
        kind: "object",
        label: "Experience badge",
        fields: {
          value: { kind: "text", label: "Value" },
          label: { kind: "text", label: "Label" },
        },
      },
    },
  }),
  services: defineSection({
    label: "Services",
    description: "Core expertise intro plus repeatable service cards.",
    fields: {
      eyebrow: { kind: "text", label: "Eyebrow" },
      heading: { kind: "textarea", label: "Heading" },
      description: { kind: "textarea", label: "Description" },
      tagline: { kind: "text", label: "Tagline" },
      items: {
        kind: "objectArray",
        label: "Service items",
        itemLabel: "Service",
        fields: {
          icon: { kind: "iconPicker", label: "Icon", iconSet: "service" },
          title: { kind: "text", label: "Title" },
          desc: { kind: "textarea", label: "Description" },
        },
      },
    },
  }),
  stats: defineSection({
    label: "Stats",
    description: "Numbers strip shown beneath the services section.",
    fields: {
      items: {
        kind: "objectArray",
        label: "Stats",
        itemLabel: "Stat",
        fields: {
          value: { kind: "text", label: "Value" },
          suffix: { kind: "text", label: "Suffix" },
          label: { kind: "text", label: "Label" },
        },
      },
    },
  }),
  process: defineSection({
    label: "Process",
    description: "Homepage working process section: positioning copy and repeatable steps.",
    fields: {
      eyebrow: { kind: "text", label: "Eyebrow" },
      heading: { kind: "textarea", label: "Heading" },
      description: { kind: "textarea", label: "Description" },
      steps: {
        kind: "objectArray",
        label: "Process steps",
        itemLabel: "Step",
        fields: {
          icon: { kind: "iconPicker", label: "Icon", iconSet: "process" },
          title: { kind: "text", label: "Title" },
          description: { kind: "textarea", label: "Description" },
          deliverable: { kind: "text", label: "Deliverable (e.g. Scope & roadmap)" },
        },
      },
    },
  }),
  about: defineSection({
    label: "About",
    description: "About copy, image, quote, bullet points, and CTA.",
    fields: {
      eyebrow: { kind: "text", label: "Eyebrow" },
      heading: { kind: "textarea", label: "Heading" },
      image: { kind: "image", label: "Image" },
      imageAlt: { kind: "text", label: "Image alt text" },
      quote: { kind: "textarea", label: "Quote" },
      quoteAuthor: { kind: "text", label: "Quote author" },
      quoteRole: { kind: "text", label: "Quote role" },
      points: { kind: "stringArray", label: "Bullet points", itemLabel: "Point" },
      badgeValue: { kind: "text", label: "Badge value" },
      badgeLabel: { kind: "text", label: "Badge label" },
      ctaLabel: { kind: "text", label: "CTA label" },
      ctaHref: { kind: "text", label: "CTA href" },
    },
  }),
  skills: defineSection({
    label: "Skills",
    description: "Tech stack heading plus repeatable skill tiles.",
    fields: {
      eyebrow: { kind: "text", label: "Eyebrow" },
      heading: { kind: "textarea", label: "Heading" },
      items: {
        kind: "objectArray",
        label: "Skills",
        itemLabel: "Skill",
        fields: {
          name: { kind: "text", label: "Name" },
          icon: { kind: "iconPicker", label: "Icon", iconSet: "skill" },
        },
      },
    },
  }),
  testimonials: defineSection({
    label: "Testimonials",
    description: "Quotes plus marquee client names.",
    fields: {
      eyebrow: { kind: "text", label: "Eyebrow" },
      heading: { kind: "textarea", label: "Heading" },
      items: {
        kind: "objectArray",
        label: "Testimonials",
        itemLabel: "Testimonial",
        fields: {
          quote: { kind: "textarea", label: "Quote" },
          name: { kind: "text", label: "Name" },
          role: { kind: "text", label: "Role (e.g. Founder, Acme Inc.)" },
          initials: { kind: "text", label: "Initials" },
          avatarUrl: { kind: "image", label: "Avatar image (optional)" },
          rating: { kind: "number", label: "Rating (1-5)", min: 1, max: 5 },
          href: { kind: "url", label: "Link to case study (optional)" },
        },
      },
      clients: { kind: "stringArray", label: "Client marquee", itemLabel: "Client" },
    },
  }),
  cta: defineSection({
    label: "CTA Band",
    description: "Homepage conversion band above testimonials.",
    fields: {
      rating: { kind: "text", label: "Rating" },
      ratingLabel: { kind: "text", label: "Rating label" },
      heading: { kind: "textarea", label: "Heading" },
      description: { kind: "textarea", label: "Description" },
      ctaLabel: { kind: "text", label: "CTA label" },
      ctaHref: { kind: "text", label: "CTA href" },
    },
  }),
  contact: defineSection({
    label: "Contact",
    description: "Contact intro and repeatable contact info rows.",
    fields: {
      eyebrow: { kind: "text", label: "Eyebrow" },
      heading: { kind: "textarea", label: "Heading" },
      description: { kind: "textarea", label: "Description" },
      info: {
        kind: "objectArray",
        label: "Contact info",
        itemLabel: "Row",
        fields: {
          icon: { kind: "iconPicker", label: "Icon", iconSet: "contact" },
          label: { kind: "text", label: "Label" },
          value: { kind: "text", label: "Value" },
          href: { kind: "text", label: "Href" },
        },
      },
    },
  }),
  meeting: defineSection({
    label: "Meeting",
    description: "Book-a-meeting intro copy and scheduling notes.",
    fields: {
      eyebrow: { kind: "text", label: "Eyebrow" },
      heading: { kind: "textarea", label: "Heading" },
      description: { kind: "textarea", label: "Description" },
      durationLabel: { kind: "text", label: "Duration label", placeholder: "30 min call" },
      notes: { kind: "stringArray", label: "Notes", itemLabel: "Note" },
    },
  }),
  social: defineSection({
    label: "Social Links",
    description: "Links used across hero, contact, and footer.",
    fields: {
      links: {
        kind: "objectArray",
        label: "Links",
        itemLabel: "Link",
        fields: {
          icon: { kind: "iconPicker", label: "Icon", iconSet: "social" },
          label: { kind: "text", label: "Label" },
          href: { kind: "url", label: "Href" },
        },
      },
    },
  }),
  footer: defineSection({
    label: "Footer",
    description: "Global footer copy and primary CTA.",
    fields: {
      tagline: { kind: "textarea", label: "Tagline" },
      email: { kind: "email", label: "Email" },
      location: { kind: "text", label: "Location" },
      newsletterHeading: { kind: "text", label: "Newsletter heading" },
      newsletterDescription: { kind: "textarea", label: "Newsletter description" },
      ctaLabel: { kind: "text", label: "CTA label" },
      ctaHref: { kind: "text", label: "CTA href" },
      copyrightName: { kind: "text", label: "Copyright name" },
      copyrightRole: { kind: "text", label: "Copyright role" },
    },
  }),
  seo: defineSection({
    label: "SEO",
    description: "Site-wide metadata defaults used for homepage metadata, robots, and sitemap origin.",
    fields: {
      title: { kind: "text", label: "Title" },
      description: { kind: "textarea", label: "Description" },
      ogImage: { kind: "image", label: "Open Graph image" },
      siteUrl: { kind: "url", label: "Canonical site URL" },
    },
  }),
};
