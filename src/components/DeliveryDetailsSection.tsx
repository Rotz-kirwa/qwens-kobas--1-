import { MapPin, Store, Truck } from "lucide-react";
import type { DeliverySelection } from "@/context/CartContext";
import {
  getDeliveryZone,
  kenyaDeliveryZones,
  type DeliveryMethod,
} from "@/data/kenyaDelivery";
import type { DeliveryFieldErrors } from "@/lib/delivery";

interface DeliveryDetailsSectionProps {
  deliverySelection: DeliverySelection;
  setDeliveryZone: (zone: string) => void;
  setDeliveryCounty: (county: string) => void;
  setDeliveryArea: (area: string) => void;
  setDeliveryPoint: (point: string) => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  errors?: DeliveryFieldErrors;
  className?: string;
}

const getInputClassName = (hasError?: boolean) =>
  `w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors ${
    hasError
      ? "border-destructive focus:border-destructive"
      : "border-border focus:border-primary"
  }`;

const DeliveryDetailsSection = ({
  deliverySelection,
  setDeliveryZone,
  setDeliveryCounty,
  setDeliveryArea,
  setDeliveryPoint,
  setDeliveryMethod,
  errors = {},
  className = "",
}: DeliveryDetailsSectionProps) => {
  const activeZone = getDeliveryZone(deliverySelection.zone);

  return (
    <div className={`rounded-[22px] border border-primary/15 bg-secondary/10 p-4 ${className}`}>
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <p className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-foreground/80">
          Delivery in Kenya
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-body uppercase tracking-[0.18em] text-muted-foreground">
            Delivery Zone
          </label>
          <select
            value={deliverySelection.zone}
            onChange={(event) => setDeliveryZone(event.target.value)}
            className={getInputClassName()}
          >
            {kenyaDeliveryZones.map((zone) => (
              <option key={zone.zone} value={zone.zone}>
                {zone.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-muted-foreground">
            {activeZone.label} shipping is KSh {activeZone.doorFee.toLocaleString()}.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-body uppercase tracking-[0.18em] text-muted-foreground">
              County
            </label>
            <input
              type="text"
              value={deliverySelection.county}
              onChange={(event) => setDeliveryCounty(event.target.value)}
              placeholder={activeZone.countyPlaceholder}
              className={getInputClassName(Boolean(errors.county))}
            />
            {errors.county && (
              <p className="mt-2 text-xs text-destructive">{errors.county}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-body uppercase tracking-[0.18em] text-muted-foreground">
              Area / Town / Estate
            </label>
            <input
              type="text"
              value={deliverySelection.area}
              onChange={(event) => setDeliveryArea(event.target.value)}
              placeholder={activeZone.areaPlaceholder}
              className={getInputClassName(Boolean(errors.area))}
            />
            {errors.area && (
              <p className="mt-2 text-xs text-destructive">{errors.area}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-body uppercase tracking-[0.18em] text-muted-foreground">
            Exact Delivery Point
          </label>
          <input
            type="text"
            value={deliverySelection.point}
            onChange={(event) => setDeliveryPoint(event.target.value)}
            placeholder={activeZone.pointPlaceholder}
            className={getInputClassName(Boolean(errors.point))}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Enter the exact estate, stage, building, landmark, or pickup point that works best for
            your delivery.
          </p>
          {errors.point && (
            <p className="mt-2 text-xs text-destructive">{errors.point}</p>
          )}
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
                  Delivery fee KSh {activeZone.pickupFee.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ready for pickup in {activeZone.eta}
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
                  Delivery fee KSh {activeZone.doorFee.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Estimated arrival in {activeZone.eta}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetailsSection;
