import { motion } from "framer-motion";

const HERO_IMAGE =
  "https://www.dropbox.com/scl/fi/dlm8mxurz33lyfahdig88/bg.png?rlkey=uazruv0hawvwkwjxtsmacpmo1&st=4qjh0r3d&raw=1";

const Hero = () => {
  return (
    <section className="relative min-h-[92vh] md:min-h-[108vh] lg:min-h-[120vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <picture className="w-full h-full">
          <source
            media="(min-width: 1024px)"
            srcSet={HERO_IMAGE}
            type="image/png"
          />
          <source
            media="(max-width: 1023px)"
            srcSet={HERO_IMAGE}
            type="image/png"
          />
          <motion.img
            src={HERO_IMAGE}
            alt="Queen Koba - radiant melanin-rich skin"
            className="w-full h-full object-cover saturate-[1.04] contrast-[1.02] brightness-[0.82]"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'cover', 
              display: 'block',
              objectPosition: "center top"
            }}
            initial={{ scale: 1 }}
            animate={{ scale: 1.03 }}
            transition={{ duration: 2.8, ease: "easeOut" }}
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-black/68 via-black/28 to-black/44" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(0,0,0,0.34)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-0">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xs md:text-sm tracking-[0.3em] uppercase font-body mb-5 text-[#E8D3C0]"
          >
            Queen Koba
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-light leading-[0.95] mb-5 text-[#F5F5F5]"
          >
            Dark Spots &amp; Uneven Tone Stealing Your <span className="font-semibold italic text-[#D4AF37]">Glow?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-sm md:text-base text-[#F5F5F5] font-semibold leading-relaxed mb-8 max-w-md font-body drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
          >
            <span className="text-[#E8D3C0]">Naturally</span> Brighten Up to 2 Shades - Toxin-Free, Melanin-Safe Luxury
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="font-display italic text-lg md:text-xl mb-8 text-[#D4AF37] drop-shadow-[0_1px_1px_rgba(0,0,0,0.28)]"
          >
            Queen Koba: Eternal Radiance, Naturally You
          </motion.p>

        </div>
      </div>
    </section>
  );
};

export default Hero;
