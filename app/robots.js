export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      crawlDelay: 1,
    },
    sitemap: "https://parvej-shah.netlify.app/sitemap.xml",
  };
}
