import type { FairData, Job } from "./types";
import fairJson from "./data/fair.json";

export const fair = fairJson as FairData;

export const hiringCompanies = fair.companies.filter((c) => c.jobCount > 0);

export function getCompany(id: string) {
  return fair.companies.find((c) => c.id === id);
}

export function getJob(id: string) {
  return fair.jobs.find((j) => j.id === id);
}

export function jobsForCompany(id: string) {
  return fair.jobs.filter((j) => j.companyId === id);
}

export function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export const categories = unique(fair.jobs.map((j) => j.category));
export const locations = unique(fair.jobs.map((j) => j.location));
export const seniorities = unique(fair.jobs.map((j) => j.seniority));

export const categoryCounts = categories
  .map((name) => ({
    name,
    count: fair.jobs.filter((j) => j.category === name).length,
  }))
  .sort((a, b) => b.count - a.count);

export function searchJobs(
  jobs: Job[],
  query: string,
  filters: { company?: string; category?: string; location?: string; seniority?: string },
) {
  const q = query.trim().toLowerCase();
  return jobs.filter((job) => {
    if (filters.company && job.companyId !== filters.company) return false;
    if (filters.category && job.category !== filters.category) return false;
    if (filters.location && job.location !== filters.location) return false;
    if (filters.seniority && job.seniority !== filters.seniority) return false;
    if (!q) return true;
    const hay = [
      job.title,
      job.company,
      job.location,
      job.category,
      job.hours,
      job.seniority,
      ...job.description,
      ...job.requirements,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

const SHORTLIST_KEY = "e2i-fair-shortlist";

export function readShortlist(): string[] {
  try {
    const raw = localStorage.getItem(SHORTLIST_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function writeShortlist(ids: string[]) {
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("shortlist-change"));
}

export function isSaved(id: string) {
  return readShortlist().includes(id);
}

export function toggleShortlist(id: string) {
  const current = readShortlist();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  writeShortlist(next);
  return next;
}

export function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function fairCountdown(now = new Date()) {
  const start = new Date(`${fair.event.dateIso}T00:00:00`);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((start.getTime() - today.getTime()) / 86_400_000);
  if (days > 1) return { days, label: `${days} days to go`, tone: "soon" as const };
  if (days === 1) return { days, label: "Tomorrow", tone: "soon" as const };
  if (days === 0) return { days, label: "Happening today", tone: "today" as const };
  return { days, label: "Fair has ended", tone: "past" as const };
}

const LABEL_RE =
  /^(the role|about the role|what you.?ll (do|bring|be doing)|what you do|ways of working|why accenture|responsibilities|key responsibilities|job description|requirements|qualifications|position responsibilities|here.?s what you need|bonus points if you have|critical success factors|experience & skills|skills & competencies|required qualifications|preferred qualifications|core requirements)$/i;

export function isCopyLabel(text: string) {
  const t = text.trim().replace(/:+$/, "");
  if (t.length > 56) return false;
  if (/:$/.test(text.trim())) return true;
  return LABEL_RE.test(t);
}

export function jobSnippet(job: Job, max = 140) {
  const line = job.description.find((item) => item.length > 40 && !isCopyLabel(item));
  if (!line) return job.category;
  return line.length > max ? `${line.slice(0, max).replace(/\s+\S*$/, "")}…` : line;
}

export function groupJobsByCompany(jobs: Job[]) {
  const order = hiringCompanies.map((c) => c.id);
  const groups = new Map<string, Job[]>();
  for (const job of jobs) {
    const list = groups.get(job.companyId) ?? [];
    list.push(job);
    groups.set(job.companyId, list);
  }
  return [...groups.entries()]
    .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    .map(([companyId, items]) => ({
      company: getCompany(companyId),
      jobs: items,
    }));
}

export const companyAccent: Record<string, string> = {
  accenture: "#a100ff",
  "apar-technologies": "#0b6e4f",
  "forvis-mazars": "#1b365d",
  "kbx-resources": "#9b1c31",
  "lit-strategy": "#c45c26",
  "ncs-group": "#0072ce",
  "red-alpha-cybersecurity": "#b42318",
  "rsm-singapore": "#0f766e",
  "tangspac-consulting": "#1d4e89",
  e2i: "#e24a12",
  "e2i-services": "#e24a12",
};

const CAREERS: Record<string, (title: string) => string> = {
  accenture: (title) =>
    `https://www.accenture.com/sg-en/careers/jobsearch?jk=${encodeURIComponent(title)}`,
  "apar-technologies": () => "https://www.apartechnologies.com",
  "forvis-mazars": (title) =>
    `https://careers-asia.forvismazars.com/jobs/?search[keyword]=${encodeURIComponent(title)}`,
  "ncs-group": (title) =>
    `https://jobs.smartrecruiters.com/NCS3?search=${encodeURIComponent(title)}`,
  "rsm-singapore": () => "https://www.rsm.global/singapore/careers/join-our-rsm-family",
  "red-alpha-cybersecurity": () => "https://www.redalpha.sg",
  "tangspac-consulting": () => "https://www.tangspac.com",
  e2i: () => "https://www.e2i.com.sg",
};

export function careersHref(companyId: string) {
  const maker = CAREERS[companyId];
  if (maker) return maker("");
  return getCompany(companyId)?.website || undefined;
}

export type ApplyKind = "search" | "careers" | "site" | "linkedin";

const APPLY_KIND: Record<string, Exclude<ApplyKind, "linkedin">> = {
  accenture: "search",
  "forvis-mazars": "search",
  "ncs-group": "search",
  "rsm-singapore": "careers",
  "apar-technologies": "site",
  "red-alpha-cybersecurity": "site",
  "tangspac-consulting": "site",
  e2i: "site",
};

const APPLY_COPY: Record<ApplyKind, { label: string; hint: string }> = {
  search: {
    label: "Apply",
    hint: "Opens this employer’s careers search for this title. You can also apply at the booth.",
  },
  careers: {
    label: "Careers page",
    hint: "Opens their careers page — not this specific listing. Search the title, or apply at the booth.",
  },
  site: {
    label: "Company site",
    hint: "No public job URL in the booklet. Search this title on their site, or apply at the booth.",
  },
  linkedin: {
    label: "Search on LinkedIn",
    hint: "No careers page listed. This searches LinkedIn, or apply in person at the booth.",
  },
};

export function applyMeta(job: Job) {
  const maker = CAREERS[job.companyId];
  const site = getCompany(job.companyId)?.website;
  const href = maker
    ? maker(job.title)
    : site ||
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${job.company} ${job.title}`)}&location=Singapore`;
  const kind: ApplyKind = APPLY_KIND[job.companyId] ?? (site ? "site" : "linkedin");
  return { href, kind, ...APPLY_COPY[kind] };
}

export function companyApplyMeta(companyId: string) {
  const href = careersHref(companyId);
  if (!href) return undefined;
  const kind: ApplyKind = APPLY_KIND[companyId] ?? "site";
  const labels: Record<ApplyKind, string> = {
    search: "Search careers",
    careers: "Careers page",
    site: "Company site",
    linkedin: "Search on LinkedIn",
  };
  return { href, label: labels[kind], hint: APPLY_COPY[kind].hint };
}
export const suggestedSearches = ["AI", "audit", "ServiceNow", "Avaloq", "PDPA", "cyber"];

export const boothQuestions: Record<string, string[]> = {
  accenture: [
    "Is this role on a client project or in managed services — and where is the Singapore team sitting?",
    "For Avaloq, Sunline, or ServiceNow roles: what platform experience do you expect on day one?",
    "How do TAP / graduate analysts get staffed onto local work?",
    "What happens after this booth chat — on-site interview, or apply online later?",
  ],
  "apar-technologies": [
    "Is the Desktop & Workplace Support work on-site with a named client, or rotating?",
    "For ServiceNow Developer: which modules are you hiring for right now?",
    "Do you hire as Apar employees or as contractors deployed to clients?",
  ],
  "forvis-mazars": [
    "Is the Associate, Audit & Assurance seat busy-season overtime, and what does that look like in Singapore?",
    "For tax roles: GST vs financial-services tax — which team is hiring at this booth?",
    "What does the written test or case at this booth cover?",
  ],
  "kbx-resources": [
    "For Cybersecurity executive: which tools are actually in production — SIEM, EDR, both?",
    "Does the Data Protection officer role own PDPA end-to-end, or support a larger team?",
    "Is Business Development selling services, or opening employer accounts?",
  ],
  "lit-strategy": [
    "Are the AI and Automation Engineer projects for SME clients in Singapore or regional?",
    "For the finance and HR consulting PMs: how large is the delivery team you would join?",
    "What does a typical first engagement look like in the first 90 days?",
  ],
  "ncs-group": [
    "End User Support vs Network vs Service Delivery — which queue is live at this booth today?",
    "Are these roles on NCS payroll, and which client site would I report to?",
    "What shift pattern should I expect for the support and network roles?",
  ],
  "red-alpha-cybersecurity": [
    "Is Cybersecurity Engineer the Alpha graduate path, or do you also hire experienced specialists here?",
    "Which cloud and engineering seats are still open this afternoon?",
    "Do you run a technical screen at the booth, or is it a conversation then a later test?",
  ],
  "rsm-singapore": [
    "IT Manager vs Compliance Counsel vs Market Advisor — which hiring manager is at this booth?",
    "Are professional-services seats in audit/advisory still open, or is this mostly corporate functions?",
    "What should I bring if you want a CV plus a writing or case sample?",
  ],
  "tangspac-consulting": [
    "Are these operations and IT seats with Tangspac, or placements into client teams?",
    "KYC Analyst and Data Management Officer — which client industry are you filling first?",
    "What does ‘contract vs permanent’ look like for the roles on the board?",
  ],
  e2i: [
    "Which transformation or corporate-finance seats are still interviewing today?",
    "Is this an e2i headcount role, or a placement into a partner employer?",
    "Can a coach here help me sequence the other booths on my shortlist?",
  ],
  "e2i-services": [
    "Can you match me to booths from the roles I already saved?",
    "Which SkillsFuture pathways pair with the tech and accountancy seats on the floor?",
    "What should I fix in my CV before I join an employer queue?",
  ],
};

export function questionsForCompany(companyId: string) {
  return boothQuestions[companyId] ?? [
    "What does success look like in this role in the first 90 days?",
    "Who would I report to, and where does the team sit?",
    "What should I do after this conversation — apply here, or online?",
  ];
}

export function shareShortlistText(jobs: Job[]) {
  const groups = groupJobsByCompany(jobs);
  const lines = [`e2i Career Fair · 1 Sep 2026 · The Exchange L4`, `${EVENT_HOURS} · Raffles Place MRT`, ""];
  for (const group of groups) {
    const n = pad(group.company?.number ?? 0);
    lines.push(`Booth ${n} ${group.company?.name ?? "Employer"}`);
    for (const job of group.jobs) lines.push(`• ${job.title}`);
    lines.push("");
  }
  lines.push("Saved on your phone — this text is the backup copy.");
  return lines.join("\n").trim();
}

export function whatsappHref(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export const REGISTER_URL = "https://e2i.sg/TTU1926fb";
export const EVENT_HOURS = "10:00 AM – 4:00 PM";

export function initials(name: string) {
  const parts = name
    .replace(/&/g, " ")
    .split(/\s+/)
    .filter((w) => !/^(and|of|the|group|pte|ltd)$/i.test(w));
  if (parts[0]?.toLowerCase() === "e2i") return "e2";
  return parts
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export const dayPlan = [
  {
    time: "10:00",
    title: "Registration",
    body: "Check in at The Exchange, Level 4. Pre-register if you can — walk-ins may be limited.",
  },
  {
    time: "10:00–16:00",
    title: "Employer booths",
    body: "Meet hiring teams face-to-face at numbered booths. This is where conversations and on-site interviews happen.",
  },
  {
    time: "All day",
    title: "Networking",
    body: "Move between booths, compare notes, and talk to people already doing the work you want next.",
  },
  {
    time: "All day",
    title: "Skills workshops",
    body: "Ask e2i about SkillsFuture pathways and high-demand programmes while you are already in the room with employers.",
  },
  {
    time: "All day",
    title: "Career coaching",
    body: "e2i coaches are on the floor for job matching, career direction, and interview prep.",
  },
  {
    time: "16:00",
    title: "Fair closes",
    body: "Last conversations wrap. Return the printed job listing booklet at the exit after your interviews.",
  },
];

export const faqs = [
  {
    q: "Do I need to register?",
    a: "Yes — register on e2i’s event page before you go. Walk-ins may be limited. LTVP/LTVP+ holders should bring PLOC/LOC and an identification pass and register on site.",
  },
  {
    q: "When and where is it?",
    a: "Tuesday 1 September 2026, 10:00 AM to 4:00 PM at The Exchange, Singapore Land Tower, 50 Raffles Place, Level 4. Nearest MRT: Raffles Place.",
  },
  {
    q: "How do I apply for a role?",
    a: "Use Apply on any role to open that employer’s careers page. You can also apply in person at their booth during the fair.",
  },
  {
    q: "What should I bring?",
    a: "IC, a few printed resumes, and a shortlist of booths. This site saves a booth plan on your phone.",
  },
  {
    q: "Is this the official e2i site?",
    a: "This is a digital companion to the official job listing booklet. Registration and event operations stay on e2i.",
  },
];
