import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categoryCounts, fair, fairCountdown, hiringCompanies, mapsUrl, pad } from "../lib";
import { useTitle } from "../hooks";

export default function Home() {
  useTitle();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const { event, jobs } = fair;
  const hiring = hiringCompanies.length;
  const countdown = fairCountdown();

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const next = q.trim();
    navigate(next ? `/jobs?q=${encodeURIComponent(next)}` : "/jobs");
  }

  return (
    <main>
      <section className="hero">
        <div>
          <p className="kicker">
            {event.day} · {event.date}
            <span className={`countdown ${countdown.tone}`}>{countdown.label}</span>
          </p>
          <h1>Find the booth before you join the queue.</h1>
          <p className="lede">
            Every role from the e2i Tech & Accountancy Talent Career Fair booklet, searchable on your phone.
            Shortlist on the way there, then walk the floor with a plan.
          </p>
          <form className="hero-search" onSubmit={onSearch}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search AI, audit, ServiceNow, City Hall…"
              aria-label="Search roles"
            />
            <button className="btn" type="submit">
              Search roles
            </button>
          </form>
          <div className="actions">
            <Link className="btn-ghost" to="/jobs">
              Browse all {jobs.length} roles
            </Link>
            <Link className="btn-ghost" to="/companies">
              {hiring} employers
            </Link>
          </div>
        </div>
        <aside className="hero-card">
          <p className="hero-card-kicker">Fair desk</p>
          <dl>
            <dt>When</dt>
            <dd>
              {event.day}, {event.date}
            </dd>
            <dt>Where</dt>
            <dd>{event.venue}</dd>
            <dt>Address</dt>
            <dd>{event.address}</dd>
            <dt>MRT</dt>
            <dd>Raffles Place</dd>
          </dl>
          <a className="btn-ghost" href={mapsUrl(event.address)} target="_blank" rel="noreferrer">
            Open in Maps
          </a>
        </aside>
      </section>

      <section className="stats">
        <div className="stat">
          <b>{jobs.length}</b>
          <span>Roles in the booklet</span>
        </div>
        <div className="stat">
          <b>{hiring}</b>
          <span>Hiring employers</span>
        </div>
        <div className="stat">
          <b>{locationsCount()}</b>
          <span>Work locations</span>
        </div>
        <div className="stat">
          <b>1</b>
          <span>Day at Raffles Place</span>
        </div>
      </section>

      <div className="section-head">
        <div>
          <h2>Browse by function</h2>
          <p className="muted">Jump straight to the cluster you want to talk about at the booth.</p>
        </div>
      </div>
      <div className="chip-row">
        {categoryCounts.map((item) => (
          <Link className="chip-link" key={item.name} to={`/jobs?category=${encodeURIComponent(item.name)}`}>
            {item.name}
            <em>{item.count}</em>
          </Link>
        ))}
      </div>

      <div className="steps">
        <article>
          <span>1</span>
          <h3 className="serif">Search tonight</h3>
          <p>Filter by skill, employer, or location so you are not flipping the paper booklet in the queue.</p>
        </article>
        <article>
          <span>2</span>
          <h3 className="serif">Save a booth plan</h3>
          <p>Shortlist lives on this phone. Roles group by employer so you visit each booth once.</p>
        </article>
        <article>
          <span>3</span>
          <h3 className="serif">Walk the floor</h3>
          <p>Bring printed resumes. Return the booklet at the exit after interviews.</p>
        </article>
      </div>

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
            <p className="muted" style={{ margin: 0 }}>
              {company.tagline}
            </p>
            <div className="chips">
              <span className="chip">{company.jobCount} roles</span>
              <span className="chip">{company.sector}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

function locationsCount() {
  return new Set(fair.jobs.map((j) => j.location).filter(Boolean)).size;
}
