import { CreditCard, MapPin, ShieldCheck, Smartphone, Store, Truck } from "lucide-react";
import type { ChangeEvent } from "react";
import type { DeliverySelection } from "@/context/CartContext";
import type { DeliveryZoneConfig } from "@/data/kenyaDelivery";

interface CheckoutReviewStepProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
  };
  deliverySelection: DeliverySelection;
  activeZone: DeliveryZoneConfig;
  paymentMethodLabel: string;
  paymentMethodType: "mobile" | "card" | "bank" | null;
  paymentMethodId: string;
  paymentDetails: {
    phoneNumber: string;
    bankName: string;
  };
  shippingFee: number;
  paymentMessage: string;
  submittingOrder: boolean;
  onPaymentInputChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: () => void;
}

const inputClassName =
  "w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-primary";

const CheckoutReviewStep = ({
  formData,
  deliverySelection,
  activeZone,
  paymentMethodLabel,
  paymentMethodType,
  paymentMethodId,
  paymentDetails,
  shippingFee,
  paymentMessage,
  submittingOrder,
  onPaymentInputChange,
  onSubmit,
}: CheckoutReviewStepProps) => {
  const deliveryMethodLabel =
    deliverySelection.method === "door" ? "Door Delivery" : "Pickup Station";

  return (
    <section className="rounded-[30px] border border-primary/10 bg-card px-5 py-6 shadow-[0_22px_48px_rgba(32,24,17,0.06)] sm:px-8 sm:py-8 lg:sticky lg:top-24">
      <div className="border-b border-border/80 pb-5">
        <h2 className="font-display text-2xl text-foreground sm:text-3xl">
          Order Summary
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          Confirm your address, delivery method, and payment details before you complete the order.
        </p>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="rounded-[24px] border border-border bg-background p-5">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <p className="text-xs font-body font-semibold uppercase tracking-[0.18em] text-foreground/80">
                Address
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
              <p className="text-base font-body font-semibold text-foreground">{formData.fullName}</p>
              <p>{formData.phone}</p>
              <p>{formData.email}</p>
              <p>
                {deliverySelection.zone === "nairobi"
                  ? "Nairobi"
                  : deliverySelection.county || "County pending"}
                {" · "}
                {deliverySelection.area}
              </p>
              <p>{deliverySelection.point}</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-border bg-background p-5">
            <div className="flex items-center gap-2">
              {deliverySelection.method === "door" ? (
                <Truck className="h-4 w-4 text-primary" />
              ) : (
                <Store className="h-4 w-4 text-primary" />
              )}
              <p className="text-xs font-body font-semibold uppercase tracking-[0.18em] text-foreground/80">
                Delivery
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
              <p className="text-base font-body font-semibold text-foreground">
                {deliveryMethodLabel}
              </p>
              <p>{activeZone.label}</p>
              <p>KSh {shippingFee.toLocaleString()}</p>
              <p>{activeZone.eta}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-primary/12 bg-secondary/10 p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <p className="text-xs font-body font-semibold uppercase tracking-[0.18em] text-primary/80">
              Payment
            </p>
          </div>

          <div className="mt-4 rounded-[22px] border border-border bg-background px-4 py-4">
            <p className="text-xs font-body uppercase tracking-[0.18em] text-muted-foreground">
              Selected Method
            </p>
            <p className="mt-2 text-xl font-display text-foreground">{paymentMethodLabel}</p>
          </div>

          <div className="mt-4 rounded-[22px] border border-border bg-background px-4 py-4">
            {paymentMethodId === "mpesa" ? (
              <div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <p className="text-sm font-body font-semibold text-foreground">
                    M-Pesa STK Push
                  </p>
                </div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Enter the Safaricom number that should receive the payment prompt.
                </p>
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-body text-foreground">
                    M-Pesa Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={paymentDetails.phoneNumber}
                    onChange={onPaymentInputChange}
                    placeholder="07XXXXXXXX"
                    className={inputClassName}
                  />
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    We will send an STK push to this number as soon as you tap pay now.
                  </p>
                </div>
              </div>
            ) : paymentMethodType === "card" ? (
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <p className="text-sm font-body font-semibold text-foreground">
                    Secure card payment
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  We will share the next secure card-payment step after you confirm this order.
                </p>
              </div>
            ) : paymentMethodId.includes("airtel") ? (
              <div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <p className="text-sm font-body font-semibold text-foreground">
                    Airtel Money
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  We will confirm the Airtel Money payment step with your contact details after the
                  order is placed.
                </p>
              </div>
            ) : paymentMethodType === "bank" ? (
              <div>
                <p className="text-sm font-body font-semibold text-foreground">Bank Transfer</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Bank transfer instructions are shared after order confirmation.
                </p>
              </div>
            ) : (
              <p className="text-sm leading-7 text-muted-foreground">
                Complete your order with the selected secure payment method.
              </p>
            )}
          </div>

          {paymentMessage && (
            <div className="mt-4 rounded-[20px] border border-primary/20 bg-primary/5 px-4 py-4 text-sm leading-7 text-foreground">
              {paymentMessage}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={onSubmit}
          disabled={submittingOrder}
          className="inline-flex w-full items-center justify-center rounded-[18px] bg-primary px-6 py-4 text-sm font-body font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-[0_18px_36px_rgba(95,74,43,0.18)] transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submittingOrder
            ? paymentMethodId === "mpesa"
              ? "Sending Payment Request..."
              : "Placing Order..."
            : paymentMethodId === "mpesa"
              ? "Pay Now"
              : "Confirm Order"}
        </button>
      </div>
    </section>
  );
};

export default CheckoutReviewStep;
