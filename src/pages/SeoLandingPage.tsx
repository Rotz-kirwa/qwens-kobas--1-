import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import SEO from "@/components/SEO";
import FaqSection from "@/components/seo/FaqSection";
import ProductRecommendations from "@/components/seo/ProductRecommendations";
import ResourceGrid from "@/components/seo/ResourceGrid";
import { findBlogPostsBySlugs, landingPagesBySlug, type LinkCard } from "@/data/siteSeo";

interface SeoLandingPageProps {
  slug: string;
}

const SeoLandingPage = ({ slug }: SeoLandingPageProps) => {
  const page = landingPagesBySlug[slug];

  if (!page) {
    return (
      <main className="min-h-screen bg-background pb-16 pt-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl text-foreground">Page not found</h1>
          <p className="mt-4 text-muted-foreground">
            The SEO landing page you requested is unavailable right now.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground"
          >
            Return home
          </Link>
        </div>
      </main>
    );
  }

  const relatedArticles = findBlogPostsBySlugs(page.relatedArticleSlugs).map<LinkCard>((post) => ({
    eyebrow: "Blog Guide",
    title: post.title,
    description: post.excerpt,
    to: post.path,
    ctaLabel: "Read article",
  }));

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      url: `https://queenkoba.com${page.path}`,
      description: page.metaDescription,
      keywords: page.keywords.join(", "),
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
          name: page.heroTitle,
          item: `https://queenkoba.com${page.path}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
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
        title={page.title}
        description={page.metaDescription}
        path={page.path}
        keywords={page.keywords.join(", ")}
        structuredData={structuredData}
      />

      <section className="pb-10">
        <div className="container mx-auto px-4">
          <div className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-primary/75">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>{page.heroEyebrow}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
            <div className="rounded-[32px] border border-border/70 bg-card p-7 shadow-[0_22px_54px_rgba(24,17,8,0.07)] md:p-10">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">{page.heroEyebrow}</p>
              <h1 className="mt-4 font-display text-4xl font-light leading-tight md:text-6xl">
                {page.heroTitle}
              </h1>
              <p className="mt-6 max-w-3xl text-sm leading-8 text-muted-foreground md:text-lg">
                {page.heroIntro}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {page.keywords.slice(0, 4).map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={page.ctaPrimaryTo}
                  className="inline-flex items-center justify-center rounded-full bg-gold-gradient px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {page.ctaPrimaryLabel}
                </Link>
                <Link
                  to={page.ctaSecondaryTo}
                  className="inline-flex items-center justify-center rounded-full border border-primary/20 px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/5"
                >
                  {page.ctaSecondaryLabel}
                </Link>
              </div>
            </div>

            <aside className="rounded-[32px] border border-primary/15 bg-secondary/20 p-7 shadow-[0_18px_44px_rgba(24,17,8,0.06)] md:p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-primary">What this page covers</p>
              <div className="mt-5 space-y-4">
                {page.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-start gap-3 rounded-2xl bg-background/75 px-4 py-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                    <span className="text-sm leading-7 text-foreground/85">{highlight}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10">
        <div className="container mx-auto space-y-8 px-4 md:space-y-10">
          {page.sections.map((section) => (
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
              {section.note ? <p className="mt-6 text-sm italic text-primary/80">{section.note}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="py-10 md:py-12">
        <div className="container mx-auto space-y-12 px-4">
          <ProductRecommendations
            title="Products that fit this concern"
            description="Move from education into action with the Queen Koba products most closely aligned to this search intent."
            productKeys={page.relatedProductKeys}
          />
          <ResourceGrid
            title="Related guides and landing pages"
            intro="These internal links help shoppers continue learning while also strengthening the site's topical authority."
            items={[...page.relatedPageLinks, ...relatedArticles]}
          />
          <FaqSection
            title={`FAQs about ${page.heroEyebrow.toLowerCase()}`}
            intro="Use these answers to remove common doubts before a shopper chooses a routine or product."
            faqs={page.faqs}
          />
        </div>
      </section>

      <section className="pt-4">
        <div className="container mx-auto px-4">
          <div className="rounded-[32px] bg-gradient-to-br from-secondary via-background to-accent/35 p-8 shadow-[0_22px_54px_rgba(24,17,8,0.08)] md:p-12">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.28em] text-primary">Next Step</p>
              <h2 className="mt-4 font-display text-4xl font-light md:text-5xl">{page.ctaTitle}</h2>
              <p className="mt-5 text-sm leading-8 text-muted-foreground md:text-base">{page.ctaBody}</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={page.ctaPrimaryTo}
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(77,54,22,0.32)]"
              >
                {page.ctaPrimaryLabel}
              </Link>
              <Link
                to={page.ctaSecondaryTo}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/5"
              >
                {page.ctaSecondaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SeoLandingPage;
