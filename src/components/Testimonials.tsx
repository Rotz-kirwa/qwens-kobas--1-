import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

const TESTIMONIAL_IMAGE =
  "https://www.dropbox.com/scl/fi/fzpslkoquqh0nno3jcgy2/testimonial.jpeg?rlkey=jfu9vuduexkn3biu4ikmrusnr&st=yljnrpd1&raw=1";

const Testimonials = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="reviews" className="section-spacing">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-4">Royal Reviews</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mb-4">
            Loved by <span className="italic text-gold-gradient">Queens</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-primary fill-primary" />
              ))}
            </div>
            <span className="font-body text-sm text-muted-foreground">4.8/5 from 1M+ Queens Worldwide</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="w-full overflow-hidden"
      >
        <img
          src={TESTIMONIAL_IMAGE}
          alt="Customer testimonials"
          className="w-full h-auto object-contain"
          loading="lazy"
          decoding="async"
        />
      </motion.div>
    </section>
  );
};

export default Testimonials;
