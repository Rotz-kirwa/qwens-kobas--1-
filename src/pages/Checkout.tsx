import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import DeliveryDetailsSection from "@/components/DeliveryDetailsSection";
import PromoCodePanel from "@/components/PromoCodePanel";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Building2, CheckCircle2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getDeliveryZone } from "@/data/kenyaDelivery";
import { paymentAPI, ordersAPI, isApiOfflineError } from "@/lib/api";
import { getDeliveryFieldErrors, getFirstDeliveryError } from "@/lib/delivery";
import { sanitizePromoCodeInput } from "@/lib/promo";
import SEO from "@/components/SEO";

const getPaymentIcon = (type: string) => {
  if (type.includes('card') || type.includes('visa') || type.includes('mastercard')) return CreditCard;
  if (type.includes('bank') || type.includes('transfer')) return Building2;
  return Smartphone;
};

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  description: string;
  logo?: string;
}

const paymentLogos: Record<string, string> = {
  mpesa: "/payment/mpesa.svg",
  airtel: "/payment/airtel.svg",
  airtel_money: "/payment/airtel.svg",
  card: "/payment/card.svg",
  bank_transfer: "",
  mtn_mobile_money: "/payment/airtel.svg",
  ecocash: "/payment/mastercard.svg",
  lumicash: "/payment/airtel.svg",
  orange_money: "/payment/airtel.svg",
  vodacom_mpesa: "/payment/mpesa.svg",
};

const currencyConfig: Record<string, { code: string; symbol: string; rate: number }> = {
  Kenya: { code: "KES", symbol: "KSh", rate: 1 },
  Uganda: { code: "UGX", symbol: "UGX", rate: 28.5 },
  Burundi: { code: "BIF", symbol: "FBu", rate: 285 },
  Congo: { code: "CDF", symbol: "FC", rate: 280 },
};
const supportedCheckoutCountries = ["Kenya"] as const;

const formatCurrency = (amount: number, country: string) => {
  const config = currencyConfig[country];
  const converted = Math.round(amount * config.rate);
  return `${config.symbol} ${converted.toLocaleString()}`;
};

