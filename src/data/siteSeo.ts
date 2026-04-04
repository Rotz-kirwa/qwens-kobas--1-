export interface FaqItem {
  question: string;
  answer: string;
}

export interface ContentSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
}

export interface LinkCard {
  title: string;
  description: string;
  to: string;
  eyebrow?: string;
  ctaLabel?: string;
}

export interface LandingPageData {
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  heroEyebrow: string;
  heroTitle: string;
  heroIntro: string;
  highlights: string[];
  sections: ContentSection[];
  faqs: FaqItem[];
  relatedProductKeys: string[];
  relatedArticleSlugs: string[];
  relatedPageLinks: LinkCard[];
  ctaTitle: string;
  ctaBody: string;
  ctaPrimaryLabel: string;
  ctaPrimaryTo: string;
  ctaSecondaryLabel: string;
  ctaSecondaryTo: string;
}

export interface BlogCategory {
  slug: string;
  name: string;
  description: string;
}

export interface BlogPost {
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  heroImage: string;
  heroImageAlt: string;
  categorySlug: string;
  keywords: string[];
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  heroEyebrow: string;
  localAngle: string;
  sections: ContentSection[];
  faqs: FaqItem[];
  relatedProductKeys: string[];
  relatedArticleSlugs: string[];
  relatedPageLinks: LinkCard[];
}

export const keywordPageMap: Array<{
  title: string;
  to: string;
  pageType: "home" | "shop" | "landing" | "product" | "blog" | "support";
  primaryKeywords: string[];
  supportingKeywords: string[];
}> = [
  {
    title: "Homepage",
    to: "/",
    pageType: "home",
    primaryKeywords: [
      "brightening skincare",
      "skincare for melanin skin",
      "natural skincare products",
      "African botanical skincare",
      "skincare products in Kenya",
    ],
    supportingKeywords: [
      "toxin free skincare",
      "premium skincare Kenya",
      "melanin skincare products",
    ],
  },
  {
    title: "Shop",
    to: "/shop",
    pageType: "shop",
    primaryKeywords: [
      "brightening skincare products",
      "hyperpigmentation products Kenya",
      "dark spots treatment products",
    ],
    supportingKeywords: [
      "brightening toner",
      "hyperpigmentation serum",
      "skincare kit for hyperpigmentation",
    ],
  },
  {
    title: "Hyperpigmentation Treatment",
    to: "/hyperpigmentation-treatment",
    pageType: "landing",
    primaryKeywords: ["hyperpigmentation treatment", "skincare for hyperpigmentation"],
    supportingKeywords: [
      "uneven skin tone treatment",
      "best products for hyperpigmentation",
      "hyperpigmentation treatment in Kenya",
    ],
  },
  {
    title: "Dark Spots Treatment",
    to: "/dark-spots-treatment",
    pageType: "landing",
    primaryKeywords: ["dark spots treatment", "products for dark spots"],
    supportingKeywords: [
      "how to remove dark spots",
      "dark spots treatment in Kenya",
      "natural products for dark spots",
    ],
  },
  {
    title: "Skincare for Melanin Skin",
    to: "/skincare-for-melanin-skin",
    pageType: "landing",
    primaryKeywords: ["skincare for melanin skin", "skincare for melanin rich skin"],
    supportingKeywords: [
      "melanin skincare products",
      "skincare for African skin",
      "safe skin brightening products",
    ],
  },
  {
    title: "African Botanical Skincare",
    to: "/african-botanical-skincare",
    pageType: "landing",
    primaryKeywords: ["African botanical skincare", "botanical skincare"],
    supportingKeywords: [
      "natural skincare products",
      "licorice root skincare",
      "moringa skincare benefits",
    ],
  },
  {
    title: "Skincare Products in Kenya",
    to: "/skincare-products-kenya",
    pageType: "landing",
    primaryKeywords: ["skincare products in Kenya", "natural skincare Kenya"],
    supportingKeywords: [
      "brightening skincare Kenya",
      "Nairobi skincare products",
      "Kenyan skincare brands",
    ],
  },
  {
    title: "Blog",
    to: "/blog",
    pageType: "blog",
    primaryKeywords: [
      "best skincare routine for hyperpigmentation",
      "how to remove dark spots naturally",
      "safe alternatives to bleaching creams",
    ],
    supportingKeywords: [
      "melanin skin care routine",
      "best serum for hyperpigmentation in Kenya",
      "African botanical ingredients for glowing skin",
    ],
  },
  {
    title: "Contact",
    to: "/contact",
    pageType: "support",
    primaryKeywords: ["skincare support Kenya", "Queen Koba contact"],
    supportingKeywords: ["Nairobi skincare support", "delivery support Kenya"],
  },
];

const BLOG_IMAGE_LIBRARY = {
  ritual:
    "https://www.dropbox.com/scl/fi/jpdncaq9lkmtnhxz3xbli/new.jpeg?rlkey=y6gg1oiji39i52ve9avevqplh&st=zuyfr36d&raw=1",
  cleanser:
    "https://www.dropbox.com/scl/fi/4tulvx5wuscmhcrvls4tg/sp2.jpeg?rlkey=6lr1shzfkfy14xcl6d7zhqxmd&st=uec69ia4&raw=1",
  toner:
    "https://www.dropbox.com/scl/fi/akek115wovbezb0m923q0/sp3.jpeg?rlkey=w25aqom0rmq40uwmqse84cawb&st=vb6mzc2a&raw=1",
  serum:
    "https://www.dropbox.com/scl/fi/ydx5ia5xvcblz5a7d8ty2/sp4.jpeg?rlkey=jy5lypf5j1csv88fy7s33pte9&st=r8air5om&raw=1",
  cream:
    "https://www.dropbox.com/scl/fi/bparrxju6nzi3y816yoc7/sp5.jpeg?rlkey=mae29d7hd4dq88lj4hlvf8fju&st=yqb89dwv&raw=1",
  mask:
    "https://www.dropbox.com/scl/fi/srxgy8id5smigxy8vtepg/sp6.jpeg?rlkey=4s4p1hq245l9htmf3952f0xnb&st=9jgl6wjw&raw=1",
  hero:
    "https://www.dropbox.com/scl/fi/r6uxk1n0vhhia84hmar79/hero5.png?rlkey=2a6ctpj7jg2sfgmvttnye7vo9&st=fqm1f4ds&raw=1",
  story:
    "https://www.dropbox.com/scl/fi/6k0kxjlofssv1qj8o9ddh/story.jpeg?rlkey=u67x7bkz6yy7gvsesljcv7oiw&st=3oto1u1d&raw=1",
  trust:
    "https://www.dropbox.com/scl/fi/otsqggich7pprbsxgr8dm/tf.jpeg?rlkey=npcjiid7k8m57dfdvd4r7r7cd&st=ok99bzbi&raw=1",
  ingredients:
    "https://www.dropbox.com/scl/fi/zxgwxymwoevlm0jezfq1t/qpr.jpeg?rlkey=t9n79yhhahzjm85ad98aacdr2&st=wy7fx6g4&raw=1",
  results:
    "https://www.dropbox.com/scl/fi/rbkbdc750xw1drznche0a/rs1.jpeg?rlkey=fhgchugyidb4sg55tjdnvmir9&st=fn5nc2gk&raw=1",
} as const;

export const homeHeroTrustPoints = [
  "Toxin-free formulas for dark spots and uneven tone",
  "Created for melanin-rich skin and daily consistency",
  "African botanical skincare with Kenya-wide delivery",
];

export const homeConcernCards: LinkCard[] = [
  {
    eyebrow: "Concern Guide",
    title: "Hyperpigmentation Treatment",
    description:
      "Learn how to build a brightening routine that supports melanin-rich skin without harsh bleaching ingredients.",
    to: "/hyperpigmentation-treatment",
    ctaLabel: "Explore treatment path",
  },
  {
    eyebrow: "Concern Guide",
    title: "Dark Spots Treatment",
    description:
      "Target post-acne marks, patchy tone, and stubborn spots with a gentler routine built around consistency.",
    to: "/dark-spots-treatment",
    ctaLabel: "Fade dark spots",
  },
  {
    eyebrow: "Skin Education",
    title: "Skincare for Melanin Skin",
    description:
      "Understand what melanin-rich skin needs, what to avoid, and how to brighten while protecting the barrier.",
    to: "/skincare-for-melanin-skin",
    ctaLabel: "See melanin-safe rituals",
  },
  {
    eyebrow: "Local Search",
    title: "Skincare Products in Kenya",
    description:
      "Find premium skincare products in Kenya with local support, WhatsApp guidance, and routines for Kenyan shoppers.",
    to: "/skincare-products-kenya",
    ctaLabel: "Shop in Kenya",
  },
];

