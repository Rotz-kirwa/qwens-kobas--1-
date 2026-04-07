import ProductStore from "@/components/ProductStore";
import SEO from "@/components/SEO";
import KitPopup from "@/components/KitPopup";

const Shop = () => {
  return (
    <main className="pt-16 md:pt-[4.5rem]">
      <SEO
        title="Brightening Skincare Products for Dark Spots and Hyperpigmentation"
        description="Shop brightening skincare products in Kenya for hyperpigmentation, dark spots, uneven skin tone, and dull skin. Browse cleanser, toner, serum, cream, mask, and a full skincare kit."
        path="/shop"
        keywords="brightening skincare, hyperpigmentation treatment, dark spots treatment, brightening toner, hyperpigmentation serum, skincare kit for hyperpigmentation, skincare products in Kenya"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Queen Koba Shop",
          url: "https://queenkoba.com/shop",
          description:
            "Shop Queen Koba brightening skincare products for hyperpigmentation, dark spots, uneven skin tone, and melanin-rich skin.",
        }}
      />
      <ProductStore />
      <KitPopup />
    </main>
  );
};

export default Shop;

