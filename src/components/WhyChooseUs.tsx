import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const WHY_CHOOSE_IMAGES = [
  {
    src: "/images/local/why-radiance.jpeg",
    alt: "Radiance skincare result",
  },
  {
    src: "/images/local/why-naturally.jpeg",
    alt: "Naturally bright skincare result",
  },
  {
    src: "/images/local/why-glow.jpeg",
    alt: "Healthy glow skincare result",
  },
  {
    src: "/images/local/why-brighten.jpeg",
    alt: "Brightened complexion result",
  },
];

const WhyChooseUs = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-10 md:py-14 bg-secondary/35">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 gap-6 md:gap-8 items-start"
        >
          <div className="order-1">
            <p className="font-display text-2xl md:text-3xl font-bold tracking-[0.12em] uppercase text-primary mb-3">
              Why Choose Us
            </p>
            <div className="grid grid-cols-2 gap-3">
            {WHY_CHOOSE_IMAGES.map((image, index) => (
              <motion.div
                key={image.src}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.55 }}
                className="relative overflow-hidden rounded-2xl shadow-[0_14px_30px_rgba(38,28,14,0.14)]"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full min-h-[145px] md:min-h-[190px] object-cover"
                  loading={index < 2 ? "eager" : "lazy"}
                  fetchpriority={index < 2 ? "high" : "low"}
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </motion.div>
            ))}
            </div>
          </div>

          <div className="order-2">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-3 text-[#194d2f]">
              Dark Spots &amp; Uneven Tone Stealing Your Glow?
            </h2>
            <h3 className="font-display text-xl md:text-2xl leading-snug mb-3 text-[#194d2f]">
              Naturally Brighten Up to 2 Shades - Toxin-Free, Melanin-Safe Luxury
            </h3>
            <p className="font-display italic text-lg md:text-xl text-primary mb-3">
              Queen Koba: Eternal Radiance, Naturally You
            </p>
            <p className="text-muted-foreground font-body leading-relaxed max-w-xl whitespace-pre-line">
              {"You know the frustration:\nStubborn dark spots, dullness, hyperpigmentation that won't budge."}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
