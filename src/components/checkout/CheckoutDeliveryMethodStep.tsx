import { Store, Truck } from "lucide-react";
import type { DeliverySelection } from "@/context/CartContext";
import type { DeliveryMethod, DeliveryZoneConfig } from "@/data/kenyaDelivery";

interface CheckoutDeliveryMethodStepProps {
  deliverySelection: DeliverySelection;
  activeZone: DeliveryZoneConfig;
  shippingFee: number;
  onSelectMethod: (method: DeliveryMethod) => void;
  onBack: () => void;
  onContinue: () => void;
}

const methodCards: Array<{
  id: DeliveryMethod;
  title: string;
  description: string;
  icon: typeof Store;
}> = [
  {
    id: "pickup",
    title: "Pickup Station",
    description: "Collect from a nearby pickup location when it is ready.",
    icon: Store,
  },
  {
    id: "door",
    title: "Door Delivery",
    description: "Delivered directly to the exact location you entered.",
    icon: Truck,
  },
];

const CheckoutDeliveryMethodStep = ({
  deliverySelection,
  activeZone,
  shippingFee,
  onSelectMethod,
  onBack,
  onContinue,
}: CheckoutDeliveryMethodStepProps) => {
  return (
    <section className="rounded-[30px] border border-primary/10 bg-card px-5 py-6 shadow-[0_22px_48px_rgba(32,24,17,0.06)] sm:px-8 sm:py-8">
      <div className="border-b border-border/80 pb-5">
        <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-primary/80">
          Step 2
        </p>
        <h2 className="mt-3 font-display text-3xl text-foreground sm:text-[2.35rem]">
          Delivery Method
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          Choose how you would like the order delivered. Your shipping rate stays at KSh{" "}
          {shippingFee.toLocaleString()} for {activeZone.label.toLowerCase()}.
        </p>
      </div>

      <div className="mt-6 rounded-[24px] border border-primary/12 bg-secondary/10 p-5">
        <p className="text-xs font-body uppercase tracking-[0.18em] text-muted-foreground">
          Delivery Address
        </p>
        <p className="mt-2 text-base font-body font-semibold text-foreground">
          {deliverySelection.zone === "nairobi"
            ? `Nairobi · ${deliverySelection.area || "Area pending"}`
            : `${deliverySelection.county || "County pending"} · ${
                deliverySelection.area || "Area pending"
              }`}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {deliverySelection.point || "Exact delivery point will appear here once added."}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {methodCards.map((method) => {
          const Icon = method.icon;
          const selected = deliverySelection.method === method.id;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelectMethod(method.id)}
              className={`flex w-full items-start gap-4 rounded-[24px] border px-5 py-5 text-left transition-all ${
                selected
                  ? "border-primary bg-primary/5 shadow-[0_18px_34px_rgba(95,74,43,0.12)]"
                  : "border-border bg-background hover:border-primary/20 hover:bg-secondary/5"
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                  selected ? "bg-primary text-primary-foreground" : "bg-secondary/30 text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-2xl text-foreground">{method.title}</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {method.description}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card px-4 py-3 text-left sm:min-w-[12rem]">
                    <p className="text-xs font-body uppercase tracking-[0.18em] text-muted-foreground">
                      Delivery Fee
                    </p>
                    <p className="mt-2 text-lg font-body font-semibold text-foreground">
                      KSh {shippingFee.toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{activeZone.eta}</p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-[18px] border border-border bg-background px-6 py-4 text-sm font-body font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-secondary/10"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center justify-center rounded-[18px] bg-primary px-6 py-4 text-sm font-body font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-[0_18px_36px_rgba(95,74,43,0.18)] transition-all hover:bg-primary/90"
        >
          Continue to Payment
        </button>
      </div>
    </section>
  );
};

export default CheckoutDeliveryMethodStep;
