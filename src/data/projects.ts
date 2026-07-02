export type Domain = "rippl" | "realm" | "trmeric" | "rozi";
export type ProjectType = "academic" | "professional" | "personal";

export interface ParticleBehaviourProfile {
  id: Domain;
  type: "ripple" | "organic" | "lattice" | "orbital";
  accent: string;
  particleCount: number;
  speed: number;
}

export interface SubPiece {
  slug: string;
  title: string;
  oneLiner: string;
  sandboxSrc?: string;   // relative to /prototypes/ — live iframe embed
  showcaseImages?: string[];
  tags?: string[];
}

export interface Project {
  slug: string;
  domain: Domain;
  title: string;
  oneLiner: string;
  type: ProjectType;
  year: string;
  role: string;
  accent: string;
  particleProfile: ParticleBehaviourProfile;
  metrics?: { value: string; label: string }[];
  subPieces?: SubPiece[];
  coverImage?: string;
  keywords?: string[];
}

export const particleProfiles: Record<Domain, ParticleBehaviourProfile> = {
  rippl: {
    id: "rippl",
    type: "orbital",
    accent: "#4FA8A0",    /* muted teal, matches Rippl domain preset */
    particleCount: 4000,
    speed: 0.6,
  },
  realm: {
    id: "realm",
    type: "organic",
    accent: "#d9b46a",    /* gold — matches realm/css/style.css exactly */
    particleCount: 6000,
    speed: 0.4,
  },
  trmeric: {
    id: "trmeric",
    type: "lattice",
    accent: "#FFA426",    /* amber — unchanged */
    particleCount: 5000,
    speed: 0.8,
  },
  rozi: {
    id: "rozi",
    type: "ripple",
    accent: "#C94030",    /* Rozi red — warm, readable on dark */
    particleCount: 4500,
    speed: 0.5,
  },
};

export const projects: Project[] = [
  {
    slug: "rippl",
    domain: "rippl",
    title: "Rippl",
    oneLiner: "A projector-lamp that fights distracted reading and turns notetaking into a two-way interaction.",
    type: "academic",
    year: "2024",
    role: "Design Researcher & Interaction Designer",
    accent: "#4FA8A0",
    particleProfile: particleProfiles.rippl,
    keywords: ["Interaction Design", "Physical Computing", "OCR", "HCI", "Prototyping"],
    metrics: [
      { value: "12 weeks", label: "Project duration" },
      { value: "3", label: "Working prototypes" },
    ],
    subPieces: [
      {
        slug: "ocr-prototype",
        title: "OCR & Handwriting Recognition",
        oneLiner: "Python model trained to read and respond to handwritten notes in real time.",
      },
      {
        slug: "hi-fi-ui",
        title: "Hi-Fi Marking UI",
        oneLiner: "The interface layer: marking, saving, sorting, and navigating your annotated history.",
      },
    ],
    coverImage: "/images/rippl/cover.png",
  },
  {
    slug: "realm",
    domain: "realm",
    title: "Realm of Elementals",
    oneLiner: "A WebAR butterfly-raising experience that extends the Tata Motors Lakehouse to people who'll never visit in person.",
    type: "academic",
    year: "2025–2026",
    role: "Designer & Researcher, in partnership with Tata Motors · graduation thesis",
    accent: "#d9b46a",
    particleProfile: particleProfiles.realm,
    keywords: ["WebAR", "Ecological Identity", "Care", "Behavioural Change", "Tata Motors"],
    metrics: [
      { value: "9 months", label: "Research & build" },
      { value: "M.Des", label: "Graduation project" },
      { value: "WebAR", label: "Core technology" },
    ],
    subPieces: [
      {
        slug: "webar-experience",
        title: "WebAR Experience",
        oneLiner: "The butterfly lifecycle as a care mechanic: raise, observe, release.",
      },
      {
        slug: "lifecycle-design",
        title: "Lifecycle & Badge System",
        oneLiner: "Seven-day care arc, image-marker recognition, and the ecological identity reveal.",
      },
    ],
    coverImage: "/images/realm/cover.png",
  },
  {
    slug: "trmeric",
    domain: "trmeric",
    title: "Trmeric",
    oneLiner: "Designing the full product experience for an AI-native enterprise platform, demand intake to portfolio value.",
    type: "professional",
    year: "2024–present",
    role: "Senior Product Designer, sole designer, founding team",
    accent: "#FFA426",
    particleProfile: particleProfiles.trmeric,
    keywords: ["Enterprise SaaS", "AI Design", "Design Systems", "B2B", "Prototyping"],
    metrics: [
      { value: "99.8%", label: "Time-to-scope reduction" },
      { value: "87%", label: "Task completion (vs 23% baseline)" },
      { value: "81%", label: "Tango AI acceptance rate" },
      { value: "+72", label: "NPS" },
    ],
    subPieces: [
      {
        slug: "demand-owner-flow",
        title: "Demand Owner Flow",
        oneLiner: "End-to-end: from a new demand idea to a scoped, resourced initiative.",
        sandboxSrc: "trmeric/demand-live.html",
        tags: ["Onboarding", "Canvas", "Tango", "Conversational UI"],
      },
      {
        slug: "portfolio-monitor",
        title: "Portfolio Monitor",
        oneLiner: "Multi-portfolio explorer with persona-contextual views for CIOs and portfolio leaders.",
        sandboxSrc: "trmeric/portfolio-monitor.html",
        tags: ["Force Graph", "Persona", "Executive"],
      },
      {
        slug: "trucible",
        title: "Trucible · Knowledge OS",
        oneLiner: "Wiki and Explorer modes for an enterprise context management system.",
        sandboxSrc: "trmeric/trucible.html",
        tags: ["Knowledge Management", "Dual Mode", "Search"],
      },
      {
        slug: "signals",
        title: "Signals · D3 Force Graph",
        oneLiner: "An Obsidian-style force-directed signal map for early-warning detection.",
        sandboxSrc: "trmeric/pm-signals.html",
        tags: ["D3", "Force Graph", "Data Viz"],
      },
      {
        slug: "project-manager",
        title: "Project Manager + RAID",
        oneLiner: "Project status and execution management: Up-level is the only path.",
        tags: ["Status", "RAID", "Engineering Handoff"],
      },
    ],
    coverImage: "/images/trmeric/cover.png",
  },
  {
    slug: "rozi",
    domain: "rozi",
    title: "Rozi",
    oneLiner: "A two-sided labour marketplace that connects India's informal workers directly to employers — no contractor, no wage skimming.",
    type: "academic",
    year: "2021",
    role: "UX Researcher & Service Designer",
    accent: "#C94030",
    particleProfile: particleProfiles.rozi,
    keywords: ["Service Design", "UX Research", "Social Impact", "Inclusive Design", "Mobile"],
    metrics: [
      { value: "Top 5", label: "SARVA Designathon 2021" },
      { value: "24h", label: "Design sprint" },
      { value: "2-sided", label: "Platform architecture" },
    ],
    coverImage: "/images/rozi/hero-phones.png",
  },
];

export const projectsBySlug = Object.fromEntries(
  projects.map((p) => [p.slug, p])
) as Record<string, Project>;
