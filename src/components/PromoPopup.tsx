import { useEffect, useState } from "react";
import { X, ShoppingBag, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FULL_KIT_IMAGE =
  "https://www.dropbox.com/scl/fi/jpdncaq9lkmtnhxz3xbli/new.jpeg?rlkey=y6gg1oiji39i52ve9avevqplh&st=zuyfr36d&raw=1";

export default function PromoPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("fullKitPopupSeen");
    if (hasSeenPopup) return;

    const timer = window.setTimeout(() => {
      setShowPopup(true);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("fullKitPopupSeen", "true");
    setShowPopup(false);
  };

  const handleShopNow = () => {
    sessionStorage.setItem("fullKitPopupSeen", "true");
    setShowPopup(false);
    navigate("/shop");
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.18),transparent_32%),linear-gradient(180deg,rgba(7,10,8,0.46),rgba(7,10,8,0.74))] p-4 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{
              duration: 0.28,
              ease: "easeOut",
            }}
            onClick={(e) => e.stopPropagation()}
            className="group luxury-card relative w-full max-w-[24rem] overflow-hidden border-border/80 bg-card p-0 shadow-[0_24px_60px_rgba(24,17,8,0.24)]"
          >
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 z-20 rounded-full border border-background/90 bg-background/92 p-2 text-foreground shadow-md transition-all duration-300 hover:scale-105"
              aria-label="Close promo popup"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="absolute left-4 right-14 top-4 z-10 flex flex-wrap gap-2">
              <div className="rounded-full bg-background/92 px-3 py-1 text-[10px] font-body font-bold uppercase tracking-[0.2em] text-primary shadow-md backdrop-blur">
                Limited Kit
              </div>
              <div className="rounded-full bg-black/75 px-3 py-1 text-[10px] font-body font-bold uppercase tracking-[0.2em] text-white">
                Only 4 left
              </div>
            </div>

            <div className="w-full overflow-hidden">
              <img
                src={FULL_KIT_IMAGE}
                alt="Queen Koba Full Product Kit"
                className="aspect-[4/4.1] w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <p className="mb-2 text-[11px] font-body uppercase tracking-[0.24em] text-primary">
                Limited Offer This Month
              </p>
              <h3 className="mb-2 font-display text-[1.7rem] font-semibold leading-tight text-foreground sm:text-[1.95rem]">
                Full Product Kit
              </h3>
              <p className="text-sm font-body leading-relaxed text-muted-foreground">
                Mask, toner, serum, cream, and cleanser together in one complete routine for brighter, smoother, radiant skin.
              </p>
              <p className="mt-4 text-xs font-body font-bold uppercase tracking-[0.24em] text-primary">
                Grab the Bundle & Save
              </p>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-xs font-body text-muted-foreground">5/5 (200 reviews)</span>
              </div>

              <div className="mt-auto border-t border-border/50 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-semibold text-primary">KSh 9,999</p>
                    <p className="mt-1 text-[11px] font-body uppercase tracking-[0.2em] text-muted-foreground">
                      Full routine bundle
                    </p>
                  </div>

                  <button
                    onClick={handleShopNow}
                    className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-gold-gradient px-4 py-3 text-[11px] font-body font-bold uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
