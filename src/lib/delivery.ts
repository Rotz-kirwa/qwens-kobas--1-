import { getDeliveryZone } from "@/data/kenyaDelivery";

export interface DeliveryValidationShape {
  zone: string;
  county: string;
  area: string;
  point: string;
}

export interface DeliveryFieldErrors {
  county?: string;
  area?: string;
  point?: string;
}

const normalizeText = (value?: string | null) => value?.trim() || "";

export const getDeliveryFieldErrors = (
  delivery: DeliveryValidationShape,
): DeliveryFieldErrors => {
  const errors: DeliveryFieldErrors = {};
  const activeZone = getDeliveryZone(delivery.zone);

  if (activeZone.zone !== "nairobi" && !normalizeText(delivery.county)) {
    errors.county = "County is required before checkout.";
  }

  if (!normalizeText(delivery.area)) {
    errors.area = "Area / Town / Estate is required before checkout.";
  }

  if (!normalizeText(delivery.point)) {
    errors.point = "Exact delivery point is required before checkout.";
  }

  return errors;
};

export const hasDeliveryFieldErrors = (delivery: DeliveryValidationShape) =>
  Object.keys(getDeliveryFieldErrors(delivery)).length > 0;

export const getFirstDeliveryError = (delivery: DeliveryValidationShape) => {
  const errors = getDeliveryFieldErrors(delivery);
  return errors.county || errors.area || errors.point || null;
};

export const getDeliverySummaryLabel = (delivery: DeliveryValidationShape) =>
  getDeliveryZone(delivery.zone).label;
