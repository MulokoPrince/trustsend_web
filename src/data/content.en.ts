import type { MockupVariant, NavMegaMenu } from "./content.fr";

export const navLinks = [
  { label: "Payments", href: "#payments" },
  { label: "Transfers", href: "#transfers" },
  { label: "Savings & Games", href: "#savings" },
  { label: "Partners", href: "#partners" },
  { label: "Pricing", href: "/pricing" },

];

export const navMegaMenus: Record<string, NavMegaMenu> = {
  Payments: {
    columns: [
      {
        heading: "Collect",
        items: [
          {
            label: "Virtual Cards",
            desc: "Issue virtual Visa/Mastercard cards for your online payments, in seconds.",
            icon: "/assets/icons/products/capital.svg",
          },
          {
            label: "Cryptocurrencies",
            desc: "Buy, hold and spend crypto directly from your TrustSend wallet.",
            icon: "/assets/icons/products/x.svg",
          },
          {
            label: "Merchant Payments",
            desc: "Collect in-store sales with a QR code or a shareable payment link.",
            icon: "/assets/icons/products/paymentpages.svg",
          },
        ],
      },
      {
        heading: "Recurring billing",
        items: [
          {
            label: "Subscriptions",
            desc: "Automate recurring billing for your SaaS or media customers.",
            icon: "/assets/icons/products/subscriptions.svg",
          },
          {
            label: "School fees",
            desc: "Collect school fees online and track every payment in real time.",
            icon: "/assets/icons/products/invoices.svg",
          },
          {
            label: "Invoices & Bills",
            desc: "Generate invoices and get paid in one click.",
            icon: "/assets/icons/products/paymentlinks.svg",
          },
        ],
      },
    ],
    promo: {
      eyebrow: "New",
      heading: "TrustSend Virtual Cards",
      desc: "Create a virtual card in seconds for all your online payments.",
      cta: "Discover cards",
      icon: "/assets/icons/products/capital.svg",
    },
  },

  Transfers: {
    columns: [
      {
        heading: "Send money",
        items: [
          {
            label: "Local Transfer",
            desc: "Send funds instantly to any TrustSend wallet.",
            icon: "/assets/icons/products/route.svg",
          },
          {
            label: "International Transfer",
            desc: "Send and receive money from abroad, as simply as Wave.",
            icon: "/assets/icons/products/capital.svg",
          },
          {
            label: "Wallet to Wallet Swap",
            desc: "Exchange funds between two TrustSend wallets instantly.",
            icon: "/assets/icons/products/x.svg",
          },
        ],
      },
      {
        heading: "Cash In / Cash Out",
        items: [
          {
            label: "Agent Deposit",
            desc: "Deposit cash at a TrustSend agent near you.",
            icon: "/assets/icons/products/smartcollect.svg",
          },
          {
            label: "Mobile Money Deposit",
            desc: "Top up your wallet directly from your Mobile Money account.",
            icon: "/assets/icons/products/paymentlinks.svg",
          },
          {
            label: "Agent & Mobile Money Withdrawal",
            desc: "Withdraw your money as cash at an agent or via Mobile Money.",
            icon: "/assets/icons/products/route.svg",
          },
        ],
      },
    ],
    promo: {
      kind: "quote",
      heading: "",
      desc: "Sending money to my family used to take days. With TrustSend transfers, it arrives in seconds, just like Wave.",
      cta: "Send now",
      quote: { name: "N. Gitau", title: "Customer", company: "Diaspora" },
    },
  },

  "Savings & Games": {
    columns: [
      {
        heading: "Save",
        items: [
          {
            label: "Digital Likelemba",
            desc: "Create or join a digital savings circle and save as a group, fully transparently.",
            icon: "/assets/icons/products/capital.svg",
          },
          {
            label: "Savings Goals",
            desc: "Set a goal and let TrustSend set money aside for you.",
            icon: "/assets/icons/products/capital.svg",
          },
          {
            label: "Locked Savings",
            desc: "Lock funds for a chosen period so you're not tempted to spend them.",
            icon: "/assets/icons/products/invoices.svg",
          },
        ],
      },
      {
        heading: "BGame",
        items: [
          {
            label: "Mini-games & Rewards",
            desc: "Play, earn bonuses, and boost your savings with BGame.",
            icon: "/assets/icons/products/x.svg",
          },
          {
            label: "Community Pot",
            desc: "Join community pots and try to win the shared jackpot.",
            icon: "/assets/icons/products/x-club.svg",
          },
          {
            label: "Loyalty Program",
            desc: "Earn points on every transaction and unlock rewards.",
            icon: "/assets/icons/products/subscriptions.svg",
          },
        ],
      },
    ],
    promo: {
      eyebrow: "BGame",
      heading: "Play, save, win",
      desc: "The game that rewards your loyalty and gives your savings a boost with every transaction.",
      cta: "Discover BGame",
      icon: "/assets/icons/products/x.svg",
    },
  },

  Partners: {
    columns: [
      {
        heading: "Agent network",
        items: [
          {
            label: "Become an Agent",
            desc: "Join the TrustSend agent network and earn a commission on every deposit and withdrawal.",
            icon: "/assets/icons/products/route.svg",
          },
          {
            label: "Referral Program",
            desc: "Refer TrustSend to merchants and earn on every transaction.",
            icon: "/assets/icons/products/capital.svg",
          },
        ],
      },
      {
        heading: "Developers",
        items: [
          {
            label: "API Documentation",
            desc: "All the documentation to integrate payments, transfers and virtual cards.",
            icon: "/assets/icons/develop/api.svg",
          },
          {
            label: "Webhooks",
            desc: "Get real-time notifications for every transaction.",
            icon: "/assets/icons/develop/docs.svg",
          },
          {
            label: "Sandbox Environment",
            desc: "Test your integration with mock data before going live.",
            icon: "/assets/icons/develop/integrations.svg",
          },
        ],
      },
    ],
    promo: {
      kind: "code",
      heading: "Built for developers",
      desc: "Integrate cards, payments and transfers in an afternoon with our SDKs.",
      cta: "Read the docs",
      code: `const TrustSend = require("TrustSend")(apiKey);

const transfer = await TrustSend.transfers.create({
  amount: 50,
  currency: "USD",
  destination: "wallet_98213",
});`,
    },
  },
};

