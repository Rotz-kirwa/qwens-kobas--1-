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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.2),transparent_32%),linear-gradient(180deg,rgba(7,10,8,0.5),rgba(7,10,8,0.76))] p-4 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: [0, -6, 0],
              scale: 1,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{
              opacity: { duration: 0.28, ease: "easeOut" },
              scale: { duration: 0.28, ease: "easeOut" },
              y: {
                duration: 5.4,
                ease: "easeInOut",
                repeat: Infinity,
              },
            }}
            onClick={(e) => e.stopPropagation()}
            className="group relative w-[90%] max-w-[32rem] overflow-hidden rounded-[24px] border border-white/25 bg-[linear-gradient(180deg,rgba(248,243,234,0.9),rgba(240,232,218,0.82))] shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.2),transparent_28%),radial-gradient(circle_at_top_right,rgba(19,78,74,0.18),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent_24%)]" />

            <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-20 rounded-full border border-white/55 bg-white/68 p-2.5 text-[#2E2A24] shadow-[0_10px_24px_rgba(0,0,0,0.14)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white"
              aria-label="Close promo popup"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative px-5 pt-5 sm:px-6 sm:pt-6">
              <div className="absolute inset-x-10 top-7 z-0 h-36 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.3),rgba(212,175,55,0.08)_46%,transparent_72%)] blur-2xl" />
              <div className="absolute inset-x-8 top-3 z-0 h-44 rounded-full bg-[radial-gradient(circle,rgba(5,95,70,0.22),transparent_68%)] blur-3xl" />

              <div className="absolute left-9 top-9 z-20 rounded-full bg-[linear-gradient(135deg,#E0BC68,#B98839)] px-4 py-1.5 text-[10px] font-body font-bold uppercase tracking-[0.24em] text-white shadow-[0_12px_24px_rgba(185,136,57,0.35)]">
                Limited Kit
              </div>

              <div className="relative z-10 overflow-hidden rounded-[22px] bg-[linear-gradient(145deg,#194E44,#604523)] px-4 pt-12">
                <img
                  src={FULL_KIT_IMAGE}
                  alt="Queen Koba Full Product Kit"
                  className="mx-auto -mb-6 w-[108%] max-w-none object-contain drop-shadow-[0_28px_36px_rgba(0,0,0,0.34)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.02]"
                />
              </div>
            </div>

            <div className="relative z-10 p-5 sm:p-6">
              <p className="text-[11px] font-body uppercase tracking-[0.28em] text-[#9A7328]">
                Limited Offer This Month
              </p>
              <h3 className="mt-3 font-display text-[2rem] font-light leading-none text-[#3B2C25] sm:text-[2.35rem]">
                Full Product Kit
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#665B52]">
                Mask, toner, serum, cream, and cleanser in one complete routine for
                brighter, smoother, radiant skin.
              </p>
              <p className="mt-3 text-sm leading-7 text-[#665B52]">
                Complete skincare routine designed to clarify, hydrate, and restore
                natural glow.
              </p>

              <div className="mt-5">
                <p className="font-display text-[2rem] font-semibold leading-none text-[#9C7330] sm:text-[2.45rem]">
                  KSh 9,999
                </p>
                <p className="mt-2 text-xs font-body uppercase tracking-[0.22em] text-[#8B6B38]">
                  Limited kits available this month
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm text-[#3E3932]">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#B98B3C] text-[#B98B3C]" />
                  ))}
                </div>
                <span>5.0 (200 Reviews)</span>
              </div>

              <button
                onClick={handleShopNow}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#D8B15B,#B98535)] px-6 py-4 text-sm font-body font-bold text-white shadow-[0_18px_30px_rgba(185,133,53,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_40px_rgba(185,133,53,0.38)]"
              >
                <ShoppingBag className="h-4 w-4" />
                Get the Full Kit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
