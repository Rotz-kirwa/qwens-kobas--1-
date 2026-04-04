import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdaptiveImage from "@/components/AdaptiveImage";
import SEO from "@/components/SEO";
import FaqSection from "@/components/seo/FaqSection";
import ProductRecommendations from "@/components/seo/ProductRecommendations";
import ResourceGrid from "@/components/seo/ResourceGrid";
import {
  blogCategories,
  blogPostsBySlug,
  defaultArticleAuthor,
  findBlogPostsBySlugs,
  getRelatedBlogPosts,
  type LinkCard,
} from "@/data/siteSeo";

const BlogArticle = () => {
  const { slug = "" } = useParams();
  const post = blogPostsBySlug[slug];

  if (!post) {
    return (
      <main className="min-h-screen bg-background pb-16 pt-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl text-foreground">Article not found</h1>
          <p className="mt-4 text-muted-foreground">
            The article you requested is unavailable right now.
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground"
          >
            Back to blog
          </Link>
        </div>
      </main>
    );
  }

  const category = blogCategories.find((item) => item.slug === post.categorySlug);
  const relatedPosts = getRelatedBlogPosts(post.slug).map<LinkCard>((relatedPost) => ({
    eyebrow: "Related Article",
    title: relatedPost.title,
    description: relatedPost.excerpt,
    to: relatedPost.path,
    ctaLabel: "Read article",
  }));
  const explicitLandingLinks = [...post.relatedPageLinks];
  const explicitArticles = findBlogPostsBySlugs(post.relatedArticleSlugs)
    .filter((relatedPost) => relatedPost.slug !== post.slug)
    .map<LinkCard>((relatedPost) => ({
      eyebrow: "Related Article",
      title: relatedPost.title,
      description: relatedPost.excerpt,
      to: relatedPost.path,
      ctaLabel: "Read article",
    }));

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: {
        "@type": "Person",
        name: defaultArticleAuthor.name,
      },
      publisher: {
        "@type": "Organization",
        name: "Queen Koba",
        logo: {
          "@type": "ImageObject",
          url: "https://queenkoba.com/images/local/logo-kbl.jpg",
        },
      },
      url: `https://queenkoba.com${post.path}`,
      articleSection: category?.name || "Skincare",
      keywords: post.keywords.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://queenkoba.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: "https://queenkoba.com/blog",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: `https://queenkoba.com${post.path}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-background pb-16 pt-24 md:pb-20">
      <SEO
        title={post.title}
        description={post.metaDescription}
        path={post.path}
        type="article"
        image={post.heroImage}
        keywords={post.keywords.join(", ")}
        publishedTime={post.publishedAt}
        modifiedTime={post.updatedAt}
        structuredData={structuredData}
      />

      <section className="pb-10">
        <div className="container mx-auto px-4">
          <Link
            to="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>

          <article className="rounded-[32px] border border-border/70 bg-card p-8 shadow-[0_22px_54px_rgba(24,17,8,0.07)] md:p-10">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">{post.heroEyebrow}</p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-light leading-tight md:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 max-w-3xl text-sm leading-8 text-muted-foreground md:text-lg">
              {post.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {post.keywords.slice(0, 4).map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-6 text-xs uppercase tracking-[0.18em] text-primary/75">
              <span>{category?.name || "Skincare"}</span>
              <span>{post.readTime}</span>
              <span>Updated {post.updatedAt}</span>
            </div>
            <div className="mt-8 overflow-hidden rounded-[26px] border border-border/70 bg-background shadow-[0_18px_42px_rgba(24,17,8,0.08)]">
              <AdaptiveImage
                src={post.heroImage}
                alt={post.heroImageAlt}
                className="aspect-[16/9] w-full object-cover object-center"
                highPriority
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            </div>
            <p className="mt-6 rounded-[24px] bg-secondary/25 px-5 py-5 text-sm leading-7 text-foreground/80">
              {post.localAngle}
            </p>
          </article>
        </div>
      </section>

      <section className="py-8 md:py-10">
        <div className="container mx-auto space-y-8 px-4 md:space-y-10">
          {post.sections.map((section) => (
            <article
              key={section.heading}
              className="rounded-[30px] border border-border/70 bg-card p-6 shadow-[0_18px_40px_rgba(24,17,8,0.05)] md:p-8"
            >
              <h2 className="font-display text-3xl font-light md:text-4xl">{section.heading}</h2>
              <div className="mt-5 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-8 text-muted-foreground md:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.bullets?.length ? (
                <ul className="mt-6 grid gap-3 md:grid-cols-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm leading-7 text-foreground/85"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="py-10 md:py-12">
        <div className="container mx-auto space-y-12 px-4">
          <ProductRecommendations
            title="Shop the products mentioned in this guide"
            description="These products align most closely with the article's search intent and routine advice."
            productKeys={post.relatedProductKeys}
          />
          <FaqSection
            title="Frequently asked questions"
            intro="Answering common concerns helps readers move from research to confident routine building."
            faqs={post.faqs}
          />
          <div className="rounded-[30px] border border-primary/15 bg-secondary/20 p-6 shadow-[0_18px_44px_rgba(24,17,8,0.06)] md:p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-primary">Author</p>
            <h2 className="mt-4 font-display text-3xl font-light md:text-4xl">
              {defaultArticleAuthor.name}
            </h2>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-primary/75">
              {defaultArticleAuthor.role}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              {defaultArticleAuthor.bio}
            </p>
          </div>
          <ResourceGrid
            title="Continue the journey"
            intro="These links connect the article to product, landing page, and supporting blog content."
            items={[...explicitLandingLinks, ...explicitArticles, ...relatedPosts].slice(0, 6)}
          />
        </div>
      </section>
    </main>
  );
};

export default BlogArticle;
