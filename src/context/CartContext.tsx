import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  defaultKenyaDelivery,
  getCountyDelivery,
  type DeliveryMethod,
} from "@/data/kenyaDelivery";

export interface Product {
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
  county: string;
  point: string;
  method: DeliveryMethod;
  pickupFee: number;
  doorFee: number;
  eta: string;
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
  setCounty: (county: string) => void;
  setDeliveryPoint: (point: string) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  shippingFee: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("queenkoba-cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [deliverySelection, setDeliverySelection] = useState<DeliverySelection>(() => {
    const saved = localStorage.getItem("queenkoba-delivery");
    if (saved) {
      return JSON.parse(saved);
    }

    return {
      county: defaultKenyaDelivery.county,
      point: defaultKenyaDelivery.points[0],
      method: "pickup",
      pickupFee: defaultKenyaDelivery.pickupFee,
      doorFee: defaultKenyaDelivery.doorFee,
      eta: defaultKenyaDelivery.eta,
    };
  });

  useEffect(() => {
    localStorage.setItem("queenkoba-cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("queenkoba-delivery", JSON.stringify(deliverySelection));
  }, [deliverySelection]);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const setCounty = useCallback((county: string) => {
    const config = getCountyDelivery(county);
    setDeliverySelection((prev) => ({
      ...prev,
      county: config.county,
      point: config.points[0],
      pickupFee: config.pickupFee,
      doorFee: config.doorFee,
      eta: config.eta,
    }));
  }, []);

  const setDeliveryPoint = useCallback((point: string) => {
    setDeliverySelection((prev) => ({ ...prev, point }));
  }, []);

  const setDeliveryMethod = useCallback((method: DeliveryMethod) => {
    setDeliverySelection((prev) => ({ ...prev, method }));
  }, []);

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const shippingFee =
    deliverySelection.method === "door"
      ? deliverySelection.doorFee
      : deliverySelection.pickupFee;
  const grandTotal = total + shippingFee;

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
        setCounty,
        setDeliveryPoint,
        setDeliveryMethod,
        shippingFee,
        grandTotal,
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
