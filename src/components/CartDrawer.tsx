import { useEffect } from "react";
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

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 top-auto z-50 flex h-[min(84svh,calc(100svh-0.5rem))] max-h-[calc(100svh-0.5rem)] w-full flex-col overflow-hidden rounded-t-[2rem] border border-border bg-card shadow-[0_-24px_60px_rgba(0,0,0,0.16)] overscroll-contain md:inset-y-0 md:left-auto md:right-0 md:top-0 md:h-auto md:max-h-none md:max-w-md md:rounded-none md:rounded-l-[1.75rem] md:border-y-0 md:border-r-0"
          >
            <div className="border-b border-border px-4 pb-3 pt-2 md:px-6 md:py-6">
              <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-border md:hidden" />
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold md:text-2xl">Your Cart</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground md:hidden">
                    {items.length} item{items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
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
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 pb-32 space-y-4 overscroll-contain md:p-6 md:space-y-6 md:pb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 border-b border-border/50 pb-4 md:gap-4 md:pb-6">
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 font-display text-base font-semibold leading-snug md:text-lg">{item.product.name}</h3>
                        <p className="text-sm text-primary font-body font-semibold">
                          KSh {item.product.price.toLocaleString()}
                        </p>
                        <div className="mt-3 flex items-center gap-2 md:gap-3">
                          <div className="flex items-center border border-border rounded-sm">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-sm font-body md:px-3">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
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
                      <p className="shrink-0 font-display text-base font-semibold text-foreground md:text-lg">
                        KSh {(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <div className="rounded-[20px] border border-primary/15 bg-secondary/10 p-3.5 md:hidden">
                    <div className="mb-3 flex items-center gap-2 md:mb-4">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/80 md:text-sm">
                        Delivery Across Kenya
                      </p>
                    </div>

                    <div className="space-y-2.5 md:space-y-3">
                      <div>
                        <label className="mb-1 block text-[10px] font-body uppercase tracking-[0.16em] text-muted-foreground md:text-xs">
                          Choose your county
                        </label>
                        <select
                          value={deliverySelection.county}
                          onChange={(event) => setCounty(event.target.value)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary md:px-4 md:py-3"
                        >
                          {kenyaDeliveryLocations.map((location) => (
                            <option key={location.county} value={location.county}>
                              {location.county}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-[10px] font-body uppercase tracking-[0.16em] text-muted-foreground md:text-xs">
                          Major delivery point
                        </label>
                        <select
                          value={deliverySelection.point}
                          onChange={(event) => setDeliveryPoint(event.target.value)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary md:px-4 md:py-3"
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
                          className={`rounded-[18px] border p-3 text-left transition-all md:rounded-[20px] md:p-4 ${
                            deliverySelection.method === "pickup"
                              ? "border-primary bg-primary/5 shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
                              : "border-border bg-background"
                          }`}
                        >
                          <div className="flex items-start gap-2.5 md:gap-3">
                            <div className="rounded-xl bg-secondary/40 p-2">
                              <Store className="h-4 w-4 text-primary md:h-5 md:w-5" />
                            </div>
                            <div>
                              <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-foreground/85 md:text-sm">
                                Pickup Station
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground md:text-sm">
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
                          className={`rounded-[18px] border p-3 text-left transition-all md:rounded-[20px] md:p-4 ${
                            deliverySelection.method === "door"
                              ? "border-primary bg-primary/5 shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
                              : "border-border bg-background"
                          }`}
                        >
                          <div className="flex items-start gap-2.5 md:gap-3">
                            <div className="rounded-xl bg-secondary/40 p-2">
                              <Truck className="h-4 w-4 text-primary md:h-5 md:w-5" />
                            </div>
                            <div>
                              <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-foreground/85 md:text-sm">
                                Door Delivery
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground md:text-sm">
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
                </div>

                <div className="sticky bottom-0 border-t border-border bg-card/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-card/92 md:static md:space-y-4 md:border-t md:bg-transparent md:px-6 md:py-6 md:backdrop-blur-0">
                  <div className="hidden rounded-[22px] border border-primary/15 bg-secondary/10 p-4 md:block">
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

                  <div className="mb-2 rounded-2xl border border-primary/10 bg-secondary/10 px-3 py-2 text-[11px] text-muted-foreground md:hidden">
                    <span className="font-semibold text-foreground">{deliverySelection.method === "pickup" ? "Pickup" : "Door Delivery"}</span>
                    {" · "}
                    {deliverySelection.point}
                    {" · "}
                    KSh {shippingFee.toLocaleString()}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs text-muted-foreground uppercase tracking-wide md:text-sm">Subtotal</span>
                    <span className="font-display text-xl font-semibold text-primary md:text-2xl">
                      KSh {total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs text-muted-foreground uppercase tracking-wide md:text-sm">
                      Shipping
                    </span>
                    <span className="font-body text-sm font-semibold text-foreground">
                      KSh {shippingFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3 md:pt-4">
                    <span className="font-body text-xs text-muted-foreground uppercase tracking-wide md:text-sm">
                      Total
                    </span>
                    <span className="font-display text-xl font-semibold text-primary md:text-2xl">
                      KSh {grandTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground font-body md:gap-3 md:text-xs">
                    <span>🔒 Secure Checkout</span>
                    <span>·</span>
                    <span>{deliverySelection.county} delivery ready</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full rounded-sm bg-gold-gradient py-3.5 text-primary-foreground font-body text-sm font-bold uppercase tracking-widest transition-opacity hover:opacity-90 md:py-4"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full pb-[max(env(safe-area-inset-bottom),0.35rem)] text-center text-xs text-muted-foreground hover:text-destructive font-body tracking-wide transition-colors"
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