export const heroCapabilities: { label: string; variant: MockupVariant }[] = [
  { label: "Pay your subscriptions", variant: "payments" },
  { label: "Save with Likelemba", variant: "payroll" },
  { label: "Transfer locally and internationally", variant: "payouts" },
  { label: "Manage your virtual card", variant: "checkout" },
  { label: "Withdraw at an agent", variant: "banking" },
];

export const heroSpotlight = {
  eyebrow: "The business API that connects it all",
  heading: "cards, cash, mobile money and crypto",
  subline: "Virtual Cards | Wave-style Transfers | Agent Withdrawal & Deposit | Likelemba | BGame",
  appName: "La Sagesse School",
  productLabel: "School fees — Term 2",
  price: "$45",
  attribution: "Management, La Sagesse School",
  signature: "Aïcha",
};

export const recommendationChips = [
  "Send money",
  "Withdraw at an agent",
  "Open a virtual card",
  "Save (Likelemba)",
  "Buy crypto",
  "Play on BGame",
];

export const paymentMethods = [
  { name: "Visa", src: "/assets/icons/payment-modes/visa.png" },
  { name: "Mastercard", src: "/assets/icons/payment-modes/mastercard.png" },
  { name: "Bank transfer", src: "/assets/icons/payment-modes/netbanking.png" },
];

export const mobileMoneyProviders: { name: string; src: string }[] = [
  { name: "M-Pesa", src: "/assets/icons/mobile-money/mpesa.svg" },
  { name: "Orange Money", src: "/assets/icons/mobile-money/orange-money.svg" },
  { name: "MTN MoMo", src: "/assets/icons/mobile-money/mtn.svg" },
  { name: "Airtel Money", src: "/assets/icons/mobile-money/airtel.svg" },
  { name: "Moov Money", src: "/assets/icons/mobile-money/moov-money.png" },
  { name: "Africell Afrimoney", src: "/assets/icons/mobile-money/africell.png" },
  { name: "EcoCash", src: "/assets/icons/mobile-money/ecocash.png" },
];

