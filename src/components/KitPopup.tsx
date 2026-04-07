import { useEffect, useState, useCallback } from "react";
import { X, ShoppingBag, Sparkles, Star, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdaptiveImage from "@/components/AdaptiveImage";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";

const KIT_PRODUCT = products.find((p) => p.id === "new-bundle")!;
const KIT_ITEMS = ["Clarifying Cleanser", "Brightening Toner", "Clarifying Serum", "Clarifying Cream", "Brightening Mask"];
const STORAGE_KEY = "queenkoba-kit-popup-dismissed";
const TRIGGER_DELAY = 30_000; // 30 seconds

export default function KitPopup() {
  const [visible, setVisible] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, TRIGGER_DELAY);

    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }, []);

  const handleAddAndCheckout = useCallback(async () => {
    if (!KIT_PRODUCT) return;
    setAdding(true);
    addToCart(KIT_PRODUCT, 1);
    // Small delay so cart state settles before navigation
    await new Promise((r) => window.setTimeout(r, 280));
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
    navigate("/checkout");
  }, [addToCart, navigate]);

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
            className="relative w-full max-w-[22rem] overflow-hidden rounded-[28px] bg-card shadow-[0_32px_80px_rgba(10,8,6,0.36)] sm:max-w-[26rem]"
          >
            {/* Dismiss button */}
            <button
              onClick={dismiss}
              aria-label="Dismiss kit popup"
              className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-md transition-all hover:scale-105"
            >
              <X className="h-4 w-4 text-foreground" />
            </button>

            {/* Badge */}
            <div className="absolute left-3 top-3 z-10 flex gap-2">
              <span className="flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary shadow backdrop-blur">
                <Sparkles className="h-3 w-3" />
                Full Kit
              </span>
            </div>

            {/* Kit image */}
            <div className="relative overflow-hidden">
              <AdaptiveImage
                src={KIT_PRODUCT.image ?? ""}
                alt="Queen Koba Full Product Kit"
                className="aspect-[4/3] w-full object-cover object-center"
                sizes="(max-width: 640px) 100vw, 26rem"
              />

              {/* Gradient overlay on image */}
              <div
                className="absolute inset-x-0 bottom-0 h-28"
                style={{
                  background:
                    "linear-gradient(to top, hsl(var(--card)) 0%, transparent 100%)",
                }}
              />

              {/* Price badge on image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="font-display text-3xl font-semibold text-foreground">
                    KSh 9,999
                  </p>
                  <p className="mt-0.5 text-[10px] font-body uppercase tracking-[0.2em] text-primary">
                    Complete Routine
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  <span className="text-xs font-bold text-primary">5.0</span>
                  <span className="text-[10px] text-muted-foreground">(200)</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 pb-5 pt-2">
              <h2 className="font-display text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                Full Product Kit
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                Every step of the brightening routine in one box — made for melanin-rich skin.
              </p>

              {/* What's included */}
              <div className="mt-4 rounded-[18px] border border-border/70 bg-secondary/20 px-4 py-3">
                <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
                  What's included
                </p>
                <ul className="space-y-1.5">
                  {KIT_ITEMS.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-foreground/90">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <button
                id="kit-popup-checkout-btn"
                onClick={handleAddAndCheckout}
                disabled={adding}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_10px_28px_rgba(212,175,55,0.32)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(212,175,55,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
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
                className="mt-2.5 w-full text-center text-[11px] text-muted-foreground underline-offset-2 hover:underline"
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
