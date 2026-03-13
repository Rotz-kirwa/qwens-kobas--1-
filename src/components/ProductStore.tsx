import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { products as initialProducts } from "@/data/products";
import { productsAPI } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { setAuthRedirect } from "@/lib/authRedirect";

interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  category: string;
  prices: {
    KES: { amount: number; symbol: string; country: string };
  };
  in_stock: boolean;
  image_url?: string;
  rating?: number;
  reviews?: number;
  discount_percentage?: number;
  on_sale?: boolean;
}

interface StoreProduct {
  id: string;
  catalogKey: string;
  name: string;
  description: string;
  price: number;
  in_stock: boolean;
  image_url?: string;
  rating?: number;
  reviews?: number;
  discount_percentage?: number;
  on_sale?: boolean;
  badges?: string[];
  stock_left?: number;
  urgency_tag?: string;
  cta_label?: string;
  footer_note?: string;
  bundle_message?: string;
}

const productMarketing: Record<string, Partial<StoreProduct>> = {
  "new-cleanser": {
    badges: ["Best Seller", "4.9 ★"],
    stock_left: 12,
    urgency_tag: "Buy Now, Glow Tomorrow",
    rating: 4.8,
    reviews: 87,
  },
  "new-toner": {
    badges: ["Loved by Melanin Queens"],
    stock_left: 9,
    urgency_tag: "Buy Now, Glow Tomorrow",
    rating: 4.7,
    reviews: 64,
  },
  "new-serum": {
    badges: ["Hero Product", "Limited Stock"],
    stock_left: 5,
    urgency_tag: "Buy Now, Glow Tomorrow",
    rating: 4.9,
    reviews: 112,
  },
  "new-cream": {
    badges: ["Skin Barrier Favorite"],
    urgency_tag: "Buy Now, Glow Tomorrow",
    rating: 4.8,
    reviews: 95,
  },
  "new-mask": {
    badges: ["Weekly Reset", "Glow Boost"],
    stock_left: 7,
    urgency_tag: "Spa Night, Elevated",
    rating: 4.8,
    reviews: 76,
  },
  "new-bundle": {
    badges: ["Full Kit", "Free Shipping"],
    stock_left: 4,
    cta_label: "Grab the Bundle & Save",
    bundle_message: "Full Product Kit • KSh 9,999. Limited kits this month.",
    rating: 5,
    reviews: 200,
  },
};

const catalogOrder = [
  "new-cleanser",
  "new-toner",
  "new-serum",
  "new-cream",
  "new-mask",
  "new-bundle",
] as const;

const shopTrustBadges = [
  "Cruelty-Free",
  "Sustainable Sourcing",
  "No Harsh Chemicals",
];

const fallbackStoreProducts: StoreProduct[] = initialProducts.map((product) => {
  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return {
    id: product.id,
    catalogKey: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    in_stock: true,
    image_url: product.image,
    rating: product.rating,
    reviews: product.reviews,
    discount_percentage: discountPercentage,
    on_sale: discountPercentage > 0,
    ...productMarketing[product.id],
  };
});

const canonicalProductsByKey = Object.fromEntries(
  fallbackStoreProducts.map((product) => [product.catalogKey, product])
) as Record<string, StoreProduct>;

const getProductMarketingKey = (name: string) => {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("cleanser")) return "new-cleanser";
  if (normalizedName.includes("toner")) return "new-toner";
  if (normalizedName.includes("serum")) return "new-serum";
  if (normalizedName.includes("cream")) return "new-cream";
  if (normalizedName.includes("mask")) return "new-mask";
  if (normalizedName.includes("full product kit") || normalizedName.includes("bundle")) {
    return "new-bundle";
  }

  return null;
};

const mapApiProduct = (product: ApiProduct): StoreProduct | null => {
  const marketingKey = getProductMarketingKey(product.name);

  if (!marketingKey) {
    return null;
  }

  const canonicalProduct = canonicalProductsByKey[marketingKey];

  if (!canonicalProduct) {
    return null;
  }

  return {
    id: product._id,
    catalogKey: marketingKey,
    name: canonicalProduct.name,
    description: canonicalProduct.description,
    price: canonicalProduct.price,
    in_stock: product.in_stock ?? true,
    image_url: canonicalProduct.image_url,
    rating: canonicalProduct.rating,
    reviews: canonicalProduct.reviews,
    discount_percentage: canonicalProduct.discount_percentage,
    on_sale: canonicalProduct.on_sale,
    isBundle: marketingKey === "new-bundle",
    ...(productMarketing[marketingKey] ?? {}),
  };
};

const BundleCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 11, minutes: 45 });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59 };
        if (prev.days > 0) return { days: prev.days - 1, hours: 23, minutes: 59 };
        return { days: 2, hours: 11, minutes: 45 };
      });
    }, 60000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 inline-flex items-center gap-3 rounded-sm border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-body uppercase tracking-[0.2em] text-primary">
      <span>Bundle Timer</span>
      <span>{String(timeLeft.days).padStart(2, "0")}d</span>
      <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
      <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
    </div>
  );
};

const ProductCard = ({ product, index }: { product: StoreProduct; index: number }) => {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const price = product.price;
  const discount = product.discount_percentage || 0;
  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;
  const rating = product.rating || 4.5;
  const reviews = product.reviews || 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setAuthRedirect("/checkout");
      toast({
        title: "Sign In Required",
        description: "Create an account or sign in before adding products to your cart.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: discount > 0 ? discountedPrice : price,
        rating,
        reviews,
        description: product.description,
        image: product.image_url,
      },
      qty
    );
    setQty(1);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="luxury-card flex flex-col overflow-hidden p-0 relative"
    >
      <div className="absolute left-4 right-4 top-4 z-10 flex flex-wrap gap-2">
        {product.badges?.map((badge) => (
          <span
            key={badge}
            className="rounded-full bg-background/90 px-3 py-1 text-[10px] font-body font-bold uppercase tracking-[0.2em] text-primary shadow-md backdrop-blur"
          >
            {badge}
          </span>
        ))}
        {product.on_sale && discount > 0 && (
          <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-body font-bold uppercase tracking-[0.2em] text-white shadow-md">
            {discount}% Off
          </span>
        )}
        {typeof product.stock_left === "number" && (
          <span className="rounded-full bg-black/75 px-3 py-1 text-[10px] font-body font-bold uppercase tracking-[0.2em] text-white">
            Only {product.stock_left} left
          </span>
        )}
      </div>
      {product.image_url && (
        <div className="w-full overflow-hidden">
          <img 
            src={product.image_url} 
            alt={product.name}
            className="h-96 w-full object-cover lg:h-[26rem]"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="font-display text-xl md:text-2xl font-semibold mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground font-body mb-4 leading-relaxed whitespace-pre-line">{product.description}</p>
        {product.bundle_message && (
          <p className="mb-4 text-xs font-body uppercase tracking-[0.22em] text-primary">
            {product.bundle_message}
          </p>
        )}

        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? "text-primary fill-primary" : "text-muted-foreground/30"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-body">
            {rating}/5 ({reviews} reviews)
          </span>
        </div>

        {product.urgency_tag && (
          <p className="mb-4 text-xs font-body font-bold uppercase tracking-[0.24em] text-primary">
            {product.urgency_tag}
          </p>
        )}

        {product.isBundle && <BundleCountdown />}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/50 pt-4">
        <div>
          {discount > 0 ? (
            <div>
              <span className="font-display text-lg line-through text-muted-foreground mr-2">
                KSh {price.toLocaleString()}
              </span>
              <span className="font-display text-2xl font-semibold text-red-600">
                KSh {Math.round(discountedPrice).toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="font-display text-2xl font-semibold text-primary">
              KSh {price.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center border border-border rounded-sm">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-3 text-sm font-body">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-5 py-2.5 bg-gold-gradient text-primary-foreground font-body text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity"
            disabled={!product.in_stock}
          >
            <ShoppingBag className="w-4 h-4" />
            {product.in_stock ? product.cta_label || "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
      </div>
    </motion.div>
  );
};

const ProductStore = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [products, setProducts] = useState<StoreProduct[]>(fallbackStoreProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getAll()
      .then(data => {
        const apiProducts = Array.isArray(data.products)
          ? data.products
              .map(mapApiProduct)
              .filter((product): product is StoreProduct => product !== null)
          : [];

        const mergedCatalog = catalogOrder.map((key) => {
          const apiProduct = apiProducts.find((product) => product.catalogKey === key);
          return apiProduct ?? canonicalProductsByKey[key];
        });

        setProducts(mergedCatalog);
        setLoading(false);
      })
      .catch(() => {
        setProducts(fallbackStoreProducts);
        setLoading(false);
      });
  }, []);

  return (
    <section id="shop" className="py-12 md:py-14 lg:py-16">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10 text-center md:mb-12"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-4">The Collection</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            Shop <span className="italic text-gold-gradient">Queen Koba</span>
          </h2>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-8 rounded-sm border border-primary/20 bg-background px-6 py-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:mt-10"
            >
              <p className="mx-auto max-w-4xl text-sm leading-7 text-muted-foreground font-body">
                Results vary; gentle and natural - patch test recommended. 100% toxin-free
                (no mercury, hydroquinone, steroids). Dermatologist-inspired for melanin-rich
                skin. Your safety is our promise.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {shopTrustBadges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-primary/20 px-4 py-2 text-xs font-body font-bold uppercase tracking-[0.2em] text-primary"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductStore;