export const platformStandards: { icon: string; label: string }[] = [
  { icon: "Wallet", label: "An account with no deposit or withdrawal fees" },
  { icon: "Percent", label: "Money transfers for just 1%" },
  { icon: "Receipt", label: "Fee-free bill payments" },
  { icon: "Smartphone", label: "Instant airtime top-up on every network" },
  { icon: "Phone", label: "A single, free contact number" },
  { icon: "ShieldCheck", label: "Security to international standards" },
];

export const featureTabs: {
  id: string;
  label: string;
  badge?: string;
  heading: string;
  description: string;
  bullets: { label: string; desc: string }[];
  variant: MockupVariant;
  icon: string;
}[] = [
  {
    id: "cartes-virtuelles",
    label: "Virtual Cards",
    badge: "new",
    heading: "Virtual Cards",
    description:
      "Issue virtual Visa/Mastercard cards in seconds for your own online payments and your team's.",
    bullets: [
      { label: "Instant issuance", desc: "Create a virtual card straight from your dashboard, no waiting." },
      { label: "Limits & control", desc: "Set spending limits and freeze a card in one click." },
    ],
    variant: "checkout",
    icon: "/assets/icons/products/capital.svg",
  },
  {
    id: "cryptos-swap",
    label: "Crypto & Swap",
    heading: "Cryptocurrencies & Swap",
    description:
      "Manage your digital assets and exchange funds between TrustSend wallets, without going through a bank.",
    bullets: [
      { label: "Crypto wallet", desc: "Buy, hold and convert your crypto at the best market rate." },
      { label: "Wallet to Wallet Swap", desc: "Instantly transfer funds from one TrustSend wallet to another." },
    ],
    variant: "payments",
    icon: "/assets/icons/products/x.svg",
  },
  {
    id: "paiements",
    label: "Payments",
    heading: "Payments & Collections",
    description: "Collect subscriptions, school fees and in-store sales from a single platform.",
    bullets: [
      { label: "Subscriptions", desc: "Automate recurring billing for your SaaS or media customers." },
      { label: "School fees", desc: "Collect school fees online and track every payment in real time." },
      { label: "Merchant Payments", desc: "Collect in-store with a QR code or a shareable payment link." },
    ],
    variant: "payments",
    icon: "/assets/icons/products/paymentpages.svg",
  },
  {
    id: "transferts",
    label: "Transfers",
    heading: "Local & International Transfers",
    description: "Send money instantly, at home or abroad, as simply as Wave.",
    bullets: [
      { label: "Local Transfer", desc: "Send funds instantly to any TrustSend wallet." },
      { label: "International Transfer", desc: "Send and receive money from abroad with no hidden fees." },
    ],
    variant: "payouts",
    icon: "/assets/icons/products/route.svg",
  },
  {
    id: "retrait-depot",
    label: "Withdraw & Deposit",
    heading: "Withdraw & Deposit",
    description: "Convert your digital money to cash and back, at an agent or via Mobile Money.",
    bullets: [
      { label: "Agent network", desc: "Deposit or withdraw cash at a TrustSend agent near you." },
      { label: "Mobile Money", desc: "Top up or withdraw directly from your Mobile Money account." },
    ],
    variant: "banking",
    icon: "/assets/icons/products/capital.svg",
  },
  {
    id: "epargne-bgame",
    label: "Savings & BGame",
    heading: "Savings (Likelemba) & BGame",
    description: "Save as a group the way a savings circle works, and boost your savings by playing BGame.",
    bullets: [
      { label: "Digital Likelemba", desc: "Create or join a digital savings circle and track every contribution transparently." },
      { label: "BGame", desc: "Play, earn bonuses, and give your savings a boost." },
    ],
    variant: "payroll",
    icon: "/assets/icons/products/subscriptions.svg",
  },
];

