import Testimonials from "@/components/Testimonials";
import SEO from "@/components/SEO";

const Reviews = () => {
  return (
    <main className="pt-20">
      <SEO
        title="Customer Reviews"
        description="Read Queen Koba customer reviews and experiences with our premium skincare routines for brighter, smoother, melanin-rich skin."
        path="/reviews"
        keywords="Queen Koba reviews, skincare testimonials, customer reviews Kenya, melanin skincare reviews"
      />
      <Testimonials />
    </main>
  );
};

export default Reviews;
