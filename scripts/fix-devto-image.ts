import "dotenv/config";

async function fixDevTo() {
  const apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) {
    throw new Error("DEVTO_API_KEY not found in environment");
  }

  console.log("Fetching Dev.to articles list...");
  const listRes = await fetch("https://dev.to/api/articles/me/all?per_page=1000", {
    headers: {
      "api-key": apiKey,
      "Accept": "application/json",
    },
  });

  const articles = await listRes.json();
  console.log(`Found ${articles.length} articles on Dev.to.`);

  const targetArticle = articles.find((a: any) =>
    a.slug.includes("why-browser-agents-fail") ||
    a.title.toLowerCase().includes("why browser agents fail")
  );

  if (!targetArticle) {
    console.error("Target article not found on Dev.to!");
    console.log("Recent article titles:", articles.slice(0, 5).map((a: any) => ({ id: a.id, title: a.title, slug: a.slug })));
    return;
  }

  console.log("Found target article on Dev.to:", {
    id: targetArticle.id,
    title: targetArticle.title,
    currentMainImage: targetArticle.main_image,
    url: targetArticle.url,
  });

  const properCoverImageUrl = "https://pub-13629069dfd74891bffc487ab4e135f5.r2.dev/assets/bab02951-9cb5-4e46-b056-635c35b42c8c-hero-1787836780942.png";

  console.log(`Updating article ${targetArticle.id} with main_image: ${properCoverImageUrl}...`);

  const updateRes = await fetch(`https://dev.to/api/articles/${targetArticle.id}`, {
    method: "PUT",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      article: {
        main_image: properCoverImageUrl,
      },
    }),
  });

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    console.error(`Failed to update Dev.to article: ${updateRes.status} ${errText}`);
    return;
  }

  const updated = await updateRes.json();
  console.log("✅ Successfully updated Dev.to article cover image!", {
    id: updated.id,
    title: updated.title,
    mainImage: updated.main_image,
    url: updated.url,
  });
}

fixDevTo().catch(console.error);
