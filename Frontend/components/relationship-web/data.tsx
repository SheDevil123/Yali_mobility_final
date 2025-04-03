// Define node data
export const nodeData = [
  // Promoters & Founders
  {
    id: 1,
    label: "Sakthivel T.",
    shortLabel: "CEO",
    group: "Promoters",
    role: "Founder/CEO",
    description: "Primary decision-maker, responsible for overall business strategy",
  },
  {
    id: 2,
    label: "Pradeep T.",
    shortLabel: "Director",
    group: "Promoters",
    role: "Director",
    description: "Helps guide the company's vision and major decisions",
  },
  {
    id: 3,
    label: "Anil P.",
    shortLabel: "Ex-Dir",
    group: "Promoters",
    role: "Ex-Director",
    description: "Formerly helped guide company vision and decisions",
  },

  // Executive Leadership
  {
    id: 4,
    label: "CTO",
    shortLabel: "CTO",
    group: "Executive",
    role: "Chief Technology Officer",
    description: "Leads technology and innovation",
  },
  {
    id: 5,
    label: "COO",
    shortLabel: "COO",
    group: "Executive",
    role: "Chief Operating Officer",
    description: "Manages daily operations, including production and logistics",
  },
  {
    id: 6,
    label: "CBO",
    shortLabel: "CBO",
    group: "Executive",
    role: "Chief Business Officer",
    description: "Responsible for business expansion, partnerships, and customer relationships",
  },
  {
    id: 7,
    label: "CFO",
    shortLabel: "CFO",
    group: "Executive",
    role: "Chief Financial Officer",
    description: "Handles financial planning, investments, and funding",
  },
  {
    id: 8,
    label: "HR Head",
    shortLabel: "HR",
    group: "Executive",
    role: "Human Resources Head",
    description: "Manages recruitment, employee well-being, and company policies",
  },
  {
    id: 9,
    label: "Auditor",
    shortLabel: "Audit",
    group: "Executive",
    role: "Auditor",
    description: "Ensures financial transparency",
  },
  {
    id: 10,
    label: "CS",
    shortLabel: "CS",
    group: "Executive",
    role: "Company Secretary",
    description: "Handles legal and regulatory compliance",
  },
  {
    id: 11,
    label: "Legal",
    shortLabel: "Legal",
    group: "Executive",
    role: "Legal Team",
    description: "Manages company contracts, policies, and compliance",
  },

  // Technology & Engineering
  {
    id: 12,
    label: "Engineering",
    shortLabel: "Eng",
    group: "Tech",
    role: "Engineering & Product Development",
    description: "Develops products, designs technology, and improves innovation",
  },
  {
    id: 13,
    label: "IT",
    shortLabel: "IT",
    group: "Tech",
    role: "IT & Infrastructure",
    description: "Manages company software, networks, and internal technology",
  },

  // Manufacturing & Operations
  {
    id: 14,
    label: "Manufacturing",
    shortLabel: "Mfg",
    group: "Operations",
    role: "Manufacturing & Production",
    description: "Handles making and assembling products",
  },
  {
    id: 15,
    label: "Supply Chain",
    shortLabel: "Supply",
    group: "Operations",
    role: "Supply Chain & Vendors",
    description: "Works with vendors to procure materials",
  },

  // Business & Marketing
  {
    id: 16,
    label: "Sales",
    shortLabel: "Sales",
    group: "Business",
    role: "Sales & Business Development",
    description: "Generates revenue, manages clients, and expands business",
  },
  {
    id: 17,
    label: "Marketing",
    shortLabel: "Mktg",
    group: "Business",
    role: "Marketing & Branding",
    description: "Promotes the brand and runs campaigns",
  },
  {
    id: 18,
    label: "Support",
    shortLabel: "Support",
    group: "Business",
    role: "Customer Support & Service",
    description: "Manages customer queries and complaints",
  },

  // Finance & HR Side
  {
    id: 19,
    label: "Finance",
    shortLabel: "Finance",
    group: "Finance",
    role: "Finance & Accounting",
    description: "Manages company money, payments, and budgets",
  },
  {
    id: 20,
    label: "Compliance",
    shortLabel: "Compl",
    group: "Finance",
    role: "Legal & Compliance",
    description: "Ensures company follows laws and regulations",
  },
  {
    id: 21,
    label: "HR",
    shortLabel: "HR",
    group: "HR",
    role: "Human Resources & Administration",
    description: "Hires employees, manages policies, and handles company culture",
  },

  // External Stakeholders
  {
    id: 22,
    label: "Clients",
    shortLabel: "Clients",
    group: "External",
    role: "Clients",
    description: "Purchase products and services from the company",
  },
  {
    id: 23,
    label: "Vendors",
    shortLabel: "Vendors",
    group: "External",
    role: "Vendors & Suppliers",
    description: "Supply raw materials and services to the company",
  }
]

// Define edge data
export const edgeData = [
  // CEO connections
  { source: 1, target: 4 },
  { source: 1, target: 5 },
  { source: 1, target: 6 },
  { source: 1, target: 7 },
  { source: 1, target: 8 },
  { source: 1, target: 24 },

  // Directors connections
  { source: 2, target: 1 },
  { source: 3, target: 1 },

  // Executive connections
  { source: 4, target: 12 },
  { source: 4, target: 13 },
  { source: 5, target: 14 },
  { source: 6, target: 16 },
  { source: 6, target: 17 },
  { source: 6, target: 18 },
  { source: 7, target: 19 },
  { source: 7, target: 20 },
  { source: 8, target: 21 },

  // Department connections
  { source: 12, target: 13 }, // Engineering ↔ IT
  { source: 14, target: 15 }, // Manufacturing ↔ Supply Chain
  { source: 16, target: 17 }, // Sales ↔ Marketing
  { source: 16, target: 18 }, // Sales ↔ Support
  { source: 19, target: 20 }, // Finance ↔ Compliance

  // External stakeholder connections
  { source: 22, target: 16 }, // Clients ↔ Sales
  { source: 22, target: 18 }, // Clients ↔ Support
  { source: 23, target: 14 }, // Vendors ↔ Manufacturing
  { source: 23, target: 15 }, // Vendors ↔ Supply Chain
  { source: 23, target: 19 }, // Vendors ↔ Finance
  { source: 24, target: 1 }, // Investors ↔ CEO
  { source: 24, target: 7 }, // Investors ↔ CFO
  { source: 24, target: 20 }, // Investors ↔ Compliance
]

