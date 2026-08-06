import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  defaultKenyaDeliveryZone,
  getDeliveryZone,
  normalizeDeliveryZone,
  type DeliveryMethod,
  type DeliveryZone,
} from "@/data/kenyaDelivery";
import { cartAPI } from "@/lib/api";
import { products } from "@/data/products";

export interface Product {
  apiId?: number;
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  rating: number;
  reviews: number;
  description: string;
  isBundle?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliverySelection {
  zone: DeliveryZone;
  county: string;
  area: string;
  point: string;
  method: DeliveryMethod;
  pickupFee: number;
  doorFee: number;
  eta: string;
}

export interface PromoSummary {
  code: string;
  description?: string;
  campaign_type?: string;
  discount_type: "percentage" | "fixed" | "free_shipping";
  discount_value: number;
  discount_amount: number;
  shipping_discount: number;
  subtotal_kes: number;
  eligible_subtotal_kes: number;
  shipping_kes: number;
  final_total_kes: number;
  applies_to_type?: string;
  customer_scope?: string;
  first_order_only?: boolean;
  message?: string;
}

interface PromoValidationResponse {
  exists?: boolean;
  valid?: boolean;
  message?: string;
  reason?: string;
  promo?: PromoSummary | null;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  deliverySelection: DeliverySelection;
  setDeliveryZone: (zone: string) => void;
  setDeliveryCounty: (county: string) => void;
  setDeliveryArea: (area: string) => void;
  setDeliveryPoint: (point: string) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  shippingFee: number;
  grandTotal: number;
  promoSummary: PromoSummary | null;
  promoLoading: boolean;
  promoError: string | null;
  discountAmount: number;
  shippingDiscount: number;
  applyPromoCode: (code: string) => Promise<PromoSummary>;
  removePromoCode: () => Promise<void>;
}

interface BackendCartItem {
  product_id: string;
  product_name: string;
  product_price_kes?: number;
  price_per_item_kes?: number;
  image_url?: string;
  description?: string;
  quantity: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "queenkoba-cart";
const DELIVERY_STORAGE_KEY = "queenkoba-delivery";
const PROMO_STORAGE_KEY = "queenkoba-promo";

interface DeliverySelectionDraft {
  county?: string;
  area?: string;
  point?: string;
}

const findCatalogProduct = (productId: string) =>
  products.find((product) => product.id === productId);

const augmentProductWithApiId = (product: Product): Product => {
  if (product.apiId !== undefined) {
    return product;
  }

  const catalogProduct = findCatalogProduct(product.id);
  return catalogProduct?.apiId !== undefined ? { ...product, apiId: catalogProduct.apiId } : product;
};

const getBackendProductId = (product: Product) => {
  if (product.apiId !== undefined) {
    return String(product.apiId);
  }

  if (/^\d+$/.test(product.id)) {
    return product.id;
  }

  const catalogProduct = findCatalogProduct(product.id);
  return catalogProduct?.apiId !== undefined ? String(catalogProduct.apiId) : product.id;
};

const resolveBackendProductId = (productId: string, currentItems: CartItem[]) => {
  const existingItem = currentItems.find((item) => item.product.id === productId);
  if (existingItem) {
    return getBackendProductId(existingItem.product);
  }

  const catalogProduct = findCatalogProduct(productId);
  if (catalogProduct?.apiId !== undefined) {
    return String(catalogProduct.apiId);
  }

  return productId;
};

const inferDeliveryZoneFromCounty = (county?: string | null): DeliveryZone | null => {
  const normalizedCounty = county?.trim().toLowerCase();
  if (!normalizedCounty) {
    return null;
  }

  return normalizedCounty.includes("nairobi") ? "nairobi" : "outside_nairobi";
};

const buildDeliverySelection = (
  zone: string,
  method: DeliveryMethod,
  fields: DeliverySelectionDraft = {},
): DeliverySelection => {
  const config = getDeliveryZone(zone);
  const countyValue = fields.county?.trim() || "";

  return {
    zone: config.zone,
    county: countyValue,
    area: fields.area?.trim() || "",
    point: fields.point?.trim() || "",
    method,
    pickupFee: config.pickupFee,
    doorFee: config.doorFee,
    eta: config.eta,
  };
};

const readStoredDeliverySelection = (): DeliverySelection => {
  const saved = localStorage.getItem(DELIVERY_STORAGE_KEY);
  if (!saved) {
    return buildDeliverySelection(defaultKenyaDeliveryZone.zone, "pickup");
  }

  const parsed = JSON.parse(saved) as Partial<DeliverySelection> & {
    delivery_zone?: string;
  };

  const storedCounty = parsed.county?.trim() || "";
  const inferredZoneFromCounty = inferDeliveryZoneFromCounty(storedCounty);
  const resolvedZone = normalizeDeliveryZone(
    inferredZoneFromCounty || parsed.zone || parsed.delivery_zone || parsed.county,
  );

  return buildDeliverySelection(
    resolvedZone,
    parsed.method === "door" ? "door" : "pickup",
    {},
  );
};

const readStoredCartItems = (): CartItem[] => {
  const saved = localStorage.getItem(CART_STORAGE_KEY);
  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved) as CartItem[];
    return parsed.map((item) => ({
      ...item,
      product: augmentProductWithApiId(item.product),
    }));
  } catch {
    return [];
  }
};