export const homeEducationCards: LinkCard[] = [
  {
    eyebrow: "Journal",
    title: "Best Skincare Routine for Hyperpigmentation",
    description:
      "A step-by-step guide to cleansing, treating, hydrating, and protecting skin when uneven tone is your main concern.",
    to: "/blog/best-skincare-routine-for-hyperpigmentation",
    ctaLabel: "Read the routine guide",
  },
  {
    eyebrow: "Journal",
    title: "Safe Alternatives to Bleaching Creams",
    description:
      "Compare harsh lightening approaches with a gentler, barrier-first brightening strategy for long-term skin health.",
    to: "/blog/safe-alternatives-to-bleaching-creams",
    ctaLabel: "Read the education guide",
  },
  {
    eyebrow: "Ingredients",
    title: "African Botanical Ingredients for Glowing Skin",
    description:
      "Discover why licorice root, moringa, qasil, aloe, liwa, and shea fit a premium brightening routine.",
    to: "/blog/african-botanical-ingredients-for-glowing-skin",
    ctaLabel: "Explore ingredient benefits",
  },
];

export const homeTrustPillars = [
  {
    title: "Melanin-Honoring Formulas",
    description:
      "Queen Koba is designed for melanin-rich skin that needs clarity and brightness without irritation, stripping, or aggressive bleaching.",
  },
  {
    title: "African Botanical Skincare",
    description:
      "Licorice root, moringa, qasil, aloe, liwa, snail mucin, and shea help deliver a ritual that feels rooted, premium, and purposeful.",
  },
  {
    title: "Kenya-Focused Convenience",
    description:
      "From Nairobi support to Kenya-wide delivery guidance, the site is built for local discovery, trust, and repeat orders.",
  },
];

export const homeFaqs: FaqItem[] = [
  {
    question: "What makes Queen Koba different from harsh brightening products?",
    answer:
      "Queen Koba focuses on gradual brightening and skin tone support for melanin-rich skin using toxin-free formulas rather than harsh bleaching ingredients such as mercury or hydroquinone.",
  },
  {
    question: "Which Queen Koba product is best for hyperpigmentation?",
    answer:
      "The Complexion Clarifying Serum is the most targeted treatment product for hyperpigmentation, while the full routine supports better results by layering cleanser, toner, moisturizer, and a weekly mask around it.",
  },
  {
    question: "Are Queen Koba products suitable for skincare routines in Kenya?",
    answer:
      "Yes. The range is positioned for shoppers in Kenya looking for brightening skincare, local support, WhatsApp guidance, and products built for melanin-rich skin concerns such as dark spots and uneven tone.",
  },
  {
    question: "Can I use Queen Koba if I want a safe alternative to bleaching creams?",
    answer:
      "Yes. Queen Koba is positioned as a gentler brightening option that helps improve visible dark spots and uneven skin tone without promoting aggressive bleaching or compromised skin health.",
  },
  {
    question: "How should I start if I am new to skincare for melanin skin?",
    answer:
      "Start with a simple ritual: cleanser, toner, serum, moisturizer, and daily sun protection. The full Queen Koba ritual bundle is the easiest way to stay consistent when you are building a complete routine.",
  },
];

