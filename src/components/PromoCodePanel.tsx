import type { PromoSummary } from "@/context/CartContext";
import {
  getPromoBenefitLabel,
  getPromoCampaignLabel,
  getPromoTypeLabel,
} from "@/lib/promo";

interface PromoCodePanelProps {
  promoCode: string;
  onPromoCodeChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
  promoSummary: PromoSummary | null;
  promoLoading: boolean;
  promoError: string | null;
  totalSavingsLabel: string;
  updatedTotalLabel: string;
  placeholder?: string;
}

const PromoCodePanel = ({
  promoCode,
  onPromoCodeChange,
  onApply,
  onRemove,
  promoSummary,
  promoLoading,
  promoError,
  totalSavingsLabel,
  updatedTotalLabel,
  placeholder = "WELCOME10",
}: PromoCodePanelProps) => {
  const promoCampaignLabel = getPromoCampaignLabel(promoSummary);
  const promoBenefitLabel = getPromoBenefitLabel(promoSummary);
  const promoTypeLabel = getPromoTypeLabel(promoSummary);
  const status = promoLoading
    ? "validating"
    : promoSummary
      ? "success"
      : promoError
        ? "invalid"
        : "idle";

  return (
    <div className="rounded-[18px] border border-border bg-background/80 p-4">
      <label className="mb-2 block text-xs font-body uppercase tracking-[0.18em] text-muted-foreground">
        Promo Code
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={promoCode}
          onChange={(event) => onPromoCodeChange(event.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
        />
        {promoSummary ? (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-xl border border-border px-4 py-3 text-xs font-body font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-secondary/10"
          >
            Remove
          </button>
        ) : (
          <button
            type="button"
            onClick={onApply}
            disabled={!promoCode.trim() || promoLoading}
            className="rounded-xl bg-gold-gradient px-4 py-3 text-xs font-body font-bold uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {promoLoading ? "Checking..." : "Apply"}
          </button>
        )}
      </div>

      {status === "idle" && (
        <p className="mt-3 text-sm text-muted-foreground">
          Enter a promo code and we&apos;ll verify it against your current cart before checkout.
        </p>
      )}

      {status === "validating" && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Checking whether this promo code is available for your current order.
        </div>
      )}

      {status === "success" && promoSummary && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <p className="font-semibold">
            {promoSummary.message || `${promoSummary.code} applied successfully.`}
          </p>
          <p className="mt-1 text-emerald-700">
            {promoSummary.code} · {promoTypeLabel}
          </p>
          {promoCampaignLabel && (
            <p className="mt-1 text-emerald-700">{promoCampaignLabel}</p>
          )}
          {promoBenefitLabel && (
            <p className="mt-1 text-emerald-700">{promoBenefitLabel}</p>
          )}
          <p className="mt-1 text-emerald-700">Savings: {totalSavingsLabel}</p>
          <p className="mt-1 text-emerald-700">Updated total: {updatedTotalLabel}</p>
        </div>
      )}

      {status === "invalid" && promoError && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {promoError}
        </div>
      )}
    </div>
  );
};

export default PromoCodePanel;
