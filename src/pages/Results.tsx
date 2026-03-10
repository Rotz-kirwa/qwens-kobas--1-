import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3, FlaskConical, Leaf, ShieldCheck, Star } from "lucide-react";

const RESULTS_HERO_IMAGE =
  "https://www.dropbox.com/scl/fi/x1nk08f8gru7n1o699jme/tp1.jpeg?rlkey=djry321laqjq65hydowsglee3&st=c260vvht&raw=1";
const RESULTS_SUPPORT_IMAGE =
  "https://www.dropbox.com/scl/fi/rbkbdc750xw1drznche0a/rs1.jpeg?rlkey=fhgchugyidb4sg55tjdnvmir9&st=fn5nc2gk&raw=1";
const RESULTS_SUPPORT_IMAGE_2 =
  "https://www.dropbox.com/scl/fi/rrwlx88xncctp68mf7qs1/d1.jpeg?rlkey=tsfeliz4u80qh7umv9zr16o59&st=kahhk9sl&raw=1";
const RESULTS_CASE_IMAGE =
  "https://www.dropbox.com/scl/fi/7yrskjjpwt8epsz2cnl5u/w123.jpeg?rlkey=l7deiwnknzw6zrqz3l6bda7mx&st=mv2h6m9o&raw=1";

const glowMetrics = [
  {
    icon: Clock3,
    title: "Visible in 2-4 Weeks",
    detail: "Consistent ritual use reveals noticeable tone and texture refinement.",
  },
  {
    icon: FlaskConical,
    title: "Dermatologically Tested",
    detail: "Balanced active blends designed for melanin-rich skin resilience.",
  },
  {
    icon: ShieldCheck,
    title: "Toxin-Free Formula",
    detail: "No mercury, no hydroquinone, and no shortcuts in safety standards.",
  },
  {
    icon: Leaf,
    title: "Kenyan Botanicals",
    detail: "Locally inspired ingredients with clean, modern formulation science.",
  },
];

const testimonials = [
  {
    image: "https://i.pinimg.com/736x/34/62/5b/34625b38a76aa0777f4ec608614daab5.jpg",
    quote: "Queen Koba didn't change my skin — it restored it.",
    name: "Amina N.",
    city: "Nairobi",
    rating: 5,
  },
  {
    image: "https://i.pinimg.com/736x/9f/e1/05/9fe105d789b9a7c387aa54ae15463981.jpg",
    quote: "My complexion is brighter, smoother, and still completely me.",
    name: "Zawadi K.",
    city: "Mombasa",
    rating: 5,
  },
  {
    image: "https://i.pinimg.com/736x/be/2d/13/be2d13d49b690816ebab388a24fae55d.jpg",
    quote: "I finally trust my routine. It feels elegant, safe, and effective.",
    name: "Njeri W.",
    city: "Kisumu",
    rating: 5,
  },
  {
    image: "https://i.pinimg.com/1200x/8f/a2/f2/8fa2f239ff3cc07dac525507b6a33fc4.jpg",
    quote: "Every week my skin looked calmer and more even. That's real confidence.",
    name: "Halima O.",
    city: "Nakuru",
    rating: 5,
  },
];

