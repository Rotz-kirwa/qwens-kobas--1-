import { Suspense, lazy } from "react";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";

const Testimonials = lazy(() => import("@/components/Testimonials"));
const IngredientsSpotlight = lazy(() => import("@/components/IngredientsSpotlight"));

const Home = () => {
  return (
    <main>
      <Hero />
      <WhyChooseUs />
      <Suspense fallback={null}>
        <Testimonials />
        <IngredientsSpotlight />
      </Suspense>
    </main>
  );
};

export default Home;
