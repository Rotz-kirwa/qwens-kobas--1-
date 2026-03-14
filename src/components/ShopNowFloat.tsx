import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const hiddenRoutes = new Set(["/login", "/signup", "/auth/callback", "/checkout", "/cart"]);

const ShopNowFloat = () => {
  const { pathname } = useLocation();
  const { isOpen } = useCart();

  if (hiddenRoutes.has(pathname) || isOpen) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed bottom-5 left-4 z-50 sm:bottom-8 sm:left-8"
    >
      <Link
        to="/shop"
        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-[1.45rem] border border-[#F0D68A]/50 bg-[linear-gradient(140deg,rgba(18,63,53,0.96),rgba(8,27,23,0.96))] px-2.5 py-2.5 pr-4 shadow-[0_18px_34px_rgba(4,14,12,0.3)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_56px_rgba(4,14,12,0.42)] sm:gap-4 sm:rounded-[2rem] sm:px-4 sm:py-4 sm:pr-6"
        aria-label="Shop Queen Koba products"
      >
        <span className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08),transparent_34%,rgba(212,175,55,0.14)_70%,rgba(255,255,255,0.08)_100%)]" />
        <span className="absolute inset-[1px] rounded-[calc(1.45rem-1px)] bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0)_30%,rgba(0,0,0,0.12)_100%)] sm:rounded-[calc(2rem-1px)]" />
        <span className="absolute inset-y-0 left-0 w-24 -translate-x-[130%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)] transition-transform duration-1000 group-hover:translate-x-[320%]" />

        <span className="relative flex h-9 w-9 items-center justify-center rounded-[0.95rem] border border-[#FFE8AB]/55 bg-[radial-gradient(circle_at_30%_30%,#FFF4CC,#D4AF37_68%,#9A6B1A_100%)] text-[#2E2006] shadow-[inset_0_1px_1px_rgba(255,255,255,0.82),0_10px_20px_rgba(0,0,0,0.22)] sm:h-12 sm:w-12 sm:rounded-[1.3rem]">
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-5 sm:w-5"
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

        <span className="relative flex flex-col leading-none">
          <span className="text-[8px] uppercase tracking-[0.28em] text-[#EFDDA6] sm:text-[10px]">
            Glow Ritual
          </span>
          <span className="mt-1 text-[12px] font-bold uppercase tracking-[0.18em] text-white sm:text-[15px] sm:tracking-[0.24em]">
            Shop Now
          </span>
        </span>
      </Link>
    </motion.div>
  );
};

export default ShopNowFloat;
