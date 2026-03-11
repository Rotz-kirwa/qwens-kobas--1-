import { Suspense, lazy } from "react";
import Hero from "@/components/Hero";
import SEO from "@/components/SEO";

const Testimonials = lazy(() => import("@/components/Testimonials"));
const IngredientsSpotlight = lazy(() => import("@/components/IngredientsSpotlight"));
const HERO_FOLLOWUP_IMAGE =
  "https://www.dropbox.com/scl/fi/jpdncaq9lkmtnhxz3xbli/new.jpeg?rlkey=y6gg1oiji39i52ve9avevqplh&st=zuyfr36d&raw=1";

const Home = () => {
  return (
    <main>
      <SEO
        title="Premium Kenyan Skincare for Melanin-Rich Skin"
        description="Shop Queen Koba skincare for melanin-rich skin: toxin-free cleansers, toners, serums, masks, creams, and full routines crafted in Kenya."
        path="/"
        keywords="Queen Koba, Kenyan skincare, melanin rich skin, brightening skincare, toxin-free skincare, African botanicals"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Queen Koba",
          url: "https://queenkoba.com/",
          description:
            "Premium Kenyan skincare for melanin-rich skin with toxin-free formulas and African botanicals.",
        }}
      />
      <Hero />
      <section className="bg-background py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid max-w-5xl items-center gap-6 overflow-hidden rounded-sm border border-primary/15 bg-secondary/20 shadow-[0_24px_60px_rgba(0,0,0,0.06)] md:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
            <div className="flex justify-start bg-background/70 p-4 md:p-6">
              <img
                src={HERO_FOLLOWUP_IMAGE}
                alt="Queen Koba Eternal Radiance"
                className="w-full max-w-sm rounded-sm object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="max-w-2xl p-6 text-left md:p-10">
              <p className="font-body text-sm uppercase tracking-[0.24em] text-primary">
                100% toxin-free · Handcrafted African Botanicals
              </p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight text-foreground md:text-5xl">
                Explore The <span className="italic text-gold-gradient">Full Ritual</span>
              </h2>
              <p className="mt-5 font-body text-base leading-8 text-foreground md:text-lg">
                Explore our complete skincare lineup, mask, toner, serum, cream, and cleanser,
                carefully curated to work together for healthier, glowing skin. Get them
                individually or choose the full product kit for the best experience.
              </p>
              <p className="mt-5 font-body text-sm uppercase tracking-[0.24em] text-primary">
                No risks. No compromises.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Suspense fallback={null}>
        <Testimonials />
        <IngredientsSpotlight />
      </Suspense>
    </main>
  );
};

export default Home;
