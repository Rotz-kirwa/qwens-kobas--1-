import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import BrandStory from "@/components/BrandStory";
import IngredientsSpotlight from "@/components/IngredientsSpotlight";
import ProductStore from "@/components/ProductStore";
import Testimonials from "@/components/Testimonials";
import SafetyDisclaimer from "@/components/SafetyDisclaimer";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main>
      <Hero />
      <WhyChooseUs />
      <BrandStory />
      <IngredientsSpotlight />
      <ProductStore />
      <Testimonials />
      <SafetyDisclaimer />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default Index;
