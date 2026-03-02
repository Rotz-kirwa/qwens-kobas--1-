import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Sparkles, Leaf } from "lucide-react";

const WHY_CHOOSE_IMAGE =
  "https://www.dropbox.com/scl/fi/36ono7hig59zzuv33jril/glow.jpeg?rlkey=j8cyb4qi7k8pe8t3y3mses8ed&st=yapqxl2j&raw=1";

const points = [
  {
    icon: ShieldCheck,
    title: "Safe Formulations",
    desc: "No mercury or hydroquinone. Gentle clarity-focused care designed for long-term skin health.",
  },
  {
    icon: Sparkles,
    title: "Visible Glow",
    desc: "Targets dullness, uneven tone, and dark marks to reveal a smooth, radiant complexion.",
  },
  {
    icon: Leaf,
    title: "Kenyan Botanicals",
    desc: "Powered by African ingredients and modern skincare science for premium everyday results.",
  },
];

const WhyChooseUs = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-spacing bg-secondary/35">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center"
        >
          <div className="order-1 relative overflow-hidden rounded-[26px] shadow-[0_20px_54px_rgba(38,28,14,0.18),0_36px_90px_rgba(38,28,14,0.14)]">
            <img
              src={WHY_CHOOSE_IMAGE}
              alt="Why choose Queen Koba skincare glow"
              className="w-full h-full min-h-[320px] md:min-h-[460px] object-cover saturate-[1.08] contrast-[1.05]"
              loading="lazy"
              decoding="async"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/8 to-transparent" />
          </div>

          <div className="order-2">
            <p className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-4">Why Choose Us</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6">
              Glow With <span className="italic text-gold-gradient">Confidence</span>
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed mb-8 max-w-xl">
              Queen Koba blends African heritage ingredients with modern skin science to deliver safer, refined,
              and visibly radiant results for melanin-rich skin.
            </p>

            <div className="space-y-5">
              {points.map((point, i) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, x: 18 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.6 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-11 h-11 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <point.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl leading-none mb-2">{point.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground font-body leading-relaxed">{point.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
