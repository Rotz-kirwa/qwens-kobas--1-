import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const siteSeoPath = path.join(rootDir, "src", "data", "siteSeo.ts");
const productsPath = path.join(rootDir, "src", "data", "products.ts");
const sitemapPath = path.join(publicDir, "sitemap.xml");
const siteUrl = "https://queenkoba.com";
const today = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/story", changefreq: "monthly", priority: "0.8" },
  { path: "/results", changefreq: "weekly", priority: "0.8" },
  { path: "/ingredients", changefreq: "monthly", priority: "0.8" },
  { path: "/shop", changefreq: "weekly", priority: "0.9" },
  { path: "/reviews", changefreq: "weekly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
];

const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const extractMatches = (source, pattern) => {
  const matches = [];
  for (const match of source.matchAll(pattern)) {
    matches.push(match[1]);
  }
  return matches;
};

const dedupe = (entries) => {
  const seen = new Set();
  return entries.filter((entry) => {
    if (seen.has(entry.path)) {
      return false;
    }

    seen.add(entry.path);
    return true;
  });
};

const buildXmlEntry = ({ path: routePath, changefreq, priority, lastmod = today }) => `  <url>
    <loc>${escapeXml(new URL(routePath, siteUrl).toString())}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const generate = async () => {
  const [siteSeoSource, productsSource] = await Promise.all([
    readFile(siteSeoPath, "utf8"),
    readFile(productsPath, "utf8"),
  ]);

  const landingPaths = extractMatches(siteSeoSource, /path:\s*"((?:\/(?!blog\/)[^"])*)"/g)
    .filter((routePath) => routePath && routePath !== "/blog");
  const blogPostPaths = extractMatches(siteSeoSource, /path:\s*"(\/blog\/[^"]+)"/g);
  const blogCategorySlugs = extractMatches(siteSeoSource, /slug:\s*"([a-z-]+)"/g).filter((slug) =>
    ["hyperpigmentation", "dark-spots", "melanin-skin", "ingredients", "kenya-skincare"].includes(slug),
  );
  const productIds = extractMatches(productsSource, /id:\s*"([^"]+)"/g);

  const sitemapEntries = dedupe([
    ...staticRoutes,
    ...landingPaths.map((routePath) => ({
      path: routePath,
      changefreq: "weekly",
      priority: "0.9",
    })),
    ...blogCategorySlugs.map((slug) => ({
      path: `/blog/category/${slug}`,
      changefreq: "weekly",
      priority: "0.7",
    })),
    ...blogPostPaths.map((routePath) => ({
      path: routePath,
      changefreq: "monthly",
      priority: "0.7",
    })),
    ...productIds.map((productId) => ({
      path: `/shop/${productId}`,
      changefreq: "weekly",
      priority: "0.8",
    })),
  ]);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(buildXmlEntry).join("\n")}
</urlset>
`;

  await mkdir(publicDir, { recursive: true });
  await writeFile(sitemapPath, xml, "utf8");
  console.log(`Generated sitemap with ${sitemapEntries.length} URLs at ${path.relative(rootDir, sitemapPath)}`);
};

generate().catch((error) => {
  console.error("Failed to generate sitemap", error);
  process.exitCode = 1;
});
