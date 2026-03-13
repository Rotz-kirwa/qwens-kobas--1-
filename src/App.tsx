import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ShopNowFloat from "@/components/ShopNowFloat";
import Home from "./pages/Home";
import { setAuthRedirect } from "@/lib/authRedirect";

const CartDrawer = lazy(() => import("@/components/CartDrawer"));
const PromoPopup = lazy(() => import("@/components/PromoPopup"));
const Index = lazy(() => import("./pages/Index"));
const Story = lazy(() => import("./pages/Story"));
const Results = lazy(() => import("./pages/Results"));
const Ingredients = lazy(() => import("./pages/Ingredients"));
const Shop = lazy(() => import("./pages/Shop"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageFallback = () => <div className="min-h-[40vh]" />;

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirectPath = `${location.pathname}${location.search}${location.hash}`;
    setAuthRedirect(redirectPath);

    return <Navigate to="/login" replace state={{ from: redirectPath }} />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <Toaster />
          <Sonner />
          <Navbar />
          <Suspense fallback={null}>
            <CartDrawer />
          </Suspense>
          <WhatsAppFloat />
          <ShopNowFloat />
          <Suspense fallback={null}>
            <PromoPopup />
          </Suspense>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/all" element={<Index />} />
              <Route path="/story" element={<Story />} />
              <Route path="/results" element={<Results />} />
              <Route path="/ingredients" element={<Ingredients />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route
                path="/checkout"
                element={
                  <RequireAuth>
                    <Checkout />
                  </RequireAuth>
                }
              />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
