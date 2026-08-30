import { Link, Navigate, useParams } from "react-router-dom";
import { getCompany, jobsForCompany, pad } from "../lib";
import { useTitle } from "../hooks";
import JobCard from "../components/JobCard";

export default function CompanyDetail() {
  const { id = "" } = useParams();
  const company = getCompany(id);
  useTitle(company?.name);
  if (!company) return <Navigate to="/companies" replace />;
  const jobs = jobsForCompany(company.id);

  return (
    <main>
      <p className="kicker">
        <Link to="/companies">Employers</Link> · #{pad(company.number)}
      </p>
      <div className="panel company-hero">
        <h1 style={{ marginTop: 0 }}>{company.name}</h1>
        <div className="chips" style={{ marginBottom: 14 }}>
          <span className="chip">{company.sector}</span>
          <span className="chip">{company.jobCount ? `${company.jobCount} roles` : "Services"}</span>
        </div>
        <p className="lede" style={{ maxWidth: "70ch" }}>
          {company.about}
        </p>
        {company.website ? (
          <a className="btn-ghost" href={company.website} target="_blank" rel="noreferrer">
            Visit website
          </a>
        ) : null}
      </div>
      {jobs.length > 0 ? (
        <>
          <div className="section-head">
            <h2>Open roles</h2>
          </div>
          <div className="job-grid">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </>
      ) : (
        <div className="note">
          This booth is for e2i career coaching, job matching, and SkillsFuture advice — not a hiring list.
          See the Visit page for centre addresses and hours.
        </div>
      )}
    </main>
  );
}