const getFallbackMethods = (country: string): PaymentMethod[] => {
  const methods: Record<string, PaymentMethod[]> = {
    Kenya: [
      { id: "mpesa", name: "M-Pesa", type: "mobile_money", description: "Mobile money (most popular in Kenya)", logo: paymentLogos.mpesa },
      { id: "airtel_money", name: "Airtel Money", type: "mobile_money", description: "Mobile money alternative", logo: paymentLogos.airtel_money },
      { id: "card", name: "Visa/Mastercard", type: "card", description: "Credit/Debit cards", logo: paymentLogos.card },
      { id: "bank_transfer", name: "Bank Transfer", type: "bank_transfer", description: "Direct bank transfer", logo: paymentLogos.bank_transfer },
    ],
    Uganda: [
      { id: "mtn_mobile_money", name: "MTN Mobile Money", type: "mobile_money", description: "Primary mobile money service", logo: paymentLogos.mtn_mobile_money },
      { id: "airtel_money", name: "Airtel Money", type: "mobile_money", description: "Alternative mobile money", logo: paymentLogos.airtel_money },
      { id: "card", name: "Visa/Mastercard", type: "card", description: "Credit/Debit cards", logo: paymentLogos.card },
    ],
    Burundi: [
      { id: "lumicash", name: "Lumicash", type: "mobile_money", description: "Mobile money service", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa2EsR4opmeHo-7AZdQWOXzAopmCAtyTWJbA&s" },
      { id: "ecocash", name: "EcoCash", type: "mobile_money", description: "Mobile payment platform", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxM9aLsK9Xzy2xfcGjsciN7ge8p8KdzqhvOA&s" },
      { id: "bank_transfer", name: "Bank Transfer", type: "bank_transfer", description: "Direct bank transfer", logo: paymentLogos.bank_transfer },
    ],
    Congo: [
      { id: "orange_money", name: "Orange Money", type: "mobile_money", description: "Mobile money service", logo: paymentLogos.orange_money },
      { id: "vodacom_mpesa", name: "Vodacom M-Pesa", type: "mobile_money", description: "Mobile money platform", logo: paymentLogos.vodacom_mpesa },
      { id: "bank_transfer", name: "Bank Transfer", type: "bank_transfer", description: "Direct bank transfer", logo: paymentLogos.bank_transfer },
    ],
  };
  return methods[country] || methods.Kenya;
}

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const isTransientMpesaStatusError = (error: unknown) =>
  error instanceof Error &&
  (
    error.message.includes("Failed to query M-Pesa payment status") ||
    error.message.includes("500.001.1001")
  );

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

const getFriendlyMpesaFailureMessage = (description?: string) => {
  if (!description) return "M-Pesa payment was cancelled or failed.";
  if (description.toLowerCase().includes("user cannot be reached")) {
    return "The phone could not be reached for the M-Pesa prompt. Confirm the number is active, on, and has network, then try again.";
  }
  return description;
};

const buildStructuredAddress = (deliveryArea: string, deliveryPoint: string) =>
  [deliveryArea.trim(), deliveryPoint.trim()].filter(Boolean).join(", ");

const buildStructuredCity = (deliveryCounty: string) => deliveryCounty.trim();

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
  const activeDeliveryZone = getDeliveryZone(deliverySelection.zone);
  
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("Kenya");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState(promoSummary?.code || "");
  const [paymentDetails, setPaymentDetails] = useState({
    phoneNumber: "",
    bankName: "",
  });
  const [paymentMessage, setPaymentMessage] = useState("");
  const [showDeliveryErrors, setShowDeliveryErrors] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const deliveryErrors = showDeliveryErrors ? getDeliveryFieldErrors(deliverySelection) : {};
  const structuredAddress = buildStructuredAddress(deliverySelection.area, deliverySelection.point);
  const structuredCity = buildStructuredCity(deliverySelection.county);

  useEffect(() => {
    setPromoCode(promoSummary?.code || "");
  }, [promoSummary?.code]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
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
    const fetchPaymentMethods = async () => {
      // Start with fallback methods immediately
      const fallbackMethods = getFallbackMethods(country);
      setPaymentMethods(fallbackMethods);
      
      try {
        setLoading(true);
        const response = await paymentAPI.getByCountry(country);
        const methodsRaw = Array.isArray(response)
          ? response
          : response?.methods || response?.payment_methods || [];
        const methods = methodsRaw.map((method: any) => ({
          id: method.id || method.code || method.name?.toLowerCase().replace(/\s+/g, "_"),
          name: method.name,
          type: method.type || method.code || "mobile_money",
          description: method.description || "Secure payment option",
          logo: method.logo,
        })).map((method: PaymentMethod) => ({
          ...method,
          logo: method.logo || paymentLogos[method.id],
        }));
        if (methods.length > 0) {
          setPaymentMethods(methods);
        }
        setPaymentMethod("");
      } catch (error) {
        if (!isApiOfflineError(error)) {
          console.error('Failed to fetch payment methods:', error);
        }
        // Keep fallback methods already set
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentMethods();
  }, [country]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const validateStepOne = () => {
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

    const requiredFields = [
      ["Full name", formData.fullName],
      ["Email", formData.email],
      ["Phone number", formData.phone],
    ];

    const missingField = requiredFields.find(([, value]) => !value.trim());
    if (missingField) {
      toast({
        title: "Missing Information",
        description: `${missingField[0]} is required before continuing.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validateStepThree = () => {
    const paymentType = getPaymentMethodType();

    if (paymentType === "mobile" && !paymentDetails.phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Enter the mobile money number that should receive the payment prompt.",
        variant: "destructive",
      });
      return false;
    }

    if (paymentType === "bank" && !paymentDetails.bankName.trim()) {
      toast({
        title: "Bank Selection Required",
        description: "Choose your preferred bank before reviewing the order.",
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

  const finalTotal = grandTotal;

  const getPaymentMethodType = () => {
    const method = paymentMethods.find(m => m.id === paymentMethod);
    if (!method) return null;
    if (method.type === 'card') return 'card';
    if (method.type === 'bank_transfer') return 'bank';
    return 'mobile';
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setPaymentMessage("");

      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Login Required",
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
          grand_total_kes: finalTotal,
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
          county: deliverySelection.county,
          area: deliverySelection.area,
          delivery_zone: activeDeliveryZone.label,
          delivery_zone_code: deliverySelection.zone,
          delivery_point: deliverySelection.point,
          delivery_method: deliverySelection.method,
          delivery_eta: deliverySelection.eta,
        },
        payment_method: paymentMethod || "card",
        payment_details: {
          type: getPaymentMethodType(),
          phone_number:
            getPaymentMethodType() === "mobile" ? paymentDetails.phoneNumber : undefined,
          bank_name: getPaymentMethodType() === "bank" ? paymentDetails.bankName : undefined,
        },
        delivery: {
          county: deliverySelection.county,
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

      if (paymentMethod === "mpesa") {
        const orderId = response?.order_id;
        const customerMessage =
          response?.payment?.customer_message ||
          "STK push sent. Check your phone and enter your M-Pesa PIN.";

        setPaymentMessage(customerMessage);
        toast({
          title: "STK Push Sent",
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
            toast({
              title: "Payment Confirmed",
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
          "Payment is still pending. Complete the M-Pesa prompt, then try again in a moment."
        );
      }

      toast({
        title: "Order Placed Successfully!",
        description: `Your order of ${formatCurrency(finalTotal, country)} has been received.`,
      });
      
      clearCart();
      setTimeout(() => navigate("/shop"), 2000);
    } catch (error) {
      console.error('Order submission failed:', error);
      toast({
        title: "Order Failed",
        description: isApiOfflineError(error)
          ? "The backend is offline. Start the API server on port 5000 to place orders."
          : error instanceof Error
            ? error.message
            : "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen overflow-x-hidden pt-32 pb-20">
        <SEO
          title="Checkout"
          description="Complete your Queen Koba order."
          path="/checkout"
          robots="noindex,nofollow"
        />
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl mb-4">Your cart is empty</h1>
          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-gradient text-primary-foreground font-body font-semibold text-sm tracking-widest uppercase rounded-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-secondary/20 pb-20 pt-24">
      <SEO
        title="Checkout"
        description="Secure checkout for Queen Koba skincare orders."
        path="/checkout"
        robots="noindex,nofollow"
      />
      <div className="container mx-auto max-w-6xl overflow-x-hidden px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-body text-sm tracking-wide uppercase">Back</span>
        </button>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="space-y-5 lg:col-span-2 lg:space-y-6">
            {/* Progress Steps */}
            <div className="mb-6 flex items-center justify-between gap-1 overflow-hidden sm:mb-8 sm:gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex min-w-0 flex-1 items-center">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold font-body sm:h-10 sm:w-10 sm:text-base ${
                      step >= s ? "bg-gold-gradient text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                  {s < 4 && (
                    <div className={`mx-1 h-1 min-w-0 flex-1 sm:mx-2 ${step > s ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="luxury-card p-5 sm:p-8"
              >
                <h2 className="font-display text-3xl font-semibold mb-6">Contact & Delivery</h2>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-body mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-sm focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-sm focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-body mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-sm focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body mb-2">Country *</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-sm focus:outline-none focus:border-primary"
                      >
                        {supportedCheckoutCountries.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Delivery pricing is currently configured for Kenya orders.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-[20px] border border-primary/12 bg-secondary/10 px-4 py-4">
                    <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80">
                      Delivery Address
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Use the delivery details below to tell us exactly where the order should go.
                      Your county, area, and exact delivery point will be saved with the order.
                    </p>
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
                  <button
                    onClick={() => {
                      if (validateStepOne()) {
                        setStep(2);
                      }
                    }}
                    className="w-full py-4 bg-gold-gradient text-primary-foreground font-body font-bold text-sm tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity"
                  >
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="luxury-card p-5 sm:p-8"
              >
                <h2 className="font-display text-3xl font-semibold mb-6">Payment Method</h2>
                <p className="text-muted-foreground font-body mb-6">Select your preferred payment method for {country}</p>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground font-body">Loading payment methods...</p>
                  </div>
                ) : (
                  <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`relative h-28 overflow-hidden rounded-lg border-[3px] transition-all sm:h-32 sm:border-4 ${
                          paymentMethod === method.id
                            ? "border-primary ring-4 ring-primary/30"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {method.logo ? (
                          <img
                            src={method.logo}
                            alt={method.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-secondary/30">
                            {(() => {
                              const Icon = getPaymentIcon(method.type);
                              return <Icon className="h-10 w-10 text-primary" />;
                            })()}
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 py-3 text-left text-white sm:px-4">
                          <p className="text-sm font-semibold">{method.name}</p>
                          <p className="text-xs text-white/80">{method.description}</p>
                        </div>
                        {paymentMethod === method.id && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <CheckCircle2 className="w-12 h-12 text-primary drop-shadow-lg" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-sm border border-border py-4 text-foreground font-body text-sm font-bold uppercase tracking-widest transition-colors hover:bg-secondary"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!paymentMethod}
                    className="flex-1 rounded-sm bg-gold-gradient py-4 text-primary-foreground font-body text-sm font-bold uppercase tracking-widest transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment Details */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="luxury-card p-5 sm:p-8"
              >
                <h2 className="font-display text-3xl font-semibold mb-6">Payment Details</h2>
                <p className="text-muted-foreground font-body mb-6">
                  {paymentMethods.find(m => m.id === paymentMethod)?.name}
                </p>

                {/* Mobile Money Payment */}
                {getPaymentMethodType() === 'mobile' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-body mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={paymentDetails.phoneNumber}
                        onChange={handlePaymentInputChange}
                        placeholder="e.g. 254712345678"
                        className="w-full px-4 py-3 bg-background border border-border rounded-sm focus:outline-none focus:border-primary"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        For M-Pesa use a Safaricom number like 2547XXXXXXXX. You will receive an STK push on this phone.
                      </p>
                    </div>
                  </div>
                )}

                {/* Card Payment */}
                {getPaymentMethodType() === 'card' && (
                  <div className="rounded-sm border border-primary/15 bg-secondary/20 p-4">
                    <p className="text-sm font-body font-semibold text-foreground">
                      Card payments are handled after order confirmation.
                    </p>
                    <p className="mt-2 text-sm font-body text-muted-foreground">
                      For security, this page does not collect raw card numbers or CVV details.
                      After you place the order, the next payment step is shared using your contact
                      details.
                    </p>
                  </div>
                )}

                {/* Bank Transfer */}
                {getPaymentMethodType() === 'bank' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-body mb-2">Bank Name *</label>
                      <select
                        name="bankName"
                        value={paymentDetails.bankName}
                        onChange={handlePaymentInputChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-sm focus:outline-none focus:border-primary"
                        required
                      >
                        <option value="">Select your bank</option>
                        <option value="equity">Equity Bank</option>
                        <option value="kcb">KCB Bank</option>
                        <option value="coop">Co-operative Bank</option>
                        <option value="absa">ABSA Bank</option>
                        <option value="stanbic">Stanbic Bank</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-sm">
                      <p className="text-sm font-body text-muted-foreground">
                        Transfer instructions will be sent after the order is placed. No account
                        number is collected on this page.
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-sm border border-border py-4 text-foreground font-body text-sm font-bold uppercase tracking-widest transition-colors hover:bg-secondary"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (validateStepThree()) {
                        setStep(4);
                      }
                    }}
                    className="flex-1 rounded-sm bg-gold-gradient py-4 text-primary-foreground font-body text-sm font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
                  >
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review & Confirm */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="luxury-card p-5 sm:p-8"
              >
                <h2 className="font-display text-3xl font-semibold mb-6">Review Your Order</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-xl font-semibold mb-3">Shipping Details</h3>
                    <div className="text-sm font-body space-y-1 text-muted-foreground">
                      <p>{formData.fullName}</p>
                      <p>{formData.email}</p>
                      <p>{formData.phone}</p>
                      <p>{country}</p>
                      <p>{activeDeliveryZone.label}</p>
                      <p>{deliverySelection.county} · {deliverySelection.area}</p>
                      <p>{deliverySelection.point || "Area not set yet"}</p>
                      <p className="capitalize">
                        {deliverySelection.method === "door" ? "Door delivery" : "Pickup station"} · {deliverySelection.eta}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold mb-3">Payment Method</h3>
                    <p className="text-sm font-body text-muted-foreground mb-1">
                      {paymentMethods.find(m => m.id === paymentMethod)?.name}
                    </p>
                    {getPaymentMethodType() === 'mobile' && paymentDetails.phoneNumber && (
                      <p className="text-sm font-body text-muted-foreground">Phone: {paymentDetails.phoneNumber}</p>
                    )}
                    {getPaymentMethodType() === 'card' && (
                      <p className="text-sm font-body text-muted-foreground">
                        Secure card instructions follow after order confirmation.
                      </p>
                    )}
                    {getPaymentMethodType() === 'bank' && paymentDetails.bankName && (
                      <p className="text-sm font-body text-muted-foreground">Bank: {paymentDetails.bankName}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 rounded-sm border border-border py-4 text-foreground font-body text-sm font-bold uppercase tracking-widest transition-colors hover:bg-secondary"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 rounded-sm bg-gold-gradient py-4 text-primary-foreground font-body text-sm font-bold uppercase tracking-widest transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {loading ? "Processing..." : paymentMethod === "mpesa" ? "Send STK Push" : "Place Order"}
                    </button>
                  </div>
                  {paymentMessage && (
                    <div className="rounded-sm border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-body text-foreground">
                      {paymentMessage}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="luxury-card top-24 p-5 sm:p-8 lg:sticky">
              <h3 className="font-display text-2xl font-semibold mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 border-b border-border/50 pb-4 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-sm font-semibold mb-1">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground font-body">Qty: {item.quantity}</p>
                    </div>
                    <p className="shrink-0 font-body text-sm font-semibold">
                      {formatCurrency(item.product.price * item.quantity, country)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(total, country)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between font-body text-sm text-green-600">
                    <span>
                      Discount{promoSummary?.code ? ` (${promoSummary.code})` : ""}
                    </span>
                    <span>-{formatCurrency(discountAmount, country)}</span>
                  </div>
                )}
                {shippingDiscount > 0 && (
                  <div className="flex justify-between font-body text-sm text-green-600">
                    <span>Shipping Discount</span>
                    <span>-{formatCurrency(shippingDiscount, country)}</span>
                  </div>
                )}
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-primary">{formatCurrency(shippingFee, country)}</span>
                </div>
                <div className="rounded-[18px] border border-primary/15 bg-secondary/10 px-4 py-3 text-sm">
                  <p className="font-body font-semibold uppercase tracking-[0.16em] text-foreground/80">
                    Delivery Selection
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    {activeDeliveryZone.label}
                  </p>
                  <p className="text-muted-foreground">
                    {deliverySelection.county} · {deliverySelection.area}
                  </p>
                  <p className="text-muted-foreground">
                    {deliverySelection.point || "Area not set yet"}
                  </p>
                  <p className="text-muted-foreground capitalize">
                    {deliverySelection.method === "door" ? "Door delivery" : "Pickup station"} · {deliverySelection.eta}
                  </p>
                </div>
                <div className="flex justify-between font-display text-xl font-semibold pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(finalTotal, country)}</span>
                </div>
                <div className="pt-4 border-t border-border">
                  <PromoCodePanel
                    promoCode={promoCode}
                    onPromoCodeChange={(value) => setPromoCode(sanitizePromoCodeInput(value))}
                    onApply={handleApplyPromoCode}
                    onRemove={handleRemovePromoCode}
                    promoSummary={promoSummary}
                    promoLoading={promoLoading}
                    promoError={promoError}
                    totalSavingsLabel={formatCurrency(discountAmount + shippingDiscount, country)}
                    updatedTotalLabel={formatCurrency(finalTotal, country)}
                    placeholder="ENTERCODE"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
