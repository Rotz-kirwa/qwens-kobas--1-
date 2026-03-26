export type DeliveryMethod = "pickup" | "door";
export type DeliveryZone = "nairobi" | "outside_nairobi";

export interface DeliveryZoneConfig {
  zone: DeliveryZone;
  label: string;
  pickupFee: number;
  doorFee: number;
  eta: string;
  countyPlaceholder: string;
  areaPlaceholder: string;
  pointPlaceholder: string;
}

export const kenyaDeliveryZones: DeliveryZoneConfig[] = [
  {
    zone: "nairobi",
    label: "Within Nairobi",
    pickupFee: 300,
    doorFee: 300,
    eta: "Same day / next day",
    countyPlaceholder: "Nairobi",
    areaPlaceholder: "e.g. Westlands, Kilimani, Kasarani",
    pointPlaceholder: "e.g. Sarit Centre stage, Kilimani Plaza gate",
  },
  {
    zone: "outside_nairobi",
    label: "Outside Nairobi",
    pickupFee: 500,
    doorFee: 500,
    eta: "2-4 business days",
    countyPlaceholder: "e.g. Nakuru, Kisumu, Uasin Gishu",
    areaPlaceholder: "e.g. Nakuru Town, Kisumu CBD, Eldoret Town",
    pointPlaceholder: "e.g. stage, building, landmark, pickup centre",
  },
];

export const normalizeDeliveryZone = (value?: string | null): DeliveryZone => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_")
    .replace(/\s+/g, "_");

  if (
    normalized === "nairobi" ||
    normalized === "within_nairobi" ||
    (normalized.includes("nairobi") && !normalized.startsWith("outside"))
  ) {
    return "nairobi";
  }

  if (normalized) {
    return "outside_nairobi";
  }

  return "nairobi";
};

export const defaultKenyaDeliveryZone =
  kenyaDeliveryZones.find((zone) => zone.zone === "nairobi") ?? kenyaDeliveryZones[0];

export const getDeliveryZone = (zone?: string | null) =>
  kenyaDeliveryZones.find((item) => item.zone === normalizeDeliveryZone(zone)) ??
  defaultKenyaDeliveryZone;
