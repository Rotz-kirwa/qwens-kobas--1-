import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const sitemapPath = path.join(publicDir, "sitemap.xml");

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<url>
<loc>https://queenkoba.com/</loc>
<lastmod>2026-04-08</lastmod>
<changefreq>weekly</changefreq>
<priority>1.0</priority>
</url>

<url>
<loc>https://queenkoba.com/shop</loc>
<lastmod>2026-04-08</lastmod>
<changefreq>weekly</changefreq>
<priority>0.9</priority>
</url>

<url>
<loc>https://queenkoba.com/blog</loc>
<lastmod>2026-04-08</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>

<url>
<loc>https://queenkoba.com/contact</loc>
<lastmod>2026-04-08</lastmod>
<changefreq>monthly</changefreq>
<priority>0.6</priority>
</url>

</urlset>
`;

const generate = async () => {
  await mkdir(publicDir, { recursive: true });
  await writeFile(sitemapPath, sitemapContent, "utf8");
  console.log(`Generated sitemap at ${path.relative(rootDir, sitemapPath)}`);
};

generate().catch((error) => {
  console.error("Failed to generate sitemap", error);
  process.exitCode = 1;
});
