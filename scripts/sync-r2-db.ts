import "dotenv/config";
import { prisma } from "../lib/prisma";
import { blogPosts } from "../prisma/posts-data";

const R2_PREFIX = "https://pub-13629069dfd74891bffc487ab4e135f5.r2.dev";

async function main() {
  console.log("🔄 Syncing R2 URLs to PostgreSQL database...\n");

  // 1. Update posts from blogPosts (posts-data.ts)
  console.log("📝 Updating Blog Posts and Cover Assets...");
  for (const post of blogPosts) {
    const assetKey = `post-cover-${post.slug}`;
    
    // Upsert/update the asset
    const asset = await prisma.asset.upsert({
      where: { key: assetKey },
      update: {
        url: post.coverImage.url,
        alt: post.coverImage.alt,
      },
      create: {
        key: assetKey,
        url: post.coverImage.url,
        alt: post.coverImage.alt,
      },
    });

    // Update the post content and coverImageId
    const updatedPost = await prisma.post.update({
      where: { slug: post.slug },
      data: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        featured: post.featured,
        coverImageId: asset.id,
      },
    });

    console.log(`  ✅ Post [${post.slug}] updated. Cover URL: ${asset.url}`);
  }

  // Handle any additional post in DB not in posts-data.ts, e.g. why-browser-agents-fail
  const otherPosts = await prisma.post.findMany({
    where: {
      slug: {
        notIn: blogPosts.map((p) => p.slug),
      },
    },
    include: {
      coverImage: true,
    },
  });

  for (const p of otherPosts) {
    if (p.coverImage && p.coverImage.url.startsWith("/")) {
      const newUrl = `${R2_PREFIX}${p.coverImage.url}`;
      await prisma.asset.update({
        where: { id: p.coverImage.id },
        data: { url: newUrl },
      });
      console.log(`  ✅ Extra Post [${p.slug}] cover asset updated: ${newUrl}`);
    }
  }

  // 2. Update Project Gallery Assets in DB
  console.log("\n📁 Updating Project Gallery Assets...");
  const projectAssets = await prisma.asset.findMany({
    where: {
      projectId: { not: null },
    },
  });

  let projectAssetUpdates = 0;
  for (const asset of projectAssets) {
    if (asset.url.startsWith("/projects/")) {
      const newUrl = `${R2_PREFIX}${asset.url}`;
      await prisma.asset.update({
        where: { id: asset.id },
        data: { url: newUrl },
      });
      console.log(`  ✅ Project asset [${asset.key}] -> ${newUrl}`);
      projectAssetUpdates++;
    } else if (asset.url.startsWith("/")) {
      const newUrl = `${R2_PREFIX}${asset.url}`;
      await prisma.asset.update({
        where: { id: asset.id },
        data: { url: newUrl },
      });
      console.log(`  ✅ Project asset [${asset.key}] -> ${newUrl}`);
      projectAssetUpdates++;
    }
  }
  console.log(`Updated ${projectAssetUpdates} project gallery assets.`);

  // 3. Verify specific requirements for rapid-software-development-user-experience
  console.log("\n🔍 Verifying rapid-software-development-user-experience post...");
  const rapidPost = await prisma.post.findUnique({
    where: { slug: "rapid-software-development-user-experience" },
    include: { coverImage: true },
  });

  if (!rapidPost) {
    throw new Error("rapid-software-development-user-experience post not found in DB!");
  }

  console.log("  Cover Image URL:", rapidPost.coverImage?.url);
  console.log("  Contains Diagram 1:", rapidPost.content.includes("https://pub-13629069dfd74891bffc487ab4e135f5.r2.dev/blog/rapid-software-development-two-perspectives.png"));
  console.log("  Contains Diagram 2:", rapidPost.content.includes("https://pub-13629069dfd74891bffc487ab4e135f5.r2.dev/blog/why-rapid-prototyping-matters.png"));
  
  if (
    !rapidPost.coverImage?.url.includes("rapid-software-development-user-experience.png") ||
    !rapidPost.content.includes("rapid-software-development-two-perspectives.png") ||
    !rapidPost.content.includes("why-rapid-prototyping-matters.png")
  ) {
    throw new Error("Verification failed: rapid-software-development-user-experience does not have all required R2 URLs in DB!");
  }

  console.log("\n🎉 Database sync completed successfully!");
}

main()
  .catch((e) => {
    console.error("Sync failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
