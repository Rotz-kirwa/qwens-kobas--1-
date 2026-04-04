import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import AdaptiveImage from "@/components/AdaptiveImage";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import PromoCodePanel from "@/components/PromoCodePanel";
import CheckoutAddressStep from "@/components/checkout/CheckoutAddressStep";
import CheckoutDeliveryMethodStep from "@/components/checkout/CheckoutDeliveryMethodStep";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import CheckoutReviewStep from "@/components/checkout/CheckoutReviewStep";
import { useToast } from "@/hooks/use-toast";
import { getDeliveryZone } from "@/data/kenyaDelivery";
import { paymentAPI, ordersAPI, isApiOfflineError } from "@/lib/api";
import { getDeliveryFieldErrors, getFirstDeliveryError } from "@/lib/delivery";
import { sanitizePromoCodeInput } from "@/lib/promo";
import SEO from "@/components/SEO";

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  description: string;
  logo?: string;
}

interface CheckoutDraft {
  step?: number;
  paymentMethod?: string;
  paymentDetails?: {
    phoneNumber?: string;
    bankName?: string;
  };
  formData?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
}

const paymentLogos: Record<string, string> = {
  mpesa: "/payment/mpesa.svg",
  airtel: "/payment/airtel.svg",
  airtel_money: "/payment/airtel.svg",
  card: "/payment/card.svg",
  bank_transfer: "",
};

const country = "Kenya";
const CHECKOUT_STORAGE_KEY = "queenkoba-checkout-progress";
const checkoutSteps = [
  { id: 1, label: "Address", description: "Address & zone" },
  { id: 2, label: "Delivery", description: "Pickup or door" },
  { id: 3, label: "Payment", description: "Choose method" },
  { id: 4, label: "Confirm", description: "Review & pay" },
] as const;

const formatCurrency = (amount: number) => `KSh ${Math.round(amount).toLocaleString()}`;

const normalizePaymentMethodId = (value: string) => value.trim().toLowerCase();

const getPreferredMethodId = (methods: PaymentMethod[]) =>
  methods.find((method) => normalizePaymentMethodId(method.id) === "mpesa")?.id ??
  methods[0]?.id ??
  "";

const prioritizePaymentMethods = (methods: PaymentMethod[]) => {
  const seen = new Set<string>();
  const orderedIds = ["mpesa", "airtel", "airtel_money", "card", "bank_transfer"];

  return [...methods]
    .filter((method) => {
      const key = normalizePaymentMethodId(method.id || method.name);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .sort((left, right) => {
      const leftIndex = orderedIds.indexOf(normalizePaymentMethodId(left.id));
      const rightIndex = orderedIds.indexOf(normalizePaymentMethodId(right.id));

      if (leftIndex === -1 && rightIndex === -1) {
        return left.name.localeCompare(right.name);
      }

      if (leftIndex === -1) {
        return 1;
      }

      if (rightIndex === -1) {
        return -1;
      }

      return leftIndex - rightIndex;
    });
};

const getFallbackMethods = (): PaymentMethod[] =>
  prioritizePaymentMethods([
    {
      id: "mpesa",
      name: "M-Pesa",
      type: "mobile_money",
      description: "Pay via mobile money (recommended in Kenya)",
      logo: paymentLogos.mpesa,
    },
    {
      id: "airtel_money",
      name: "Airtel Money",
      type: "mobile_money",
      description: "Alternative mobile wallet payment",
      logo: paymentLogos.airtel_money,
    },
    {
      id: "card",
      name: "Card Payment",
      type: "card",
      description: "Visa or Mastercard",
      logo: paymentLogos.card,
    },
  ]);

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const isTransientMpesaStatusError = (error: unknown) =>
  error instanceof Error &&
  (error.message.includes("Failed to query M-Pesa payment status") ||
    error.message.includes("500.001.1001"));

const getFriendlyMpesaFailureMessage = (description?: string) => {
  if (!description) return "M-Pesa payment was cancelled or failed.";
  if (description.toLowerCase().includes("user cannot be reached")) {
    return "The phone could not be reached for the M-Pesa prompt. Confirm the number is active, on, and has network, then try again.";
  }
  return description;
};

const formatMpesaFailureDetails = (payment: any) => {
  const friendly = getFriendlyMpesaFailureMessage(payment?.result_desc);
  const rawBits = [
    payment?.result_code !== undefined && payment?.result_code !== null
      ? `Code: ${payment.result_code}`
      : null,
    payment?.result_desc ? `Raw: ${payment.result_desc}` : null,
  ].filter(Boolean);

  return rawBits.length > 0 ? `${friendly} (${rawBits.join(" | ")})` : friendly;
};

const buildStructuredAddress = (county: string, area: string, deliveryPoint: string) =>
  [county.trim(), area.trim(), deliveryPoint.trim()].filter(Boolean).join(", ");

const buildStructuredCity = (deliveryCounty: string) => deliveryCounty.trim() || "Nairobi";

const clampCheckoutStep = (value?: number) =>
  typeof value === "number" && value >= 1 && value <= 4 ? value : 1;

const readStoredCheckoutDraft = (): CheckoutDraft | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const saved = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as CheckoutDraft) : null;
  } catch (error) {
    console.error("Failed to read stored checkout draft:", error);
    return null;
  }
};

