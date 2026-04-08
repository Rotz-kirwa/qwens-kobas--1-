import { Link } from "react-router-dom";
import ProductStore from "@/components/ProductStore";
import SEO from "@/components/SEO";
import KitPopup from "@/components/KitPopup";
import FaqSection from "@/components/seo/FaqSection";
import ProductRecommendations from "@/components/seo/ProductRecommendations";
import ResourceGrid from "@/components/seo/ResourceGrid";
import { homeConcernCards, homeEducationCards } from "@/data/siteSeo";
import { canonicalProductsByKey, catalogOrder } from "@/lib/storefrontCatalog";

const shopProducts = catalogOrder
  .map((key) => canonicalProductsByKey[key])
  .filter((product): product is NonNullable<(typeof canonicalProductsByKey)[typeof catalogOrder[number]]> => Boolean(product));

const shopFaqs = [
  {
    question: "Which Queen Koba product is best for dark spots and hyperpigmentation?",
    answer:
      "The Complexion Clarifying Serum is the most treatment-focused option for visible dark spots and hyperpigmentation, while the full ritual bundle is best for shoppers who want a complete routine that supports consistency.",
  },
  {
    question: "Do I need a full skincare routine or can I start with one product?",
    answer:
      "You can start with one product, especially if you already have part of your routine in place. If you are building from scratch, the Queen Koba bundle makes it easier to cleanse, prep, treat, hydrate, and reset with a weekly mask.",
  },
  {
    question: "Are these skincare products suitable for melanin-rich skin in Kenya?",
    answer:
      "Yes. Queen Koba positions its collection around melanin-rich skin concerns such as uneven tone, dullness, post-acne marks, and dark spots, with Kenya-focused support and delivery guidance.",
  },
  {
    question: "How should I choose between cleanser, toner, serum, cream, and mask?",
    answer:
      "Choose based on the job each step does. Cleanser removes buildup, toner preps, serum treats visible marks, cream helps hydration and barrier support, and the mask works as a weekly reset for dullness and texture.",
  },
] as const;

const shopSelectionPrinciples = [
  {
    title: "Match the product to the concern",
    description:
      "If hyperpigmentation or dark spots are the main issue, the treatment-led serum and full ritual bundle usually deserve the most attention.",
  },
  {
    title: "Build a routine, not a random cart",
    description:
      "A cleanser, prep step, treatment step, and moisturizer create a more complete answer for shoppers who want steady, visible progress.",
  },
  {
    title: "Protect progress with sunscreen",
    description:
      "Even the best brightening skincare products work harder when daily sun protection helps prevent dark marks from looking more persistent.",
  },
];

