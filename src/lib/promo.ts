import type { PromoSummary } from "@/context/CartContext";

export const sanitizePromoCodeInput = (value: string) =>
  value.toUpperCase().replace(/[^A-Z0-9]/g, "");

export const getPromoTypeLabel = (promo?: PromoSummary | null) => {
  if (!promo) return "";

  if (promo.discount_type === "free_shipping") {
    return "Free shipping";
  }

  if (promo.discount_type === "fixed") {
    return `KSh ${promo.discount_value.toLocaleString()} off`;
  }

  return `${promo.discount_value}% off`;
};

export const getPromoBenefitLabel = (promo?: PromoSummary | null) => {
  if (!promo) return "";

  if (promo.discount_type === "free_shipping") {
    return "Free shipping on the current order.";
  }

  if (promo.discount_type === "fixed") {
    return `KSh ${promo.discount_value.toLocaleString()} off eligible items.`;
  }

  return `${promo.discount_value}% off eligible items.`;
};

export const getPromoCampaignLabel = (promo?: PromoSummary | null) => {
  if (!promo) return "";

  const parts = [promo.description, promo.campaign_type].filter(Boolean);
  return parts.join(" · ");
};
