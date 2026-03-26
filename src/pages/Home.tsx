import { Suspense, lazy, useEffect, useState } from "react";
import AdaptiveImage from "@/components/AdaptiveImage";
import { useNetworkQuality } from "@/context/NetworkQualityContext";
import Hero from "@/components/Hero";
import SEO from "@/components/SEO";
import { useSiteContent } from "@/hooks/use-site-content";

const Testimonials = lazy(() => import("@/components/Testimonials"));
const IngredientsSpotlight = lazy(() => import("@/components/IngredientsSpotlight"));
const HERO_FOLLOWUP_IMAGE =
  "https://www.dropbox.com/scl/fi/xbfgwzkqvfqe2hhybwwhp/er.png?rlkey=jovtvo8ux3daj3m7h2pkkie3c&st=1jb5ihyj&raw=1";

const Home = () => {
  const { content } = useSiteContent();
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
      <section className="bg-background py-5 md:py-8">
        <div className="container mx-auto px-4">
          <div className="grid max-w-5xl items-center gap-4 overflow-hidden rounded-sm border border-primary/15 bg-secondary/20 shadow-[0_24px_60px_rgba(0,0,0,0.06)] md:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
            <div className="flex justify-start bg-background/70 p-3 md:p-5">
              <AdaptiveImage
                src={HERO_FOLLOWUP_IMAGE}
                alt="Queen Koba Eternal Radiance"
                className="h-auto w-full rounded-sm object-cover sm:max-w-sm"
                sizes="(max-width: 768px) 100vw, 24rem"
              />
            </div>
            <div className="max-w-2xl p-5 text-left md:p-8">
              <p className="font-body text-sm uppercase tracking-[0.24em] text-primary">
                100% toxin-free · Handcrafted African Botanicals
              </p>
              <h2 className="mt-3 font-display text-3xl font-light leading-tight text-foreground md:text-5xl">
                {content.about_title.split(" ").slice(0, -1).join(" ") || "Explore The"}{" "}
                <span className="italic text-gold-gradient">
                  {content.about_title.split(" ").slice(-1).join(" ") || "Full Ritual"}
                </span>
              </h2>
              <p className="mt-4 font-body text-base leading-7 text-foreground md:text-lg">
                {content.about_description}
              </p>
              <p className="mt-4 font-body text-sm uppercase tracking-[0.24em] text-primary">
                No risks. No compromises.
              </p>
            </div>
          </div>
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
    </main>
  );
};

export default Home;
