import { Link } from "react-router-dom";
import { fair, hiringCompanies, pad } from "../lib";

export default function Home() {
  const { event, jobs, companies } = fair;
  const hiring = hiringCompanies.length;

  return (
    <main>
      <section className="hero">
        <div>
          <p className="kicker">{event.day} · {event.date}</p>
          <h1>Tech & Accountancy Talent Career Fair 2026</h1>
          <p className="lede">
            Browse every role from the official e2i job listing booklet. Search by skill, shortlist before
            you walk in, and show up ready to talk to employers.
          </p>
          <div className="actions">
            <Link className="btn" to="/jobs">Browse {jobs.length} roles</Link>
            <Link className="btn-ghost" to="/companies">See {hiring} employers</Link>
          </div>
        </div>
        <aside className="hero-card">
          <dl>
            <dt>When</dt>
            <dd>{event.day}, {event.date}</dd>
            <dt>Where</dt>
            <dd>{event.venue}</dd>
            <dt>Address</dt>
            <dd>{event.address}</dd>
            <dt>Organised by</dt>
            <dd>e2i · NTUC</dd>
          </dl>
        </aside>
      </section>

      <section className="stats">
        <div className="stat"><b>{jobs.length}</b><span>Open roles in the booklet</span></div>
        <div className="stat"><b>{hiring}</b><span>Hiring employers</span></div>
        <div className="stat"><b>{companies.length - hiring}</b><span>Career service desks</span></div>
        <div className="stat"><b>1</b><span>Day to meet recruiters</span></div>
      </section>

      <div className="section-head">
        <div>
          <h2>Employers on the floor</h2>
          <p className="muted">Numbered as they appear in the printed job listing booklet.</p>
        </div>
        <Link to="/companies">View all</Link>
      </div>
      <div className="company-grid">
        {hiringCompanies.map((company) => (
          <Link className="company-card" key={company.id} to={`/companies/${company.id}`}>
            <span className="num">#{pad(company.number)}</span>
            <h3>{company.name}</h3>
            <p className="muted" style={{ margin: 0 }}>{company.tagline}</p>
            <div className="chips">
              <span className="chip">{company.jobCount} roles</span>
              <span className="chip">{company.sector}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="note" style={{ marginTop: 28 }}>
        Bring a few printed resumes, shortlist the roles you want to discuss, and return the paper booklet
        at the exit after your interviews — this site is the reusable copy.
      </div>
    </main>
  );
}
