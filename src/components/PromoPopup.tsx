import { useEffect, useState } from "react";
import { X, ShoppingBag } from "lucide-react";
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
            className="group luxury-card relative w-full max-w-[20rem] overflow-hidden border-border/80 bg-card p-0 shadow-[0_24px_60px_rgba(24,17,8,0.24)] sm:max-w-[21.5rem]"
          >
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 z-20 rounded-full border border-background/90 bg-background/92 p-2 text-foreground shadow-md transition-all duration-300 hover:scale-105"
              aria-label="Close promo popup"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="absolute left-3 right-12 top-3 z-10 flex flex-wrap gap-2">
              <div className="rounded-full bg-background/92 px-3 py-1 text-[10px] font-body font-bold uppercase tracking-[0.2em] text-primary shadow-md backdrop-blur">
                Limited Kit
              </div>
            </div>

            <div className="w-full overflow-hidden">
              <img
                src={FULL_KIT_IMAGE}
                alt="Queen Koba Full Product Kit"
                className="aspect-[4/3.15] w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02] sm:aspect-[4/3.35]"
              />
            </div>

            <div className="flex flex-1 flex-col p-4">
              <h3 className="mb-1.5 font-display text-[1.35rem] font-semibold leading-tight text-foreground sm:text-[1.55rem]">
                Full Product Kit
              </h3>
              <p className="text-sm font-body leading-6 text-muted-foreground">
                Complete glow routine in one bundle.
              </p>

              <div className="mt-3 border-t border-border/50 pt-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-semibold text-primary">KSh 9,999</p>
                    <p className="mt-1 text-[10px] font-body uppercase tracking-[0.18em] text-muted-foreground">
                      Limited offer
                    </p>
                  </div>

                  <button
                    onClick={handleShopNow}
                    className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-gold-gradient px-3 py-2.5 text-[10px] font-body font-bold uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90"
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
