import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, ShieldOff, FlaskConical } from "lucide-react";

const transparencyImage =
  "https://www.dropbox.com/scl/fi/zxgwxymwoevlm0jezfq1t/qpr.jpeg?rlkey=t9n79yhhahzjm85ad98aacdr2&st=wy7fx6g4&raw=1";

const keyIngredients = [
  { name: "Licorice Root", desc: "Curbs excess melanin to help reduce uneven tone and persistent discoloration." },
  { name: "Moringa", desc: "Brightens with antioxidants while supporting a nourished, healthy-looking glow." },
  { name: "Aloe + Liwa", desc: "Aloe soothes while Liwa helps fade spots without compromising comfort." },
  { name: "Qasil", desc: "Purifies the skin gently and helps keep the complexion fresh, clean, and refined." },
  { name: "Snail Mucin + Shea", desc: "Snail mucin plumps while shea hydrates with a richer, more luxurious finish." },
];

const trustBadges = [
  { icon: ShieldCheck, label: "100% Toxin-Free" },
  { icon: ShieldCheck, label: "Handcrafted African Botanicals" },
  { icon: ShieldOff, label: "No Risks" },
  { icon: ShieldOff, label: "No Compromises" },
];

const IngredientsSpotlight = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="ingredients" className="bg-secondary/30 py-12 md:py-14 lg:py-16">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10 text-center md:mb-12"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-4">Full Ingredient Transparency</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            Because Queens Deserve to <span className="italic text-gold-gradient">Know</span>
          </h2>
          <p className="text-muted-foreground font-body mt-4 max-w-3xl mx-auto">
            100% toxin-free · Handcrafted African Botanicals
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.05, duration: 0.7 }}
          className="mb-10 overflow-hidden rounded-sm border border-primary/15 bg-background shadow-[0_24px_60px_rgba(0,0,0,0.08)] md:mb-12"
        >
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex justify-center bg-secondary/20 p-3 md:p-5">
              <img
                src={transparencyImage}
                alt="Queen Koba ingredient transparency"
                className="max-h-[420px] w-auto max-w-full object-contain"
              />
            </div>

            <div className="flex flex-col justify-center p-6 md:p-8">
              <p className="font-body text-sm uppercase tracking-[0.24em] text-primary">
                100% toxin-free · Handcrafted African Botanicals
              </p>
              <p className="mt-4 font-body text-base leading-7 text-foreground">
                Licorice root curbs excess melanin · Moringa brightens with antioxidants.
                Aloe soothes · Liwa fades spots · Qasil purifies · Snail mucin plumps ·
                Shea hydrates luxuriously
              </p>
              <p className="mt-4 font-body text-sm uppercase tracking-[0.24em] text-primary">
                No risks. No compromises.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:mb-12">
          {keyIngredients.map((ing, i) => (
            <motion.div
              key={ing.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
              className="luxury-card p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <FlaskConical className="w-5 h-5 text-primary" />
                <h3 className="font-display text-xl font-semibold">{ing.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{ing.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-2 justify-center gap-3 md:flex md:flex-wrap md:gap-5 lg:gap-8"
        >
          {trustBadges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-3 border border-primary/20 rounded-sm justify-center">
              <Icon className="w-5 h-5 text-primary" />
              <span className="font-body text-xs tracking-widest uppercase">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default IngredientsSpotlight;