export const industries: {
  name: string;
  headingLead: string;
  headingHighlight: string;
  blurb: string;
  detail: string;
  count: string;
  icon: string;
  photo: string;
  logos: string[];
}[] = [
  {
    name: "Merchants",
    headingLead: "Collect your sales",
    headingHighlight: "in-store and online",
    blurb: "Accept cards, Mobile Money and QR codes from a single platform.",
    detail:
      "Create payment links and sales pages, and accept payments from your customers in-store and online, no code required.",
    count: "+ 12,000 merchants",
    icon: "/assets/icons/products/paymentpages.svg",
    photo:
      "https://framerusercontent.com/images/0TEFuXH3g6z7mdznP6jJWQlQ7A.webp?width=1183&height=571",
    logos: ["Nova", "Loopay", "Bluewave"],
  },
  {
    name: "Schools",
    headingLead: "Simplify",
    headingHighlight: "school fees",
    blurb: "Collect payments from parents and track every payment in real time.",
    detail:
      "Set up school fee collection in minutes, with or without a website, and track every payment from a single dashboard.",
    count: "+ 300 institutions",
    icon: "/assets/icons/products/invoices.svg",
    photo:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400&auto=format&fit=crop",
    logos: ["Orbit", "Vantik", "Northstar"],
  },
  {
    name: "Diaspora",
    headingLead: "Send money to your",
    headingHighlight: "family, wherever they are",
    blurb: "Instant international transfers to any TrustSend wallet.",
    detail:
      "Send money from abroad in seconds, with transparent fees and a clear exchange rate, as simply as Wave.",
    count: "+ 2,800 families connected",
    icon: "/assets/icons/products/capital.svg",
    photo:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400&auto=format&fit=crop",
    logos: ["Fintra", "Corelink", "Meridian"],
  },
  {
    name: "Agents",
    headingLead: "Grow your business as a",
    headingHighlight: "TrustSend agent",
    blurb: "Earn a commission on every deposit and withdrawal at your point of sale.",
    detail:
      "Join the TrustSend agent network, process your customers' deposits and withdrawals, and get your commission automatically.",
    count: "+ 5,000 active agents",
    icon: "/assets/icons/products/route.svg",
    photo:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop",
    logos: ["Zenpay", "Cobalt", "Driftly"],
  },
  {
    name: "Savings groups",
    headingLead: "Digitize your",
    headingHighlight: "Likelemba",
    blurb: "Run a digital savings circle with your loved ones, fully transparently.",
    detail:
      "Create a group, invite its members, track every contribution, and unlock the collective savings in turn, no notebook or disputes.",
    count: "+ 45,000 members",
    icon: "/assets/icons/products/x-club.svg",
    photo:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1400&auto=format&fit=crop",
    logos: ["Lumen", "Parallel", "Corelink"],
  },
];

export const innovationBlocks: {
  name: string;
  stat: string;
  description: string;
  variant: MockupVariant;
}[] = [
  {
    name: "Multi-Currency Wallet",
    stat: "Manage cash, Mobile Money and crypto in a single wallet, available in over 15 countries.",
    description: "One wallet to manage everything, from cash to crypto.",
    variant: "banking",
  },
];

export const devCards = [
  {
    title: "Integrations",
    desc: "Ready-to-use SDKs and plugins to integrate virtual cards, transfers and Mobile Money in a few lines.",
    icon: "/assets/icons/develop/integrations.svg",
  },
  {
    title: "API Reference",
    desc: "Complete documentation to connect payments, transfers, withdrawals/deposits and crypto to your product.",
    icon: "/assets/icons/develop/api.svg",
  },
  {
    title: "Webhooks",
    desc: "Get real-time notifications for every transaction, deposit, withdrawal or payment.",
    icon: "/assets/icons/develop/docs.svg",
  },
];

