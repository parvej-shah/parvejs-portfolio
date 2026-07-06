export default function sitemap() {
  const baseUrl = "https://parvej-shah.netlify.app";
  const lastModified = "2025-10-13";

  return [
    { url: `${baseUrl}/`, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/#about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/#skills`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/#portfolio`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/#contact`, lastModified, changeFrequency: "monthly", priority: 0.7 },
  ];
}
