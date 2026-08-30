import { Link } from "react-router-dom";
import type { Job } from "../types";

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link className="job-card" to={`/jobs/${job.id}`}>
      <span className="num">{job.company}</span>
      <h3>{job.title}</h3>
      <div className="chips">
        <span className="chip">{job.location || "Singapore"}</span>
        <span className="chip">{job.category}</span>
        <span className="chip">{job.seniority}</span>
      </div>
    </Link>
  );
}