export const codeSamples: Record<string, string> = {
  "CURL": `curl -X POST https://api.TrustSend.com/v1/payments \\
  -u key_live_xxxxx: \\
  -d amount=50 \\
  -d currency="USD" \\
  -d receipt="qwsaq1" \\
  -d partial_payment=true \\
  -d first_payment_min_amount=20`,
  "JAVA": `TrustSendClient client = new TrustSendClient(apiKey);

JSONObject paymentRequest = new JSONObject();
paymentRequest.put("amount", 50);
paymentRequest.put("currency", "USD");
paymentRequest.put("receipt", "qwsaq1");
paymentRequest.put("partial_payment", true);
paymentRequest.put("first_payment_min_amount", 20);

Payment payment = client.payments.create(paymentRequest);`,
  "Python": `import TrustSend

client = TrustSend.Client(api_key=API_KEY)

payment = client.payment.create({
    "amount": 50,
    "currency": "USD",
    "receipt": "qwsaq1",
    "partial_payment": True,
    "first_payment_min_amount": 20,
})`,
  "PHP": `$api = new TrustSend\\Api($apiKey);

$payment = $api->payment->create([
  "amount"                   => 50,
  "currency"                 => "USD",
  "receipt"                  => "qwsaq1",
  "partial_payment"          => true,
  "first_payment_min_amount" => 20,
]);`,
  "NODE JS": `const TrustSend = require("TrustSend")(apiKey);

const payment = await TrustSend.payments.create({
  amount: 50,
  currency: "USD",
  receipt: "qwsaq1",
  partial_payment: true,
  first_payment_min_amount: 20,
});`,
};

export const noCodeExamples = [
  { title: "School fees link", subtitle: "Collect school fees with one link, no website needed" },
  { title: "Shop page", subtitle: "Sell your products with a custom payment page" },
  { title: "Likelemba contribution link", subtitle: "Get your savings group to contribute in one click" },
  { title: "Subscription page", subtitle: "Sell recurring subscriptions with no code" },
];

// Fictional testimonials illustrating how TrustSend products are used (cards,
// Likelemba, agents, transfers). Names and companies are generic examples,
// not real customers.
export const testimonials: {
  quote: string;
  name: string;
  title: string;
  company: string;
}[] = [
  {
    quote:
      "With TrustSend virtual cards, my online subscriptions never get blocked anymore. I manage them all from my phone.",
    name: "A. Kariuki",
    title: "Founder",
    company: "Boutique A",
  },
  {
    quote:
      "Our Likelemba used to run on WhatsApp and a notebook. With TrustSend, every contribution is logged and no one can dispute it anymore.",
    name: "D. Mensah",
    title: "Group treasurer",
    company: "Group B",
  },
  {
    quote:
      "As a TrustSend agent, I handle deposits and withdrawals all day. The commission lands automatically, no manual calculations.",
    name: "N. Achieng",
    title: "TrustSend Agent",
    company: "Point C",
  },
  {
    quote:
      "I collect school fees through a payment link. No more queues on registration day.",
    name: "D. Rawat",
    title: "Principal",
    company: "School D",
  },
  {
    quote:
      "Sending money to my family abroad used to take days. With TrustSend international transfers, it arrives in seconds.",
    name: "N. Gitau",
    title: "Customer",
    company: "Diaspora E",
  },
  {
    quote:
      "We integrated the TrustSend API for paying our in-store and online orders in a week, cards and Mobile Money included.",
    name: "A. Njoroge",
    title: "Co-founder",
    company: "Commerce F",
  },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "What is TrustSend?",
    answer:
      "TrustSend is a business API that lets businesses and individuals issue virtual cards, accept payments, send and receive money, manage crypto, save as a group (Likelemba) and much more, from a single account.",
  },
  {
    question: "What services does TrustSend offer?",
    answer:
      "Virtual cards, cryptocurrencies, payments (subscriptions, school fees, in-store sales), local and international transfers, withdrawal and deposit via agents or Mobile Money, wallet-to-wallet swap, Likelemba savings and BGame — all in one platform.",
  },
  {
    question: "How do TrustSend virtual cards work?",
    answer:
      "Generate a virtual Visa or Mastercard in seconds from the app, with customizable limits and the ability to freeze it instantly.",
  },
  {
    question: "Can I buy and manage cryptocurrencies with TrustSend?",
    answer:
      "Yes. The TrustSend wallet lets you buy, hold and convert your crypto to cash, at the best market rate.",
  },
  {
    question: "How do I send money with TrustSend?",
    answer:
      "Send funds instantly to any TrustSend wallet, locally or internationally, as simply as Wave.",
  },
  {
    question: "How does withdrawal and deposit work?",
    answer:
      "Visit a TrustSend agent near you, or use your Mobile Money account, to deposit or withdraw cash in minutes.",
  },
  {
    question: "What is Wallet to Wallet Swap?",
    answer:
      "Swap lets you instantly transfer funds between two TrustSend wallets, without going through a bank.",
  },
  {
    question: "How does Likelemba savings work?",
    answer:
      "Create or join a digital savings circle with your friends or colleagues, track every contribution, and unlock the collective savings transparently.",
  },
  {
    question: "What is BGame?",
    answer:
      "BGame is our mini-games and rewards space: play, earn bonuses, and boost your savings with every transaction.",
  },
  {
    question: "Is TrustSend safe and secure?",
    answer:
      "Yes. TrustSend uses encryption and tokenisation so your sensitive data never travels in plain text, and every transaction is tracked.",
  },
  {
    question: "Is TrustSend regulated?",
    answer:
      "TrustSend operates as a licensed payment institution in each market where the platform is available.",
  },
  {
    question: "How do I become a TrustSend agent?",
    answer:
      "Sign up from the app, complete verification of your point of sale, and start processing deposits and withdrawals within 48 hours.",
  },
  {
    question: "How do I integrate the TrustSend API into my business?",
    answer:
      "Create a free developer account, generate your API keys in test mode, and follow our documentation to integrate payments, cards and transfers in a few hours.",
  },
];

