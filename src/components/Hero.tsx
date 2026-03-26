import { motion } from "framer-motion";
import AdaptiveImage from "@/components/AdaptiveImage";
import { useNetworkQuality } from "@/context/NetworkQualityContext";
import { useSiteContent } from "@/hooks/use-site-content";

const HERO_IMAGE =
  "https://www.dropbox.com/scl/fi/dlm8mxurz33lyfahdig88/bg.png?rlkey=uazruv0hawvwkwjxtsmacpmo1&st=4qjh0r3d&raw=1";

const Hero = () => {
  const { content } = useSiteContent();
  const network = useNetworkQuality();

  return (
    <section className="relative flex min-h-[82svh] items-center overflow-hidden sm:min-h-[88svh] md:min-h-[108vh] lg:min-h-[120vh]">
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
          <AdaptiveImage
            src={HERO_IMAGE}
            alt="Queen Koba - radiant melanin-rich skin"
            className="h-full w-full object-cover object-[58%_top] saturate-[1.04] contrast-[1.02] brightness-[0.82] sm:object-[center_top]"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'cover', 
              display: 'block'
            }}
            highPriority
            sizes="100vw"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-black/68 via-black/28 to-black/44" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(0,0,0,0.34)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 py-20 sm:py-24 md:py-0">
        <div className="max-w-xl">
          <motion.p
            initial={network.animationEnabled ? { opacity: 0, y: 20 } : false}
            animate={network.animationEnabled ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xs md:text-sm tracking-[0.3em] uppercase font-body mb-5 text-[#E8D3C0]"
          >
            Queen Koba
          </motion.p>

          <motion.h1
            initial={network.animationEnabled ? { opacity: 0, y: 30 } : false}
            animate={network.animationEnabled ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-light leading-[0.95] mb-5 text-[#F5F5F5]"
          >
            {content.hero_title}
          </motion.h1>

          <motion.p
            initial={network.animationEnabled ? { opacity: 0, y: 20 } : false}
            animate={network.animationEnabled ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-sm md:text-base text-[#F5F5F5] font-semibold leading-relaxed mb-8 max-w-md font-body drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
          >
            {content.hero_subtitle}
          </motion.p>

          <motion.p
            initial={network.animationEnabled ? { opacity: 0, y: 20 } : false}
            animate={network.animationEnabled ? { opacity: 1, y: 0 } : {}}
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
