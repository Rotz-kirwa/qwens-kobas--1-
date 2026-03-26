import { useQuery } from "@tanstack/react-query";
import { useNetworkQuality } from "@/context/NetworkQualityContext";
import { contentAPI } from "@/lib/api";

export interface SiteContent {
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_description: string;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  instagram_handle: string;
  footer_text: string;
}

const defaultSiteContent: SiteContent = {
  hero_title: "Dark Spots & Uneven Tone Stealing Your Glow?",
  hero_subtitle: "Naturally brighten with toxin-free, melanin-safe luxury skincare.",
  about_title: "Explore The Full Ritual",
  about_description:
    "Explore our complete skincare lineup, mask, toner, serum, cream, and cleanser, curated to work together for healthier, glowing skin.",
  contact_email: "info@queenkoba.com",
  contact_phone: "0119 559 180",
  contact_whatsapp: "0119 559 180",
  instagram_handle: "@queenkoba",
  footer_text: "© 2026 Queen Koba. All rights reserved.",
};

const mergeSiteContent = (raw: unknown): SiteContent => {
  if (!raw || typeof raw !== "object") {
    return defaultSiteContent;
  }

  const content = raw as Partial<Record<keyof SiteContent, unknown>>;

  return {
    hero_title: String(content.hero_title || defaultSiteContent.hero_title),
    hero_subtitle: String(content.hero_subtitle || defaultSiteContent.hero_subtitle),
    about_title: String(content.about_title || defaultSiteContent.about_title),
    about_description: String(content.about_description || defaultSiteContent.about_description),
    contact_email: String(content.contact_email || defaultSiteContent.contact_email),
    contact_phone: String(content.contact_phone || defaultSiteContent.contact_phone),
    contact_whatsapp: String(content.contact_whatsapp || content.contact_phone || defaultSiteContent.contact_whatsapp),
    instagram_handle: String(content.instagram_handle || defaultSiteContent.instagram_handle),
    footer_text: String(content.footer_text || defaultSiteContent.footer_text),
  };
};

const normalizePhoneDigits = (value: string) => value.replace(/[^\d+]/g, "");

export const getTelHref = (phone: string) => {
  const digits = normalizePhoneDigits(phone);
  if (!digits) return `tel:${phone}`;
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.startsWith("254")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:+254${digits.slice(1)}`;
  return `tel:${digits}`;
};

export const getWhatsAppHref = (phone: string) => {
  const digits = normalizePhoneDigits(phone).replace(/^\+/, "");
  if (!digits) return "https://wa.me/";
  if (digits.startsWith("254")) return `https://wa.me/${digits}`;
  if (digits.startsWith("0")) return `https://wa.me/254${digits.slice(1)}`;
  return `https://wa.me/${digits}`;
};

export const formatInstagramHandle = (handle: string) =>
  handle.startsWith("@") ? handle : `@${handle}`;

export const getInstagramHref = (handle: string) =>
  `https://www.instagram.com/${formatInstagramHandle(handle).replace(/^@/, "")}/`;

export const useSiteContent = () => {
  const network = useNetworkQuality();

  const query = useQuery({
    queryKey: ["site-content", network.liteMode ? "lite" : "full"],
    queryFn: async () => {
      try {
        const response = await contentAPI.getPublic({
          lite: network.liteMode,
          cacheTtlMs: network.isSlow ? 1000 * 60 * 15 : 1000 * 60 * 10,
        });
        return mergeSiteContent(response?.content);
      } catch {
        return defaultSiteContent;
      }
    },
    staleTime: network.isSlow ? 1000 * 60 * 15 : 1000 * 60 * 5,
  });

  return {
    ...query,
    content: query.data || defaultSiteContent,
  };
};

export { defaultSiteContent };
