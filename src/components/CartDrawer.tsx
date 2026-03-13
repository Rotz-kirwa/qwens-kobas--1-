import { X, Plus, Minus, Trash2, ShoppingBag, MapPin, Truck, Store } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getCountyDelivery, kenyaDeliveryLocations } from "@/data/kenyaDelivery";
import { useToast } from "@/hooks/use-toast";
import { setAuthRedirect } from "@/lib/authRedirect";

const CartDrawer = () => {
  const {
    items,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    total,
    clearCart,
    deliverySelection,
    setCounty,
    setDeliveryPoint,
    setDeliveryMethod,
    shippingFee,
    grandTotal,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const activeCounty = getCountyDelivery(deliverySelection.county);

  const handleCheckout = () => {
    setIsOpen(false);
    if (!isAuthenticated) {
      setAuthRedirect("/checkout");
      toast({
        title: "Sign In Required",
        description: "Please sign in or create an account before proceeding to checkout.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-2xl font-semibold">Your Cart</h2>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <ShoppingBag className="w-12 h-12" />
                <p className="font-body text-sm">Your cart is empty</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-primary font-body text-sm tracking-widest uppercase hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 pb-6 border-b border-border/50">
                      <div className="flex-1">
                        <h3 className="font-display text-lg font-semibold mb-1">{item.product.name}</h3>
                        <p className="text-sm text-primary font-body font-semibold">
                          KSh {item.product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-border rounded-sm">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-sm font-body">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="font-display text-lg font-semibold text-foreground">
                        KSh {(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-border space-y-4">
                  <div className="rounded-[22px] border border-primary/15 bg-secondary/10 p-4">
                    <div className="mb-4 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-foreground/80">
                        Delivery Across Kenya
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-xs font-body uppercase tracking-[0.18em] text-muted-foreground">
                          Choose your county
                        </label>
                        <select
                          value={deliverySelection.county}
                          onChange={(event) => setCounty(event.target.value)}
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                        >
                          {kenyaDeliveryLocations.map((location) => (
                            <option key={location.county} value={location.county}>
                              {location.county}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-body uppercase tracking-[0.18em] text-muted-foreground">
                          Major delivery point
                        </label>
                        <select
                          value={deliverySelection.point}
                          onChange={(event) => setDeliveryPoint(event.target.value)}
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                        >
                          {activeCounty.points.map((point) => (
                            <option key={point} value={point}>
                              {point}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-3">
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod("pickup")}
                          className={`rounded-[20px] border p-4 text-left transition-all ${
                            deliverySelection.method === "pickup"
                              ? "border-primary bg-primary/5 shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
                              : "border-border bg-background"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-secondary/40 p-2">
                              <Store className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-body text-sm font-semibold uppercase tracking-[0.16em] text-foreground/85">
                                Pickup Station
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                Delivery fee KSh {activeCounty.pickupFee.toLocaleString()}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Ready for pickup in {activeCounty.eta}
                              </p>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeliveryMethod("door")}
                          className={`rounded-[20px] border p-4 text-left transition-all ${
                            deliverySelection.method === "door"
                              ? "border-primary bg-primary/5 shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
                              : "border-border bg-background"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-secondary/40 p-2">
                              <Truck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-body text-sm font-semibold uppercase tracking-[0.16em] text-foreground/85">
                                Door Delivery
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                Delivery fee KSh {activeCounty.doorFee.toLocaleString()}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Estimated arrival in {activeCounty.eta}
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-muted-foreground uppercase tracking-wide">Subtotal</span>
                    <span className="font-display text-2xl font-semibold text-primary">
                      KSh {total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-muted-foreground uppercase tracking-wide">
                      Shipping
                    </span>
                    <span className="font-body text-sm font-semibold text-foreground">
                      KSh {shippingFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border pt-4">
                    <span className="font-body text-sm text-muted-foreground uppercase tracking-wide">
                      Total
                    </span>
                    <span className="font-display text-2xl font-semibold text-primary">
                      KSh {grandTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
                    <span>🔒 Secure Checkout</span>
                    <span>·</span>
                    <span>{deliverySelection.county} delivery ready</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-4 bg-gold-gradient text-primary-foreground font-body font-bold text-sm tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full text-center text-xs text-muted-foreground hover:text-destructive font-body tracking-wide transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
