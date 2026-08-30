import { Link } from "react-router-dom";
import type { Job } from "../types";
import { companyAccent, jobSnippet, toggleShortlist } from "../lib";
import { useShortlist } from "../hooks";

export default function JobCard({ job }: { job: Job }) {
  const { saved } = useShortlist(job.id);
  const accent = companyAccent[job.companyId] ?? "#e24a12";
  const marked = saved;

  return (
    <article className="job-card" style={{ borderLeftColor: accent }}>
      <Link className="job-card-link" to={`/jobs/${job.id}`}>
        <span className="num">{job.company}</span>
        <h3>{job.title}</h3>
        <p className="job-snippet">{jobSnippet(job)}</p>
        <div className="chips">
          <span className="chip">{job.location || "Singapore"}</span>
          <span className="chip">{job.category}</span>
          {job.hours ? <span className="chip">{job.hours}</span> : null}
        </div>
      </Link>
      <button
        className={marked ? "save-btn on" : "save-btn"}
        type="button"
        aria-label={marked ? "Remove from shortlist" : "Save to shortlist"}
        aria-pressed={marked}
        onClick={() => toggleShortlist(job.id)}
      >
        {marked ? "Saved" : "Save"}
      </button>
    </article>
  );
}
