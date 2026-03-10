import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Sparkles, Droplets } from "lucide-react";
import BrandStory from "@/components/BrandStory";

const STORY_HERO_VIDEO =
  "/queenkoba-story-hero.mp4";
const STORY_HERO_POSTER =
  "https://www.dropbox.com/scl/fi/6k0kxjlofssv1qj8o9ddh/story.jpeg?rlkey=u67x7bkz6yy7gvsesljcv7oiw&st=3oto1u1d&raw=1";
const STORY_TRUST_IMAGE =
  "https://www.dropbox.com/scl/fi/otsqggich7pprbsxgr8dm/tf.jpeg?rlkey=npcjiid7k8m57dfdvd4r7r7cd&st=ok99bzbi&raw=1";
const STORY_BADGES = [
  {
    title: "Melanin-Honoring Formulas",
    image:
      "https://www.dropbox.com/scl/fi/9m6pelk20xy4z1w3hzi01/mh.jpeg?rlkey=flezqw5z0vnhfp47ms7mm5ozi&st=bdnr1igg&raw=1",
  },
  {
    title: "Cruelty-Free & Sustainable",
    image: STORY_TRUST_IMAGE,
  },
  {
    title: "Dermatologist-Inspired Safety",
    image:
      "https://www.dropbox.com/scl/fi/xp4pg3fl6i9zks0caeok2/ds.jpeg?rlkey=q5m8c72ktnz4of9yhpwde2g5h&st=xwezzobc&raw=1",
  },
];

const Story = () => {
  return (
    <main className="pt-20">
      <section className="relative min-h-[72vh] overflow-hidden border-b border-border/60 bg-black">
        <video
          key={STORY_HERO_VIDEO}
          className="absolute inset-0 h-full w-full object-cover"
          src={STORY_HERO_VIDEO}
          poster={STORY_HERO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls
        >
          <source src={STORY_HERO_VIDEO} type="video/mp4" />
          Your browser does not support the story video.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/55" />

        <div className="container relative mx-auto flex min-h-[72vh] items-center px-4 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <p className="text-sm uppercase tracking-[0.32em] text-primary">Our Story</p>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border/50 bg-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="mb-4 font-display text-4xl font-light md:text-5xl">
              Rooted in <span className="italic text-gold-gradient">African Ritual</span>
            </h2>
            <p className="text-base leading-7 text-foreground/80 md:text-lg">
              Queen Koba began with one clear belief: melanin-rich skin deserves safe,
              elegant skincare without toxins, shortcuts, or compromise.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border/50 bg-secondary/20 py-14 md:py-18">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-6">
              <p className="max-w-4xl text-base leading-8 text-foreground/85 md:text-lg">
                For too long, hyperpigmentation, uneven tone, and dullness have been met with toxic
                “lighteners” that irritate, scar, or harm long-term.
              </p>
              <p className="max-w-4xl text-base leading-8 text-foreground/85 md:text-lg">
                We created a different path: luxurious, 100% toxin-free formulas powered by the most
                potent African Botanicals - designed to gently fade dark spots, even tone, and reveal
                up to 2 shades brighter, more luminous skin - without ever compromising safety or your
                natural beauty.
              </p>

              <div className="rounded-[28px] border border-primary/15 bg-background/80 p-7 shadow-[0_20px_50px_rgba(24,17,8,0.08)]">
                <p className="mb-3 text-sm uppercase tracking-[0.28em] text-primary">
                  Core Brand Mission
                </p>
                <h3 className="mb-4 font-display text-3xl font-light md:text-4xl">
                  This is not just <span className="italic text-gold-gradient">skincare.</span>
                </h3>
                <p className="mb-4 text-base leading-8 text-foreground/85">
                  It’s a celebration of your skin’s inherent strength.
                </p>
                <p className="mb-4 text-base leading-8 text-foreground/85">
                  A tribute to the timeless wisdom of African nature - licorice root to elegantly balance
                  melanin, moringa for antioxidant brightness, aloe for soothing calm, liwa for spot clarity,
                  qasil for gentle renewal, snail mucin for plump vitality, shea for sumptuous hydration.
                </p>
                <p className="text-base leading-8 text-foreground/85">
                  Every jar, bottle, and drop is handcrafted with intention.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  "100% free of mercury, hydroquinone, steroids, and all banned toxins",
                  "Sustainably sourced from African roots",
                  "Gentle brightening that works with your melanin, never against it",
                  "Results that unfold naturally over time - because real radiance is earned, not forced",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-border/70 bg-background px-5 py-4 text-sm leading-7 text-foreground/80 shadow-[0_10px_24px_rgba(24,17,8,0.06)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-[28px] border border-primary/15 bg-background shadow-[0_24px_60px_rgba(24,17,8,0.12)]">
                <img
                  src={STORY_TRUST_IMAGE}
                  alt="Queen Koba trust and toxin-free promise"
                  className="block w-full h-auto object-cover"
                />
              </div>

              <div className="rounded-[28px] border border-primary/15 bg-background p-7 shadow-[0_20px_50px_rgba(24,17,8,0.08)]">
                <p className="mb-5 text-sm uppercase tracking-[0.28em] text-primary">
                  Our Promise
                </p>
                <div className="space-y-4">
                  {[
                    { icon: ShieldCheck, label: "100% Toxin-Free" },
                    { icon: Leaf, label: "African Botanicals" },
                    { icon: Sparkles, label: "Gentle Brightening" },
                    { icon: Droplets, label: "Safety First" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 rounded-2xl bg-secondary/25 px-4 py-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium uppercase tracking-[0.18em] text-foreground/80">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/50 bg-background py-14 md:py-18">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">Brand Badges</p>
            <h2 className="font-display text-4xl font-light md:text-5xl">
              Values Woven Into Every <span className="italic text-gold-gradient">Formula</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {STORY_BADGES.map((badge) => (
              <article
                key={badge.title}
                className="overflow-hidden rounded-[28px] border border-primary/15 bg-card shadow-[0_20px_50px_rgba(24,17,8,0.08)]"
              >
                <img
                  src={badge.image}
                  alt={badge.title}
                  className="block h-72 w-full object-cover"
                />
                <div className="p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-primary">Badge</p>
                  <h3 className="mt-3 font-display text-2xl font-light">{badge.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BrandStory />
    </main>
  );
};

export default Story;
