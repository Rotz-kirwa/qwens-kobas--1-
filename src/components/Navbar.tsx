import { useState } from "react";
import { ShoppingBag, Menu, X, User, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";

const BRAND_LOGO_URL = "/images/local/logo-kbl.jpg";

const Navbar = () => {
  const { itemCount, setIsOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Results", href: "/results" },
    { label: "Our Story", href: "/story" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/75">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="group flex min-w-0 items-center gap-3 md:gap-3.5">
          <img
            src={BRAND_LOGO_URL}
            alt="Queen Koba logo"
            className="block h-10 w-auto shrink-0 object-contain md:h-11 mix-blend-multiply contrast-[1.04] saturate-95"
          />
          <span className="whitespace-nowrap font-display text-[1.15rem] font-semibold leading-none tracking-[0.07em] text-primary md:text-[1.4rem]">
            Queen Koba
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.href}
              to={l.href}
              className="text-[12px] font-body font-semibold uppercase tracking-[0.18em] text-foreground/90 transition-colors duration-300 hover:text-primary"
              activeClassName="text-primary"
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm font-body font-semibold text-foreground/90">Hi, {user.name.split(' ')[0]}</span>
              <button
                onClick={logout}
                className="p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-2 text-sm font-body font-semibold text-foreground/90 hover:text-primary transition-colors"
            >
              <User className="w-5 h-5" />
              Sign In
            </Link>
          )}
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-64 border-l border-gray-200 bg-[#FAF8F5] shadow-2xl md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4">
                  <span className="font-display text-xl font-semibold text-[#8B6F47]">Menu</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 text-gray-700 transition-colors hover:text-[#8B6F47]"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-col gap-4 bg-[#FAF8F5] px-4 py-6">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      to={l.href}
                      onClick={() => setMobileOpen(false)}
                      className={`border-b border-gray-200 py-3 text-base font-bold uppercase tracking-widest transition-colors hover:text-[#8B6F47] ${
                        isActive(l.href) ? "text-[#8B6F47]" : "text-gray-800"
                      }`}
                    >
                      {l.label}
                    </Link>
                  ))}
                  {user ? (
                    <>
                      <div className="border-b border-gray-200 py-2 text-sm text-gray-500">
                        Hi, {user.name}
                      </div>
                      <button
                        onClick={() => { logout(); setMobileOpen(false); }}
                        className="flex items-center gap-2 border-b border-gray-200 py-3 text-left text-base font-bold uppercase tracking-widest text-gray-800 transition-colors hover:text-[#8B6F47]"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 border-b border-gray-200 py-3 text-base font-bold uppercase tracking-widest text-gray-800 transition-colors hover:text-[#8B6F47]"
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
