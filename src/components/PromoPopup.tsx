import { useEffect, useState } from "react";
import { X, ShoppingBag, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FULL_KIT_IMAGE =
  "https://www.dropbox.com/scl/fi/waicevj5xuzm33zgg2hmp/sp7.jpeg?rlkey=ojau7f05ljcqt7d2qhodwmnrz&st=u7hk5mfy&raw=1";

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-primary/15 bg-background shadow-[0_28px_80px_rgba(0,0,0,0.28)]"
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-background/90 p-2 text-foreground shadow-md transition-colors hover:text-primary"
              aria-label="Close promo popup"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative">
              <div className="absolute left-4 top-4 z-10 rounded-full bg-primary px-4 py-1.5 text-[10px] font-body font-bold uppercase tracking-[0.22em] text-primary-foreground shadow-lg">
                Full Kit
              </div>
              <img
                src={FULL_KIT_IMAGE}
                alt="Queen Koba Full Product Kit"
                className="h-64 w-full object-cover"
              />
            </div>

            <div className="p-6 md:p-7">
              <p className="text-xs font-body uppercase tracking-[0.26em] text-primary">
                Limited kits this month
              </p>
              <h3 className="mt-3 font-display text-3xl font-light text-foreground">
                Full Product Kit
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Mask, toner, serum, cream, and cleanser together in one complete routine.
                The full kit for brighter, even, melanin-safe radiance.
              </p>
              <p className="mt-4 text-xs font-body uppercase tracking-[0.22em] text-primary">
                Full Product Kit • KSh 9,999. Limited kits this month.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm text-foreground">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <span>5/5 (200 reviews)</span>
              </div>

              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-body uppercase tracking-[0.2em] text-muted-foreground">
                    Price
                  </p>
                  <p className="mt-1 font-display text-3xl font-semibold text-primary">
                    KSh 9,999
                  </p>
                </div>
                <div className="rounded-full border border-border px-4 py-2 text-sm font-body">
                  1
                </div>
              </div>

              <button
                onClick={handleShopNow}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-4 text-xs font-body font-bold uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
              >
                <ShoppingBag className="h-4 w-4" />
                Grab the Bundle &amp; Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
