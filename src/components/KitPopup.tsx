import { useEffect, useState, useCallback, useRef } from "react";
import { X, ShoppingBag, Star, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdaptiveImage from "@/components/AdaptiveImage";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";

const KIT_PRODUCT = products.find((p) => p.id === "new-bundle")!;
const KIT_SUMMARY = "5 essentials: Cleanser, Toner, Serum, Cream, and Mask.";
const TRIGGER_DELAY = 30_000; // 30 seconds

export default function KitPopup() {
  const [visible, setVisible] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);

  const clearPopupTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const schedulePopup = useCallback(() => {
    clearPopupTimer();
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setVisible(true);
    }, TRIGGER_DELAY);
  }, [clearPopupTimer]);

  useEffect(() => {
    schedulePopup();

    return () => {
      clearPopupTimer();
    };
  }, [clearPopupTimer, schedulePopup]);

  const dismiss = useCallback(() => {
    setVisible(false);
    schedulePopup();
  }, [schedulePopup]);

  const handleAddAndCheckout = useCallback(async () => {
    if (!KIT_PRODUCT) return;
    setAdding(true);
    clearPopupTimer();
    addToCart(KIT_PRODUCT, 1);
    // Small delay so cart state settles before navigation
    await new Promise((r) => window.setTimeout(r, 280));
    setVisible(false);
    navigate("/checkout");
  }, [addToCart, clearPopupTimer, navigate]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="kit-popup-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{
            background:
              "radial-gradient(ellipse at 60% 30%, rgba(212,175,55,0.14) 0%, transparent 55%), linear-gradient(180deg, rgba(10,8,6,0.52) 0%, rgba(10,8,6,0.72) 100%)",
            backdropFilter: "blur(10px)",
          }}
          onClick={dismiss}
        >
          <motion.div
            key="kit-popup-card"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Full Product Kit offer"
            className="relative w-full max-w-[19.25rem] overflow-hidden rounded-[10px] border border-[#dcc7a0] bg-[linear-gradient(180deg,#fffdf9_0%,#fff7ea_100%)] shadow-[0_32px_80px_rgba(10,8,6,0.36)] sm:max-w-[24.5rem]"
          >
            <div className="absolute inset-x-0 top-0 z-10 h-1.5 bg-[linear-gradient(90deg,#7e1111_0%,#c22f2f_36%,#d7a13f_100%)]" />

            {/* Dismiss button */}
            <button
              onClick={dismiss}
              aria-label="Dismiss kit popup"
              className="absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-[9px] border border-white/15 bg-black/30 shadow-[0_10px_24px_rgba(18,12,6,0.18)] backdrop-blur-md transition-all hover:-translate-y-0.5 sm:h-9 sm:w-9"
            >
              <X className="h-4 w-4 text-white" />
            </button>

            <div className="absolute left-3 top-4 z-20">
              <div
                className="flex h-[3.8rem] w-[3.8rem] flex-col items-center justify-center bg-[#c62828] text-white shadow-[0_16px_32px_rgba(198,40,40,0.35)] sm:h-[4.35rem] sm:w-[4.35rem]"
                style={{
                  clipPath:
                    "polygon(50% 0%, 60% 14%, 76% 6%, 81% 23%, 100% 24%, 89% 41%, 100% 57%, 82% 59%, 76% 76%, 60% 68%, 50% 100%, 40% 68%, 24% 76%, 18% 59%, 0% 57%, 11% 41%, 0% 24%, 19% 23%, 24% 6%, 40% 14%)",
                }}
              >
                <Star className="mb-1 h-3.5 w-3.5 fill-[#fff4cb] text-[#fff4cb] sm:h-4 sm:w-4" />
                <span className="text-[8px] font-bold uppercase tracking-[0.22em] leading-none sm:text-[9px]">
                  VIP
                </span>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] leading-none sm:text-[10px]">
                  Kit
                </span>
              </div>
            </div>

            {/* Kit image */}
            <div className="relative h-[12.25rem] overflow-hidden border-b border-[#eadbbf] sm:h-[14.75rem]">
              <AdaptiveImage
                src={KIT_PRODUCT.image ?? ""}
                alt="Queen Koba Full Product Kit"
                className="h-full w-full object-cover object-center"
                sizes="(max-width: 640px) 100vw, 26rem"
              />

            </div>

            {/* Content */}
            <div className="px-4 pb-4 pt-4 sm:px-6 sm:pb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary/70">
                Queen Koba ritual
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                Full Product Kit
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="rounded-[10px] border border-[#ddcfb7] bg-white/85 px-3 py-2 shadow-[0_10px_24px_rgba(10,8,6,0.08)]">
                  <p className="font-display text-[1.85rem] font-semibold leading-none text-foreground sm:text-[2.1rem]">
                    KSh 9,999
                  </p>
                  <p className="mt-1 text-[10px] font-body uppercase tracking-[0.2em] text-primary">
                    Complete routine
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-[10px] border border-[#ddcfb7] bg-white/85 px-3 py-2 shadow-[0_10px_24px_rgba(10,8,6,0.08)]">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  <span className="text-xs font-bold text-primary">5.0</span>
                  <span className="text-[10px] text-muted-foreground">(200)</span>
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Complete glow routine in one box for melanin-rich skin.
              </p>

              <div className="mt-4 rounded-[10px] border border-[#d9c5a5] bg-white/75 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
                  What's inside
                </p>
                <p className="mt-1.5 text-sm leading-6 text-foreground/85">
                  {KIT_SUMMARY}
                </p>
              </div>

              {/* CTA */}
              <button
                id="kit-popup-checkout-btn"
                onClick={handleAddAndCheckout}
                disabled={adding}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-[10px] bg-gold-gradient py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_10px_28px_rgba(212,175,55,0.32)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(212,175,55,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {adding ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                    Adding to cart…
                  </span>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Add Kit & Go to Checkout
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <button
                onClick={dismiss}
                className="mt-3 w-full text-center text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                No thanks, keep browsing
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
