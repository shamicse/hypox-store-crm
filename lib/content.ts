export const pages: Record<
  string,
  { title: string; intro: string; sections: [string, string][] }
> = {
  "size-guide": {
    title: "Find your fit.",
    intro: "HypoX starter collection: S, M, L, XL, XXL.",
    sections: [
      [
        "Choose your usual size",
        "Our sample collection uses relaxed and oversized silhouettes. Select your usual size for the intended shape. Exact garment measurements must be added for each live product before sales begin.",
      ],
      [
        "How to measure",
        "Lay a tee or hoodie you already like flat. Measure across the chest from underarm to underarm, then from the highest shoulder point to the hem. Compare these with the final product measurements.",
      ],
      [
        "Stock in this starter",
        "Available stock is pooled across sizes. Your selected size is saved in the bag and order. Per-size inventory is a next-stage integration before managing real size-specific quantities.",
      ],
      [
        "Need a hand?",
        "Send an order or sizing question through Contact. Never guess a fit from a sample photo alone.",
      ],
    ],
  },
  about: {
    title: "For your own kind of different.",
    intro: "HypoX is a clothing brand for self-expression. your vive. your x",
    sections: [
      [
        "Less endless scrolling. More good finds.",
        "Our first drop starts with oversized tees, heavyweight hoodies, relaxed cargos, crewnecks, and utility jackets. Build your rotation around your own energy.",
      ],
      [
        "A wardrobe with room to move.",
        "HypoX starts with clothing only. Easy silhouettes and versatile layers make space for the way you actually live. Your style is yours to define.",
      ],
      [
        "The collection today",
        "This initial store is a demonstration catalog. Product names, pricing, and descriptions are sample content; photos are illustrative. Demo orders do not charge money or ship physical goods.",
      ],
    ],
  },
  services: {
    title: "More than a shopping bag.",
    intro: "Support for every step of your HypoX order.",
    sections: [
      [
        "For shoppers",
        "Browse collections, compare prices, keep a wishlist, save addresses, and follow orders from checkout to delivery. Need help? Send a message from Contact.",
      ],
      [
        "For sellers",
        "Apply for a seller account, publish products, upload photos, manage available stock, and review sales from a dedicated dashboard.",
      ],
      [
        "For marketplace operators",
        "Review seller applications, manage promotions, coordinate fulfillment, and handle return requests. Live payment, tax, shipping, email, and seller payout operations require merchant configuration.",
      ],
    ],
  },
  faq: {
    title: "Good questions. Clear answers.",
    intro: "The things you might want to know before your next find.",
    sections: [
      [
        "Is this a live shop?",
        "This deployment starts in demo mode. Demo checkout creates an order record but never charges a card or dispatches goods.",
      ],
      [
        "How do I pay?",
        "Demo checkout is available without credentials. Configured stores can redirect to Razorpay for supported India payment methods or Stripe for supported international cards. Availability depends on the merchant’s provider account.",
      ],
      [
        "Where can I track an order?",
        "Sign in and visit Orders. You can see the status and tracking reference supplied by the marketplace administrator.",
      ],
      [
        "Can I return a product?",
        "Request a return from a delivered order within 7 days. The administrator reviews it. Approval is not a refund; money movement is handled through the payment provider after inspection.",
      ],
      [
        "How can I sell?",
        "Visit Seller onboarding, sign in, and tell us about your brand. You receive dashboard access after an administrator approves your application.",
      ],
      [
        "How do discounts work?",
        "Enter a valid code at checkout. The server applies the minimum order, maximum discount, and expiry rules. HYPOX10 is a sample 10% offer on orders of at least ₹999, capped at ₹1,000.",
      ],
    ],
  },
  shipping: {
    title: "From their studio to your door.",
    intro: "Sample delivery information for the demonstration store.",
    sections: [
      [
        "India",
        "Sample shipping is ₹99, waived for product subtotals of ₹2,999 or more. Estimated delivery is 3–7 working days after dispatch.",
      ],
      [
        "International",
        "Supported sample destinations include the United States, United Kingdom, Canada, Australia, Germany, and Singapore. Sample shipping is ₹1,499 with a 7–15 working-day estimate. Customs duties are not included.",
      ],
      [
        "Tracking",
        "Order progress and the administrator’s tracking reference appear in your account. Carrier label creation and live carrier events are not connected in this initial release.",
      ],
      [
        "Before live operation",
        "The merchant must replace these sample rates and estimates with its actual carrier services, delivery coverage, tax treatment, and published commitments. No sample order is physically fulfilled.",
      ],
    ],
  },
  returns: {
    title: "Not quite your thing?",
    intro: "Start a return request from your delivered order.",
    sections: [
      [
        "Request within 7 days",
        "Sign in, open Orders, and select the delivered order. Explain why you are requesting a return. One request per order is supported in this release.",
      ],
      [
        "Review and inspection",
        "Support reviews the request and provides return instructions. An approved return is reviewed again after the goods arrive. Please do not ship items without agreed instructions.",
      ],
      [
        "Refunds",
        "Refund processing is a scaffold in this release. Administrators can track requests through review, receipt, and refund pending. Actual refunds must be issued and reconciled through the payment provider. Demo orders do not involve money.",
      ],
      [
        "Product condition",
        "Eligibility and exclusions must be finalized by the operating merchant before real sales. Keep packaging, proof of purchase, and accessories while a request is open.",
      ],
    ],
  },
  "privacy-policy": {
    title: "Your information, considered.",
    intro:
      "Draft privacy information for this demonstration marketplace. The operating business must finalize its policy before launch.",
    sections: [
      [
        "What this app stores",
        "The app stores your sign-in identifier, display name, email, role, addresses, cart, wishlist, orders, reviews, seller applications, support messages, and notification history.",
      ],
      [
        "How it is used",
        "Information supports account access, ordering, inventory management, fulfillment, support, and marketplace administration. Payment card details are entered on provider-hosted pages and are not stored by this app.",
      ],
      [
        "Cookies and preferences",
        "An HTTP-only guest cookie identifies an anonymous shopping bag. The theme preference is stored in your browser. Authentication cookies are managed by the identity platform.",
      ],
      [
        "Service providers",
        "Hosting and authentication use the Sites platform. Live payment providers, when configured, process payment data under their own policies. Product photography is bundled locally.",
      ],
      [
        "Your requests",
        "Use Contact to request access, correction, or deletion. The operator must establish verified request handling, retention periods, legal bases, processor agreements, and jurisdiction-specific disclosures before accepting real customer data at scale.",
      ],
    ],
  },
  terms: {
    title: "The details behind the deal.",
    intro:
      "Draft terms for the demonstration marketplace. These are not a finalized merchant contract.",
    sections: [
      [
        "Demonstration use",
        "The initial deployment uses sample listings and simulated checkout. A demo order is not a contract for delivery and does not transfer funds.",
      ],
      [
        "Accounts and sellers",
        "Keep your account secure. Seller access requires administrator approval. Sellers are responsible for accurate listings and inventory; administrators control marketplace fulfillment in this release.",
      ],
      [
        "Pricing and payments",
        "All amounts are shown in INR. The server calculates product totals, discounts, and sample shipping. Live tax calculations, invoicing, payment-provider eligibility, and international duties must be configured by the merchant.",
      ],
      [
        "Orders and returns",
        "The app records order progress and return requests. Actual delivery, cancellation, refund, warranty, dispute, and consumer-rights policies must be finalized before trading.",
      ],
      [
        "Acceptable use",
        "Do not submit unlawful listings, misleading reviews, harmful uploads, or content that infringes others’ rights. The operator may moderate products and seller access.",
      ],
    ],
  },
  careers: {
    title: "Build what comes next.",
    intro: "A marketplace is only as interesting as the people behind it.",
    sections: [
      [
        "No open roles right now",
        "We are not currently advertising vacancies. Future opportunities in product, engineering, operations, and brand partnerships will be listed here.",
      ],
      [
        "Stay in touch",
        "If you would like to introduce yourself, use the Contact form with the subject “Careers”. Please do not include sensitive identity documents.",
      ],
    ],
  },
  blog: {
    title: "The edit.",
    intro: "Ideas for a more considered everyday.",
    sections: [
      [
        "01 / Build your everyday rotation",
        "Start with a tee that feels right, a layer you reach for, and trousers that move with you. Keep the palette simple or let one piece speak louder. Your daily rotation should feel like you.",
      ],
      [
        "02 / The oversized balance",
        "Pair an oversized tee with a straighter trouser, or go relaxed from head to toe. Check garment measurements, try your usual size first, and choose the silhouette that makes you feel comfortable.",
      ],
      [
        "03 / Layer without the rules",
        "A hoodie under a utility jacket. A clean white tee with cargos. Mix texture and weight to make a simple fit feel personal. There is no uniform here — just a starting point.",
      ],
    ],
  },
};
