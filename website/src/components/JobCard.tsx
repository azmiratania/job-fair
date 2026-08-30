import { Link } from "react-router-dom";
import type { Job } from "../types";
import { companyAccent, jobSnippet, toggleShortlist } from "../lib";
import { useShortlist } from "../hooks";
import ApplyButton from "./ApplyButton";
import CompanyLogo from "./CompanyLogo";

export default function JobCard({ job }: { job: Job }) {
  const { saved } = useShortlist(job.id);
  const accent = companyAccent[job.companyId] ?? "#e24a12";

  return (
    <article className="job-card" style={{ borderLeftColor: accent }}>
      <Link className="job-card-link" to={`/jobs/${job.id}`}>
        <div className="job-card-top">
          <CompanyLogo id={job.companyId} name={job.company} size={36} />
          <span className="num">{job.company}</span>
        </div>
        <h3>{job.title}</h3>
        <p className="job-snippet">{jobSnippet(job)}</p>
        <div className="chips">
          <span className="chip">{job.location || "Singapore"}</span>
          <span className="chip">{job.category}</span>
          {job.hours ? <span className="chip">{job.hours}</span> : null}
        </div>
      </Link>
      <div className="card-actions no-print">
        <ApplyButton job={job} />
        <button
          className={saved ? "save-btn on" : "save-btn"}
          type="button"
          aria-label={saved ? "Remove from shortlist" : "Save to shortlist"}
          aria-pressed={saved}
          onClick={() => toggleShortlist(job.id)}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </article>
  );
}
