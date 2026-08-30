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
