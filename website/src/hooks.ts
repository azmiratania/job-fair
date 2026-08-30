import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { isSaved, readShortlist, toggleShortlist } from "./lib";

export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title
      ? `${title} · Talent Career Fair 2026`
      : "Tech & Accountancy Talent Career Fair 2026 · e2i";
  }, [title]);
}

export function useShortlist(id?: string) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const sync = () => setTick((n) => n + 1);
    window.addEventListener("shortlist-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("shortlist-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const ids = readShortlist();
  return {
    ids,
    count: ids.length,
    saved: id ? isSaved(id) : false,
    toggle: (jobId: string) => toggleShortlist(jobId),
    tick,
  };
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