export const landingPages: LandingPageData[] = [
  {
    slug: "hyperpigmentation-treatment",
    path: "/hyperpigmentation-treatment",
    title: "Hyperpigmentation Treatment for Melanin-Rich Skin in Kenya | Queen Koba",
    metaDescription:
      "Discover hyperpigmentation treatment in Kenya with Queen Koba. Learn how to treat dark spots, post-acne marks, and uneven skin tone with brightening skincare made for melanin-rich skin.",
    keywords: [
      "hyperpigmentation treatment",
      "skincare for hyperpigmentation",
      "uneven skin tone treatment",
      "hyperpigmentation treatment in Kenya",
      "best products for hyperpigmentation",
    ],
    heroEyebrow: "Hyperpigmentation Guide",
    heroTitle: "A gentler hyperpigmentation treatment path for melanin-rich skin",
    heroIntro:
      "Hyperpigmentation does not need harsh shortcuts. Queen Koba pairs brightening skincare, African botanical ingredients, and a consistent ritual to help fade visible marks while keeping skin calm, supported, and healthy-looking.",
    highlights: [
      "Designed for post-acne marks, patchy tone, and lingering discoloration",
      "Builds around cleanser, toner, serum, cream, and a weekly reset mask",
      "Supports shoppers searching for hyperpigmentation treatment in Kenya",
    ],
    sections: [
      {
        heading: "Why hyperpigmentation needs a barrier-friendly routine",
        paragraphs: [
          "Melanin-rich skin often responds strongly to inflammation, breakouts, friction, and sun exposure. That means dark marks can linger well after the original trigger has passed.",
          "A strong hyperpigmentation treatment routine should not just chase brightness. It should also reduce irritation, support hydration, and help the skin stay consistent long enough to visibly improve tone.",
        ],
        bullets: [
          "Cleanse without stripping the barrier",
          "Layer brightening actives gently and consistently",
          "Hydrate well so treatment products stay tolerable",
          "Use sunscreen daily to prevent marks from deepening",
        ],
      },
      {
        heading: "The Queen Koba ritual for uneven skin tone",
        paragraphs: [
          "Start with the Complexion Clarifying Cleanser to remove buildup and prep skin for the rest of the ritual. Follow with the Brightening Toner to refresh, hydrate, and set up the serum step.",
          "The Complexion Clarifying Serum is the treatment-led core of the routine. It targets visible dark spots and uneven tone, while the Complexion Clarifying Cream helps keep the barrier soft, comfortable, and nourished. Once or twice a week, the Brightening Face Mask helps reset dullness and buildup.",
        ],
        bullets: [
          "Morning: Cleanser, toner, serum, cream, sunscreen",
          "Evening: Cleanser, toner, serum, cream",
          "Weekly: Add the Brightening Face Mask after cleansing",
        ],
      },
      {
        heading: "Ingredients that support brighter-looking skin",
        paragraphs: [
          "Licorice root is a standout ingredient for visible uneven tone because it helps support a more balanced-looking complexion. Moringa contributes antioxidant care, while aloe brings comfort to routines that need both brightness and calm.",
          "Queen Koba also highlights qasil, liwa, shea, and snail mucin in ways that fit a toxin-free skincare positioning. Instead of promising instant bleaching, the formulas emphasize gradual brightening, smoother texture, and healthier-looking skin over time.",
        ],
      },
      {
        heading: "Hyperpigmentation treatment in Kenya: what shoppers care about",
        paragraphs: [
          "Shoppers in Nairobi and across Kenya often need more than product claims. They need clear routines, local trust, mobile-friendly browsing, and confidence that the skincare is safe for daily use.",
          "Queen Koba is strongest when it connects problem-based education with local support, Kenya-focused metadata, and product pages that explain exactly who each product is for and how to use it.",
        ],
      },
    ],
    faqs: [
      {
        question: "What causes hyperpigmentation on melanin-rich skin?",
        answer:
          "Common triggers include post-acne inflammation, sun exposure, irritation, friction, and using products that are too harsh for the skin barrier.",
      },
      {
        question: "How long does it take to see results from a hyperpigmentation routine?",
        answer:
          "Results vary, but a consistent routine typically needs several weeks of steady use. Barrier support and daily sunscreen are essential for visible progress.",
      },
      {
        question: "Which Queen Koba product is most targeted for hyperpigmentation?",
        answer:
          "The Complexion Clarifying Serum is the most targeted step, but it performs best when paired with the rest of the ritual for cleansing, hydration, and ongoing support.",
      },
    ],
    relatedProductKeys: ["new-serum", "new-toner", "new-bundle"],
    relatedArticleSlugs: [
      "best-skincare-routine-for-hyperpigmentation",
      "best-serum-for-hyperpigmentation-in-kenya",
      "african-botanical-ingredients-for-glowing-skin",
    ],
    relatedPageLinks: [
      {
        eyebrow: "Related Concern",
        title: "Dark Spots Treatment",
        description:
          "Go deeper on fading post-acne marks and visible spots with a more problem-specific guide.",
        to: "/dark-spots-treatment",
        ctaLabel: "View dark spots guide",
      },
      {
        eyebrow: "Related Education",
        title: "Skincare for Melanin Skin",
        description:
          "Understand why barrier support, tone consistency, and safe brightening matter more for melanin-rich skin.",
        to: "/skincare-for-melanin-skin",
        ctaLabel: "Read melanin skin guide",
      },
    ],
    ctaTitle: "Build your hyperpigmentation routine with the full ritual",
    ctaBody:
      "If you want a clear starting point, the Queen Koba bundle brings cleanser, toner, serum, cream, and mask into one brightening routine for dark spots and uneven skin tone.",
    ctaPrimaryLabel: "Shop the full ritual",
    ctaPrimaryTo: "/shop/new-bundle",
    ctaSecondaryLabel: "Browse the shop",
    ctaSecondaryTo: "/shop",
  },
  {
    slug: "dark-spots-treatment",
    path: "/dark-spots-treatment",
    title: "Dark Spots Treatment for Melanin-Rich Skin | Queen Koba",
    metaDescription:
      "Looking for dark spots treatment in Kenya? Explore Queen Koba skincare for post-acne marks, uneven tone, and natural-looking brightness with toxin-free African botanical skincare.",
    keywords: [
      "dark spots treatment",
      "how to remove dark spots",
      "products for dark spots",
      "dark spots treatment in Kenya",
      "natural products for dark spots",
    ],
    heroEyebrow: "Dark Spots Guide",
    heroTitle: "How to treat dark spots without compromising skin health",
    heroIntro:
      "Dark spots often fade best with patience, consistent brightening care, and formulas that work with melanin-rich skin rather than overwhelming it. Queen Koba builds that approach into a premium daily ritual.",
    highlights: [
      "Supports post-blemish marks and visible discoloration",
      "Pairs treatment serums with hydration and weekly reset care",
      "Built for shoppers comparing safe alternatives to bleaching creams",
    ],
    sections: [
      {
        heading: "Dark spots are usually a story of inflammation",
        paragraphs: [
          "Many dark spots appear after breakouts, irritation, or small injuries to the skin. When melanin-rich skin heals, it can leave behind visible marks that last longer than the original event.",
          "That is why dark spots treatment should focus on reducing repeat irritation and supporting steady skin recovery, not just layering stronger and stronger actives.",
        ],
      },
      {
        heading: "What to use for dark spots",
        paragraphs: [
          "A good routine starts with a gentle brightening face cleanser and a toner that prepares the skin for targeted treatment. The serum then does the focused work of supporting clarity and a more even-looking complexion.",
          "Hydration matters too. When a moisturizer helps keep the barrier comfortable, shoppers are more likely to stay consistent with their dark spots treatment routine long enough to see change.",
        ],
        bullets: [
          "Cleanser for daily buildup and a fresh base",
          "Toner for prep and hydration",
          "Serum for dark spot focus",
          "Cream for comfort and barrier support",
          "Mask for weekly brightening maintenance",
        ],
      },
      {
        heading: "Why toxin-free brightening matters",
        paragraphs: [
          "Searches for how to remove dark spots often lead shoppers toward risky solutions that promise speed but damage trust. Queen Koba positions itself differently, with no mercury, no hydroquinone, and no steroid shortcuts.",
          "That difference matters commercially and educationally. It helps the brand rank for safe alternative keywords while also improving conversion among shoppers who are cautious about harsh brightening products.",
        ],
      },
      {
        heading: "Dark spots treatment in Kenya",
        paragraphs: [
          "Locally relevant skincare content should speak to how Kenyan shoppers actually browse: by problem, by ingredient safety, and by whether the routine feels practical to follow every day.",
          "Queen Koba becomes more valuable when product pages, educational guides, and WhatsApp support all reinforce the same message: brightening can be safe, premium, and rooted in skin health.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best serum for dark spots?",
        answer:
          "A serum that targets visible discoloration while staying compatible with melanin-rich skin is often the most useful choice. Queen Koba positions its Complexion Clarifying Serum as the key treatment step for this concern.",
      },
      {
        question: "Can dark spots fade naturally with skincare?",
        answer:
          "Yes. Dark spots can gradually fade with a routine that supports brighter-looking skin, reduces repeated irritation, and includes sunscreen to protect progress.",
      },
      {
        question: "Are bleaching creams the same as dark spots treatment?",
        answer:
          "No. Dark spots treatment can focus on safer brightening and skin tone support, while bleaching creams often imply harsher approaches that may compromise the skin barrier.",
      },
    ],
    relatedProductKeys: ["new-serum", "new-cleanser", "new-mask"],
    relatedArticleSlugs: [
      "how-to-remove-dark-spots-naturally",
      "safe-alternatives-to-bleaching-creams",
      "best-skincare-products-in-kenya-for-dark-spots",
    ],
    relatedPageLinks: [
      {
        eyebrow: "Related Concern",
        title: "Hyperpigmentation Treatment",
        description:
          "See the broader routine strategy for patchy tone, post-acne marks, and lingering discoloration.",
        to: "/hyperpigmentation-treatment",
        ctaLabel: "Read treatment guide",
      },
      {
        eyebrow: "Local Search",
        title: "Skincare Products in Kenya",
        description:
          "Browse product and delivery guidance built for shoppers in Nairobi and across Kenya.",
        to: "/skincare-products-kenya",
        ctaLabel: "Explore Kenya skincare",
      },
    ],
    ctaTitle: "Start with the serum-led dark spots routine",
    ctaBody:
      "If dark spots are your top concern, build around the Queen Koba serum and support it with cleanser, toner, and moisturizer for a more consistent routine.",
    ctaPrimaryLabel: "Shop the serum",
    ctaPrimaryTo: "/shop/new-serum",
    ctaSecondaryLabel: "Read the routine guide",
    ctaSecondaryTo: "/blog/how-to-remove-dark-spots-naturally",
  },
  {
    slug: "skincare-for-melanin-skin",
    path: "/skincare-for-melanin-skin",
    title: "Skincare for Melanin Skin: Brightening Without Harshness | Queen Koba",
    metaDescription:
      "Learn how to build skincare for melanin skin with Queen Koba. Discover safe brightening routines, dark spot support, and barrier-friendly skincare for melanin-rich skin.",
    keywords: [
      "skincare for melanin skin",
      "skincare for melanin rich skin",
      "melanin skincare products",
      "skincare for African skin",
      "safe skin brightening products",
    ],
    heroEyebrow: "Melanin Skin Guide",
    heroTitle: "Skincare for melanin skin should brighten without fighting your skin",
    heroIntro:
      "Melanin-rich skin deserves routines that respect tone depth, support the barrier, and treat hyperpigmentation without pushing harsh bleaching language. Queen Koba is built around that philosophy.",
    highlights: [
      "Barrier-friendly brightening for uneven skin tone",
      "Educational guidance for melanin-rich skin shoppers",
      "Natural and African botanical positioning with premium language",
    ],
    sections: [
      {
        heading: "Why melanin-rich skin needs a different brightening conversation",
        paragraphs: [
          "Melanin-rich skin often experiences lingering marks after inflammation, and it can also react strongly when products are too aggressive. That is why brightening for melanin skin must prioritize safety, consistency, and calm support.",
          "The right routine does not aim to erase your natural complexion. It helps improve visible uneven tone, soften dark marks, and restore a healthier-looking glow.",
        ],
      },
      {
        heading: "What to look for in melanin skincare products",
        paragraphs: [
          "Look for routines that balance targeted treatment with hydration and soothing support. Product descriptions should explain how to use each step, what ingredients are included, and which concerns the formula is best for.",
          "Queen Koba strengthens its authority when it clearly communicates that its brightening products are designed for melanin-rich skin and free from mercury, hydroquinone, and steroid shortcuts.",
        ],
        bullets: [
          "A gentle cleanser that does not leave skin tight",
          "A toner that adds prep and comfort",
          "A serum with a clear dark spot focus",
          "A moisturizer that keeps treatment routines tolerable",
          "A weekly mask that supports smoother, fresher-looking skin",
        ],
      },
      {
        heading: "Brightening safely for African skin",
        paragraphs: [
          "For many shoppers, the search for skincare for African skin is also a search for trust. They want proof that a brand understands dark spots, dullness, sensitivity, and the damage caused by harsh lightening products.",
          "Queen Koba can own that conversation by pairing premium aesthetics with educational content about melanin-safe routines, ingredient transparency, and realistic expectations.",
        ],
      },
      {
        heading: "How Queen Koba supports melanin skin in Kenya",
        paragraphs: [
          "Local relevance matters when shoppers are choosing between imported products, social recommendations, and regional beauty brands. Queen Koba stands out by blending local SEO, Kenya-focused messaging, and a premium skincare narrative with direct support channels.",
          "This makes the site more than a product catalog. It becomes a skincare authority destination for problem-based discovery and conversion-ready education.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Queen Koba suitable for melanin-rich skin?",
        answer:
          "Yes. The brand positions its skincare around melanin-rich skin concerns such as dark spots, uneven skin tone, and dullness while emphasizing gentle brightening and barrier support.",
      },
      {
        question: "What should melanin skin avoid when targeting dark spots?",
        answer:
          "Melanin-rich skin often benefits from avoiding overly harsh routines, friction, and unsafe bleaching products that can trigger more irritation or rebound discoloration.",
      },
      {
        question: "Can a natural skincare routine still help with hyperpigmentation?",
        answer:
          "Yes. A natural or botanical routine can support brighter-looking skin when it is consistent, treatment-aware, and balanced with hydration and sun protection.",
      },
    ],
    relatedProductKeys: ["new-cleanser", "new-serum", "new-cream"],
    relatedArticleSlugs: [
      "how-to-build-a-skincare-routine-for-melanin-skin",
      "best-skincare-routine-for-hyperpigmentation",
      "safe-alternatives-to-bleaching-creams",
    ],
    relatedPageLinks: [
      {
        eyebrow: "Ingredient Education",
        title: "African Botanical Skincare",
        description:
          "See how licorice root, moringa, qasil, aloe, and shea support a skincare ritual designed for glow and clarity.",
        to: "/african-botanical-skincare",
        ctaLabel: "Explore ingredients",
      },
      {
        eyebrow: "Product Discovery",
        title: "Brightening Skincare Products in Kenya",
        description:
          "Shop the full Queen Koba range with local context, ingredient trust, and problem-based product selection.",
        to: "/skincare-products-kenya",
        ctaLabel: "Browse products",
      },
    ],
    ctaTitle: "Build a melanin-safe brightening routine",
    ctaBody:
      "Shop the daily cleanser, toner, serum, and cream if you want a complete routine built to support glow, clarity, and comfort for melanin-rich skin.",
    ctaPrimaryLabel: "Shop the routine",
    ctaPrimaryTo: "/shop/new-bundle",
    ctaSecondaryLabel: "Read the blog",
    ctaSecondaryTo: "/blog/how-to-build-a-skincare-routine-for-melanin-skin",
  },
  {
    slug: "african-botanical-skincare",
    path: "/african-botanical-skincare",
    title: "African Botanical Skincare for Brightening and Glow | Queen Koba",
    metaDescription:
      "Explore African botanical skincare by Queen Koba, including licorice root, moringa, qasil, aloe, liwa, snail mucin, and shea for brightening, glow, and uneven skin tone support.",
    keywords: [
      "African botanical skincare",
      "botanical skincare",
      "natural skincare products",
      "licorice root skincare",
      "moringa skincare benefits",
    ],
    heroEyebrow: "Ingredient Authority",
    heroTitle: "African botanical skincare that feels luxurious and purposeful",
    heroIntro:
      "Queen Koba draws on ingredients associated with brightening, soothing, clarifying, and nourishing skin. The brand becomes more memorable when shoppers understand exactly how those ingredients fit into a daily ritual.",
    highlights: [
      "Licorice root, moringa, aloe, liwa, qasil, shea, and snail mucin",
      "Premium ingredient storytelling built for topical authority",
      "Natural skincare positioning without vague wellness language",
    ],
    sections: [
      {
        heading: "Why ingredient storytelling matters",
        paragraphs: [
          "Ingredient-led content gives shoppers a reason to trust the brand beyond visuals alone. It helps them understand what each formula is trying to do and why the full ritual works better together than isolated products.",
          "For SEO, ingredient education creates new entry points for searches around botanical skincare, natural brightening skincare, and clean beauty alternatives to harsh lightening routines.",
        ],
      },
      {
        heading: "The Queen Koba ingredient story",
        paragraphs: [
          "Licorice root is often associated with helping support a more even-looking complexion. Moringa contributes antioxidant care and a healthier-looking glow. Aloe helps calm routines that need comfort as much as clarity.",
          "Qasil supports a refined, fresh feel in cleansing and masking routines. Liwa adds spot-focused storytelling. Shea and snail mucin speak to nourishment, softness, and recovery, which is essential when brightening remains barrier-aware.",
        ],
        bullets: [
          "Licorice root for visible tone balance support",
          "Moringa for antioxidant glow support",
          "Aloe for soothing comfort",
          "Qasil for gentle purification",
          "Shea and snail mucin for richer hydration",
        ],
      },
      {
        heading: "Natural skincare products still need structure",
        paragraphs: [
          "Natural positioning works best when it stays specific. Shoppers need to know whether a cleanser is for daily use, a serum is for dark spots, or a mask belongs in a weekly routine.",
          "Queen Koba improves conversion when ingredient education pages point clearly toward the corresponding product pages and explain how each product fits within a complete brightening ritual.",
        ],
      },
      {
        heading: "African botanical skincare in Kenya",
        paragraphs: [
          "Local SEO improves when ingredient pages mention Kenya naturally and connect product discovery with regional trust. This is especially important for shoppers searching for natural skincare Kenya, botanical skincare, and skincare products in Nairobi.",
          "Queen Koba should position its ingredient authority as part of a broader skin education ecosystem, linking ingredient pages to guides about hyperpigmentation, dark spots, and melanin-safe routines.",
        ],
      },
    ],
    faqs: [
      {
        question: "What are African botanical ingredients in Queen Koba products?",
        answer:
          "Queen Koba highlights ingredients such as licorice root, moringa, aloe, qasil, liwa, shea, and snail mucin within its brightening and hydration-focused skincare ritual.",
      },
      {
        question: "Why does licorice root appear in brightening skincare?",
        answer:
          "Licorice root is commonly associated with supporting a more even-looking complexion, which makes it relevant for skincare routines targeting dark spots and uneven tone.",
      },
      {
        question: "Is African botanical skincare the same as harsh skin lightening?",
        answer:
          "No. Queen Koba frames African botanical skincare as a gentler, toxin-free brightening approach focused on glow, clarity, and skin health rather than harsh bleaching.",
      },
    ],
    relatedProductKeys: ["new-cleanser", "new-mask", "new-cream"],
    relatedArticleSlugs: [
      "african-botanical-ingredients-for-glowing-skin",
      "natural-ingredients-that-help-fade-hyperpigmentation",
      "safe-alternatives-to-bleaching-creams",
    ],
    relatedPageLinks: [
      {
        eyebrow: "Concern Guide",
        title: "Hyperpigmentation Treatment",
        description:
          "See how ingredient education connects to a complete routine for dark spots and uneven tone.",
        to: "/hyperpigmentation-treatment",
        ctaLabel: "View treatment guide",
      },
      {
        eyebrow: "Local Search",
        title: "Skincare Products in Kenya",
        description:
          "Move from ingredient discovery to a Kenya-focused product experience with direct paths to the full catalog.",
        to: "/skincare-products-kenya",
        ctaLabel: "Browse products in Kenya",
      },
    ],
    ctaTitle: "Shop the ritual powered by African botanicals",
    ctaBody:
      "Bring ingredient education into your daily routine with the Queen Koba cleanser, serum, cream, and weekly mask.",
    ctaPrimaryLabel: "Shop the collection",
    ctaPrimaryTo: "/shop",
    ctaSecondaryLabel: "Read ingredient guides",
    ctaSecondaryTo: "/blog/african-botanical-ingredients-for-glowing-skin",
  },
  {
    slug: "skincare-products-kenya",
    path: "/skincare-products-kenya",
    title: "Premium Skincare Products in Kenya for Dark Spots and Glow | Queen Koba",
    metaDescription:
      "Shop skincare products in Kenya with Queen Koba. Discover brightening skincare, natural skincare products, and melanin-safe routines for dark spots, hyperpigmentation, and uneven skin tone.",
    keywords: [
      "skincare products in Kenya",
      "natural skincare Kenya",
      "brightening skincare Kenya",
      "hyperpigmentation products Kenya",
      "Nairobi skincare products",
    ],
    heroEyebrow: "Kenya Skincare Hub",
    heroTitle: "Premium skincare products in Kenya for dark spots, glow, and melanin-rich skin",
    heroIntro:
      "Queen Koba gives shoppers in Kenya a clearer way to browse premium skincare by problem, product type, and routine stage. That makes the site more useful for both Google and customers deciding what to buy next.",
    highlights: [
      "Targets problem-based local searches such as dark spots treatment in Kenya",
      "Combines product discovery, education, and local trust signals",
      "Built for Nairobi shoppers and Kenya-wide skincare demand",
    ],
    sections: [
      {
        heading: "What shoppers in Kenya want from skincare sites",
        paragraphs: [
          "Local shoppers often arrive with a problem in mind: hyperpigmentation, dark spots, dullness, or uneven skin tone. They need a brand to explain which products solve what, how the routine works, and whether the formulas are safe.",
          "Queen Koba becomes stronger when its home page, shop, product pages, and educational content all reinforce that it offers premium, toxin-free brightening skincare in Kenya for melanin-rich skin.",
        ],
      },
      {
        heading: "How to shop skincare products in Kenya by routine",
        paragraphs: [
          "Instead of starting with isolated products, many shoppers convert more easily when they understand the routine. Cleanser removes buildup, toner refreshes and preps, serum targets visible concerns, cream locks in hydration, and a mask supports a weekly glow reset.",
          "This routine-based approach is especially useful for first-time shoppers who want clarity and for repeat shoppers who want to restock by step.",
        ],
        bullets: [
          "Daily cleanser for a clean base",
          "Brightening toner for prep",
          "Serum for dark spots and hyperpigmentation",
          "Cream for hydration and support",
          "Mask for weekly glow maintenance",
        ],
      },
      {
        heading: "Building local trust in Nairobi and beyond",
        paragraphs: [
          "Local SEO is not only about adding city names. It is about showing that the business understands local expectations, offers direct support, and communicates delivery, payment, and contact details clearly.",
          "Nairobi shoppers may search for skincare products in Nairobi, while other users search for natural skincare Kenya or hyperpigmentation products Kenya. Queen Koba benefits by serving all of those needs with focused pages and internal links.",
        ],
      },
      {
        heading: "Why local relevance also improves conversion",
        paragraphs: [
          "When shoppers see Kenya-specific messaging, local contact details, and educational content built around their concerns, they move more confidently from browsing to checkout.",
          "That is the commercial advantage of local SEO for an ecommerce skincare brand: better rankings, stronger trust, and fewer unanswered questions before purchase.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does Queen Koba serve skincare shoppers in Kenya?",
        answer:
          "Yes. The site is optimized for skincare shoppers in Kenya, with local support, Kenya-relevant metadata, and product content built around the concerns customers search for most often.",
      },
      {
        question: "What Queen Koba products are best for dark spots in Kenya?",
        answer:
          "The serum is the most targeted step for dark spots, while the full routine helps improve consistency by combining cleanser, toner, moisturizer, and a weekly mask.",
      },
      {
        question: "Are Queen Koba products natural skincare products?",
        answer:
          "Queen Koba positions its range as toxin-free African botanical skincare, combining a natural ingredient story with premium ritual-based product design.",
      },
    ],
    relatedProductKeys: ["new-serum", "new-bundle", "new-toner"],
    relatedArticleSlugs: [
      "best-skincare-products-in-kenya-for-dark-spots",
      "best-serum-for-hyperpigmentation-in-kenya",
      "best-skincare-routine-for-hyperpigmentation",
    ],
    relatedPageLinks: [
      {
        eyebrow: "Related Topic",
        title: "Dark Spots Treatment",
        description:
          "Move from local product discovery into a deeper routine guide built specifically for dark spots.",
        to: "/dark-spots-treatment",
        ctaLabel: "Read dark spots guide",
      },
      {
        eyebrow: "Ingredient Authority",
        title: "African Botanical Skincare",
        description:
          "See the ingredient story behind the Queen Koba range and how it supports topical authority.",
        to: "/african-botanical-skincare",
        ctaLabel: "Explore ingredients",
      },
    ],
    ctaTitle: "Shop Queen Koba skincare in Kenya",
    ctaBody:
      "Browse the cleanser, toner, serum, cream, mask, and full ritual bundle to build a glow-focused skincare routine in Kenya.",
    ctaPrimaryLabel: "Shop Queen Koba",
    ctaPrimaryTo: "/shop",
    ctaSecondaryLabel: "Contact our team",
    ctaSecondaryTo: "/contact",
  },
];

export const landingPagesBySlug = Object.fromEntries(
  landingPages.map((page) => [page.slug, page]),
) as Record<string, LandingPageData>;

export const landingPageLinkCards: LinkCard[] = landingPages.map((page) => ({
  eyebrow: "SEO Landing Page",
  title: page.heroTitle,
  description: page.metaDescription,
  to: page.path,
  ctaLabel: "Open page",
}));

export const blogCategories: BlogCategory[] = [
  {
    slug: "hyperpigmentation",
    name: "Hyperpigmentation",
    description:
      "Educational content for uneven tone, post-acne marks, and practical treatment routines.",
  },
  {
    slug: "dark-spots",
    name: "Dark Spots",
    description:
      "Buyer-intent and educational content focused on fading visible spots and discoloration.",
  },
  {
    slug: "melanin-skin",
    name: "Melanin Skin",
    description:
      "Barrier-aware skincare education for melanin-rich skin and safe brightening routines.",
  },
  {
    slug: "ingredients",
    name: "Ingredients",
    description:
      "Ingredient-led skincare education for licorice root, moringa, qasil, aloe, and more.",
  },
  {
    slug: "kenya-skincare",
    name: "Kenya Skin Care",
    description:
      "Local SEO-focused skincare guidance for shoppers in Nairobi and across Kenya.",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "best-skincare-routine-for-hyperpigmentation",
    path: "/blog/best-skincare-routine-for-hyperpigmentation",
    title: "Best Skincare Routine for Hyperpigmentation on Melanin-Rich Skin",
    metaDescription:
      "Learn the best skincare routine for hyperpigmentation with Queen Koba. Discover how to layer cleanser, toner, serum, cream, and weekly care for melanin-rich skin.",
    excerpt:
      "A simple, conversion-focused guide to building a brightening skincare routine for hyperpigmentation, dark spots, and uneven tone.",
    heroImage: BLOG_IMAGE_LIBRARY.ritual,
    heroImageAlt: "Queen Koba full skincare ritual for hyperpigmentation and melanin-rich skin",
    categorySlug: "hyperpigmentation",
    keywords: [
      "best skincare routine for hyperpigmentation",
      "skincare routine for hyperpigmentation",
      "hyperpigmentation skincare routine",
      "skincare for melanin skin",
    ],
    readTime: "7 min read",
    publishedAt: "2026-04-04",
    updatedAt: "2026-04-04",
    heroEyebrow: "Routine Guide",
    localAngle:
      "Built for shoppers in Kenya who want a practical routine for dark spots and uneven tone without harsh bleaching products.",
    sections: [
      {
        heading: "Start with the right goal",
        paragraphs: [
          "The best skincare routine for hyperpigmentation is not the one with the most products. It is the one you can follow consistently while keeping the skin calm enough to tolerate treatment.",
          "For melanin-rich skin, that usually means focusing on discoloration, hydration, and barrier support at the same time.",
        ],
      },
      {
        heading: "Morning routine for hyperpigmentation",
        paragraphs: [
          "Use a gentle cleanser first to remove overnight buildup. Apply toner to refresh and prep the skin, then use a targeted serum for visible dark spots and uneven tone.",
          "Finish with a moisturizer and sunscreen. Sunscreen is essential because unprotected sun exposure can keep hyperpigmentation looking darker for longer.",
        ],
        bullets: [
          "Cleanser",
          "Brightening toner",
          "Dark spot serum",
          "Moisturizer",
          "Sunscreen",
        ],
      },
      {
        heading: "Evening routine for brighter-looking skin",
        paragraphs: [
          "Evening is where consistency compounds. Cleanse away the day, reapply toner, follow with your serum, and finish with a cream that keeps the barrier comfortable.",
          "If you want a weekly reset step, add a brightening face mask one or two times per week after cleansing.",
        ],
      },
      {
        heading: "Why a full ritual often works better than a single product",
        paragraphs: [
          "Many shoppers search for the best serum for hyperpigmentation, and the serum is important. But it is rarely the whole answer. Results improve when the rest of the routine helps the serum perform consistently.",
          "That is why a cleanser, toner, cream, and weekly mask all support the treatment goal rather than competing with it.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best order to apply hyperpigmentation products?",
        answer:
          "Use products from thinnest to thickest: cleanser, toner, serum, cream, then sunscreen in the morning.",
      },
      {
        question: "Do I need sunscreen for hyperpigmentation?",
        answer:
          "Yes. Sunscreen protects your progress and helps prevent dark spots from becoming more visible.",
      },
    ],
    relatedProductKeys: ["new-serum", "new-bundle", "new-cream"],
    relatedArticleSlugs: [
      "best-serum-for-hyperpigmentation-in-kenya",
      "how-to-remove-dark-spots-naturally",
      "how-to-build-a-skincare-routine-for-melanin-skin",
    ],
    relatedPageLinks: [
      {
        eyebrow: "Landing Page",
        title: "Hyperpigmentation Treatment",
        description: "Explore the full treatment page for this keyword cluster.",
        to: "/hyperpigmentation-treatment",
        ctaLabel: "Open landing page",
      },
    ],
  },
  {
    slug: "how-to-remove-dark-spots-naturally",
    path: "/blog/how-to-remove-dark-spots-naturally",
    title: "How to Remove Dark Spots Naturally Without Harsh Bleaching",
    metaDescription:
      "Learn how to remove dark spots naturally with Queen Koba. Explore gentle brightening skincare, barrier-safe routines, and ingredient tips for melanin-rich skin.",
    excerpt:
      "A realistic guide to fading dark spots naturally with brightening skincare, consistency, and ingredient awareness.",
    heroImage: BLOG_IMAGE_LIBRARY.serum,
    heroImageAlt: "Queen Koba dark spot serum for natural brightening and uneven skin tone support",
    categorySlug: "dark-spots",
    keywords: [
      "how to remove dark spots naturally",
      "natural products for dark spots",
      "dark spots treatment",
      "products that fade dark spots naturally",
    ],
    readTime: "6 min read",
    publishedAt: "2026-04-04",
    updatedAt: "2026-04-04",
    heroEyebrow: "Dark Spots Education",
    localAngle:
      "Ideal for Kenya-based shoppers comparing natural dark spot routines with harsh bleaching promises.",
    sections: [
      {
        heading: "Natural does not mean random",
        paragraphs: [
          "If you want to remove dark spots naturally, the goal is not to try every herbal ingredient at once. The goal is to use a routine that is gentle enough to keep using while still targeting visible discoloration.",
          "That is where botanical skincare works best: as part of a structured ritual, not as a pile of disconnected remedies.",
        ],
      },
      {
        heading: "Ingredients that can support a natural dark spot routine",
        paragraphs: [
          "Licorice root is often included in brightening skincare for visible tone support. Aloe helps calm routines that need comfort, while moringa, qasil, and shea add a richer story around glow, softness, and skin nourishment.",
          "Queen Koba benefits when those ingredients are tied clearly to product use cases rather than left as generic wellness language.",
        ],
      },
      {
        heading: "The routine still matters most",
        paragraphs: [
          "Even a natural dark spot routine needs daily cleansing, targeted treatment, and hydration. A serum can carry the treatment focus, but the rest of the routine helps keep the skin stable enough to continue.",
          "That is especially important for melanin-rich skin, where over-exfoliation or irritation can create more visible marks rather than fewer.",
        ],
      },
      {
        heading: "What to avoid when treating dark spots",
        paragraphs: [
          "Avoid routines that promise instant bleaching or that rely on unsafe ingredients to force a quick result. Also avoid changing products too often, because inconsistency makes it harder to judge what is helping.",
          "The better approach is to choose a brightening routine, track progress, and protect the skin barrier as you go.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can dark spots fade without bleaching creams?",
        answer:
          "Yes. A consistent brightening routine, daily sunscreen, and gentle ingredient support can help dark spots fade over time without harsh bleaching products.",
      },
      {
        question: "What natural ingredient is best for dark spots?",
        answer:
          "Many shoppers look for licorice root, aloe, moringa, and other botanical ingredients that support a brighter-looking complexion as part of a full routine.",
      },
    ],
    relatedProductKeys: ["new-serum", "new-mask", "new-cleanser"],
    relatedArticleSlugs: [
      "safe-alternatives-to-bleaching-creams",
      "african-botanical-ingredients-for-glowing-skin",
      "best-skincare-products-in-kenya-for-dark-spots",
    ],
    relatedPageLinks: [
      {
        eyebrow: "Landing Page",
        title: "Dark Spots Treatment",
        description: "Go from education into a dark spots-specific treatment page.",
        to: "/dark-spots-treatment",
        ctaLabel: "Open landing page",
      },
    ],
  },
  {
    slug: "safe-alternatives-to-bleaching-creams",
    path: "/blog/safe-alternatives-to-bleaching-creams",
    title: "Safe Alternatives to Bleaching Creams for Brighter-Looking Skin",
    metaDescription:
      "Looking for safe alternatives to bleaching creams? Learn how Queen Koba approaches brightening skincare for melanin-rich skin without mercury, hydroquinone, or steroid shortcuts.",
    excerpt:
      "A premium, educational article for shoppers who want brighter-looking skin without risky bleaching practices.",
    heroImage: BLOG_IMAGE_LIBRARY.trust,
    heroImageAlt: "Queen Koba toxin-free skincare trust image for safe brightening routines",
    categorySlug: "melanin-skin",
    keywords: [
      "safe alternatives to bleaching creams",
      "alternative to bleaching creams",
      "safe skin brightening products",
      "toxin free skincare",
    ],
    readTime: "6 min read",
    publishedAt: "2026-04-04",
    updatedAt: "2026-04-04",
    heroEyebrow: "Trust & Safety",
    localAngle:
      "Important for local SEO and conversion because Kenyan shoppers often compare brightening products against risky lightening alternatives.",
    sections: [
      {
        heading: "Why shoppers search for alternatives",
        paragraphs: [
          "Many people want to reduce dark spots or dullness, but they do not want the fear that comes with harsh bleaching products. That search is really about safety, trust, and sustainable results.",
          "Queen Koba can own that conversation by making it clear that brightening does not have to mean compromising skin health.",
        ],
      },
      {
        heading: "A better brightening philosophy",
        paragraphs: [
          "Safe alternatives focus on brightening visible uneven tone, supporting hydration, and helping the skin stay resilient. They work with the barrier instead of constantly provoking it.",
          "This approach is especially relevant for melanin-rich skin, where irritation can worsen discoloration rather than improve it.",
        ],
      },
      {
        heading: "What Queen Koba should reinforce",
        paragraphs: [
          "The strongest trust statements are specific: no mercury, no hydroquinone, no steroid shortcuts, and routines designed for melanin-rich skin. These claims should appear on the homepage, product pages, landing pages, and FAQs.",
          "That consistency improves both conversion and topical authority because it aligns product content, educational content, and local SEO messaging around one clear promise.",
        ],
      },
      {
        heading: "How to shop for safer brightening skincare",
        paragraphs: [
          "Look for a brand that explains ingredients, offers full routine guidance, and avoids exaggerated claims. Trust grows when products are presented as a ritual with realistic results rather than miracle fixes.",
          "Queen Koba is best positioned when it moves shoppers from fear-based comparison toward confidence-based routine building.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is brightening skincare the same as bleaching?",
        answer:
          "No. Brightening skincare can focus on visible uneven tone and glow support, while bleaching language often signals more aggressive or risky approaches.",
      },
      {
        question: "Why is toxin-free skincare important for dark spots?",
        answer:
          "Toxin-free positioning builds trust and supports long-term routine use, especially for shoppers who want a safer path to brighter-looking skin.",
      },
    ],
    relatedProductKeys: ["new-serum", "new-cream", "new-bundle"],
    relatedArticleSlugs: [
      "how-to-remove-dark-spots-naturally",
      "how-to-build-a-skincare-routine-for-melanin-skin",
      "best-skincare-routine-for-hyperpigmentation",
    ],
    relatedPageLinks: [
      {
        eyebrow: "Landing Page",
        title: "Skincare for Melanin Skin",
        description: "See how safe brightening connects to a melanin-first skincare routine.",
        to: "/skincare-for-melanin-skin",
        ctaLabel: "Open landing page",
      },
    ],
  },
  {
    slug: "best-serum-for-hyperpigmentation-in-kenya",
    path: "/blog/best-serum-for-hyperpigmentation-in-kenya",
    title: "Best Serum for Hyperpigmentation in Kenya: What to Look For",
    metaDescription:
      "Searching for the best serum for hyperpigmentation in Kenya? Learn what matters most in a dark spot serum for melanin-rich skin and how Queen Koba fits a full routine.",
    excerpt:
      "A buyer-intent article built for shoppers comparing serums for hyperpigmentation, dark spots, and uneven tone in Kenya.",
    heroImage: BLOG_IMAGE_LIBRARY.serum,
    heroImageAlt: "Queen Koba Complexion Clarifying Serum for hyperpigmentation shoppers in Kenya",
    categorySlug: "kenya-skincare",
    keywords: [
      "best serum for hyperpigmentation in Kenya",
      "hyperpigmentation serum",
      "dark spot corrector serum",
      "products for dark spots Kenya",
    ],
    readTime: "5 min read",
    publishedAt: "2026-04-04",
    updatedAt: "2026-04-04",
    heroEyebrow: "Buyer Guide",
    localAngle:
      "Built for local buyer-intent searches and product comparison queries in Nairobi and across Kenya.",
    sections: [
      {
        heading: "What makes a serum worth buying",
        paragraphs: [
          "A serum for hyperpigmentation should do more than sound premium. It should clearly explain what concern it targets, how to use it, and how it fits inside a complete routine.",
          "For melanin-rich skin, the best serum is one that supports visible tone improvement without pushing the barrier too hard.",
        ],
      },
      {
        heading: "Why the Queen Koba serum stands out",
        paragraphs: [
          "The Complexion Clarifying Serum is positioned around dark spots, hyperpigmentation, and melanin-rich skin. That alignment makes it commercially strong for buyer-intent SEO.",
          "It performs even better as part of the full ritual, where toner, moisturizer, and weekly mask use all support long-term consistency.",
        ],
      },
      {
        heading: "How to compare serums in Kenya",
        paragraphs: [
          "Local shoppers are often comparing imported serums, social-media favorites, and regional brands at the same time. That makes trust, ingredient clarity, and routine guidance especially important.",
          "A serum page that explains ingredients, benefits, FAQs, and related routine steps converts better than one that only lists a price and a short description.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I use the serum every day?",
        answer:
          "Yes, if it is part of a balanced routine that includes cleansing, hydration, and sunscreen. Consistency usually matters more than aggressive overuse.",
      },
      {
        question: "Should I buy only the serum or the full kit?",
        answer:
          "If you are starting from scratch, the full ritual offers a clearer routine. If you already have supporting steps, the serum can be the most targeted single product for dark spots.",
      },
    ],
    relatedProductKeys: ["new-serum", "new-toner", "new-bundle"],
    relatedArticleSlugs: [
      "best-skincare-routine-for-hyperpigmentation",
      "best-skincare-products-in-kenya-for-dark-spots",
      "safe-alternatives-to-bleaching-creams",
    ],
    relatedPageLinks: [
      {
        eyebrow: "Landing Page",
        title: "Skincare Products in Kenya",
        description: "Explore the broader local ecommerce hub for Queen Koba shoppers.",
        to: "/skincare-products-kenya",
        ctaLabel: "Open Kenya skincare page",
      },
    ],
  },
  {
    slug: "african-botanical-ingredients-for-glowing-skin",
    path: "/blog/african-botanical-ingredients-for-glowing-skin",
    title: "African Botanical Ingredients for Glowing Skin",
    metaDescription:
      "Discover African botanical ingredients for glowing skin, including licorice root, moringa, qasil, aloe, shea, and snail mucin in Queen Koba brightening skincare.",
    excerpt:
      "A topical-authority article connecting ingredient education with brightening skincare for glow, dark spots, and melanin-rich skin.",
    heroImage: BLOG_IMAGE_LIBRARY.ingredients,
    heroImageAlt: "Queen Koba African botanical ingredients and skincare transparency visual",
    categorySlug: "ingredients",
    keywords: [
      "African botanical ingredients for glowing skin",
      "African botanical skincare",
      "natural brightening skincare",
      "botanical skincare",
    ],
    readTime: "6 min read",
    publishedAt: "2026-04-04",
    updatedAt: "2026-04-04",
    heroEyebrow: "Ingredient Guide",
    localAngle:
      "Supports brand authority for African botanical skincare and strengthens ingredient-led search visibility in Kenya.",
    sections: [
      {
        heading: "Licorice root for visible tone support",
        paragraphs: [
          "Licorice root is often discussed in brightening skincare because it supports a more balanced-looking complexion. It fits naturally into routines designed for dark spots and uneven tone.",
        ],
      },
      {
        heading: "Moringa, aloe, and qasil for glow support",
        paragraphs: [
          "Moringa adds an antioxidant-rich story, aloe supports comfort, and qasil reinforces gentle cleansing and weekly renewal. Together, they help the brand tell a richer ingredient story than generic brightening claims alone.",
        ],
      },
      {
        heading: "Shea and snail mucin for barrier comfort",
        paragraphs: [
          "Hydration and recovery matter in any brightening routine. Shea and snail mucin make it easier to talk about softness, support, and skin resilience alongside visible glow.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are botanical ingredients enough for a brightening routine?",
        answer:
          "Botanical ingredients can support a brightening routine well when they are part of a structured regimen that includes cleansing, targeted treatment, hydration, and sunscreen.",
      },
      {
        question: "Why do ingredient pages help skincare SEO?",
        answer:
          "Ingredient pages create topical relevance around how products work, attract research-stage visitors, and strengthen internal links to product and landing pages.",
      },
    ],
    relatedProductKeys: ["new-cleanser", "new-mask", "new-cream"],
    relatedArticleSlugs: [
      "natural-ingredients-that-help-fade-hyperpigmentation",
      "how-to-remove-dark-spots-naturally",
      "best-skincare-routine-for-hyperpigmentation",
    ],
    relatedPageLinks: [
      {
        eyebrow: "Landing Page",
        title: "African Botanical Skincare",
        description: "See how ingredient education ties into the broader Queen Koba authority page.",
        to: "/african-botanical-skincare",
        ctaLabel: "Open landing page",
      },
    ],
  },
  {
    slug: "how-to-build-a-skincare-routine-for-melanin-skin",
    path: "/blog/how-to-build-a-skincare-routine-for-melanin-skin",
    title: "How to Build a Skincare Routine for Melanin Skin",
    metaDescription:
      "Learn how to build a skincare routine for melanin skin with Queen Koba. Get a simple guide to brightening, hydration, dark spot support, and barrier-friendly routine building.",
    excerpt:
      "A practical educational article for melanin-rich skin shoppers who want clarity, glow, and safe brightening support.",
    heroImage:
      "https://www.dropbox.com/scl/fi/3e612m0r8bkrt9rab3c6o/v2.jpeg?rlkey=oyt323eq4mkbksok08sslkz0c&st=qt12ty26&raw=1",
    heroImageAlt: "Queen Koba skincare routine image for melanin-rich skin and glow-focused skincare",
    categorySlug: "melanin-skin",
    keywords: [
      "how to build a skincare routine for melanin skin",
      "skincare for melanin skin",
      "skincare routine for melanin skin",
      "melanin skincare products",
    ],
    readTime: "5 min read",
    publishedAt: "2026-04-04",
    updatedAt: "2026-04-04",
    heroEyebrow: "Melanin Skin Routine",
    localAngle:
      "Supports education-first conversion for shoppers in Kenya comparing routines for melanin-rich skin and dark spots.",
    sections: [
      {
        heading: "Keep the routine simple at first",
        paragraphs: [
          "If you are building a routine for melanin skin, start with steps you can keep up with: cleanser, toner, serum, moisturizer, and sunscreen.",
          "That structure is simple enough for beginners but strong enough to support real progress for visible dark spots and uneven tone.",
        ],
      },
      {
        heading: "Use targeted treatment without overdoing it",
        paragraphs: [
          "A serum gives the routine its treatment focus, but a good cleanser and moisturizer keep the rest of the routine balanced. When products work together, the skin is more likely to stay comfortable.",
        ],
      },
      {
        heading: "Consistency is part of the result",
        paragraphs: [
          "Melanin-rich skin often rewards routines that are steady, barrier-aware, and realistic. Queen Koba fits this well by positioning its products as a ritual rather than a one-step miracle.",
        ],
      },
    ],
    faqs: [
      {
        question: "How many products do I need to start a routine for melanin skin?",
        answer:
          "A cleanser, toner, serum, moisturizer, and sunscreen are a strong foundation. A weekly mask is a useful optional step for extra glow support.",
      },
      {
        question: "Is brightening safe for melanin-rich skin?",
        answer:
          "Yes, when the routine is gentle, barrier-aware, and avoids harsh bleaching shortcuts.",
      },
    ],
    relatedProductKeys: ["new-cleanser", "new-serum", "new-bundle"],
    relatedArticleSlugs: [
      "best-skincare-routine-for-hyperpigmentation",
      "safe-alternatives-to-bleaching-creams",
      "best-serum-for-hyperpigmentation-in-kenya",
    ],
    relatedPageLinks: [
      {
        eyebrow: "Landing Page",
        title: "Skincare for Melanin Skin",
        description: "Visit the main melanin skincare landing page for deeper education and product paths.",
        to: "/skincare-for-melanin-skin",
        ctaLabel: "Open landing page",
      },
    ],
  },
  {
    slug: "best-skincare-products-in-kenya-for-dark-spots",
    path: "/blog/best-skincare-products-in-kenya-for-dark-spots",
    title: "Best Skincare Products in Kenya for Dark Spots",
    metaDescription:
      "Explore the best skincare products in Kenya for dark spots, hyperpigmentation, and uneven tone with Queen Koba's cleanser, toner, serum, cream, and ritual bundle.",
    excerpt:
      "A buyer-intent blog post linking local skincare searches in Kenya to a clear product routine for dark spots.",
    heroImage: BLOG_IMAGE_LIBRARY.ritual,
    heroImageAlt: "Queen Koba skincare products in Kenya for dark spots and brightening routines",
    categorySlug: "kenya-skincare",
    keywords: [
      "best skincare products in Kenya for dark spots",
      "skincare products in Kenya",
      "hyperpigmentation products Kenya",
      "products for dark spots Kenya",
    ],
    readTime: "5 min read",
    publishedAt: "2026-04-04",
    updatedAt: "2026-04-04",
    heroEyebrow: "Kenya Buyer Guide",
    localAngle:
      "Strengthens local commercial search visibility for shoppers in Nairobi and across Kenya.",
    sections: [
      {
        heading: "Choose products by concern, not hype",
        paragraphs: [
          "The best skincare products in Kenya for dark spots are the ones that make your routine easier to understand and easier to stay consistent with.",
          "That means knowing what each product does and how each one supports brighter-looking skin over time.",
        ],
      },
      {
        heading: "The five-step Queen Koba routine",
        paragraphs: [
          "Queen Koba covers the full ritual: cleanser, toner, serum, cream, and mask. This makes the range useful for shoppers who want one brand to support the full routine rather than piecing everything together separately.",
        ],
      },
      {
        heading: "Why this matters for local skincare SEO",
        paragraphs: [
          "When a page combines local buyer-intent keywords with specific products, educational context, and strong internal links, it becomes a more complete answer for Google and for shoppers ready to buy.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best Queen Koba product for dark spots?",
        answer:
          "The serum is the most targeted product for dark spots, while the bundle is the best option if you want a full routine in one purchase.",
      },
      {
        question: "Can I shop Queen Koba products from Nairobi?",
        answer:
          "Yes. Queen Koba is positioned for skincare shoppers in Nairobi and across Kenya, with local SEO and support messaging built into the site.",
      },
    ],
    relatedProductKeys: ["new-serum", "new-bundle", "new-cleanser"],
    relatedArticleSlugs: [
      "best-serum-for-hyperpigmentation-in-kenya",
      "how-to-remove-dark-spots-naturally",
      "best-skincare-routine-for-hyperpigmentation",
    ],
    relatedPageLinks: [
      {
        eyebrow: "Landing Page",
        title: "Skincare Products in Kenya",
        description: "Visit the main Kenya skincare hub for product discovery and local trust signals.",
        to: "/skincare-products-kenya",
        ctaLabel: "Open landing page",
      },
    ],
  },
  {
    slug: "natural-ingredients-that-help-fade-hyperpigmentation",
    path: "/blog/natural-ingredients-that-help-fade-hyperpigmentation",
    title: "Natural Ingredients That Help Fade Hyperpigmentation",
    metaDescription:
      "Discover natural ingredients that help fade hyperpigmentation, including licorice root, moringa, aloe, qasil, and more in Queen Koba brightening skincare.",
    excerpt:
      "An authority-building ingredient article designed to support searches around natural hyperpigmentation skincare.",
    heroImage: BLOG_IMAGE_LIBRARY.ingredients,
    heroImageAlt: "Queen Koba ingredients visual for natural hyperpigmentation support",
    categorySlug: "ingredients",
    keywords: [
      "natural ingredients that help fade hyperpigmentation",
      "natural brightening skincare",
      "licorice root skincare",
      "natural skincare products",
    ],
    readTime: "5 min read",
    publishedAt: "2026-04-04",
    updatedAt: "2026-04-04",
    heroEyebrow: "Ingredient Education",
    localAngle:
      "Strengthens topical depth for shoppers in Kenya researching natural skincare before buying.",
    sections: [
      {
        heading: "Ingredient education builds confidence",
        paragraphs: [
          "Shoppers exploring natural skincare want to understand how ingredients support brighter-looking skin without harsh bleaching claims.",
        ],
      },
      {
        heading: "Ingredients to know",
        paragraphs: [
          "Licorice root, moringa, aloe, qasil, liwa, shea, and snail mucin all help Queen Koba describe a richer ingredient ecosystem for glow, comfort, and visible tone support.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can natural ingredients help with hyperpigmentation?",
        answer:
          "Natural ingredients can support a hyperpigmentation routine when they are paired with consistent product use, hydration, and sun protection.",
      },
      {
        question: "What Queen Koba products feature these ingredients?",
        answer:
          "Different ingredients appear across the Queen Koba ritual, including the cleanser, toner, serum, cream, and mask.",
      },
    ],
    relatedProductKeys: ["new-toner", "new-serum", "new-mask"],
    relatedArticleSlugs: [
      "african-botanical-ingredients-for-glowing-skin",
      "how-to-remove-dark-spots-naturally",
      "best-skincare-routine-for-hyperpigmentation",
    ],
    relatedPageLinks: [
      {
        eyebrow: "Landing Page",
        title: "African Botanical Skincare",
        description: "See the main ingredient authority page for Queen Koba.",
        to: "/african-botanical-skincare",
        ctaLabel: "Open landing page",
      },
    ],
  },
];

export const blogPostsBySlug = Object.fromEntries(
  blogPosts.map((post) => [post.slug, post]),
) as Record<string, BlogPost>;

export const featuredBlogSlugs = [
  "best-skincare-routine-for-hyperpigmentation",
  "how-to-remove-dark-spots-naturally",
  "best-serum-for-hyperpigmentation-in-kenya",
] as const;

export const blogContentCalendar = [
  {
    month: "April 2026",
    title: "Best Skincare Routine for Hyperpigmentation",
    stage: "Published",
    to: "/blog/best-skincare-routine-for-hyperpigmentation",
  },
  {
    month: "April 2026",
    title: "How to Remove Dark Spots Naturally",
    stage: "Published",
    to: "/blog/how-to-remove-dark-spots-naturally",
  },
  {
    month: "April 2026",
    title: "Safe Alternatives to Bleaching Creams",
    stage: "Published",
    to: "/blog/safe-alternatives-to-bleaching-creams",
  },
  {
    month: "April 2026",
    title: "Best Serum for Hyperpigmentation in Kenya",
    stage: "Published",
    to: "/blog/best-serum-for-hyperpigmentation-in-kenya",
  },
  {
    month: "April 2026",
    title: "African Botanical Ingredients for Glowing Skin",
    stage: "Published",
    to: "/blog/african-botanical-ingredients-for-glowing-skin",
  },
  {
    month: "May 2026",
    title: "Brightening Skincare Kit Buying Guide",
    stage: "Planned",
    to: "/shop/new-bundle",
  },
  {
    month: "May 2026",
    title: "Dark Spots Treatment in Kenya: FAQ Guide",
    stage: "Planned",
    to: "/dark-spots-treatment",
  },
];

export const defaultArticleAuthor = {
  name: "Queen Koba Editorial Team",
  role: "Skincare Education Team",
  bio: "Queen Koba publishes educational skincare content focused on melanin-rich skin, dark spots, hyperpigmentation, safe brightening routines, and African botanical skincare in Kenya.",
};

export const findBlogPostsBySlugs = (slugs: string[]) =>
  slugs
    .map((slug) => blogPostsBySlug[slug])
    .filter((post): post is BlogPost => Boolean(post));

export const getRelatedBlogPosts = (slug: string, limit = 3) => {
  const current = blogPostsBySlug[slug];
  if (!current) return [];

  const explicit = findBlogPostsBySlugs(current.relatedArticleSlugs).filter((post) => post.slug !== slug);
  if (explicit.length >= limit) {
    return explicit.slice(0, limit);
  }

  const categoryMatches = blogPosts.filter(
    (post) => post.slug !== slug && post.categorySlug === current.categorySlug,
  );

  return [...explicit, ...categoryMatches.filter((post) => !explicit.some((item) => item.slug === post.slug))].slice(
    0,
    limit,
  );
};

export const getBlogPostsByCategory = (categorySlug?: string) =>
  categorySlug ? blogPosts.filter((post) => post.categorySlug === categorySlug) : blogPosts;
