import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3, FlaskConical, Leaf, ShieldCheck, Star } from "lucide-react";

const RESULTS_HERO_IMAGE =
  "https://www.dropbox.com/scl/fi/x1nk08f8gru7n1o699jme/tp1.jpeg?rlkey=djry321laqjq65hydowsglee3&st=c260vvht&raw=1";
const RESULTS_CASE_IMAGE =
  "https://www.dropbox.com/scl/fi/7yrskjjpwt8epsz2cnl5u/w123.jpeg?rlkey=l7deiwnknzw6zrqz3l6bda7mx&st=mv2h6m9o&raw=1";
const RESULTS_ADDITIONAL_IMAGES = [
  "https://www.dropbox.com/scl/fi/3vxqlipo8r4o6u9gw15ja/v11.jpeg?rlkey=tif06a4cuhgjzcj5i20z1lal3&st=372ni6oq&raw=1",
  "https://www.dropbox.com/scl/fi/vweya80nidj1ro5fxdyt9/v10.jpeg?rlkey=c40qzif955kw6cl3zqu78fjzs&st=pusfg76u&raw=1",
];

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
    quote: "Queen Koba didn't change my skin — it restored it.",
    name: "Amina N.",
    city: "Nairobi",
    rating: 5,
  },
  {
    quote: "My complexion is brighter, smoother, and still completely me.",
    name: "Zawadi K.",
    city: "Mombasa",
    rating: 5,
  },
  {
    quote: "I finally trust my routine. It feels elegant, safe, and effective.",
    name: "Njeri W.",
    city: "Kisumu",
    rating: 5,
  },
  {
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
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.32em] text-primary">Results</p>
            <h1 className="mb-5 font-display text-5xl font-light leading-[0.95] md:text-7xl">
              <span className="text-gold-gradient">Real Results.</span>{" "}
              <span className="italic text-gold-gradient">Regal Radiance.</span>
            </h1>
            <p className="mx-auto mb-9 max-w-2xl text-base leading-relaxed text-white md:text-lg">
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

      <section className="section-spacing">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">Before & After</p>
            <h2 className="font-display text-4xl font-light md:text-5xl">
              Transformation With <span className="italic text-gold-gradient">Integrity</span>
            </h2>
          </div>

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl overflow-hidden rounded-[26px] border border-border/70 bg-card shadow-[0_18px_45px_rgba(24,17,8,0.12)]"
          >
            <img src={RESULTS_CASE_IMAGE} alt="Queen Koba visible results" className="w-full h-auto object-cover" />
          </motion.article>

          <div className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-4">
            {RESULTS_ADDITIONAL_IMAGES.map((image, index) => (
              <article
                key={`${image}-${index}`}
                className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_10px_26px_rgba(24,17,8,0.1)]"
              >
                <img
                  src={image}
                  alt={`Queen Koba before and after result ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-secondary/35">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">The Glow Metrics</p>
            <h2 className="font-display text-4xl font-light md:text-5xl">
              Proof in Every <span className="italic text-gold-gradient">Ritual</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {glowMetrics.map((metric) => (
              <article
                key={metric.title}
                className="rounded-[24px] border border-border/80 bg-card p-7 shadow-[0_14px_34px_rgba(24,17,8,0.1)]"
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

      <section className="section-spacing">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">Testimonials</p>
            <h2 className="font-display text-4xl font-light md:text-5xl">
              Voices of <span className="italic text-gold-gradient">Confidence</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {testimonials.map((item) => (
              <article key={item.name} className="rounded-[24px] bg-card p-7 shadow-[0_16px_36px_rgba(23,16,8,0.1)]">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-5 font-display text-xl italic leading-relaxed">"{item.quote}"</p>
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{item.city}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-secondary/40">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-[28px] border border-border/70 bg-card/85 p-8 shadow-[0_20px_48px_rgba(24,17,8,0.12)] md:p-12">
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

      <section className="section-spacing">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-[30px] bg-gradient-to-br from-secondary via-background to-accent/35 p-10 text-center shadow-[0_24px_58px_rgba(24,17,8,0.13)] md:p-14">
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