const clearStoredCheckoutDraft = () => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
};

const sanitizePhoneInput = (value: string) =>
  value
    .replace(/[^\d+]/g, "")
    .replace(/(?!^)\+/g, "")
    .slice(0, 13);

const isValidKenyanMobileNumber = (value: string) => {
  const cleaned = value.trim();

  if (!cleaned) {
    return false;
  }

  if (cleaned.startsWith("+")) {
    return /^\+254(7|1)\d{8}$/.test(cleaned);
  }

  return /^(0(7|1)\d{8}|254(7|1)\d{8})$/.test(cleaned);
};

const normalizePhoneNumberForPayload = (value: string) => {
  const cleaned = sanitizePhoneInput(value);

  if (cleaned.startsWith("+254")) {
    return cleaned.slice(1);
  }

  if (cleaned.startsWith("0")) {
    return `254${cleaned.slice(1)}`;
  }

  if (/^(7|1)\d{8}$/.test(cleaned)) {
    return `254${cleaned}`;
  }

  return cleaned;
};

const getPaymentMethodType = (method: PaymentMethod | null): "mobile" | "card" | "bank" | null => {
  if (!method) {
    return null;
  }

  const normalizedId = normalizePaymentMethodId(method.id);
  const normalizedType = normalizePaymentMethodId(method.type);
  const normalizedName = normalizePaymentMethodId(method.name);

  if (
    normalizedType === "card" ||
    normalizedId.includes("card") ||
    normalizedName.includes("visa") ||
    normalizedName.includes("mastercard")
  ) {
    return "card";
  }

  if (normalizedType === "bank_transfer" || normalizedId.includes("bank")) {
    return "bank";
  }

  return "mobile";
};

