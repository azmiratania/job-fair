import { FormEvent, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  categories,
  fair,
  hiringCompanies,
  locations,
  searchJobs,
  seniorities,
} from "../lib";
import JobCard from "../components/JobCard";

export default function Jobs() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const filters = {
    company: params.get("company") ?? "",
    category: params.get("category") ?? "",
    location: params.get("location") ?? "",
    seniority: params.get("seniority") ?? "",
  };

  const results = useMemo(
    () => searchJobs(fair.jobs, params.get("q") ?? "", filters),
    [params],
  );

  function update(next: Record<string, string>) {
    const merged = new URLSearchParams(params);
    Object.entries(next).forEach(([key, value]) => {
      if (value) merged.set(key, value);
      else merged.delete(key);
    });
    setParams(merged);
  }

  function onSearch(e: FormEvent) {
    e.preventDefault();
    update({ q });
  }

  return (
    <main>
      <p className="kicker">Job listing booklet</p>
      <div className="section-head">
        <div>
          <h2>All roles</h2>
          <p className="muted">Search titles, skills, employers, and locations from the fair booklet.</p>
        </div>
        <Link to="/shortlist">Open shortlist</Link>
      </div>

      <form className="filters" onSubmit={onSearch}>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            update({ q: e.target.value });
          }}
          placeholder="Search AI, audit, ServiceNow, City Hall…"
        />
        <select value={filters.company} onChange={(e) => update({ company: e.target.value })}>
          <option value="">All employers</option>
          {hiringCompanies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select value={filters.category} onChange={(e) => update({ category: e.target.value })}>
          <option value="">All functions</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={filters.location} onChange={(e) => update({ location: e.target.value })}>
          <option value="">All locations</option>
          {locations.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={filters.seniority} onChange={(e) => update({ seniority: e.target.value })}>
          <option value="">All levels</option>
          {seniorities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </form>

      <div className="toolbar">
        <p className="muted" style={{ margin: 0 }}>
          {results.length} role{results.length === 1 ? "" : "s"}
        </p>
        <button className="btn-ghost" type="button" onClick={() => { setQ(""); setParams({}); }}>
          Clear filters
        </button>
      </div>

      {results.length === 0 ? (
        <div className="empty">No roles match those filters. Try a broader keyword.</div>
      ) : (
        <div className="job-grid">
          {results.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </main>
  );
}
