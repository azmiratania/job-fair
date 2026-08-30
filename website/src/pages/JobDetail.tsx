import { Link, Navigate, useParams } from "react-router-dom";
import { useState } from "react";
import { getCompany, getJob, isSaved, jobsForCompany, toggleShortlist } from "../lib";

export default function JobDetail() {
  const { id = "" } = useParams();
  const job = getJob(id);
  const [, bump] = useState(0);
  if (!job) return <Navigate to="/jobs" replace />;
  const company = getCompany(job.companyId);
  const saved = isSaved(job.id);
  const related = jobsForCompany(job.companyId).filter((j) => j.id !== job.id).slice(0, 4);

  return (
    <main>
      <p className="kicker">
        <Link to="/jobs">All roles</Link> · <Link to={`/companies/${job.companyId}`}>{job.company}</Link>
      </p>
      <div className="job-layout">
        <article className="panel">
          <span className="num">{job.company} · Role {job.number}</span>
          <h1>{job.title}</h1>
          <div className="chips" style={{ margin: "8px 0 20px" }}>
            <span className="chip">{job.location}</span>
            <span className="chip">{job.category}</span>
            <span className="chip">{job.seniority}</span>
          </div>
          <h3 className="serif">What you'll do</h3>
          <ul className="bullets">
            {job.description.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          {job.requirements.length > 0 && (
            <>
              <h3 className="serif">What you'll need</h3>
              <ul className="bullets">
                {job.requirements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </article>
        <aside>
          <div className="panel side-meta">
            <button
              className={saved ? "btn-orange" : "btn"}
              type="button"
              onClick={() => {
                toggleShortlist(job.id);
                bump((n) => n + 1);
              }}
            >
              {saved ? "Saved to shortlist" : "Save to shortlist"}
            </button>
            <dl>
              <dt>Employer</dt>
              <dd>
                <Link to={`/companies/${job.companyId}`}>{job.company}</Link>
              </dd>
              <dt>Location</dt>
              <dd>{job.location || "Singapore"}</dd>
              <dt>Hours</dt>
              <dd>{job.hours || "See employer at the fair"}</dd>
              {job.eligibility ? (
                <>
                  <dt>Eligibility</dt>
                  <dd>{job.eligibility}</dd>
                </>
              ) : null}
              <dt>Function</dt>
              <dd>{job.category}</dd>
            </dl>
            {company?.website ? (
              <p>
                <a className="btn-ghost" href={company.website} target="_blank" rel="noreferrer">
                  Company website
                </a>
              </p>
            ) : null}
          </div>
          {related.length > 0 && (
            <div className="panel" style={{ marginTop: 14 }}>
              <h3 className="serif" style={{ marginTop: 0 }}>More from {job.company}</h3>
              {related.map((item) => (
                <p key={item.id} style={{ margin: "8px 0" }}>
                  <Link to={`/jobs/${item.id}`}>{item.title}</Link>
                </p>
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