const Checkout = () => {
  const {
    items,
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [initialDraft] = useState<CheckoutDraft | null>(() => readStoredCheckoutDraft());
  const activeDeliveryZone = getDeliveryZone(deliverySelection.zone);

  const [step, setStep] = useState(() => clampCheckoutStep(initialDraft?.step));
  const [paymentMethod, setPaymentMethod] = useState(initialDraft?.paymentMethod || "");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [promoCode, setPromoCode] = useState(promoSummary?.code || "");
  const [paymentDetails, setPaymentDetails] = useState({
    phoneNumber: initialDraft?.paymentDetails?.phoneNumber || "",
    bankName: initialDraft?.paymentDetails?.bankName || "",
  });
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentSelectionError, setPaymentSelectionError] = useState<string | null>(null);
  const [showDeliveryErrors, setShowDeliveryErrors] = useState(false);
  const [formData, setFormData] = useState({
    fullName: initialDraft?.formData?.fullName || "",
    email: initialDraft?.formData?.email || "",
    phone: initialDraft?.formData?.phone || "",
  });

  const deliveryErrors = showDeliveryErrors ? getDeliveryFieldErrors(deliverySelection) : {};
  const selectedPaymentMethod =
    paymentMethods.find((method) => normalizePaymentMethodId(method.id) === normalizePaymentMethodId(paymentMethod)) ||
    null;
  const paymentMethodType = getPaymentMethodType(selectedPaymentMethod);
  const structuredAddress = buildStructuredAddress(
    deliverySelection.zone === "nairobi" ? "Nairobi" : deliverySelection.county,
    deliverySelection.area,
    deliverySelection.point,
  );
  const structuredCity = buildStructuredCity(
    deliverySelection.zone === "nairobi" ? "Nairobi" : deliverySelection.county,
  );

  useEffect(() => {
    setPromoCode(promoSummary?.code || "");
  }, [promoSummary?.code]);

  useEffect(() => {
    setFormData((prev) => ({
      fullName: prev.fullName || user?.name || "",
      email: prev.email || user?.email || "",
      phone: prev.phone || user?.phone || "",
    }));
    setPaymentDetails((prev) => ({
      ...prev,
      phoneNumber: prev.phoneNumber || user?.phone || "",
    }));
  }, [user?.email, user?.name, user?.phone]);

  useEffect(() => {
    const draft: CheckoutDraft = {
      step,
      paymentMethod,
      paymentDetails,
      formData,
    };

    sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(draft));
  }, [formData, paymentDetails, paymentMethod, step]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const fallbackMethods = getFallbackMethods();
      setPaymentMethods(fallbackMethods);

      try {
        setPaymentMethodsLoading(true);
        const response = await paymentAPI.getByCountry(country);
        const methodsRaw = Array.isArray(response)
          ? response
          : response?.methods || response?.payment_methods || [];
        const methods = prioritizePaymentMethods(
          methodsRaw
            .map((method: any) => ({
              id: method.id || method.code || method.name?.toLowerCase().replace(/\s+/g, "_"),
              name: method.name,
              type: method.type || method.code || "mobile_money",
              description: method.description || "Secure payment option",
              logo: method.logo || paymentLogos[method.id || method.code],
            }))
            .filter((method: PaymentMethod) => Boolean(method.id && method.name)),
        );

        const nextMethods = methods.length > 0 ? methods : fallbackMethods;
        setPaymentMethods(nextMethods);
        setPaymentMethod((current) => {
          if (
            current &&
            nextMethods.some(
              (method) =>
                normalizePaymentMethodId(method.id) === normalizePaymentMethodId(current),
            )
          ) {
            return current;
          }

          return getPreferredMethodId(nextMethods);
        });
      } catch (error) {
        if (!isApiOfflineError(error)) {
          console.error("Failed to fetch payment methods:", error);
        }

        setPaymentMethod((current) => {
          if (
            current &&
            fallbackMethods.some(
              (method) =>
                normalizePaymentMethodId(method.id) === normalizePaymentMethodId(current),
            )
          ) {
            return current;
          }

          return getPreferredMethodId(fallbackMethods);
        });
      } finally {
        setPaymentMethodsLoading(false);
      }
    };

    void fetchPaymentMethods();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handlePaymentInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: name === "phoneNumber" ? sanitizePhoneInput(value) : value,
    }));
  };

  const validateAddressStep = () => {
    const deliveryError = getFirstDeliveryError(deliverySelection);
    if (deliveryError) {
      setShowDeliveryErrors(true);
      toast({
        title: "Delivery details needed",
        description: deliveryError,
        variant: "destructive",
      });
      return false;
    }

    if (!formData.fullName.trim()) {
      toast({
        title: "Missing information",
        description: "Full name is required before continuing.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Missing information",
        description: "Phone number is required before continuing.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Missing information",
        description: "Email is required before continuing.",
        variant: "destructive",
      });
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      toast({
        title: "Check your email",
        description: "Enter a valid email address before continuing.",
        variant: "destructive",
      });
      return false;
    }

    setShowDeliveryErrors(false);
    return true;
  };

  const validateReviewStep = () => {
    if (!paymentMethod) {
      setStep(3);
      setPaymentSelectionError("Select a payment method before completing the order.");
      return false;
    }

    if (normalizePaymentMethodId(paymentMethod) === "mpesa") {
      if (!paymentDetails.phoneNumber.trim()) {
        toast({
          title: "M-Pesa number needed",
          description: "Enter the phone number that should receive the STK push.",
          variant: "destructive",
        });
        return false;
      }

      if (!isValidKenyanMobileNumber(paymentDetails.phoneNumber)) {
        toast({
          title: "Check the M-Pesa number",
          description: "Use a valid Kenyan mobile number such as 07XXXXXXXX or 2547XXXXXXXX.",
          variant: "destructive",
        });
        return false;
      }
    }

    if (paymentMethodType === "bank" && !paymentDetails.bankName.trim()) {
      toast({
        title: "Bank selection needed",
        description: "Choose your bank before placing the order.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleApplyPromoCode = async () => {
    try {
      const applied = await applyPromoCode(promoCode);
      toast({
        title: "Promo applied",
        description: applied.message || `${applied.code} has been added to your order.`,
      });
    } catch (error) {
      toast({
        title: "Promo unavailable",
        description: error instanceof Error ? error.message : "Failed to apply promo code",
        variant: "destructive",
      });
    }
  };

  const handleRemovePromoCode = async () => {
    await removePromoCode();
    setPromoCode("");
    toast({
      title: "Promo removed",
      description: "Your checkout totals have been refreshed.",
    });
  };

  const handleSelectPaymentMethod = (methodId: string) => {
    setPaymentMethod(methodId);
    setPaymentSelectionError(null);
    setPaymentMessage("");
  };

  const handleSubmit = async () => {
    if (!validateReviewStep()) {
      return;
    }

    try {
      setSubmittingOrder(true);
      if (normalizePaymentMethodId(paymentMethod) === "mpesa") {
        setPaymentMessage("Sending payment request...");
      } else {
        setPaymentMessage("");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Login required",
          description: "Please sign in to complete checkout.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const orderPayload = {
        items: items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          price_per_item_kes: item.product.price,
          item_total_kes: item.product.price * item.quantity,
        })),
        totals: {
          currency: "KES",
          subtotal_kes: total,
          shipping_kes: shippingFee,
          grand_total_kes: grandTotal,
        },
        promo_code: promoSummary?.code || undefined,
        shipping_address: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: structuredAddress,
          city: structuredCity,
          postal_code: "",
          country,
          county: deliverySelection.zone === "nairobi" ? "Nairobi" : deliverySelection.county,
          area: deliverySelection.area,
          delivery_zone: activeDeliveryZone.label,
          delivery_zone_code: deliverySelection.zone,
          delivery_point: deliverySelection.point,
          delivery_method: deliverySelection.method,
          delivery_eta: deliverySelection.eta,
        },
        payment_method: paymentMethod,
        payment_details: {
          type: paymentMethodType,
          phone_number:
            normalizePaymentMethodId(paymentMethod) === "mpesa"
              ? normalizePhoneNumberForPayload(paymentDetails.phoneNumber)
              : undefined,
          bank_name: paymentMethodType === "bank" ? paymentDetails.bankName : undefined,
        },
        delivery: {
          county: deliverySelection.zone === "nairobi" ? "Nairobi" : deliverySelection.county,
          area: deliverySelection.area,
          point: deliverySelection.point,
          delivery_point: deliverySelection.point,
          delivery_zone: activeDeliveryZone.label,
          delivery_zone_code: deliverySelection.zone,
          method: deliverySelection.method,
          shipping_fee: shippingFee,
          eta: deliverySelection.eta,
        },
      };

      const response = await ordersAPI.create(orderPayload);

      if (normalizePaymentMethodId(paymentMethod) === "mpesa") {
        const orderId = response?.order_id;
        const customerMessage =
          response?.payment?.customer_message ||
          "Check your phone and complete the M-Pesa prompt to finish payment.";

        setPaymentMessage(customerMessage);
        toast({
          title: "STK push sent",
          description: customerMessage,
        });

        if (!orderId) {
          throw new Error("Order reference missing after M-Pesa initiation.");
        }

        for (let attempt = 0; attempt < 20; attempt += 1) {
          await wait(3000);
          let statusResponse;

          try {
            statusResponse = await paymentAPI.getMpesaStatus(orderId);
          } catch (error) {
            if (isTransientMpesaStatusError(error)) {
              continue;
            }
            throw error;
          }

          const payment = statusResponse?.payment;

          if (payment?.payment_status === "paid") {
            clearStoredCheckoutDraft();
            toast({
              title: "Payment confirmed",
              description: "Your M-Pesa payment was received successfully.",
            });
            clearCart();
            setTimeout(() => navigate("/shop"), 1200);
            return;
          }

          if (payment?.payment_status === "failed") {
            throw new Error(formatMpesaFailureDetails(payment));
          }
        }

        throw new Error(
          "Payment is still pending. Complete the M-Pesa prompt, then try again in a moment.",
        );
      }

      clearStoredCheckoutDraft();
      toast({
        title: "Order placed successfully",
        description: `Your order of ${formatCurrency(grandTotal)} has been received.`,
      });
      clearCart();
      setTimeout(() => navigate("/shop"), 1600);
    } catch (error) {
      console.error("Order submission failed:", error);
      toast({
        title: "Order failed",
        description: isApiOfflineError(error)
          ? "The backend is offline. Start the API server on port 5000 to place orders."
          : error instanceof Error
            ? error.message
            : "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-[#f8f5ef] pb-20 pt-32">
        <SEO
          title="Checkout"
          description="Complete your Queen Koba order."
          path="/checkout"
          robots="noindex,nofollow"
        />
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 font-display text-4xl">Your cart is empty</h1>
          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 rounded-sm bg-gold-gradient px-6 py-3 text-sm font-body font-semibold uppercase tracking-widest text-primary-foreground"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f5ef] pb-20 pt-24">
      <SEO
        title="Checkout"
        description="Secure checkout for Queen Koba skincare orders."
        path="/checkout"
        robots="noindex,nofollow"
      />

      <div className="container mx-auto max-w-7xl overflow-x-hidden px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-body text-sm uppercase tracking-wide">Back</span>
        </button>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-[#eadfce] bg-[linear-gradient(180deg,#fffaf3_0%,#f7efe2_100%)] px-6 py-8 shadow-[0_20px_50px_rgba(45,30,12,0.06)] md:px-10">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="text-xs font-body font-semibold uppercase tracking-[0.3em] text-primary/80">
                  Checkout
                </p>
                <h1 className="mt-3 font-display text-4xl font-light leading-tight md:text-5xl">
                  A cleaner path from <span className="italic text-gold-gradient">bag to payment</span>
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground/76 md:text-base">
                  This flow now leans more premium and guidance-led: address first, delivery next,
                  payment after, with a persistent order summary beside each step.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <span className="rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-[11px] font-body font-semibold uppercase tracking-[0.18em] text-primary">
                  Secure payment
                </span>
                <span className="rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-[11px] font-body font-semibold uppercase tracking-[0.18em] text-primary">
                  M-Pesa ready
                </span>
                <span className="rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-[11px] font-body font-semibold uppercase tracking-[0.18em] text-primary">
                  Kenya delivery
                </span>
              </div>
            </div>
          </div>

          <CheckoutProgress currentStep={step} steps={[...checkoutSteps]} />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)] lg:gap-8">
            <div className="space-y-5 lg:space-y-6">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                  <CheckoutAddressStep
                    formData={formData}
                    deliverySelection={deliverySelection}
                    activeZone={activeDeliveryZone}
                    errors={deliveryErrors}
                    onInputChange={handleInputChange}
                    onSetDeliveryZone={setDeliveryZone}
                    onSetDeliveryCounty={setDeliveryCounty}
                    onSetDeliveryArea={setDeliveryArea}
                    onSetDeliveryPoint={setDeliveryPoint}
                    onContinue={() => {
                      if (validateAddressStep()) {
                        setStep(2);
                      }
                    }}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                  <CheckoutDeliveryMethodStep
                    deliverySelection={deliverySelection}
                    activeZone={activeDeliveryZone}
                    shippingFee={shippingFee}
                    onSelectMethod={setDeliveryMethod}
                    onBack={() => setStep(1)}
                    onContinue={() => setStep(3)}
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                  <PaymentMethodSelector
                    methods={paymentMethods}
                    selectedMethodId={paymentMethod}
                    loading={paymentMethodsLoading}
                    selectionError={paymentSelectionError}
                    onSelect={handleSelectPaymentMethod}
                    onBack={() => setStep(2)}
                    onContinue={() => {
                      if (!paymentMethod) {
                        setPaymentSelectionError("Select a payment method to continue.");
                        return;
                      }

                      setPaymentSelectionError(null);
                      setStep(4);
                    }}
                  />
                </motion.div>
              )}

              {step === 4 && (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                  <CheckoutReviewStep
                    formData={formData}
                    deliverySelection={deliverySelection}
                    activeZone={activeDeliveryZone}
                    paymentMethodLabel={selectedPaymentMethod?.name || "Payment method"}
                    paymentMethodType={paymentMethodType}
                    paymentMethodId={normalizePaymentMethodId(paymentMethod)}
                    paymentDetails={paymentDetails}
                    shippingFee={shippingFee}
                    paymentMessage={paymentMessage}
                    submittingOrder={submittingOrder}
                    onPaymentInputChange={handlePaymentInputChange}
                    onBack={() => setStep(3)}
                    onSubmit={handleSubmit}
                  />
                </motion.div>
              )}
            </div>

            <div>
              <aside className="top-24 rounded-[32px] border border-[#eadfce] bg-white p-5 shadow-[0_22px_48px_rgba(32,24,17,0.06)] sm:p-8 lg:sticky">
                <div className="border-b border-border/80 pb-5">
                  <p className="text-xs font-body font-semibold uppercase tracking-[0.18em] text-primary/80">
                    Secure Checkout
                  </p>
                  <h3 className="mt-3 font-display text-2xl text-foreground">Order Summary</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Review your products, delivery fee, promo savings, and final total before you
                    pay.
                  </p>
                </div>

                <div className="mt-5 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] gap-3 border-b border-border/50 pb-4 sm:gap-4"
                    >
                      <div className="overflow-hidden rounded-[18px] bg-secondary/20">
                        {item.product.image ? (
                          <AdaptiveImage
                            src={item.product.image}
                            alt={item.product.name}
                            className="aspect-square w-full object-cover object-center"
                            sizes="72px"
                          />
                        ) : (
                          <div className="aspect-square w-full bg-secondary/30" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display text-sm font-semibold text-foreground">
                          {item.product.name}
                        </h4>
                        <p className="mt-1 text-xs font-body text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-body font-semibold text-foreground">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[22px] border border-primary/12 bg-secondary/10 px-4 py-4 text-sm">
                  <p className="font-body font-semibold uppercase tracking-[0.16em] text-foreground/80">
                    Delivery
                  </p>
                  <p className="mt-2 text-muted-foreground">{activeDeliveryZone.label}</p>
                  <p className="text-muted-foreground">
                    {deliverySelection.zone === "nairobi"
                      ? "Nairobi"
                      : deliverySelection.county || "County pending"}
                    {" · "}
                    {deliverySelection.area || "Area pending"}
                  </p>
                  <p className="text-muted-foreground">
                    {deliverySelection.point || "Exact delivery point pending"}
                  </p>
                  <p className="capitalize text-muted-foreground">
                    {deliverySelection.method === "door" ? "Door delivery" : "Pickup station"} ·{" "}
                    {deliverySelection.eta}
                  </p>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-primary/12 bg-primary/5 px-4 py-4 text-sm">
                    <p className="text-xs font-body uppercase tracking-[0.18em] text-primary/75">
                      Delivery fee
                    </p>
                    <p className="mt-2 font-display text-2xl text-foreground">
                      {formatCurrency(shippingFee)}
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-primary/12 bg-primary/5 px-4 py-4 text-sm">
                    <p className="text-xs font-body uppercase tracking-[0.18em] text-primary/75">
                      Final total
                    </p>
                    <p className="mt-2 font-display text-2xl text-foreground">
                      {formatCurrency(grandTotal)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 border-t border-border pt-5">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(total)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm font-body text-green-600">
                      <span>
                        Discount{promoSummary?.code ? ` (${promoSummary.code})` : ""}
                      </span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  {shippingDiscount > 0 && (
                    <div className="flex justify-between text-sm font-body text-green-600">
                      <span>Shipping Discount</span>
                      <span>-{formatCurrency(shippingDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="text-primary">{formatCurrency(shippingFee)}</span>
                  </div>

                  <div className="flex justify-between border-t border-border pt-3 font-display text-xl font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                <div className="mt-5 border-t border-border pt-5">
                  <PromoCodePanel
                    promoCode={promoCode}
                    onPromoCodeChange={(value) => setPromoCode(sanitizePromoCodeInput(value))}
                    onApply={handleApplyPromoCode}
                    onRemove={handleRemovePromoCode}
                    promoSummary={promoSummary}
                    promoLoading={promoLoading}
                    promoError={promoError}
                    totalSavingsLabel={formatCurrency(discountAmount + shippingDiscount)}
                    updatedTotalLabel={formatCurrency(grandTotal)}
                    placeholder="WELCOME10"
                  />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
