import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="hidden sm:flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/shop"
              className="group relative inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 overflow-hidden font-body font-bold text-xs sm:text-sm tracking-widest uppercase rounded-sm transition-all duration-300"
            >
              {/* Animated background */}
              <span className="absolute inset-0 bg-gold-gradient" />
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Glow effect */}
              <span className="absolute inset-0 rounded-sm blur-xl bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Button content */}
              <span className="relative flex items-center gap-2 text-primary-foreground">
                <span className="group-hover:translate-x-1 transition-transform">Shop Now</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-2 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              
              {/* Shine effect */}
              <span className="absolute inset-0 rounded-sm overflow-hidden">
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </span>
            </Link>
          </motion.div>

          {/* Mobile floating button */}
          <Link
            to="/shop"
            className="sm:hidden fixed bottom-8 left-8 z-50 group inline-flex items-center justify-center px-5 py-3 overflow-hidden font-body font-bold text-xs tracking-widest uppercase rounded-full shadow-2xl transition-all duration-300"
          >
            {/* Animated background */}
            <span className="absolute inset-0 bg-gold-gradient" />
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Button content */}
            <span className="relative flex items-center gap-2 text-primary-foreground">
              <span>Shop Now</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
