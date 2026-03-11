import IngredientsSpotlight from "@/components/IngredientsSpotlight";
import SEO from "@/components/SEO";

const Ingredients = () => {
  return (
    <main className="pt-20">
      <SEO
        title="Ingredients"
        description="Explore the African botanicals and active ingredients behind Queen Koba skincare, including qasil, aloe, moringa, shea, and snail mucin."
        path="/ingredients"
        keywords="Queen Koba ingredients, qasil, aloe, moringa skincare, African botanicals"
      />
      <IngredientsSpotlight />
    </main>
  );
};

export default Ingredients;
