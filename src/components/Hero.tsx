import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNetworkQuality } from "@/context/NetworkQualityContext";
import { useSiteContent } from "@/hooks/use-site-content";

const HERO_IMAGE = {
  mobile: {
    avif: "/images/hero/optimized/home-hero-mobile.avif",
    webp: "/images/hero/optimized/home-hero-mobile.webp",
  },
  desktop: {
    avif: "/images/hero/optimized/home-hero-desktop.avif",
    webp: "/images/hero/optimized/home-hero-desktop.webp",
  },
} as const;

interface HeroProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  signature?: string;
  primaryCta?: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
  trustPoints?: string[];
}

const Hero = ({
  eyebrow,
  title,
  subtitle,
  signature,
  primaryCta,
  secondaryCta,
  trustPoints = [],
}: HeroProps) => {
  const { content } = useSiteContent();
  const network = useNetworkQuality();
  const resolvedEyebrow = eyebrow || "Queen Koba";
  const resolvedTitle = title || content.hero_title;
  const resolvedSubtitle = subtitle || content.hero_subtitle;
  const resolvedSignature = signature || "Queen Koba: Eternal Radiance, Naturally You";

  return (
    <section className="relative flex min-h-[82svh] items-center overflow-hidden sm:min-h-[88svh] md:min-h-[100vh] lg:min-h-[105vh]">
      <div className="absolute inset-0 overflow-hidden">
        <picture>
          <source
            media="(max-width: 767px)"
            type="image/avif"
            srcSet={HERO_IMAGE.mobile.avif}
            sizes="100vw"
          />
          <source
            media="(max-width: 767px)"
            type="image/webp"
            srcSet={HERO_IMAGE.mobile.webp}
            sizes="100vw"
          />
          <source
            type="image/avif"
            srcSet={HERO_IMAGE.desktop.avif}
            sizes="100vw"
          />
          <img
            src={HERO_IMAGE.desktop.webp}
            alt="Queen Koba - radiant melanin-rich skin"
            width={1248}
            height={832}
            className="h-full w-full object-cover object-[60%_center] saturate-[1.02] contrast-[1.01] brightness-[0.88] md:object-center"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "cover",
              display: "block",
            }}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            sizes="100vw"
          />
        </picture>
        {/* Improved Premium Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.38)_45%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(0,0,0,0.2)_0%,transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 py-20 sm:py-24 md:py-0">
        <div className="max-w-xl">
          <motion.p
            initial={network.animationEnabled ? { opacity: 0, y: 20 } : false}
            animate={network.animationEnabled ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xs md:text-sm tracking-[0.3em] uppercase font-body mb-5 text-[#E8D3C0]"
          >
            {resolvedEyebrow}
          </motion.p>

          <motion.h1
            initial={network.animationEnabled ? { opacity: 0, y: 30 } : false}
            animate={network.animationEnabled ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-light leading-[0.95] mb-5 text-[#F5F5F5]"
          >
            {resolvedTitle}
          </motion.h1>

          <motion.p
            initial={network.animationEnabled ? { opacity: 0, y: 20 } : false}
            animate={network.animationEnabled ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-sm md:text-base text-[#F5F5F5] font-semibold leading-relaxed mb-8 max-w-md font-body drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
          >
            {resolvedSubtitle}
          </motion.p>

          <motion.p
            initial={network.animationEnabled ? { opacity: 0, y: 20 } : false}
            animate={network.animationEnabled ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="font-display italic text-lg md:text-xl mb-8 text-[#D4AF37] drop-shadow-[0_1px_1px_rgba(0,0,0,0.28)]"
          >
            {resolvedSignature}
          </motion.p>

          {primaryCta || secondaryCta ? (
            <motion.div
              initial={network.animationEnabled ? { opacity: 0, y: 18 } : false}
              animate={network.animationEnabled ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.95, duration: 0.55 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              {primaryCta ? (
                <Link
                  to={primaryCta.to}
                  className="inline-flex items-center justify-center rounded-full bg-gold-gradient px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {primaryCta.label}
                </Link>
              ) : null}
              {secondaryCta ? (
                <Link
                  to={secondaryCta.to}
                  className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/15"
                >
                  {secondaryCta.label}
                </Link>
              ) : null}
            </motion.div>
          ) : null}

          {trustPoints.length ? (
            <motion.div
              initial={network.animationEnabled ? { opacity: 0, y: 16 } : false}
              animate={network.animationEnabled ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.05, duration: 0.55 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {trustPoints.map((point) => (
                <span
                  key={point}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F5F5F5] backdrop-blur-sm"
                >
                  {point}
                </span>
              ))}
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Hero;
