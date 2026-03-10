import { Suspense, lazy } from "react";
import Hero from "@/components/Hero";

const Testimonials = lazy(() => import("@/components/Testimonials"));
const IngredientsSpotlight = lazy(() => import("@/components/IngredientsSpotlight"));

const Home = () => {
  return (
    <main>
      <Hero />
      <Suspense fallback={null}>
        <Testimonials />
        <IngredientsSpotlight />
      </Suspense>
    </main>
  );
};

export default Home;
