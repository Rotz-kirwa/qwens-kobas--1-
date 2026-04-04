import { ArrowLeft, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdaptiveImage from "@/components/AdaptiveImage";
import DeliveryDetailsSection from "@/components/DeliveryDetailsSection";
import PromoCodePanel from "@/components/PromoCodePanel";
import SEO from "@/components/SEO";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { setAuthRedirect } from "@/lib/authRedirect";
import {
  getDeliveryFieldErrors,
  getDeliverySummaryLabel,
  getFirstDeliveryError,
} from "@/lib/delivery";
import { sanitizePromoCodeInput } from "@/lib/promo";

const Cart = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    total,
    clearCart,
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
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState(promoSummary?.code || "");
  const [showDeliveryErrors, setShowDeliveryErrors] = useState(false);
  const deliveryErrors = showDeliveryErrors ? getDeliveryFieldErrors(deliverySelection) : {};
  const deliverySummaryLabel = getDeliverySummaryLabel(deliverySelection);

  useEffect(() => {
    setPromoCode(promoSummary?.code || "");
  }, [promoSummary?.code]);

  const handleCheckout = () => {
    const deliveryError = getFirstDeliveryError(deliverySelection);
    if (deliveryError) {
      setShowDeliveryErrors(true);
      toast({
        title: "Delivery details needed",
        description: deliveryError,
        variant: "destructive",
      });
      return;
    }

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
    <main className="min-h-screen overflow-x-hidden bg-[#f8f5ef] pb-20 pt-24">
      <SEO
        title="Your Cart"
        description="Review your Queen Koba cart and delivery details before checkout."
        path="/cart"
        robots="noindex,nofollow"
      />

      <div className="container mx-auto max-w-7xl px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-body text-sm uppercase tracking-wide">Back</span>
        </button>

        <div className="mb-8 rounded-[32px] border border-[#eadfce] bg-[linear-gradient(180deg,#fffaf3_0%,#f7efe2_100%)] px-6 py-8 shadow-[0_20px_50px_rgba(45,30,12,0.06)] md:px-10">
          <p className="mb-3 text-sm font-body uppercase tracking-[0.28em] text-primary">Your Bag</p>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h1 className="font-display text-4xl font-light md:text-5xl">
                Review your <span className="italic text-gold-gradient">routine</span> before checkout
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground/75 md:text-base">
                This pass brings the cart closer to a premium skincare flow: clearer product context,
                delivery setup, savings visibility, and a stronger bridge into checkout.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <span className="rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-[11px] font-body font-semibold uppercase tracking-[0.18em] text-primary">
                Secure checkout
              </span>
              <span className="rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-[11px] font-body font-semibold uppercase tracking-[0.18em] text-primary">
                Kenya delivery
              </span>
              <span className="rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-[11px] font-body font-semibold uppercase tracking-[0.18em] text-primary">
                Promo-ready
              </span>
            </div>
          </div>
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
            <section className="rounded-[32px] border border-[#eadfce] bg-white p-5 shadow-[0_20px_46px_rgba(45,30,12,0.05)] sm:p-8">
              <div className="mb-6 flex flex-col gap-3 border-b border-[#eadfce] pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-primary/80">
                    Selected products
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-foreground">Your Queen Koba bag</h2>
                </div>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-sm font-body font-semibold text-primary"
                >
                  Continue shopping
                </Link>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="grid gap-4 rounded-[28px] border border-[#eadfce] bg-[#fcf8f2] p-4 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:p-5"
                  >
                    <div className="overflow-hidden rounded-[22px] bg-white">
                      {item.product.image ? (
                        <AdaptiveImage
                          src={item.product.image}
                          alt={item.product.name}
                          className="aspect-square w-full object-cover object-center"
                          sizes="112px"
                        />
                      ) : (
                        <div className="aspect-square w-full bg-secondary/30" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-body uppercase tracking-[0.2em] text-primary/75">
                        Routine item
                      </p>
                      <h2 className="mt-2 font-display text-lg font-semibold leading-snug sm:text-2xl">
                        {item.product.name}
                      </h2>
                      <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                        {item.product.description}
                      </p>
                      <p className="mt-3 text-sm font-body font-semibold text-primary">
                        KSh {item.product.price.toLocaleString()}
                      </p>

                      <div className="mt-4 flex items-center gap-2.5">
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

                    <div className="flex flex-col items-start justify-between gap-3 sm:items-end">
                      <div className="rounded-full border border-primary/15 bg-white px-3 py-1 text-[11px] font-body uppercase tracking-[0.18em] text-primary/80">
                        Qty {item.quantity}
                      </div>
                      <p className="shrink-0 font-display text-xl font-semibold text-foreground sm:text-2xl">
                        KSh {(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
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

            <aside className="rounded-[32px] border border-[#eadfce] bg-white p-5 shadow-[0_20px_46px_rgba(45,30,12,0.05)] sm:p-8 lg:sticky lg:top-24">
              <div className="border-b border-[#eadfce] pb-5">
                <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-primary/80">
                  Order summary
                </p>
                <h3 className="mt-2 font-display text-3xl text-foreground">Ready to check out</h3>
                <div className="mt-4 space-y-2 text-sm text-foreground/75">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{isAuthenticated ? "Signed in and ready to continue." : "Sign in at checkout to place your order."}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Truck className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{deliverySummaryLabel} delivery configuration saved.</span>
                  </div>
                </div>
              </div>

              <DeliveryDetailsSection
                deliverySelection={deliverySelection}
                setDeliveryZone={setDeliveryZone}
                setDeliveryCounty={setDeliveryCounty}
                setDeliveryArea={setDeliveryArea}
                setDeliveryPoint={setDeliveryPoint}
                setDeliveryMethod={setDeliveryMethod}
                errors={deliveryErrors}
              />

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
                <PromoCodePanel
                  promoCode={promoCode}
                  onPromoCodeChange={(value) => setPromoCode(sanitizePromoCodeInput(value))}
                  onApply={handleApplyPromo}
                  onRemove={handleRemovePromo}
                  promoSummary={promoSummary}
                  promoLoading={promoLoading}
                  promoError={promoError}
                  totalSavingsLabel={`KSh ${(discountAmount + shippingDiscount).toLocaleString()}`}
                  updatedTotalLabel={`KSh ${grandTotal.toLocaleString()}`}
                />
                {promoSummary?.description && (
                  <div className="rounded-[20px] border border-primary/12 bg-primary/5 px-4 py-4 text-sm leading-7 text-foreground/80">
                    {promoSummary.description}
                  </div>
                )}
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
                  <span>{deliverySummaryLabel} delivery ready</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full rounded-full bg-gold-gradient py-4 text-sm font-body font-bold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Continue to Checkout
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
