import { useMemo, useRef } from "react";
import { ArrowRight, Check, CreditCard, ShieldCheck, Smartphone } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  description: string;
  logo?: string;
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethodId: string;
  loading: boolean;
  selectionError?: string | null;
  onSelect: (methodId: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const normalizePaymentMethodKey = (method: PaymentMethod) => {
  const normalizedId = method.id.trim().toLowerCase();
  const normalizedName = method.name.trim().toLowerCase();

  if (normalizedId.includes("mpesa") || normalizedName.includes("m-pesa")) {
    return "mpesa";
  }

  if (normalizedId.includes("airtel") || normalizedName.includes("airtel")) {
    return "airtel";
  }

  if (
    normalizedId.includes("card") ||
    normalizedName.includes("visa") ||
    normalizedName.includes("mastercard")
  ) {
    return "card";
  }

  return "generic";
};

const getMethodCopy = (method: PaymentMethod) => {
  switch (normalizePaymentMethodKey(method)) {
    case "mpesa":
      return {
        badge: "Recommended",
        description: "Pay via mobile money with a fast M-Pesa STK push.",
        icon: Smartphone,
      };
    case "airtel":
      return {
        badge: null,
        description: "Use Airtel Money for a familiar mobile-wallet checkout.",
        icon: Smartphone,
      };
    case "card":
      return {
        badge: null,
        description: "Secure Visa or Mastercard payment for your order.",
        icon: CreditCard,
      };
    default:
      return {
        badge: null,
        description: method.description || "Secure payment option",
        icon: ShieldCheck,
      };
  }
};

const getMethodTheme = (method: PaymentMethod) => {
  switch (normalizePaymentMethodKey(method)) {
    case "mpesa":
      return {
        selectedCard:
          "border-emerald-700 bg-emerald-600 text-white shadow-[0_18px_34px_rgba(16,185,129,0.24)]",
        unselectedCard:
          "border-emerald-300 bg-emerald-100 hover:border-emerald-400 hover:bg-emerald-200/85",
        focusRing: "focus-visible:ring-emerald-200",
        iconSelected: "bg-white/15 text-white ring-1 ring-white/20",
        iconUnselected: "bg-white/60 text-emerald-800",
        badge: "bg-white/85 text-emerald-900",
        cardPill:
          "rounded-full border border-white/40 bg-white/70 px-3 py-1 text-[11px] font-body uppercase tracking-[0.16em] text-emerald-900",
        radioSelected: "border-emerald-600 bg-emerald-600 text-white",
        radioUnselected: "border-emerald-300 bg-white/65 text-transparent",
        title: "text-emerald-950",
        titleSelected: "text-white",
        description: "text-emerald-900/90",
        descriptionSelected: "text-white/90",
      };
    case "airtel":
      return {
        selectedCard:
          "border-rose-700 bg-rose-600 text-white shadow-[0_18px_34px_rgba(244,63,94,0.24)]",
        unselectedCard:
          "border-rose-300 bg-rose-100 hover:border-rose-400 hover:bg-rose-200/85",
        focusRing: "focus-visible:ring-rose-200",
        iconSelected: "bg-white/15 text-white ring-1 ring-white/20",
        iconUnselected: "bg-white/60 text-rose-800",
        badge: "bg-white/85 text-rose-900",
        cardPill:
          "rounded-full border border-white/40 bg-white/70 px-3 py-1 text-[11px] font-body uppercase tracking-[0.16em] text-rose-900",
        radioSelected: "border-rose-600 bg-rose-600 text-white",
        radioUnselected: "border-rose-300 bg-white/65 text-transparent",
        title: "text-rose-950",
        titleSelected: "text-white",
        description: "text-rose-900/90",
        descriptionSelected: "text-white/90",
      };
    case "card":
      return {
        selectedCard:
          "border-sky-700 bg-sky-600 text-white shadow-[0_18px_34px_rgba(14,165,233,0.24)]",
        unselectedCard:
          "border-sky-300 bg-sky-100 hover:border-sky-400 hover:bg-sky-200/85",
        focusRing: "focus-visible:ring-sky-200",
        iconSelected: "bg-white/15 text-white ring-1 ring-white/20",
        iconUnselected: "bg-white/60 text-sky-800",
        badge: "bg-white/85 text-sky-900",
        cardPill:
          "rounded-full border border-white/40 bg-white/70 px-3 py-1 text-[11px] font-body uppercase tracking-[0.16em] text-sky-900",
        radioSelected: "border-sky-600 bg-sky-600 text-white",
        radioUnselected: "border-sky-300 bg-white/65 text-transparent",
        title: "text-sky-950",
        titleSelected: "text-white",
        description: "text-sky-900/90",
        descriptionSelected: "text-white/90",
      };
    default:
      return {
        selectedCard: "border-primary bg-primary/5 shadow-[0_18px_34px_rgba(95,74,43,0.12)]",
        unselectedCard: "border-border bg-background hover:border-primary/20 hover:bg-secondary/5",
        focusRing: "focus-visible:ring-primary/25",
        iconSelected: "bg-primary text-primary-foreground",
        iconUnselected: "bg-secondary/30 text-primary",
        badge: "bg-primary/10 text-primary",
        cardPill:
          "rounded-full border border-border bg-background px-3 py-1 text-[11px] font-body uppercase tracking-[0.16em] text-muted-foreground",
        radioSelected: "border-primary bg-primary text-primary-foreground",
        radioUnselected: "border-border bg-background text-transparent",
        title: "text-foreground",
        titleSelected: "text-foreground",
        description: "text-muted-foreground",
        descriptionSelected: "text-muted-foreground",
      };
  }
};

const PaymentMethodSkeleton = () => (
  <div className="space-y-4">
    {[0, 1, 2].map((index) => (
      <div
        key={index}
        className="animate-pulse rounded-[22px] border border-border bg-background px-5 py-5"
      >
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-2xl bg-secondary/70" />
          <div className="min-w-0 flex-1">
            <div className="h-3 w-24 rounded-full bg-secondary/70" />
            <div className="mt-3 h-5 w-36 rounded-full bg-secondary/70" />
            <div className="mt-3 h-3 w-full max-w-sm rounded-full bg-secondary/60" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const PaymentMethodSelector = ({
  methods,
  selectedMethodId,
  loading,
  selectionError,
  onSelect,
  onBack,
  onContinue,
}: PaymentMethodSelectorProps) => {
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const orderedMethods = useMemo(() => {
    const recommended =
      methods.find((method) => normalizePaymentMethodKey(method) === "mpesa") ?? null;
    const others = methods.filter((method) => method.id !== recommended?.id);
    return recommended ? [recommended, ...others] : methods;
  }, [methods]);

  const moveSelection = (currentIndex: number, direction: 1 | -1) => {
    if (orderedMethods.length === 0) {
      return;
    }

    const nextIndex = (currentIndex + direction + orderedMethods.length) % orderedMethods.length;
    const nextMethod = orderedMethods[nextIndex];
    onSelect(nextMethod.id);
    rowRefs.current[nextIndex]?.focus();
  };

  return (
    <section className="rounded-[30px] border border-primary/10 bg-card px-5 py-6 shadow-[0_22px_48px_rgba(32,24,17,0.06)] sm:px-8 sm:py-8">
      <div className="border-b border-border/80 pb-5">
        <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-primary/80">
          Step 3
        </p>
        <h2 className="mt-3 font-display text-3xl text-foreground sm:text-[2.35rem]">
          Payment Method
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          Choose your preferred secure payment method. M-Pesa is the smoothest option for most
          Kenya orders.
        </p>
      </div>

      <div className="mt-6 rounded-[24px] border border-primary/12 bg-secondary/10 px-4 py-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 text-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="font-body font-semibold">Secure payment options available</span>
        </div>
        <p className="mt-2 leading-7">
          Select one option to continue to the final review and payment step.
        </p>
      </div>

      <div role="radiogroup" aria-label="Payment method options" className="mt-6">
        {loading ? (
          <PaymentMethodSkeleton />
        ) : methods.length === 0 ? (
          <div className="rounded-[18px] border border-destructive/20 bg-destructive/5 px-4 py-4 text-sm text-destructive">
            No payment methods are available right now. Please refresh and try again.
          </div>
        ) : (
          <div className="space-y-4">
            {orderedMethods.map((method, index) => {
              const key = normalizePaymentMethodKey(method);
              const methodCopy = getMethodCopy(method);
              const methodTheme = getMethodTheme(method);
              const Icon = methodCopy.icon;
              const selected = selectedMethodId === method.id;

              return (
                <button
                  key={method.id}
                  ref={(element) => {
                    rowRefs.current[index] = element;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected || (!selectedMethodId && index === 0) ? 0 : -1}
                  onClick={() => onSelect(method.id)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                      event.preventDefault();
                      moveSelection(index, 1);
                    }
                    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                      event.preventDefault();
                      moveSelection(index, -1);
                    }
                  }}
                  className={`flex w-full items-start gap-4 rounded-[24px] border px-5 py-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${methodTheme.focusRing} ${
                    selected ? methodTheme.selectedCard : methodTheme.unselectedCard
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      selected ? methodTheme.iconSelected : methodTheme.iconUnselected
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className={`font-display text-2xl ${
                              selected ? methodTheme.titleSelected : methodTheme.title
                            }`}
                          >
                            {method.name}
                          </p>
                          {methodCopy.badge && (
                            <span className={`rounded-full px-3 py-1 text-[11px] font-body font-semibold uppercase tracking-[0.16em] ${methodTheme.badge}`}>
                              {methodCopy.badge}
                            </span>
                          )}
                          {key === "card" && (
                            <span className={methodTheme.cardPill}>
                              Visa / Mastercard
                            </span>
                          )}
                        </div>
                        <p
                          className={`mt-2 max-w-xl text-sm leading-7 ${
                            selected
                              ? methodTheme.descriptionSelected
                              : methodTheme.description
                          }`}
                        >
                          {methodCopy.description}
                        </p>
                      </div>

                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? methodTheme.radioSelected
                            : methodTheme.radioUnselected
                        }`}
                        aria-hidden="true"
                      >
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectionError && (
        <div
          role="alert"
          aria-live="polite"
          className="mt-5 rounded-[18px] border border-destructive/20 bg-destructive/5 px-4 py-4 text-sm text-destructive"
        >
          {selectionError}
        </div>
      )}

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
          disabled={!selectedMethodId}
          className="inline-flex items-center justify-center gap-2 rounded-[18px] bg-primary px-6 py-4 text-sm font-body font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-[0_18px_36px_rgba(95,74,43,0.18)] transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continue to Confirm
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};

export default PaymentMethodSelector;