const Results = () => {
  return (
    <main className="pt-20">
      <section className="relative overflow-hidden">
        <img
          src={RESULTS_HERO_IMAGE}
          alt="Queen Koba results hero"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/38 via-black/24 to-black/46" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-[90px]" />
        <div className="container mx-auto px-4 py-16 md:py-22">
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.32em] text-primary">Results</p>
            <h1 className="mb-5 font-display text-5xl font-light leading-[0.95] md:text-7xl">
              <span className="text-gold-gradient">Real Results.</span>{" "}
              <span className="italic text-gold-gradient">Regal Radiance.</span>
            </h1>
            <p className="mx-auto mb-7 max-w-2xl text-base leading-relaxed text-white md:text-lg">
              Safe transformation for melanin-rich skin, powered by Kenyan botanicals and precision skincare science.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center rounded-full bg-gold-gradient px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_14px_36px_rgba(95,67,27,0.28)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Shop the Glow
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">Before & After</p>
            <h2 className="font-display text-4xl font-light md:text-5xl">
              Transformation With <span className="italic text-gold-gradient">Integrity</span>
            </h2>
          </div>

          <div className="space-y-5">
            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
              <motion.article
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-[26px] border border-border/70 bg-card shadow-[0_18px_45px_rgba(24,17,8,0.12)]"
              >
                <img
                  src={RESULTS_SUPPORT_IMAGE}
                  alt="Queen Koba additional results"
                  className="block w-full h-auto"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-5 py-6 md:px-7 md:py-8">
                  <p className="max-w-3xl font-body text-sm leading-6 text-white md:text-base">
                    Discover how Queen Koba is transforming melanin-rich skin worldwide:
                    Faded dark spots, even tone, luminous radiance - all toxin-free.
                    These are real queens like you, seeing results in weeks. Your glow-up awaits.
                  </p>
                </div>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: 0.08, duration: 0.5 }}
                className="relative overflow-hidden rounded-[26px] border border-border/70 bg-card shadow-[0_18px_45px_rgba(24,17,8,0.12)]"
              >
                <img
                  src={RESULTS_SUPPORT_IMAGE_2}
                  alt="Queen Koba additional skincare result"
                  className="block w-full h-auto"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-5 py-6 md:px-7 md:py-7">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                        Aisha, 28, Medium Brown Skin
                      </p>
                      <p className="mt-2 font-body text-sm leading-6 text-white">
                        "After 4 weeks with the Serum & Mask, my dark spots faded 60-70%, tone
                        evened beautifully - skin feels alive and confident! No irritation, just glow."
                      </p>
                      <p className="mt-2 text-xs font-body uppercase tracking-[0.18em] text-primary">
                        5 ★ | Verified Purchase | Before/After Slider
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                        Nia, 35, Deep Tone
                      </p>
                      <p className="mt-2 font-body text-sm leading-6 text-white">
                        "Switched from toxic creams - Queen Koba Toner & Cream gave me visible brightness
                        and evenness in 5 weeks. Luxurious, safe, and life-changing."
                      </p>
                      <p className="mt-2 text-xs font-body uppercase tracking-[0.18em] text-primary">
                        5 ★ | Best for Hyperpigmentation
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>
            </div>

            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.08, duration: 0.5 }}
              className="relative overflow-hidden rounded-[26px] border border-border/70 bg-card shadow-[0_18px_45px_rgba(24,17,8,0.12)]"
            >
              <img
                src={RESULTS_CASE_IMAGE}
                alt="Queen Koba visible results"
                className="block w-full h-auto"
              />
            </motion.article>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-secondary/35">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">The Glow Metrics</p>
            <h2 className="font-display text-4xl font-light md:text-5xl">
              Proof in Every <span className="italic text-gold-gradient">Ritual</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {glowMetrics.map((metric) => (
              <article
                key={metric.title}
                className="rounded-[24px] border border-border/80 bg-card p-6 shadow-[0_14px_34px_rgba(24,17,8,0.1)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/12">
                  <metric.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-2xl">{metric.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{metric.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">Testimonials</p>
            <h2 className="font-display text-4xl font-light md:text-5xl">
              Voices of <span className="italic text-gold-gradient">Confidence</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {testimonials.map((item) => (
              <article key={item.name} className="rounded-[24px] bg-card p-5 shadow-[0_16px_36px_rgba(23,16,8,0.1)]">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="mb-4 h-52 w-full rounded-[18px] object-cover"
                  />
                )}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-4 font-display text-lg italic leading-relaxed">"{item.quote}"</p>
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{item.city}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-secondary/40">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-[28px] border border-border/70 bg-card/85 p-7 shadow-[0_20px_48px_rgba(24,17,8,0.12)] md:p-10">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">The Queen Koba Difference</p>
            <h2 className="mb-8 font-display text-4xl font-light md:text-5xl">
              Premium, Ethical, <span className="italic text-gold-gradient">Proven</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                "No mercury. Ever.",
                "No hydroquinone.",
                "Science-backed botanicals.",
                "Ethical and clean beauty standards.",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-background/75 px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-[30px] bg-gradient-to-br from-secondary via-background to-accent/35 p-8 text-center shadow-[0_24px_58px_rgba(24,17,8,0.13)] md:p-12">
            <h2 className="mb-5 font-display text-4xl font-light md:text-6xl">
              Your Glow Is Not a Trend. <span className="italic text-gold-gradient">It's Your Crown.</span>
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Begin a ritual rooted in confidence, clarity, and care made for melanin-rich skin.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center rounded-full bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(77,54,22,0.32)]"
            >
              Start Your Ritual
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Results;