const readStoredPromoSummary = (): PromoSummary | null => {
  const saved = localStorage.getItem(PROMO_STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
};

const mapBackendCartItem = (item: BackendCartItem): CartItem => ({
  product: {
    id: String(item.product_id),
    name: item.product_name,
    price: Number(item.price_per_item_kes ?? item.product_price_kes ?? 0),
    image: item.image_url,
    description: item.description || "",
    rating: 0,
    reviews: 0,
  },
  quantity: Number(item.quantity || 0),
});

const normalizeBackendCart = (payload: unknown): CartItem[] => {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map((item) => mapBackendCartItem(item as BackendCartItem))
    .filter((item) => item.quantity > 0);
};

const buildPromoRequestItems = (items: CartItem[]) =>
  items.map((item) => ({
    product_id: getBackendProductId(item.product),
    quantity: item.quantity,
  }));

const resolveValidPromoFromResponse = (
  response: PromoValidationResponse | null | undefined,
): PromoSummary => {
  if (response?.valid && response.promo) {
    return response.promo;
  }

  throw new Error(response?.message || "Promo validation returned an invalid response");
};

const buildPromoRequestDelivery = (deliverySelection: DeliverySelection) => ({
  delivery_zone: deliverySelection.zone,
  county: deliverySelection.county,
  area: deliverySelection.area,
  delivery_point: deliverySelection.point,
  method: deliverySelection.method,
  shipping_fee:
    deliverySelection.method === "door"
      ? deliverySelection.doorFee
      : deliverySelection.pickupFee,
  eta: deliverySelection.eta,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => readStoredCartItems());
  const [isOpen, setIsOpen] = useState(false);
  const [promoSummary, setPromoSummary] = useState<PromoSummary | null>(() => readStoredPromoSummary());
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [deliverySelection, setDeliverySelection] = useState<DeliverySelection>(() =>
    readStoredDeliverySelection(),
  );

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(
      DELIVERY_STORAGE_KEY,
      JSON.stringify({
        zone: deliverySelection.zone,
        method: deliverySelection.method,
      }),
    );
  }, [deliverySelection]);

  useEffect(() => {
    if (promoSummary) {
      localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(promoSummary));
    } else {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    }
  }, [promoSummary]);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee =
    deliverySelection.method === "door"
      ? deliverySelection.doorFee
      : deliverySelection.pickupFee;
  const discountAmount = promoSummary?.discount_amount || 0;
  const shippingDiscount = promoSummary?.shipping_discount || 0;
  const grandTotal = promoSummary?.final_total_kes ?? total + Math.max(shippingFee - shippingDiscount, 0);

  const refreshCartFromBackend = useCallback(async () => {
    const response = await cartAPI.get();
    const backendItems = normalizeBackendCart(response?.cart);
    setItems(backendItems);
    return backendItems;
  }, []);

  const syncBackendCartAction = useCallback(
    (action: () => Promise<unknown>) => {
      if (!isAuthenticated) {
        return;
      }

      void action()
        .then(() => refreshCartFromBackend())
        .catch((error) => {
          console.error("Failed to sync cart with backend:", error);
        });
    },
    [isAuthenticated, refreshCartFromBackend],
  );

  const removePromoCode = useCallback(async () => {
    setPromoSummary(null);
    setPromoError(null);
    try {
      await cartAPI.removePromoCode();
    } catch (error) {
      console.error("Failed to remove promo code:", error);
    }
  }, []);

  const applyPromoCode = useCallback(
    async (code: string) => {
      const normalizedCode = code.trim().toUpperCase();
      if (!normalizedCode) {
        throw new Error("Enter a promo code");
      }

      if (items.length === 0) {
        throw new Error("Add items to your cart before applying a promo code");
      }

      setPromoLoading(true);
      setPromoError(null);

      try {
        const response = (await cartAPI.applyPromoCode({
          code: normalizedCode,
          items: buildPromoRequestItems(items),
          shipping_kes: shippingFee,
          delivery: buildPromoRequestDelivery(deliverySelection),
        })) as PromoValidationResponse;

        const nextPromo = resolveValidPromoFromResponse(response);

        setPromoSummary(nextPromo);
        return nextPromo;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to apply promo code";
        setPromoError(message);
        setPromoSummary(null);
        throw error;
      } finally {
        setPromoLoading(false);
      }
    },
    [deliverySelection, items, shippingFee],
  );

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    let cancelled = false;

    const hydrateCart = async () => {
      try {
        const localItems = readStoredCartItems();
        const response = await cartAPI.get();
        let backendItems = normalizeBackendCart(response?.cart);

        if (backendItems.length === 0 && localItems.length > 0) {
          for (const item of localItems) {
            await cartAPI.add(getBackendProductId(item.product), item.quantity);
          }

          const synced = await cartAPI.get();
          backendItems = normalizeBackendCart(synced?.cart);
        }

        if (!cancelled) {
          setItems(backendItems);
        }
      } catch (error) {
        // Fallback to local stored cart if backend session expired or user stale
        if (!cancelled) {
          setItems(readStoredCartItems());
        }
      }
    };

    void hydrateCart();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, refreshCartFromBackend, user?.id]);

  useEffect(() => {
    if (!promoSummary?.code) {
      return;
    }

    if (items.length === 0) {
      void removePromoCode();
      return;
    }

    let cancelled = false;

    const refreshPromo = async () => {
      try {
        const response = (await cartAPI.applyPromoCode({
          code: promoSummary.code,
          items: buildPromoRequestItems(items),
          shipping_kes: shippingFee,
          delivery: buildPromoRequestDelivery(deliverySelection),
        })) as PromoValidationResponse;

        const nextPromo = resolveValidPromoFromResponse(response);
        if (!cancelled) {
          setPromoSummary(nextPromo);
          setPromoError(null);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : "Failed to refresh promo code";
          setPromoError(message);
          setPromoSummary(null);
        }
      }
    };

    void refreshPromo();

    return () => {
      cancelled = true;
    };
  }, [deliverySelection, items, promoSummary?.code, removePromoCode, shippingFee]);

  const addToCart = useCallback(
    (product: Product, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item,
          );
        }
        return [...prev, { product, quantity: qty }];
      });

      setIsOpen(false);
      syncBackendCartAction(() => cartAPI.add(getBackendProductId(product), qty));
    },
    [syncBackendCartAction],
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
      syncBackendCartAction(() => cartAPI.remove(resolveBackendProductId(productId, items)));
    },
    [syncBackendCartAction, items],
  );

  const updateQuantity = useCallback(
    (productId: string, qty: number) => {
      if (qty <= 0) {
        setItems((prev) => prev.filter((item) => item.product.id !== productId));
        syncBackendCartAction(() => cartAPI.remove(resolveBackendProductId(productId, items)));
        return;
      }

      setItems((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item)),
      );
      syncBackendCartAction(() => cartAPI.update(resolveBackendProductId(productId, items), qty));
    },
    [syncBackendCartAction, items],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoSummary(null);
    syncBackendCartAction(() => cartAPI.clear());
  }, [syncBackendCartAction]);

  const setDeliveryZone = useCallback((zone: string) => {
    setDeliverySelection((prev) => {
      const nextZone = normalizeDeliveryZone(zone);
      const shouldResetAddressFields = nextZone !== prev.zone;

      return buildDeliverySelection(nextZone, prev.method, {
        county: shouldResetAddressFields ? "" : prev.county,
        area: shouldResetAddressFields ? "" : prev.area,
        point: shouldResetAddressFields ? "" : prev.point,
      });
    });
  }, []);

  const setDeliveryCounty = useCallback((county: string) => {
    setDeliverySelection((prev) =>
      buildDeliverySelection(prev.zone, prev.method, {
        county,
        area: prev.area,
        point: prev.point,
      }),
    );
  }, []);

  const setDeliveryArea = useCallback((area: string) => {
    setDeliverySelection((prev) => ({ ...prev, area }));
  }, []);

  const setDeliveryPoint = useCallback((point: string) => {
    setDeliverySelection((prev) => ({ ...prev, point }));
  }, []);

  const setDeliveryMethod = useCallback((method: DeliveryMethod) => {
    setDeliverySelection((prev) => ({ ...prev, method }));
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        isOpen,
        setIsOpen,
        deliverySelection,
        setDeliveryZone,
        setDeliveryCounty,
        setDeliveryArea,
        setDeliveryPoint,
        setDeliveryMethod,
        shippingFee,
        grandTotal,
        promoSummary,
        promoLoading,
        promoError,
        discountAmount,
        shippingDiscount,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
