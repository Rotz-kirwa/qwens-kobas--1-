import { Mail, MapPin, Phone, UserRound } from "lucide-react";
import type { ChangeEvent } from "react";
import type { DeliveryFieldErrors } from "@/lib/delivery";
import type { DeliverySelection } from "@/context/CartContext";
import type { DeliveryZoneConfig } from "@/data/kenyaDelivery";

interface CheckoutAddressStepProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
  };
  deliverySelection: DeliverySelection;
  activeZone: DeliveryZoneConfig;
  errors: DeliveryFieldErrors;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSetDeliveryZone: (value: string) => void;
  onSetDeliveryCounty: (value: string) => void;
  onSetDeliveryArea: (value: string) => void;
  onSetDeliveryPoint: (value: string) => void;
  onContinue: () => void;
}

const getInputClassName = (hasError = false) =>
  `w-full rounded-2xl border bg-background px-4 py-3.5 text-sm outline-none transition-colors ${
    hasError
      ? "border-destructive focus:border-destructive"
      : "border-border focus:border-primary"
  }`;

const CheckoutAddressStep = ({
  formData,
  deliverySelection,
  activeZone,
  errors,
  onInputChange,
  onSetDeliveryZone,
  onSetDeliveryCounty,
  onSetDeliveryArea,
  onSetDeliveryPoint,
  onContinue,
}: CheckoutAddressStepProps) => {
  const isWithinNairobi = deliverySelection.zone === "nairobi";

  return (
    <section className="rounded-[30px] border border-primary/10 bg-card px-5 py-6 shadow-[0_22px_48px_rgba(32,24,17,0.06)] sm:px-8 sm:py-8">
      <div className="flex flex-col gap-3 border-b border-border/80 pb-5">
        <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-primary/80">
          Step 1
        </p>
        <h2 className="font-display text-3xl text-foreground sm:text-[2.35rem]">
          Address & Delivery Zone
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          Add your delivery details once so we can calculate the correct Kenya shipping fee and
          keep your order updates accurate.
        </p>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <div className="rounded-[24px] border border-border bg-background p-5">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-primary" />
              <p className="text-xs font-body font-semibold uppercase tracking-[0.18em] text-foreground/80">
                Contact Details
              </p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-body text-foreground">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={onInputChange}
                  placeholder="Your full name"
                  className={getInputClassName()}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-body text-foreground">Phone Number *</label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={onInputChange}
                    placeholder="07XXXXXXXX"
                    className={`${getInputClassName()} pl-11`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-body text-foreground">Email Address *</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onInputChange}
                  placeholder="you@example.com"
                  className={`${getInputClassName()} pl-11`}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-border bg-background p-5">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <p className="text-xs font-body font-semibold uppercase tracking-[0.18em] text-foreground/80">
                Delivery Address
              </p>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-body text-foreground">Delivery Zone *</label>
                <select
                  value={deliverySelection.zone}
                  onChange={(event) => onSetDeliveryZone(event.target.value)}
                  className={getInputClassName()}
                >
                  <option value="nairobi">Within Nairobi</option>
                  <option value="outside_nairobi">Outside Nairobi</option>
                </select>
              </div>

              {isWithinNairobi ? (
                <div className="rounded-2xl border border-primary/12 bg-primary/5 px-4 py-3">
                  <p className="text-xs font-body font-semibold uppercase tracking-[0.18em] text-primary/80">
                    County
                  </p>
                  <p className="mt-2 text-sm font-body text-foreground">Nairobi</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Nairobi deliveries are charged at KSh 300 and are usually ready the same day or
                    next day.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-body text-foreground">County *</label>
                  <input
                    type="text"
                    value={deliverySelection.county}
                    onChange={(event) => onSetDeliveryCounty(event.target.value)}
                    placeholder={activeZone.countyPlaceholder}
                    className={getInputClassName(Boolean(errors.county))}
                  />
                  {errors.county && (
                    <p className="mt-2 text-xs text-destructive">{errors.county}</p>
                  )}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-body text-foreground">
                    {isWithinNairobi ? "Area" : "Town / Area"} *
                  </label>
                  <input
                    type="text"
                    value={deliverySelection.area}
                    onChange={(event) => onSetDeliveryArea(event.target.value)}
                    placeholder={activeZone.areaPlaceholder}
                    className={getInputClassName(Boolean(errors.area))}
                  />
                  {errors.area && <p className="mt-2 text-xs text-destructive">{errors.area}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-body text-foreground">Country</label>
                  <div className="rounded-2xl border border-border bg-secondary/10 px-4 py-3.5 text-sm text-foreground">
                    Kenya
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-body text-foreground">
                  Exact Delivery Point *
                </label>
                <textarea
                  value={deliverySelection.point}
                  onChange={(event) => onSetDeliveryPoint(event.target.value)}
                  placeholder={activeZone.pointPlaceholder}
                  className={`${getInputClassName(Boolean(errors.point))} min-h-[120px] resize-none`}
                />
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  Enter the exact estate, stage, building, landmark, or pickup point that works
                  best for your delivery.
                </p>
                {errors.point && <p className="mt-2 text-xs text-destructive">{errors.point}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-primary/12 bg-secondary/10 p-5">
          <p className="text-xs font-body font-semibold uppercase tracking-[0.18em] text-primary/80">
            Delivery Preview
          </p>
          <h3 className="mt-3 font-display text-2xl text-foreground">Kenya shipping summary</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Your delivery zone controls the fee automatically, then you will choose pickup station
            or door delivery in the next step.
          </p>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-border bg-background px-4 py-4">
              <p className="text-xs font-body uppercase tracking-[0.18em] text-muted-foreground">
                Selected Zone
              </p>
              <p className="mt-2 text-lg font-body font-semibold text-foreground">
                {activeZone.label}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background px-4 py-4">
              <p className="text-xs font-body uppercase tracking-[0.18em] text-muted-foreground">
                Delivery Fee
              </p>
              <p className="mt-2 text-lg font-body font-semibold text-foreground">
                KSh {activeZone.doorFee.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{activeZone.eta}</p>
            </div>

            <div className="rounded-2xl border border-border bg-background px-4 py-4">
              <p className="text-xs font-body uppercase tracking-[0.18em] text-muted-foreground">
                Secure Checkout
              </p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Your address is saved into the order summary and used again at delivery, payment,
                and confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center justify-center rounded-[18px] bg-primary px-6 py-4 text-sm font-body font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-[0_18px_36px_rgba(95,74,43,0.18)] transition-all hover:bg-primary/90"
        >
          Continue to Delivery
        </button>
      </div>
    </section>
  );
};

export default CheckoutAddressStep;
