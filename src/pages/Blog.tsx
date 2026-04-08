import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AdaptiveImage from "@/components/AdaptiveImage";
import SEO from "@/components/SEO";
import ProductRecommendations from "@/components/seo/ProductRecommendations";
import ResourceGrid from "@/components/seo/ResourceGrid";
import {
  blogCategories,
  blogContentCalendar,
  blogPosts,
  featuredBlogSlugs,
  getBlogPostsByCategory,
  homeConcernCards,
  type BlogPost,
} from "@/data/siteSeo";

const dedupePostsBySlug = (posts: BlogPost[]) => {
  const seen = new Set<string>();

  return posts.filter((post) => {
    if (seen.has(post.slug)) {
      return false;
    }

    seen.add(post.slug);
    return true;
  });
};

const categoryProductMap: Record<string, string[]> = {
  hyperpigmentation: ["new-serum", "new-bundle", "new-cream"],
  "dark-spots": ["new-serum", "new-toner", "new-bundle"],
  "melanin-skin": ["new-bundle", "new-cream", "new-cleanser"],
  ingredients: ["new-cleanser", "new-mask", "new-bundle"],
  "kenya-skincare": ["new-serum", "new-bundle", "new-cleanser"],
};

const Blog = () => {
  const { categorySlug } = useParams();
  const activeCategory = blogCategories.find((category) => category.slug === categorySlug);
  const featuredPosts = dedupePostsBySlug(
    blogPosts.filter((post) => {
      if (!featuredBlogSlugs.includes(post.slug as (typeof featuredBlogSlugs)[number])) {
        return false;
      }

      if (activeCategory) {
        return post.categorySlug === activeCategory.slug;
      }

      return true;
    }),
  );
  const featuredPostSlugs = new Set(featuredPosts.map((post) => post.slug));
  const visiblePosts = dedupePostsBySlug(getBlogPostsByCategory(activeCategory?.slug)).filter(
    (post) => !featuredPostSlugs.has(post.slug),
  );
  const articleItemList = dedupePostsBySlug([...featuredPosts, ...visiblePosts]).slice(0, 12);
  const heroImage = featuredPosts[0]?.heroImage || visiblePosts[0]?.heroImage;
  const collectionPath = activeCategory ? `/blog/category/${activeCategory.slug}` : "/blog";
  const collectionUrl = `https://queenkoba.com${collectionPath}`;
  const productKeys = activeCategory ? categoryProductMap[activeCategory.slug] ?? ["new-bundle"] : ["new-serum", "new-bundle", "new-cleanser"];
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: activeCategory ? `${activeCategory.name} articles` : "Queen Koba Blog",
      description:
        activeCategory?.description ||
        "Educational skincare content focused on hyperpigmentation, dark spots, melanin-rich skin, natural skincare, and Kenya-focused skincare discovery.",
      url: collectionUrl,
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
        ...(activeCategory
          ? [
              {
                "@type": "ListItem",
                position: 3,
                name: activeCategory.name,
                item: collectionUrl,
              },
            ]
          : []),
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: activeCategory ? `${activeCategory.name} blog articles` : "Queen Koba educational articles",
      itemListElement: articleItemList.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://queenkoba.com${post.path}`,
        name: post.title,
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-background pb-16 pt-24 md:pb-20">
      <SEO
        title={
          activeCategory
            ? `${activeCategory.name} Blog Articles for Queen Koba`
            : "Queen Koba Blog: Hyperpigmentation, Dark Spots, and Melanin Skin Care"
        }
        description={
          activeCategory
            ? activeCategory.description
            : "Read Queen Koba blog guides on hyperpigmentation treatment, dark spots, melanin-rich skin, natural skincare, African botanicals, and skincare products in Kenya."
        }
        path={collectionPath}
        image={heroImage}
        keywords="hyperpigmentation blog, dark spots skincare articles, melanin skin care blog, skincare products Kenya, African botanical skincare blog"
        structuredData={structuredData}
      />

      <section className="pb-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl rounded-[32px] border border-border/70 bg-card p-8 shadow-[0_22px_54px_rgba(24,17,8,0.07)] md:p-10">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">
              {activeCategory ? `${activeCategory.name} articles` : "Queen Koba Journal"}
            </p>
            <h1 className="mt-4 font-display text-4xl font-light leading-tight md:text-6xl">
              Educational skincare content built for search, trust, and conversion
            </h1>
            <p className="mt-6 max-w-3xl text-sm leading-8 text-muted-foreground md:text-lg">
              Queen Koba's blog architecture targets hyperpigmentation, dark spots, melanin skin,
              ingredient education, and skincare products in Kenya. Each article is built to answer
              a real search query, then connect that search intent to the relevant product and
              landing page instead of leaving visitors stranded in information-only content.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {blogCategories.map((category) => {
                const isActive = activeCategory?.slug === category.slug;
                return (
                  <Link
                    key={category.slug}
                    to={`/blog/category/${category.slug}`}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                    }`}
                  >
                    {category.name}
                  </Link>
                );
              })}
              {activeCategory ? (
                <Link
                  to="/blog"
                  className="rounded-full border border-border/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/20 hover:text-primary"
                >
                  View all
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {featuredPosts.length > 0 ? (
        <section className="py-8 md:py-10">
          <div className="container mx-auto px-4">
            <div className="mb-8 max-w-3xl">
              <p className="text-sm uppercase tracking-[0.28em] text-primary">Featured Articles</p>
              <h2 className="mt-4 font-display text-3xl font-light md:text-4xl">
                {activeCategory
                  ? `Featured ${activeCategory.name.toLowerCase()} reads`
                  : "Start with the highest-impact content clusters"}
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-[26px] border border-border/70 bg-card p-6 shadow-[0_16px_36px_rgba(24,17,8,0.06)]"
                >
                  <Link to={post.path} className="mb-5 block overflow-hidden rounded-[20px]">
                    <AdaptiveImage
                      src={post.heroImage}
                      alt={post.heroImageAlt}
                      className="aspect-[4/3] w-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  </Link>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/75">
                    {blogCategories.find((category) => category.slug === post.categorySlug)?.name || "Blog"}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-light text-foreground">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.16em] text-primary/75">
                    <span>{post.readTime}</span>
                    <span>{post.updatedAt}</span>
                  </div>
                  <Link
                    to={post.path}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary/80"
                  >
                    Read article
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-8 md:py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-primary">All Articles</p>
            <h2 className="mt-4 font-display text-3xl font-light md:text-4xl">
              {activeCategory ? `${activeCategory.name} articles` : "Current content library"}
            </h2>
          </div>

          {visiblePosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visiblePosts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-[26px] border border-border/70 bg-card p-6 shadow-[0_16px_36px_rgba(24,17,8,0.06)]"
                >
                  <Link to={post.path} className="mb-5 block overflow-hidden rounded-[20px]">
                    <AdaptiveImage
                      src={post.heroImage}
                      alt={post.heroImageAlt}
                      className="aspect-[4/3] w-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  </Link>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/75">
                    {blogCategories.find((category) => category.slug === post.categorySlug)?.name || "Blog"}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-light text-foreground">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{post.metaDescription}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {post.readTime} · Updated {post.updatedAt}
                  </p>
                  <Link
                    to={post.path}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary/80"
                  >
                    Read article
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[26px] border border-border/70 bg-card p-6 text-sm leading-7 text-muted-foreground shadow-[0_16px_36px_rgba(24,17,8,0.06)]">
              {featuredPosts.length > 0
                ? "The remaining articles in this view are already shown above."
                : "No articles are available in this category yet."}
            </div>
          )}
        </div>
      </section>

      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4">
          <ProductRecommendations
            title={activeCategory ? `Products linked to ${activeCategory.name.toLowerCase()} searches` : "Products most closely linked to the blog's top keyword clusters"}
            description={
              activeCategory
                ? "These products map most closely to the concerns covered in this category, helping readers move from education to action."
                : "These are the products most often supported by Queen Koba's educational content around dark spots, hyperpigmentation, glow, and routine building."
            }
            productKeys={productKeys}
          />
        </div>
      </section>

      <section className="pb-10 md:pb-12">
        <div className="container mx-auto px-4">
          <ResourceGrid
            title="Strategic landing pages connected to the blog"
            intro="These pages anchor the main keyword clusters so blog posts can support them instead of competing with them."
            items={homeConcernCards}
          />
        </div>
      </section>

      <section className="pt-4">
        <div className="container mx-auto px-4">
          <div className="rounded-[32px] border border-primary/15 bg-secondary/20 p-8 shadow-[0_20px_46px_rgba(24,17,8,0.06)] md:p-10">
            <p className="text-sm uppercase tracking-[0.28em] text-primary">Content Calendar</p>
            <h2 className="mt-4 font-display text-3xl font-light md:text-4xl">
              Launch calendar for Queen Koba topical authority
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {blogContentCalendar.map((entry) => (
                <Link
                  key={`${entry.month}-${entry.title}`}
                  to={entry.to}
                  className="rounded-[24px] border border-border/70 bg-card px-5 py-5 transition-colors hover:border-primary/20 hover:bg-background"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/75">
                      {entry.month}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                        entry.stage === "Published"
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {entry.stage}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-light text-foreground">{entry.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blog;
