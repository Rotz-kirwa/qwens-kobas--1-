import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { NetworkQualityProvider } from "@/context/NetworkQualityContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Home from "./pages/Home";

const Footer = lazy(() => import("@/components/Footer"));
const WhatsAppFloat = lazy(() => import("@/components/WhatsAppFloat"));
const ShopNowFloat = lazy(() => import("@/components/ShopNowFloat"));
import { setAuthRedirect } from "@/lib/authRedirect";

const Cart = lazy(() => import("./pages/Cart"));
const Index = lazy(() => import("./pages/Index"));
const Story = lazy(() => import("./pages/Story"));
const Results = lazy(() => import("./pages/Results"));
const Ingredients = lazy(() => import("./pages/Ingredients"));
const Shop = lazy(() => import("./pages/Shop"));
const SeoLandingPage = lazy(() => import("./pages/SeoLandingPage"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
});
const OVERLAY_HIDDEN_PATHS = new Set(["/login", "/signup", "/cart", "/checkout"]);

const PageFallback = () => <div className="min-h-[40vh]" />;

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  React.useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    };
  }, []);

  React.useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search, hash]);

  return null;
};

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-[40vh]" />;
  }

  if (!isAuthenticated) {
    const redirectPath = `${location.pathname}${location.search}${location.hash}`;
    setAuthRedirect(redirectPath);

    return <Navigate to="/login" replace state={{ from: redirectPath }} />;
  }

  return <>{children}</>;
};

const AppShell = () => {
  const location = useLocation();
  const hideMarketingOverlays = OVERLAY_HIDDEN_PATHS.has(location.pathname);

  return (
    <>
      <ScrollToTop />
      <Toaster />
      <Sonner />
      <Navbar />
      {!hideMarketingOverlays && (
        <Suspense fallback={null}>
          <WhatsAppFloat />
          <ShopNowFloat />
        </Suspense>
      )}
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all" element={<Index />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/story" element={<Story />} />
          <Route path="/results" element={<Results />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/shop" element={<Shop />} />
          <Route
            path="/hyperpigmentation-treatment"
            element={<SeoLandingPage slug="hyperpigmentation-treatment" />}
          />
          <Route
            path="/dark-spots-treatment"
            element={<SeoLandingPage slug="dark-spots-treatment" />}
          />
          <Route
            path="/skincare-for-melanin-skin"
            element={<SeoLandingPage slug="skincare-for-melanin-skin" />}
          />
          <Route
            path="/african-botanical-skincare"
            element={<SeoLandingPage slug="african-botanical-skincare" />}
          />
          <Route
            path="/skincare-products-kenya"
            element={<SeoLandingPage slug="skincare-products-kenya" />}
          />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/category/:categorySlug" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/shop/:productId" element={<ProductDetail />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NetworkQualityProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AppShell />
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </NetworkQualityProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
