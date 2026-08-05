export interface NavItem {
  label: string;
  href: `#${string}`;
}

export interface SocialLink {
  label: "LinkedIn" | "GitHub" | "Email";
  href: string;
}

export interface Metric {
  value: string;
  label: string;
  detail: string;
}

export interface ModernizationMetric {
  label: string;
  before: number;
  after: number;
  beforeLabel: string;
  afterLabel: string;
  result: string;
  note: string;
  precision?: number;
  suffix?: string;
  direction: "up" | "down";
}

export interface AboutCard {
  title: string;
  description: string;
  highlights: string[];
}

export interface ProjectLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface Project {
  number: string;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  techStack: string[];
  links: ProjectLink[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  contextLabel?: string;
  bullets: string[];
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  detail: string;
  credentialUrl?: string;
  badgeImage?: string;
}

export interface WelcomeGreeting {
  text: string;
  language: string;
  direction?: "ltr" | "rtl";
}

export const siteMeta = {
  name: "Muhammad Rizky Syadrie",
  initials: "rizkysyadrie.dev",
  title: "Full-Stack & Cloud Software Engineer",
  description:
    "Software Engineer with 6+ years of experience building and modernizing enterprise web platforms across fintech and e-commerce.",
  location: "Jakarta, Indonesia (UTC+7)",
  email: "muhammad.syadrie11@gmail.com",
  resumeUrl: "/Muhammad_Rizky_Syadrie_Fullstack_Resume.pdf",
} as const;

export const navigation: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  status:
    "Based in Jakarta, ID · Open to International Relocation & Visa Sponsorship",
  name: "Muhammad Rizky Syadrie",
  title: "Full-Stack & Cloud Software Engineer",
  pitch:
    "Software Engineer with 6+ years of experience building and modernizing enterprise web platforms across fintech and e-commerce. Google Cloud Certified Associate Cloud Engineer specializing in React, Next.js, TypeScript, Node.js, and cloud optimizations—backed by 9 years of banking operational management experience.",
} as const;

export const welcomeGreetings: WelcomeGreeting[] = [
  { text: "Welcome.", language: "en" },
  { text: "Selamat datang.", language: "id" },
  { text: "Willkommen.", language: "de" },
  { text: "Welkom.", language: "nl" },
  { text: "Bienvenue.", language: "fr" },
  { text: "ようこそ。", language: "ja" },
  { text: "أهلاً وسهلاً.", language: "ar", direction: "rtl" },
];

export const careerProfile = [
  { label: "Engineering", value: "6+ years" },
  { label: "Banking operations", value: "9 years" },
  { label: "Cloud", value: "Google Cloud certified" },
  { label: "Focus", value: "Enterprise web platforms" },
] as const;

export const sectionCopy = {
  about: {
    title: "The hybrid advantage",
    description:
      "Engineering decisions grounded in operational reality, commercial outcomes, and the controls enterprise platforms require.",
  },
  projects: {
    title: "Selected work, unpacked",
    description:
      "Three builds presented the way engineering leaders assess them: the constraint, the technical response, and the operational value.",
  },
  experience: {
    title: "Experience across systems and operations",
    description:
      "A career path from regulated banking operations into full-stack engineering—useful context for building software that has to work for the business, not only the browser.",
  },
  skills: {
    title: "Technical range, production depth",
    description:
      "A practical toolkit spanning interface architecture, backend services, cloud operations, delivery automation, and measurement.",
  },
} as const;

export const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: "https://linkedin.com/in/mrizkysyadrie" },
  { label: "GitHub", href: "https://github.com/pt-arunikaciptasahaja" },
  { label: "Email", href: "mailto:muhammad.syadrie11@gmail.com" },
];

export const metrics: Metric[] = [
  {
    value: "60%",
    label: "Cloud infrastructure cost reduction",
    detail: "Storage lifecycle automation",
  },
  {
    value: "300K+",
    label: "Monthly active visitors supported",
    detail: "Across e-commerce platforms",
  },
  {
    value: "85%",
    label: "Web performance improvement",
    detail: "Faster platform load speeds",
  },
  {
    value: "GCP Certified",
    label: "Associate Cloud Engineer",
    detail: "Google Cloud certification",
  },
];