export const footerColumns: { title: string; links: { label: string; badge?: string }[] }[] = [
  {
    title: "Payments",
    links: [
      { label: "Virtual Cards" },
      { label: "Merchant Payments" },
      { label: "Subscriptions" },
      { label: "School fees" },
      { label: "QR Code", badge: "NEW" },
      { label: "Payment Links" },
      { label: "Invoices" },
    ],
  },
  {
    title: "Savings & Games",
    links: [
      { label: "Digital Likelemba" },
      { label: "Savings Goals" },
      { label: "Locked Savings" },
      { label: "BGame" },
    ],
  },
  {
    title: "Become a Partner",
    links: [{ label: "Become an Agent" }, { label: "Referral Program" }, { label: "Agent API" }],
  },
  {
    title: "Transfers",
    links: [
      { label: "Local Transfer" },
      { label: "International Transfer" },
      { label: "Wallet to Wallet Swap" },
      { label: "Withdrawal" },
      { label: "Deposit" },
    ],
  },
  {
    title: "Cash & Mobile Money",
    links: [
      { label: "Agent Withdrawal" },
      { label: "Mobile Money Withdrawal" },
      { label: "Agent Deposit" },
      { label: "Mobile Money Deposit" },
      { label: "Multi-currency Wallet" },
    ],
  },
  {
    title: "Developers",
    links: [{ label: "Documentation" }, { label: "Integrations" }, { label: "API Reference" }],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog" },
      { label: "Guides" },
      { label: "Customer Stories" },
      { label: "Events" },
    ],
  },
  {
    title: "Our users",
    links: [
      { label: "Merchants" },
      { label: "Schools" },
      { label: "Diaspora" },
      { label: "Agents" },
      { label: "Savings groups" },
    ],
  },
  {
    title: "Free Tools",
    links: [
      { label: "Fee Calculator" },
      { label: "Crypto Converter" },
      { label: "Likelemba Simulator" },
      { label: "Payment Link Generator" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us" },
      { label: "Careers" },
      { label: "Terms of Service" },
      { label: "Privacy Policy" },
      { label: "Complaints" },
      { label: "Responsible Disclosure" },
    ],
  },
  {
    title: "Help & Support",
    links: [{ label: "Support" }, { label: "Help Center" }],
  },
];
