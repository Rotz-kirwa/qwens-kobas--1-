import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import BrandStory from "@/components/BrandStory";
import IngredientsSpotlight from "@/components/IngredientsSpotlight";
import ProductStore from "@/components/ProductStore";
import Testimonials from "@/components/Testimonials";
import SafetyDisclaimer from "@/components/SafetyDisclaimer";
import FinalCTA from "@/components/FinalCTA";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <main>
      <SEO
        title="All Sections"
        description="Browse the full Queen Koba experience in one page."
        path="/all"
        robots="noindex,follow"
      />
      <Hero />
      <WhyChooseUs />
      <BrandStory />
      <IngredientsSpotlight />
      <ProductStore />
      <Testimonials />
      <SafetyDisclaimer />
      <FinalCTA />
    </main>
  );
};

export default Index;
