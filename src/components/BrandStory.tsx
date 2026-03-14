import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Leaf, FlaskConical } from "lucide-react";

const STORY_PROBLEM_IMAGE =
  "https://www.dropbox.com/scl/fi/gg49jldng153nu47ksstw/picofthegals-1.png?rlkey=3atcpufhut8ime40hxt7zvb3n&st=xf8iytyi&raw=1";

const BrandStory = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const issues = [
    { title: "Hyperpigmentation", desc: "Excess melanin production causing dark patches and uneven complexion." },
    { title: "Uneven Tone", desc: "Sun damage and inflammation creating inconsistent skin coloring." },
    { title: "Dark Spots", desc: "Post-inflammatory marks that linger after breakouts or irritation." },
    { title: "Toxic Creams", desc: "Mercury & hydroquinone products causing irreversible skin and organ damage." },
  ];

  return (
    <section id="story" className="section-spacing bg-secondary/30">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <p className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-primary">
                The Problem
              </p>
              <h2 className="mb-6 font-display text-4xl font-light md:text-5xl lg:text-6xl">
                Your Melanin Deserves <span className="italic text-gold-gradient">Better</span>
              </h2>
              <p className="max-w-xl font-body leading-relaxed text-muted-foreground">
                Millions of women risk their health with dangerous bleaching creams.
                Queen Koba is the safe complexion-clarifying revolution, inspired by
                African queens, crafted proudly in Kenya.
              </p>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-primary/15 bg-background shadow-[0_24px_60px_rgba(24,17,8,0.12)]">
              <img
                src={STORY_PROBLEM_IMAGE}
                alt="Women represented in Queen Koba's story"
                className="block aspect-[4/3] w-full object-cover object-center sm:aspect-[16/11]"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {issues.map((issue, i) => (
            <motion.div
              key={issue.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              className="luxury-card text-center"
            >
              <h3 className="font-display text-xl font-semibold text-primary mb-3">{issue.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{issue.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { icon: ShieldCheck, label: "Safe & Certified" },
            { icon: Leaf, label: "African Botanicals" },
            { icon: FlaskConical, label: "Science-Backed" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-foreground">
              <Icon className="w-6 h-6 text-primary" />
              <span className="font-body text-sm tracking-wide uppercase">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStory;
