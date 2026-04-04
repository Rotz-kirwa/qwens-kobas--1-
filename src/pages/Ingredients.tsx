import IngredientsSpotlight from "@/components/IngredientsSpotlight";
import SEO from "@/components/SEO";

const Ingredients = () => {
  return (
    <main className="pt-20">
      <SEO
        title="African Botanical Ingredients for Brightening Skincare | Queen Koba"
        description="Explore Queen Koba African botanical skincare ingredients, including qasil, aloe, moringa, licorice root, shea, and snail mucin for glow and uneven skin tone support."
        path="/ingredients"
        keywords="African botanical skincare, Queen Koba ingredients, qasil, aloe, moringa skincare, licorice root skincare"
      />
      <IngredientsSpotlight />
    </main>
  );
};

export default Ingredients;
