const baseUrl = "https://parvejshah.vercel.app";

export default function sitemap() {
  // Single-page site: fragment URLs (#about etc.) are ignored by crawlers,
  // so the root is the only real entry.
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
