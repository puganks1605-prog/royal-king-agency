export const SITE = {
  name: "Royal King Insurance Agencies",
  short: "Royal King Insurance",
  tagline: "Your Trusted Partner for Complete Insurance Solutions",
  description:
    "Royal King Insurance Agencies in Thoothukudi offers motor, health, life, home, fire and marine insurance from India's leading insurers, plus a vehicle pollution testing centre.",
  whatsapp: "919994077798",
  phones: ["99940 77798", "97518 77798"],
  pucPhones: ["78100 77798", "84385 57798"],
  emails: {
    main: "royalkinginsuran@gmail.com",
    branch: "royal628002@gmail.com",
    puc: "royalpucc@gmail.com",
  },
  offices: {
    main: {
      label: "Main Office",
      address:
        "D.No. 4/25, 1st Floor, N.P.S. Complex, Ettayapuram Road, Opposite New Bus Stand, Upstairs Axis Bank ATM, Tuticorin – 628002, Tamil Nadu",
    },
    branch: {
      label: "Branch Office",
      address:
        "Shop No. F30, Chidambara Nagar Shopping Complex, Near VVD Signal, Chidambara Nagar Main Road, Thoothukudi – 628008, Tamil Nadu",
    },
    puc: {
      label: "Pollution Testing Centre",
      address:
        "2/500, Kalluri Nagar, Near Collector Office, Opposite Hero Bike Showroom, Palai Road, Thoothukudi – 628003",
    },
  },
} as const;

export const SERVICES = [
  { slug: "motor", title: "Motor Insurance", desc: "Protect your vehicles with affordable and comprehensive coverage for cars, two-wheelers and commercial vehicles.", icon: "Car" },
  { slug: "health", title: "Health Insurance", desc: "Secure your family's health with top mediclaim and critical illness plans from India's leading insurers.", icon: "HeartPulse" },
  { slug: "life", title: "Life Insurance", desc: "Financial protection and long-term savings for your loved ones with term, endowment and ULIP plans.", icon: "ShieldCheck" },
  { slug: "claims", title: "Claims Assistance", desc: "Hassle-free, transparent support for claim registration, document verification, tracking, insurer follow-ups and faster settlement across all major insurers.", icon: "FileCheck2", cta: "Get Claim Support" },
  { slug: "home", title: "Home Insurance", desc: "Protect your property, valuables and structure against fire, theft and natural calamities.", icon: "Home" },
  { slug: "fire", title: "Fire Insurance", desc: "Comprehensive protection for shops, factories and warehouses against fire-related damage.", icon: "Flame" },
  { slug: "marine", title: "Marine Insurance", desc: "Coverage for cargo, vessels and marine operations across import, export and inland transit.", icon: "Anchor" },
] as const;

