import { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdaptiveImage from "@/components/AdaptiveImage";
import { useNetworkQuality } from "@/context/NetworkQualityContext";
import Hero from "@/components/Hero";
import SEO from "@/components/SEO";
import FaqSection from "@/components/seo/FaqSection";
import ProductRecommendations from "@/components/seo/ProductRecommendations";
import ResourceGrid from "@/components/seo/ResourceGrid";
import {
  homeConcernCards,
  homeEducationCards,
  homeFaqs,
  homeHeroTrustPoints,
  homeTrustPillars,
  keywordPageMap,
} from "@/data/siteSeo";
import { canonicalProductsByKey } from "@/lib/storefrontCatalog";

const Testimonials = lazy(() => import("@/components/Testimonials"));
const IngredientsSpotlight = lazy(() => import("@/components/IngredientsSpotlight"));
const HERO_FOLLOWUP_IMAGE = "/images/products/full-product-kit.webp";

const featuredHomeProducts = ["new-serum", "new-cleanser", "new-bundle"]
  .map((key) => canonicalProductsByKey[key])
  .filter((product) => Boolean(product));

const homeRoutineSteps = [
  {
    title: "Cleanse and prep daily",
    description:
      "Start with a cleanser that removes buildup without stripping the barrier, then follow with a toner that helps skin feel fresh and ready for treatment.",
  },
  {
    title: "Treat visible dark spots consistently",
    description:
      "A targeted serum is the step most shoppers need for post-acne marks, uneven tone, and stubborn discoloration, but it works best when the rest of the routine supports it.",
  },
  {
    title: "Hydrate so the barrier stays comfortable",
    description:
      "Brightening routines are easier to maintain when the skin feels calm, nourished, and resilient enough for daily use over time.",
  },
  {
    title: "Protect results with SPF",
    description:
      "Sun exposure can keep hyperpigmentation visible for longer, so sunscreen remains a non-negotiable final step for anyone chasing a clearer, more even-looking tone.",
  },
];

const homeBuyingPrinciples = [
  "Look for products matched to a specific concern such as hyperpigmentation, dark spots, dullness, or dryness.",
  "Choose formulas that feel gentle enough to use consistently instead of relying on harsh brightening shortcuts.",
  "Build a routine that moves in order: cleanse, tone, treat, moisturize, then protect with SPF.",
];

const Home = () => {
  const network = useNetworkQuality();
  const [showSecondarySections, setShowSecondarySections] = useState(network.isFast);

  useEffect(() => {
    if (network.deferNonCriticalMs === 0) {
      setShowSecondarySections(true);
      return;
    }

    setShowSecondarySections(false);
    const timer = window.setTimeout(() => {
      setShowSecondarySections(true);
    }, network.deferNonCriticalMs);

    return () => window.clearTimeout(timer);
  }, [network.deferNonCriticalMs, network.isFast]);

  return (
    <main>
      <SEO
        title="Brightening Skincare for Melanin-Rich Skin in Kenya | Queen Koba"
        description="Queen Koba offers brightening skincare in Kenya for hyperpigmentation, dark spots, and uneven skin tone. Discover toxin-free African botanical skincare made for melanin-rich skin."
        path="/"
        keywords="hyperpigmentation treatment, dark spots treatment, brightening skincare, skincare for melanin skin, natural skincare products, toxin free skincare, African botanical skincare, skincare products in Kenya"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Queen Koba",
            url: "https://queenkoba.com/",
            logo: "https://queenkoba.com/images/local/logo-kbl.jpg",
            description:
              "Premium toxin-free brightening skincare in Kenya for hyperpigmentation, dark spots, and melanin-rich skin.",
            areaServed: {
              "@type": "Country",
              name: "Kenya",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Queen Koba",
            url: "https://queenkoba.com/",
            description:
              "Brightening skincare in Kenya for hyperpigmentation, dark spots, uneven skin tone, and melanin-rich skin.",
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Queen Koba featured skincare products",
            itemListElement: featuredHomeProducts.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `https://queenkoba.com/shop/${product.catalogKey}`,
              name: product.name,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: homeFaqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
        ]}
      />
      <Hero
        eyebrow="Brightening skincare in Kenya"
        title="Premium brightening skincare for melanin-rich skin"
        subtitle="Treat dark spots, hyperpigmentation, dullness, and uneven tone with toxin-free African botanical skincare made for everyday ritual use."
        signature="Made for glow, clarity, and confident skin tone support"
      />

      <section className="bg-background py-5 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl overflow-hidden rounded-sm border border-primary/15 bg-secondary/20 shadow-[0_24px_60px_rgba(0,0,0,0.06)]">
            <div className="grid gap-6 p-4 md:p-6 lg:gap-8 lg:p-8">
              <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:gap-8">
                <div className="flex items-center bg-background/70 p-3 md:p-5">
                  <div className="relative w-full overflow-hidden rounded-sm shadow-[0_18px_40px_rgba(23,16,8,0.08)] aspect-[82/49]">
                    <AdaptiveImage
                      src={HERO_FOLLOWUP_IMAGE}
                      alt="Queen Koba full product kit"
                      className="h-full w-full object-cover object-center"
                      sizes="100vw"
                    />
                  </div>
                </div>
                <div className="max-w-xl text-left">
                  <p className="font-body text-sm uppercase tracking-[0.24em] text-primary">
                    Brightening skincare · Nairobi, Kenya
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-light leading-tight text-foreground md:text-5xl">
                    Built for shoppers looking for <span className="italic text-gold-gradient">clarity</span>,
                    glow, and trustworthy skincare in Kenya
                  </h2>
                </div>
              </div>
              <div className="border-t border-primary/10 pt-6">
                <div className="max-w-4xl text-left">
                  <p className="font-body text-base leading-7 text-foreground md:text-lg">
                    Queen Koba is a premium skincare brand focused on hyperpigmentation treatment,
                    dark spots treatment, natural brightening care, and toxin-free rituals made for
                    melanin-rich skin. Every page should help customers understand what to buy, why
                    it works, and how to build a routine that feels safe enough to continue.
                  </p>
                  <p className="mt-4 font-body text-sm uppercase tracking-[0.24em] text-primary">
                    No mercury. No hydroquinone. No compromises.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to="/shop/new-bundle"
                      className="inline-flex items-center rounded-full bg-gold-gradient px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      Shop The Full Routine
                    </Link>
                    <Link
                      to="/skincare-products-kenya"
                      className="inline-flex items-center rounded-full border border-primary/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-primary transition-colors hover:bg-primary/5"
                    >
                      Explore Kenya Skincare
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-12 md:py-14">
        <div className="container mx-auto px-4">
          <ProductRecommendations
            title="Start with the products that anchor the Queen Koba ritual"
            description="These are the highest-intent products for shoppers searching for hyperpigmentation treatment, dark spots treatment, and complete brightening skincare routines in Kenya."
            productKeys={["new-serum", "new-cleanser", "new-bundle"]}
          />
        </div>
      </section>

      {showSecondarySections ? (
        <Suspense fallback={null}>
          <Testimonials />
          {!network.isSlow && <IngredientsSpotlight />}
        </Suspense>
      ) : (
        <section className="bg-background py-12 md:py-14 lg:py-16">
          <div className="container mx-auto space-y-4 px-4">
            <div className="h-6 w-40 rounded-full bg-secondary/50" />
            <div className="h-12 w-full max-w-2xl rounded-sm bg-secondary/40" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: network.initialProductCount }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-border/70 bg-card p-5 shadow-[0_16px_36px_rgba(23,16,8,0.06)]"
                >
                  <div className="aspect-[4/4.2] w-full rounded-[18px] bg-secondary/35" />
                  <div className="mt-4 h-4 w-20 rounded-full bg-secondary/30" />
                  <div className="mt-4 h-5 w-3/4 rounded-full bg-secondary/40" />
                  <div className="mt-3 h-4 w-full rounded-full bg-secondary/30" />
                  <div className="mt-2 h-4 w-5/6 rounded-full bg-secondary/30" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-background py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <Link
              to="/hyperpigmentation-treatment"
              className="rounded-[24px] border border-primary/15 bg-secondary/20 px-6 py-6 shadow-[0_14px_32px_rgba(24,17,8,0.06)] transition-colors hover:border-primary/25 hover:bg-primary/5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/75">
                Concern Guide
              </p>
              <h2 className="mt-3 font-display text-3xl font-light text-foreground">
                Explore Hyperpigmentation Guide
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Learn how to build a gentler routine for dark spots, uneven tone, and melanin-rich skin.
              </p>
            </Link>

            <div className="rounded-[24px] border border-border/70 bg-card px-6 py-6 shadow-[0_14px_32px_rgba(24,17,8,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/75">
                Queen Koba Trust Signals
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {homeHeroTrustPoints.map((point) => (
                  <span
                    key={point}
                    className="rounded-full border border-primary/18 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-10 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-5 md:grid-cols-3">
            {homeTrustPillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-[24px] border border-border/70 bg-card p-6 shadow-[0_14px_32px_rgba(24,17,8,0.06)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/75">
                  Queen Koba Promise
                </p>
                <h2 className="mt-3 font-display text-3xl font-light text-foreground">{pillar.title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/20 py-12 md:py-14">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
            <article className="rounded-[28px] border border-border/70 bg-card p-6 shadow-[0_18px_44px_rgba(24,17,8,0.06)] md:p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-primary">Routine Strategy</p>
              <h2 className="mt-4 font-display text-4xl font-light md:text-5xl">
                Why a consistent skincare routine matters more than random product switching
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-8 text-muted-foreground md:text-base">
                <p>
                  Healthy, glowing skin usually comes from consistency, not chaos. Shoppers trying to
                  fade dark spots, reduce dullness, and build a more even-looking tone often get better
                  results when they use a simple routine long enough for the skin to respond.
                </p>
                <p>
                  Queen Koba is strongest when it helps people understand that cleanser, toner, serum,
                  moisturizer, and sun protection each do a different job. That education improves SEO,
                  raises trust, and makes it easier for visitors to choose the right product instead of
                  bouncing between conflicting skincare advice.
                </p>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {homeRoutineSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-[22px] border border-primary/15 bg-primary/5 px-5 py-5"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/75">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-light text-foreground">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </article>

            <aside className="rounded-[28px] border border-primary/15 bg-card p-6 shadow-[0_18px_44px_rgba(24,17,8,0.06)] md:p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-primary">Buying Guidance</p>
              <h2 className="mt-4 font-display text-4xl font-light md:text-[2.8rem]">
                What to look for when choosing skincare products in Kenya
              </h2>
              <ul className="mt-6 space-y-4">
                {homeBuyingPrinciples.map((principle) => (
                  <li
                    key={principle}
                    className="rounded-[20px] border border-border/70 bg-background px-5 py-4 text-sm leading-7 text-muted-foreground"
                  >
                    {principle}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-7 text-muted-foreground">
                This lets Queen Koba compete for keywords like skincare products in Kenya, glowing skin
                routine, hyperpigmentation treatment, and dark spots treatment without sounding generic or
                drifting away from the brand's actual value proposition.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-background py-12 md:py-14">
        <div className="container mx-auto px-4">
          <ResourceGrid
            title="Find the right Queen Koba path for your concern"
            intro="Each strategic page targets a specific skincare intent so shoppers can move from search to solution without guesswork."
            items={homeConcernCards}
          />
        </div>
      </section>

      <section className="bg-secondary/20 py-12 md:py-14">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
            <div className="rounded-[28px] border border-border/70 bg-card p-6 shadow-[0_20px_44px_rgba(24,17,8,0.06)] md:p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-primary">Search Authority</p>
              <h2 className="mt-4 font-display text-4xl font-light md:text-5xl">
                A clear content architecture strengthens rankings and conversions
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                Queen Koba now has clearer keyword homes across the homepage, shop, strategic
                landing pages, and educational blog content. That structure helps reduce keyword
                cannibalization while making internal links more intentional.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {keywordPageMap.slice(0, 6).map((entry) => (
                  <Link
                    key={entry.to}
                    to={entry.to}
                    className="rounded-[22px] border border-border/70 bg-background px-5 py-4 transition-colors hover:border-primary/25 hover:bg-primary/5"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/75">
                      {entry.pageType}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-light text-foreground">{entry.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {entry.primaryKeywords.join(", ")}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-primary/15 bg-card p-6 shadow-[0_20px_44px_rgba(24,17,8,0.08)] md:p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-primary">Kenya Relevance</p>
              <h2 className="mt-4 font-display text-4xl font-light md:text-[2.8rem]">
                Local trust matters as much as product quality
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  Searchers in Nairobi and across Kenya want more than polished visuals. They want
                  clear routines, transparent ingredient language, direct support channels, and
                  confidence that the formulas are safe for melanin-rich skin.
                </p>
                <p>
                  Queen Koba becomes more competitive when its homepage, contact page, product
                  pages, and educational content all reinforce Kenya-specific relevance without
                  relying on generic local keyword stuffing.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  "Nairobi support",
                  "Kenya-wide skincare discovery",
                  "WhatsApp guidance",
                  "Problem-led product selection",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-primary/18 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-12 md:py-14">
        <div className="container mx-auto px-4">
          <ResourceGrid
            title="Keep building your skincare knowledge"
            intro="These blog resources support long-tail search visibility while helping shoppers make better routine and product decisions."
            items={homeEducationCards}
          />
        </div>
      </section>

      <section className="bg-secondary/20 py-12 md:py-14">
        <div className="container mx-auto px-4">
          <FaqSection
            title="Frequently asked questions about Queen Koba skincare"
            intro="These FAQs reinforce the site's main themes: brightening skincare, melanin-rich skin, ingredient safety, and Kenya relevance."
            faqs={homeFaqs}
          />
        </div>
      </section>

      <section className="bg-background pb-16 pt-4 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="rounded-[30px] bg-gradient-to-br from-secondary via-background to-accent/35 p-8 text-center shadow-[0_24px_54px_rgba(24,17,8,0.1)] md:p-12">
            <p className="text-sm uppercase tracking-[0.28em] text-primary">Ready To Begin</p>
            <h2 className="mt-4 font-display text-4xl font-light md:text-6xl">
              Shop brightening skincare made for <span className="italic text-gold-gradient">melanin-rich skin</span>
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              Start with the full ritual if you want a complete skincare routine for hyperpigmentation,
              dark spots, glow, and daily barrier-friendly consistency.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/shop/new-bundle"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(77,54,22,0.32)]"
              >
                Shop The Full Ritual
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center rounded-full border border-primary/20 px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/5"
              >
                Read The Blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