export const automotiveModernization = {
  title: "Modernizing two automotive marketplaces without losing search equity",
  description:
    "A cross-functional modernization of momotor.id and momobil.id—from legacy Ember.js experiences to faster Next.js platforms connecting marketplace inventory, editorial content, technical SEO, and measurable lead journeys.",
  role: "Software Engineer · Architecture contributor",
  scope: "Frontend modernization · Headless CMS · Technical SEO · Analytics",
  collaboration: "Product · Data · Ads · Editorial · SEO",
  platforms: [
    { label: "momotor.id", href: "https://momotor.id/" },
    { label: "momobil.id", href: "https://momobil.id/" },
  ],
  metrics: [
    {
      label: "User bounce rate",
      before: 73,
      after: 13.6,
      beforeLabel: "73%",
      afterLabel: "13.6%",
      result: "−59.4 percentage points",
      note: "GA4 comparison · source range to revalidate",
      precision: 1,
      suffix: "%",
      direction: "down",
    },
    {
      label: "Active listings supported",
      before: 32,
      after: 230,
      beforeLabel: "32K",
      afterLabel: "230K+",
      result: "7.2× platform scale",
      note: "The modernized platform supported this growth",
      suffix: "K+",
      direction: "up",
    },
    {
      label: "Lighthouse SEO score",
      before: 0,
      after: 100,
      beforeLabel: "Legacy audit",
      afterLabel: "100/100",
      result: "Perfect technical audit score",
      note: "Measured with Lighthouse",
      suffix: "/100",
      direction: "up",
    },
  ] satisfies ModernizationMetric[],
} as const;

export const aboutCards: AboutCard[] = [
  {
    title: "Engineering & Modernization Focus",
    description:
      "Six-plus years building scalable React and Next.js platforms with an emphasis on measurable platform health, maintainability, and delivery speed.",
    highlights: [
      "CI/CD automation pipelines",
      "Micro-frontend architecture",
      "Technical SEO and analytics",
      "Cloud cost and performance optimization",
    ],
  },
  {
    title: "Banking & Operational Background",
    description:
      "Nine years in operational management at PT Bank Sinarmas Tbk—bringing business context to engineering decisions in regulated, high-accountability environments.",
    highlights: [
      "Business ROI and stakeholder alignment",
      "Compliance and internal controls",
      "Risk management",
      "Enterprise platform scaling",
    ],
  },
];

export const projects: Project[] = [
  {
    number: "01",
    title: "Alpha Stream Terminal",
    category: "Web3 / Market Intelligence",
    subtitle: "Side Project",
    description:
      "Crypto market intelligence dashboard for the Solana and Pump.fun ecosystem, designed for dense real-time token analytics and token data exploration.",
    problem:
      "Fast-moving Solana token data is fragmented across feeds, making meaningful comparisons difficult under time pressure.",
    solution:
      "A high-density dashboard that organizes market signals, token metrics, and exploration workflows into one responsive interface.",
    impact:
      "Creates a faster path from live market data to comparable token-level context without claiming unverified trading outcomes.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Solana Web3 APIs",
      "Recharts",
    ],
    links: [
      {
        label: "Request Demo",
        href: "mailto:muhammad.syadrie11@gmail.com?subject=Alpha%20Stream%20Terminal%20Demo",
      },
      {
        label: "GitHub Profile",
        href: "https://github.com/pt-arunikaciptasahaja/alpha-stream-terminal",
        external: true,
      },
    ],
  },
  {
    number: "02",
    title: "MVHome (OFI.id)",
    category: "Enterprise ISP Platform & CMS",
    subtitle: "Client / Enterprise Project",
    description:
      "Enterprise broadband platform featuring dynamic coverage checks, user onboarding, digital acquisition funnels, and dynamic CMS content management.",
    problem:
      "Broadband acquisition needs to connect address eligibility, plan discovery, onboarding, and frequently changing campaign content.",
    solution:
      "A full-stack platform combining dynamic coverage checks, conversion journeys, secure services, and independently managed CMS content.",
    impact:
      "Unifies customer acquisition and content operations in a scalable, Dockerized platform built for ongoing campaign iteration.",
    techStack: ["Next.js", "Node.js", "Express", "PostgreSQL", "Docker", "JWT"],
    links: [
      {
        label: "View Case Study",
        href: "/projects/mvhome",
      },
      { label: "Visit OFI.id", href: "https://ofi.id", external: true },
    ],
  },
  {
    number: "03",
    title: "Tiny Bitty",
    category: "E-Commerce / Direct-to-Consumer",
    subtitle: "Client Project",
    description:
      "E-commerce platform for a premium FMCG cookie brand featuring interactive product catalogs, hamper bundle builders, and WhatsApp-assisted checkout flows.",
    problem:
      "A premium made-to-order product catalog needs flexible bundles and human-assisted fulfillment without forcing a heavyweight checkout system.",
    solution:
      "A fast product experience with guided catalog browsing, bundle configuration, analytics, and a handoff into WhatsApp ordering.",
    impact:
      "Reduces discovery and checkout friction while preserving the high-touch ordering workflow required for custom and corporate orders.",
    techStack: ["React", "Next.js", "Tailwind CSS", "Analytics"],
    links: [
      {
        label: "Visit Live Website",
        href: "https://www.tinybitty.shop/",
        external: true,
      },
    ],
  },
];

