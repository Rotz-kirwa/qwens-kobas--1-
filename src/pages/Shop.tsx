import ProductStore from "@/components/ProductStore";
import SEO from "@/components/SEO";

const Shop = () => {
  return (
    <main className="pt-14 md:pt-16">
      <SEO
        title="Shop Skincare Products"
        description="Browse Queen Koba products including brightening toner, clarifying serum, face mask, cream, cleanser, and the full skincare kit."
        path="/shop"
        keywords="buy skincare Kenya, Queen Koba products, face mask 120ml, brightening toner, clarifying serum"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Queen Koba Shop",
          url: "https://queenkoba.com/shop",
          description:
            "Shop Queen Koba skincare products designed for melanin-rich skin.",
        }}
      />
      <ProductStore />
    </main>
  );
};

export default Shop;
