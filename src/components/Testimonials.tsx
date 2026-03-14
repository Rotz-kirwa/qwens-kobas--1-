import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    image: "https://i.pinimg.com/736x/34/62/5b/34625b38a76aa0777f4ec608614daab5.jpg",
    quote:
      "My skin looks brighter, calmer, and more even without feeling stripped or over-processed.",
    name: "Amina N.",
    city: "Nairobi",
    rating: 5,
  },
  {
    image: "https://i.pinimg.com/736x/9f/e1/05/9fe105d789b9a7c387aa54ae15463981.jpg",
    quote:
      "The routine feels luxurious, but what kept me is how safe and steady the results feel.",
    name: "Zawadi K.",
    city: "Mombasa",
    rating: 5,
  },
  {
    image: "https://i.pinimg.com/736x/be/2d/13/be2d13d49b690816ebab388a24fae55d.jpg",
    quote:
      "I finally found products that respect melanin-rich skin instead of fighting against it.",
    name: "Njeri W.",
    city: "Kisumu",
    rating: 5,
  },
  {
    image: "https://i.pinimg.com/1200x/8f/a2/f2/8fa2f239ff3cc07dac525507b6a33fc4.jpg",
    quote:
      "Dark spots softened over time and my skin stayed healthy-looking throughout the process.",
    name: "Halima O.",
    city: "Nakuru",
    rating: 5,
  },
];

const Testimonials = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="reviews" className="bg-background py-12 md:py-14 lg:py-16">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center md:mb-10"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">Customer Reviews</p>
          <h2 className="font-display text-4xl font-light md:text-5xl">
            Real Results. Real <span className="italic text-gold-gradient">Confidence.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground font-body">
            Honest feedback from customers using Queen Koba rituals for clearer, smoother,
            more radiant skin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((item, index) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.08, duration: 0.55 }}
              className="rounded-[24px] border border-border/70 bg-card p-5 shadow-[0_16px_36px_rgba(23,16,8,0.1)]"
            >
              <img
                src={item.image}
                alt={`${item.name} review portrait`}
                className="mb-4 aspect-[4/4.2] w-full rounded-[18px] object-cover object-center sm:aspect-[4/4.8]"
                loading="lazy"
              />
              <div className="mb-4 flex gap-1">
                {Array.from({ length: item.rating }).map((_, starIndex) => (
                  <Star key={starIndex} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-4 font-display text-lg italic leading-relaxed">"{item.quote}"</p>
              <p className="text-sm font-semibold text-foreground">{item.name}</p>
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {item.city}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