const Shop = () => {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Queen Koba brightening skincare products",
      url: "https://queenkoba.com/shop",
      description:
        "Shop Queen Koba skincare products in Kenya for hyperpigmentation, dark spots, uneven skin tone, dullness, and glow-focused routines for melanin-rich skin.",
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
          name: "Shop",
          item: "https://queenkoba.com/shop",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Queen Koba skincare collection",
      itemListElement: shopProducts.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://queenkoba.com/shop/${product.catalogKey}`,
        name: product.name,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: shopFaqs.map((faq) => ({
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
    <main className="pt-16 md:pt-[4.5rem]">
      <SEO
        title="Brightening Skincare Products for Dark Spots and Hyperpigmentation"
        description="Shop brightening skincare products in Kenya for hyperpigmentation, dark spots, uneven skin tone, and dull skin. Browse cleanser, toner, serum, cream, mask, and a full skincare kit."
        path="/shop"
        keywords="brightening skincare, hyperpigmentation treatment, dark spots treatment, brightening toner, hyperpigmentation serum, skincare kit for hyperpigmentation, skincare products in Kenya"
        structuredData={structuredData}
      />

      <section className="bg-background pb-8 pt-8 md:pb-10 md:pt-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
            <article className="rounded-[30px] border border-border/70 bg-card p-7 shadow-[0_20px_48px_rgba(24,17,8,0.06)] md:p-10">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Shop Queen Koba</p>
              <h1 className="mt-4 font-display text-4xl font-light leading-tight md:text-6xl">
                Skincare products in Kenya for dark spots, uneven tone, and a clearer glow
              </h1>
              <div className="mt-6 space-y-4 text-sm leading-8 text-muted-foreground md:text-base">
                <p>
                  This collection is built for shoppers who want more than generic beauty products.
                  Queen Koba focuses on brightening skincare for melanin-rich skin, especially where
                  hyperpigmentation, post-acne marks, dullness, and visible uneven tone are the main
                  reason someone is searching.
                </p>
                <p>
                  Instead of forcing visitors to guess, the shop is organized around the real jobs a
                  routine needs to do: cleanse, prep, treat, hydrate, and reset. That makes the page
                  stronger for SEO and easier for customers who are trying to choose the right skincare
                  products without getting overwhelmed.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/shop/new-bundle"
                  className="inline-flex items-center justify-center rounded-full bg-gold-gradient px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Shop the full routine
                </Link>
                <Link
                  to="/hyperpigmentation-treatment"
                  className="inline-flex items-center justify-center rounded-full border border-primary/20 px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/5"
                >
                  Explore treatment guide
                </Link>
              </div>
            </article>

            <aside className="rounded-[30px] border border-primary/15 bg-secondary/20 p-7 shadow-[0_20px_48px_rgba(24,17,8,0.06)] md:p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-primary">Collection Focus</p>
              <div className="mt-5 space-y-4">
                {[
                  "Cleanser, toner, serum, cream, mask, and a full routine bundle",
                  "Positioned around hyperpigmentation, dark spots, dullness, and glow support",
                  "Built for melanin-rich skin with Kenya-focused discovery and checkout",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-primary/12 bg-background/80 px-4 py-4 text-sm leading-7 text-foreground/85"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[24px] bg-card px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-primary/75">Best place to start</p>
                <h2 className="mt-3 font-display text-3xl font-light text-foreground">Choose based on your goal</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Pick a serum if treatment is your priority, a cleanser if you need a gentler daily
                  reset, or the complete ritual if you want the easiest path to routine consistency.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-background py-8 md:py-10">
        <div className="container mx-auto px-4">
          <ProductRecommendations
            title="Start with the highest-intent Queen Koba products"
            description="These pages capture the strongest commercial intent around hyperpigmentation treatment, dark spots skincare, and complete brightening routines."
            productKeys={["new-serum", "new-cleanser", "new-bundle"]}
          />
        </div>
      </section>

      <ProductStore />

      <section className="bg-secondary/20 py-12 md:py-14">
        <div className="container mx-auto px-4">
          <div className="grid gap-5 md:grid-cols-3">
            {shopSelectionPrinciples.map((principle) => (
              <article
                key={principle.title}
                className="rounded-[24px] border border-border/70 bg-card p-6 shadow-[0_16px_36px_rgba(24,17,8,0.06)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/75">
                  Buying tip
                </p>
                <h2 className="mt-3 font-display text-3xl font-light text-foreground">{principle.title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-12 md:py-14">
        <div className="container mx-auto px-4">
          <ResourceGrid
            title="Use Queen Koba's concern guides to choose more confidently"
            intro="These pages help shoppers move from broad search intent into the exact routine or product path that fits their concern."
            items={[...homeConcernCards, ...homeEducationCards].slice(0, 6)}
          />
        </div>
      </section>

      <section className="bg-secondary/20 py-12 md:py-14">
        <div className="container mx-auto px-4">
          <FaqSection
            title="Frequently asked questions about the Queen Koba shop"
            intro="These answers help shoppers narrow the collection faster and reduce hesitation before checkout."
            faqs={[...shopFaqs]}
          />
        </div>
      </section>

      <KitPopup />
    </main>
  );
};

export default Shop;
