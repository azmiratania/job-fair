import { Link, Navigate, useParams } from "react-router-dom";
import { applyMeta, getCompany, getJob, jobsForCompany, mapsUrl } from "../lib";
import { useShortlist, useTitle } from "../hooks";
import JobCopy from "../components/JobCopy";
import ApplyButton from "../components/ApplyButton";
import CompanyLogo from "../components/CompanyLogo";
import AskList from "../components/AskList";

export default function JobDetail() {
  const { id = "" } = useParams();
  const job = getJob(id);
  const { saved, toggle } = useShortlist(id);
  useTitle(job?.title);
  if (!job) return <Navigate to="/jobs" replace />;
  const company = getCompany(job.companyId);
  const apply = applyMeta(job);
  const related = jobsForCompany(job.companyId).filter((j) => j.id !== job.id).slice(0, 5);

  return (
    <main>
      <p className="kicker">
        <Link to="/jobs">All roles</Link> · <Link to={`/companies/${job.companyId}`}>{job.company}</Link>
      </p>
      <div className="job-layout">
        <article className="panel">
          <div className="job-card-top" style={{ marginBottom: 12 }}>
            <CompanyLogo id={job.companyId} name={job.company} size={44} />
            <span className="num">
              {job.company} · Role {job.number}
            </span>
          </div>
          <h1>{job.title}</h1>
          <div className="chips" style={{ margin: "8px 0 8px" }}>
            <span className="chip">{job.location}</span>
            <span className="chip">{job.category}</span>
            <span className="chip">{job.seniority}</span>
          </div>
          <JobCopy heading="What you'll do" items={job.description} />
          <JobCopy heading="What you'll need" items={job.requirements} />
          <AskList companyId={job.companyId} />
        </article>
        <aside className="job-aside">
          <div className="panel side-meta sticky-card">
            <ApplyButton job={job} className="btn-orange" />
            <button className={saved ? "btn-orange" : "btn-ghost"} type="button" onClick={() => toggle(job.id)}>
              {saved ? "Saved to booth plan" : "Save to booth plan"}
            </button>
            <p className="apply-hint">{apply.hint} You can also apply in person at the {job.company} booth on 1 September.</p>
            <dl>
              <dt>Employer</dt>
              <dd>
                <Link to={`/companies/${job.companyId}`}>{job.company}</Link>
              </dd>
              <dt>Location</dt>
              <dd>{job.location || "Singapore"}</dd>
              <dt>Hours</dt>
              <dd>{job.hours || "Ask at the booth"}</dd>
              {job.eligibility ? (
                <>
                  <dt>Eligibility</dt>
                  <dd>{job.eligibility}</dd>
                </>
              ) : null}
              <dt>Function</dt>
              <dd>{job.category}</dd>
            </dl>
            <div className="aside-actions">
              {job.location ? (
                <a className="btn-ghost" href={mapsUrl(`${job.location}, Singapore`)} target="_blank" rel="noreferrer">
                  Office area on Maps
                </a>
              ) : null}
              {company?.website ? (
                <a className="btn-ghost" href={company.website} target="_blank" rel="noreferrer">
                  Company website
                </a>
              ) : null}
            </div>
          </div>
          {related.length > 0 && (
            <div className="panel related">
              <h3 className="serif" style={{ marginTop: 0 }}>
                More from {job.company}
              </h3>
              {related.map((item) => (
                <Link className="related-link" key={item.id} to={`/jobs/${item.id}`}>
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