export const experiences: Experience[] = [
  {
    role: "Software Engineer",
    company:
      "PT Adira Dinamika Multifinance Tbk (Subsidiary of Bank Danamon & MUFG)",
    period: "Aug 2022 – Present",
    location: "Jakarta, Indonesia",
    bullets: [
      "Maintained and enhanced enterprise web platforms (momotor.id and momobil.id) supporting 100K–300K monthly visits.",
      "Reduced media host storage expenses by up to 60% by designing automated asset lifecycle archiving workflows.",
      "Modernized legacy codebases to React and Next.js, accelerating load speeds by up to 85%.",
      "Implemented technical SEO (JSON-LD structured data), XML sitemaps, and analytics (Google Analytics and Microsoft Clarity) to boost search visibility and conversion funnel health.",
      "Built Docker-based CI/CD pipelines, integrated SonarQube code quality checks, and Snyk security controls.",
    ],
  },
  {
    role: "Software Developer (Volunteer)",
    company: "Binar Academy",
    period: "Apr 2020 – Aug 2022",
    location: "Indonesia",
    bullets: [
      "Volunteered to develop and maintain Binar Academy’s mobile application and website using Node.js, Express, React, and RESTful APIs within Agile/Scrum teams.",
      "Implemented secure JWT authentication, pagination, role-based access control, and database query optimization.",
    ],
  },
  {
    role: "Area Operations Manager",
    company: "PT Bank Sinarmas Tbk",
    period: "2011 – 2020",
    location: "Indonesia",
    contextLabel: "Previous Professional Experience",
    bullets: [
      "Oversaw operational performance across 21 branches in Jakarta, Tangerang, and Bekasi, ensuring consistent service delivery and operational standards.",
      "Managed internal controls, regulatory compliance, operational risk, and stakeholder coordination across retail and corporate banking services.",
    ],
  },
];

export const certifications: Certification[] = [
  {
    title: "Associate Cloud Engineer",
    issuer: "Google Cloud Certified",
    detail: "Cloud operations, security, deployment, and infrastructure management",
    credentialUrl:
      "https://www.credly.com/badges/e2689632-2834-4ca7-9bd0-41609a4588b4",
    badgeImage: "/google-cloud-associate-cloud-engineer.png",
  },
  {
    title: "Full-Stack Web Development",
    issuer: "Binar Academy",
    detail: "Production-oriented frontend and backend engineering",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "Tailwind CSS",
      "Redux",
      "Web Vitals",
    ],
  },
  {
    title: "Backend & DB",
    skills: [
      "Node.js",
      "Express.js",
      "Go",
      "REST APIs",
      "GraphQL",
      "PostgreSQL",
      "MySQL",
      "Redis",
    ],
  },
  {
    title: "Cloud & DevOps",
    skills: [
      "Google Cloud Platform",
      "Docker",
      "Kubernetes",
      "GitHub Actions",
      "SonarQube",
      "Snyk",
      "Kibana",
    ],
  },
  {
    title: "Methodologies & Tools",
    skills: [
      "Agile/Scrum",
      "JIRA",
      "Confluence",
      "Technical SEO",
      "Web Analytics",
    ],
  },
];

export const contact = {
  heading: "Let’s build scalable platforms together.",
  subheading:
    "Open to full-time roles, international relocation, and visa sponsorship.",
  copyright:
    "© 2026 Muhammad Rizky Syadrie. Built with Next.js, TypeScript & Tailwind CSS.",
} as const;