export const PARTNERS = [
  {
    name: "Royal Sundaram",
    domain: "royalsundaram.in",
    logo: "https://www.royalsundaram.in/sites/default/files/2022-07/royal-sundaram-logo.png",
  },
  {
    name: "ICICI Lombard",
    domain: "icicilombard.com",
    logo: "https://www.icicilombard.com/images/logo.svg",
  },
  {
    name: "SBI General",
    domain: "sbigeneral.in",
    logo: "https://www.sbigeneral.in/content/dam/sbi-general/common/sbi-general-logo.svg",
  },
  {
    name: "HDFC ERGO",
    domain: "hdfcergo.com",
    logo: "https://www.hdfcergo.com/images/logo.svg",
  },
  {
    name: "Bajaj Allianz",
    domain: "bajajallianz.com",
    logo: "https://www.bajajallianz.com/content/dam/bagic/images/brand/bajaj-allianz-logo.png",
  },
  {
    name: "Tata AIG",
    domain: "tataaig.com",
    logo: "https://www.tataaig.com/content/dam/tata-aig/brand-assets/tata-aig-logo.svg",
  },
  {
    name: "Star Health",
    domain: "starhealth.in",
    logo: "https://www.starhealth.in/static-pages/assets/images/logo.svg",
  },
  {
    name: "Shriram General",
    domain: "shriramgi.com",
    logo: "https://www.shriramgi.com/images/Shriram-General-Insurance-Logo.png",
  },
  {
    name: "Oriental Insurance",
    domain: "orientalinsurance.org.in",
    logo: "",
  },
  {
    name: "Liberty Insurance",
    domain: "libertyinsurance.in",
    logo: "",
  },
  {
    name: "Cholamandalam MS",
    domain: "cholainsurance.com",
    logo: "https://www.cholainsurance.com/images/chola-ms-logo.svg",
  },
  {
    name: "Magma HDI",
    domain: "magmahdi.com",
    logo: "",
  },
  {
    name: "Digit Insurance",
    domain: "godigit.com",
    logo: "https://www.godigit.com/content/dam/godigit/common/logos/godigit-logo.svg",
  },
  {
    name: "Universal Sompo",
    domain: "universalsompo.com",
    logo: "",
  },
  {
    name: "IFFCO Tokio",
    domain: "iffcotokio.com",
    logo: "https://www.iffcotokio.co.in/content/dam/ITGI/common/logos/iffco-tokio-logo.png",
  },
  {
    name: "Galaxy Health",
    domain: "galaxyhealthinsurance.com",
    logo: "",
  },
  {
    name: "New India Assurance",
    domain: "newindia.co.in",
    logo: "https://www.newindia.co.in/images/logo.png",
  },
  {
    name: "ACKO Insurance",
    domain: "acko.com",
    logo: "https://www.acko.com/static/img/acko-logo.svg",
  },
  {
    name: "National Insurance",
    domain: "nationalinsurance.nic.co.in",
    logo: "",
  },
  {
    name: "United India",
    domain: "uiic.co.in",
    logo: "https://www.uiic.co.in/images/united-india-insurance-logo.png",
  },
] as const;

export const WHY_US = [
  { title: "15+ Insurers Under One Roof", desc: "Compare plans from India's top insurance companies in one place." },
  { title: "Best Premium Comparison", desc: "Side-by-side comparison of premiums, features and claim ratios." },
  { title: "Quick Policy Issuance", desc: "Issue motor and health policies the same day, often within an hour." },
  { title: "Claim Assistance Support", desc: "Hands-on support from intimation to final settlement." },
  { title: "Professional Consultation", desc: "Two qualified advisors guiding every recommendation." },
  { title: "Trusted Customer Service", desc: "Decade-long relationships with Thoothukudi families and businesses." },
  { title: "Vehicle Pollution Testing", desc: "PUC certificates issued instantly at our Kalluri Nagar centre." },
  { title: "Transparent Pricing", desc: "No hidden charges. You see what the insurer charges, nothing more." },
];

export const TESTIMONIALS = [
  { name: "Rajesh Kumar", quote: "Excellent service and quick support. They helped me find the best motor insurance policy at a competitive premium." },
  { name: "Meena Lakshmi", quote: "Very professional and trustworthy team. The quotation process was simple and transparent." },
  { name: "Arun Prakash", quote: "I renewed my health insurance through Royal King Insurance Agencies. Smooth process and excellent customer care." },
  { name: "Suresh Kumar", quote: "They compared multiple insurance companies and got me the best coverage at an affordable price." },
];

export const FAQS = [
  { q: "Which insurance companies do you work with?", a: "We are authorised intermediaries for 15+ leading insurers in India including HDFC ERGO, ICICI Lombard, Bajaj Allianz, Star Health, Tata AIG, Royal Sundaram and more." },
  { q: "How long does it take to get a quote?", a: "Most motor and health quotes are shared within a few hours of submitting your request through the customer portal." },
  { q: "Can I get a PUC certificate at your office?", a: "Yes. Our pollution testing centre is at Kalluri Nagar, Palai Road, Thoothukudi. PUC certificates for two-wheelers, cars and commercial vehicles are issued on the spot." },
  { q: "Do you help with claim settlement?", a: "Absolutely. Our team supports you end to end — claim intimation, surveyor coordination, document submission and follow-up till final settlement." },
  { q: "Is there any charge for getting a quote?", a: "No. Comparing quotes and consulting with our advisors is completely free." },
];
