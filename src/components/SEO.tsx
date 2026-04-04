import { useEffect } from "react";

const DEFAULT_SITE_URL = "https://queenkoba.com";
const DEFAULT_IMAGE =
  "https://www.dropbox.com/scl/fi/jpdncaq9lkmtnhxz3xbli/new.jpeg?rlkey=y6gg1oiji39i52ve9avevqplh&st=zuyfr36d&raw=1";
const BRAND_NAME = "Queen Koba";

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  robots?: string;
  keywords?: string;
  locale?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const ensureMeta = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
};

const ensureLink = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
};

const removeElement = (selector: string) => {
  document.head.querySelector(selector)?.remove();
};

const SEO = ({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  robots = "index,follow",
  keywords,
  locale = "en_KE",
  publishedTime,
  modifiedTime,
  structuredData,
}: SeoProps) => {
  useEffect(() => {
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin || DEFAULT_SITE_URL;
    const canonicalUrl = new URL(path, siteUrl).toString();
    const pageTitle = title.includes(BRAND_NAME) ? title : `${title} | ${BRAND_NAME}`;
    const schema =
      structuredData ??
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: pageTitle,
        description,
        url: canonicalUrl,
      };

    document.title = pageTitle;

    ensureMeta('meta[name="description"]', { name: "description", content: description });
    ensureMeta('meta[name="robots"]', { name: "robots", content: robots });
    ensureMeta('meta[name="author"]', { name: "author", content: BRAND_NAME });
    ensureMeta('meta[name="theme-color"]', { name: "theme-color", content: "#123f35" });

    if (keywords) {
      ensureMeta('meta[name="keywords"]', { name: "keywords", content: keywords });
    }

    ensureMeta('meta[property="og:title"]', { property: "og:title", content: pageTitle });
    ensureMeta('meta[property="og:description"]', { property: "og:description", content: description });
    ensureMeta('meta[property="og:type"]', { property: "og:type", content: type });
    ensureMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    ensureMeta('meta[property="og:image"]', { property: "og:image", content: image });
    ensureMeta('meta[property="og:site_name"]', { property: "og:site_name", content: BRAND_NAME });
    ensureMeta('meta[property="og:locale"]', { property: "og:locale", content: locale });

    ensureMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    ensureMeta('meta[name="twitter:title"]', { name: "twitter:title", content: pageTitle });
    ensureMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    ensureMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
    ensureMeta('meta[name="twitter:site"]', { name: "twitter:site", content: "@queenkoba" });

    if (type === "article" && publishedTime) {
      ensureMeta('meta[property="article:published_time"]', {
        property: "article:published_time",
        content: publishedTime,
      });
    } else {
      removeElement('meta[property="article:published_time"]');
    }

    if (type === "article" && modifiedTime) {
      ensureMeta('meta[property="article:modified_time"]', {
        property: "article:modified_time",
        content: modifiedTime,
      });
    } else {
      removeElement('meta[property="article:modified_time"]');
    }

    ensureLink('link[rel="canonical"]', { rel: "canonical", href: canonicalUrl });

    let script = document.head.querySelector("#seo-structured-data") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "seo-structured-data";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }, [
    description,
    image,
    keywords,
    locale,
    modifiedTime,
    path,
    publishedTime,
    robots,
    structuredData,
    title,
    type,
  ]);

  return null;
};

export default SEO;
