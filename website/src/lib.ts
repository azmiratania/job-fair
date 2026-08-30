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
