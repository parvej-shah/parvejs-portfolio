import { getSection } from "@/lib/data/public";

const defaultSiteUrl = "https://parvejshah.com";

export default async function robots() {
  const seo = await getSection("seo");
  const siteUrl = seo?.siteUrl || defaultSiteUrl;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
