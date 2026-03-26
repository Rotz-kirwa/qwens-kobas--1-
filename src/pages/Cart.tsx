import { ArrowLeft, MapPin, Minus, Plus, ShoppingBag, Store, Trash2, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getCountyDelivery, kenyaDeliveryLocations } from "@/data/kenyaDelivery";
import { useToast } from "@/hooks/use-toast";
import { setAuthRedirect } from "@/lib/authRedirect";
import { getPromoBenefitLabel, getPromoCampaignLabel, sanitizePromoCodeInput } from "@/lib/promo";

const Cart = () => {
  const {
    items,
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
    promoSummary,
    promoLoading,
    promoError,
    discountAmount,
    shippingDiscount,
    applyPromoCode,
    removePromoCode,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const activeCounty = getCountyDelivery(deliverySelection.county);
  const [promoCode, setPromoCode] = useState(promoSummary?.code || "");
  const promoCampaignLabel = getPromoCampaignLabel(promoSummary);
  const promoBenefitLabel = getPromoBenefitLabel(promoSummary);

  useEffect(() => {
    setPromoCode(promoSummary?.code || "");
  }, [promoSummary?.code]);

  const handleCheckout = () => {
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

  const handleApplyPromo = async () => {
    try {
      const applied = await applyPromoCode(promoCode);
      toast({
        title: "Promo applied",
        description: applied.message || `${applied.code} is active on your cart.`,
      });
    } catch (error) {
      toast({
        title: "Promo unavailable",
        description: error instanceof Error ? error.message : "Failed to apply promo code",
        variant: "destructive",
      });
    }
  };

  const handleRemovePromo = async () => {
    await removePromoCode();
    setPromoCode("");
    toast({
      title: "Promo removed",
      description: "The discount has been removed from your cart.",
    });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-secondary/20 pb-20 pt-24">
      <SEO
        title="Your Cart"
        description="Review your Queen Koba cart and delivery details before checkout."
        path="/cart"
        robots="noindex,nofollow"
      />

      <div className="container mx-auto max-w-6xl px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-body text-sm uppercase tracking-wide">Back</span>
        </button>

        <div className="mb-8">
          <p className="mb-3 text-sm font-body uppercase tracking-[0.28em] text-primary">Cart</p>
          <h1 className="font-display text-4xl font-light md:text-5xl">
            Your <span className="italic text-gold-gradient">Cart</span>
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="luxury-card flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6 text-center sm:p-8">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <h2 className="font-display text-3xl">Your cart is empty</h2>
            <p className="max-w-md text-sm font-body leading-7 text-muted-foreground">
              Add your Queen Koba favorites, then come back here to choose delivery and continue to checkout.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="rounded-sm bg-gold-gradient px-6 py-3 text-sm font-body font-bold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.95fr)] lg:gap-8">
            <section className="luxury-card p-5 sm:p-8">
              <div className="space-y-5">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 border-b border-border/50 pb-5 sm:gap-4 sm:pb-6"
                  >
                    <div className="min-w-0 flex-1">
                      <h2 className="mb-1 font-display text-lg font-semibold leading-snug sm:text-xl">
                        {item.product.name}
                      </h2>
                      <p className="text-sm font-body font-semibold text-primary">
                        KSh {item.product.price.toLocaleString()}
                      </p>

                      <div className="mt-3 flex items-center gap-2.5">
                        <div className="flex items-center rounded-sm border border-border">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-2 text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-sm font-body">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-2 text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="shrink-0 font-display text-lg font-semibold text-foreground sm:text-xl">
                      KSh {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={clearCart}
                className="mt-6 text-xs font-body uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-destructive"
              >
                Clear Cart
              </button>
            </section>

            <aside className="luxury-card p-5 sm:p-8 lg:sticky lg:top-24">
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

              <div className="mt-6 space-y-4 border-t border-border pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-body uppercase tracking-wide text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-display text-2xl font-semibold text-primary">
                    KSh {total.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-body uppercase tracking-wide text-muted-foreground">
                    Shipping
                  </span>
                  <span className="text-sm font-body font-semibold text-foreground">
                    KSh {shippingFee.toLocaleString()}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm font-body text-emerald-700">
                    <span className="uppercase tracking-wide">
                      Discount{promoSummary?.code ? ` · ${promoSummary.code}` : ""}
                    </span>
                    <span>-KSh {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {shippingDiscount > 0 && (
                  <div className="flex items-center justify-between text-sm font-body text-emerald-700">
                    <span className="uppercase tracking-wide">Shipping Discount</span>
                    <span>-KSh {shippingDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="rounded-[18px] border border-border bg-background/80 p-4">
                  <label className="mb-2 block text-xs font-body uppercase tracking-[0.18em] text-muted-foreground">
                    Promo Code
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(event) => setPromoCode(sanitizePromoCodeInput(event.target.value))}
                      placeholder="WELCOME10"
                      className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    />
                    {promoSummary ? (
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="rounded-xl border border-border px-4 py-3 text-xs font-body font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-secondary/10"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={!promoCode.trim() || promoLoading}
                        className="rounded-xl bg-gold-gradient px-4 py-3 text-xs font-body font-bold uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        {promoLoading ? "Applying..." : "Apply"}
                      </button>
                    )}
                  </div>
                  {promoSummary && (
                    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                      <p className="font-semibold">
                        {promoSummary.code} applied. You are saving KSh {(discountAmount + shippingDiscount).toLocaleString()}.
                      </p>
                      {promoCampaignLabel && (
                        <p className="mt-1 text-emerald-700">{promoCampaignLabel}</p>
                      )}
                      {promoBenefitLabel && (
                        <p className="mt-1 text-emerald-700">{promoBenefitLabel}</p>
                      )}
                    </div>
                  )}
                  {promoError && !promoSummary && (
                    <p className="mt-2 text-sm text-destructive">{promoError}</p>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm font-body uppercase tracking-wide text-muted-foreground">
                    Total
                  </span>
                  <span className="font-display text-2xl font-semibold text-primary">
                    KSh {grandTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-body text-muted-foreground">
                  <span>Secure Checkout</span>
                  <span>·</span>
                  <span>{deliverySelection.county} delivery ready</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full rounded-sm bg-gold-gradient py-4 text-sm font-body font-bold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Proceed to Checkout
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
