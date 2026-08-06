import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AdaptiveImage from "@/components/AdaptiveImage";
import { productSeoByKey } from "@/data/seoContent";
import { productsAPI } from "@/lib/api";
import {
  canonicalProductsByKey,
  formatCurrency,
  getEffectiveProductPrice,
  mapApiProduct,
  type StoreProduct,
} from "@/lib/storefrontCatalog";

interface ProductRecommendationsProps {
  title: string;
  description?: string;
  productKeys: string[];
}

const ProductRecommendations = ({
  title,
  description,
  productKeys,
}: ProductRecommendationsProps) => {
  const [storeProducts, setStoreProducts] = useState<Record<string, StoreProduct>>(() => canonicalProductsByKey);

  useEffect(() => {
    let cancelled = false;

    productsAPI
      .getAll({ lite: false, cacheTtlMs: 1000 * 60 * 5 })
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.products) && data.products.length > 0) {
          const apiMapped = data.products
            .map(mapApiProduct)
            .filter((p): p is StoreProduct => p !== null);

          if (apiMapped.length > 0) {
            const mappedObj: Record<string, StoreProduct> = { ...canonicalProductsByKey };
            apiMapped.forEach((prod) => {
              mappedObj[prod.catalogKey] = prod;
              if (prod.id) {
                mappedObj[prod.id] = prod;
              }
            });
            setStoreProducts(mappedObj);
          }
        }
      })
      .catch(() => {
        // Fallback gracefully to canonical catalog
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const products = productKeys
    .map((key) => storeProducts[key] || canonicalProductsByKey[key])
    .filter((product): product is StoreProduct => Boolean(product));

  if (products.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.28em] text-primary">Recommended Products</p>
        <h2 className="mt-4 font-display text-3xl font-light md:text-4xl">{title}</h2>
        {description ? (
          <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">{description}</p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article
            key={product.catalogKey}
            className="overflow-hidden rounded-[26px] border border-border/70 bg-card shadow-[0_16px_36px_rgba(24,17,8,0.08)] transition-transform duration-300 hover:-translate-y-1"
          >
            <Link to={`/shop/${product.catalogKey}`} className="block overflow-hidden">
              {product.image_url ? (
                <AdaptiveImage
                  src={product.image_url}
                  alt={productSeoByKey[product.catalogKey]?.imageAlt ?? `Queen Koba ${product.name}`}
                  className="aspect-[4/4.2] w-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              ) : null}
            </Link>

            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/70">
                {product.stepLabel || "Queen Koba"}
              </p>
              <Link to={`/shop/${product.catalogKey}`} className="transition-colors hover:text-primary">
                <h3 className="mt-3 font-display text-2xl font-light text-foreground">{product.name}</h3>
              </Link>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {product.subtitle || product.description}
              </p>
              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="font-display text-2xl text-primary">
                  {formatCurrency(getEffectiveProductPrice(product))}
                </span>
                <Link
                  to={`/shop/${product.catalogKey}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary/80"
                >
                  View product
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProductRecommendations;

