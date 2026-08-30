import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  EVENT_HOURS,
  REGISTER_URL,
  categoryCounts,
  fair,
  fairCountdown,
  hiringCompanies,
  jobsForCompany,
} from "../lib";
import { useTitle } from "../hooks";
import CompanyCard from "../components/CompanyCard";
import CompanyLogo from "../components/CompanyLogo";
import FloorMap from "../components/FloorMap";
import JobCard from "../components/JobCard";
import RecruiterGrid from "../components/RecruiterGrid";
import Reveal from "../components/Reveal";
import Timeline from "../components/Timeline";

const why = [
  {
    icon: "01",
    cls: "i1",
    title: "Meet top employers",
    body: "Ten hiring organisations in one room — from global consultancies to specialist tech and accountancy firms.",
  },
  {
    icon: "02",
    cls: "i2",
    title: "Discover opportunities",
    body: "Search every role from the official booklet before you join a queue. Shortlist on your phone, then walk with a plan.",
  },
  {
    icon: "03",
    cls: "i3",
    title: "Network on the floor",
    body: "Talk to people already doing the work. Compare teams, ask the questions a careers portal cannot answer.",
  },
  {
    icon: "04",
    cls: "i4",
    title: "Get career advice",
    body: "e2i coaches are on site for job matching, interview prep, and SkillsFuture pathways.",
  },
];

export default function Home() {
  useTitle();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const { event, jobs } = fair;
  const countdown = fairCountdown();
  const featured = useMemo(
    () =>
      hiringCompanies
        .map((c) => jobsForCompany(c.id)[0])
        .filter((job): job is NonNullable<typeof job> => Boolean(job))
        .slice(0, 6),
    [],
  );
  const floaters = hiringCompanies.slice(0, 3);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const next = q.trim();
    navigate(next ? `/jobs?q=${encodeURIComponent(next)}` : "/jobs");
  }

  return (
    <main>
      <section className="hero" id="top">
        <span className="blob blob-a" aria-hidden="true" />
        <span className="blob blob-b" aria-hidden="true" />
        <span className="blob blob-c" aria-hidden="true" />
        <div>
          <p className="kicker">
            {event.day} · {event.date}
            <span className="countdown">{countdown.label}</span>
          </p>
          <h1>
            Your next opportunity
            <br />
            starts here.
          </h1>
          <p className="lede">
            Meet ambitious people. Discover exciting companies. Find the opportunity that moves your career
            forward.
          </p>
          <div className="actions">
            <Link className="btn btn-lime" to="/companies">
              Explore Companies
            </Link>
            <a className="btn" href={REGISTER_URL} target="_blank" rel="noreferrer">
              Register for the Career Fair
            </a>
          </div>
          <form className="hero-search" onSubmit={onSearch}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search AI, audit, ServiceNow…"
              aria-label="Search roles"
            />
            <button className="btn-ghost" type="submit">
              Search
            </button>
          </form>
        </div>
        <div className="hero-visual" aria-hidden="true">
          {floaters.map((company, i) => (
            <div className={`float-card float-${i + 1}`} key={company.id}>
              <CompanyLogo id={company.id} name={company.name} size={40} />
              <div>
                <b>{company.name}</b>
                <span>
                  {company.jobCount} open roles · Booth {String(company.number).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
          <div className="event-chip">
            <small>On the floor</small>
            <strong>
              {event.date}
              <br />
              {EVENT_HOURS}
            </strong>
            <small style={{ marginTop: 8, textTransform: "none", letterSpacing: 0 }}>{event.venue}</small>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat">
          <b>{jobs.length}+</b>
          <span>Roles in the booklet</span>
        </div>
        <div className="stat">
          <b>{hiringCompanies.length}</b>
          <span>Hiring employers</span>
        </div>
        <div className="stat">
          <b>1 Sep</b>
          <span>Raffles Place, Level 4</span>
        </div>
        <div className="stat">
          <b>6 hrs</b>
          <span>{EVENT_HOURS}</span>
        </div>
      </section>

      <Reveal>
        <section className="section" id="why">
          <div className="section-head">
            <div>
              <h2>Why attend?</h2>
              <p>Your career is an adventure, not a form to fill out.</p>
            </div>
          </div>
          <div className="why-grid">
            {why.map((item) => (
              <article className="why-card" key={item.title}>
                <span className={`icon ${item.cls}`}>{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section" id="companies">
          <div className="section-head">
            <div>
              <h2>Featured companies</h2>
              <p>Numbered as they appear in the printed job listing booklet.</p>
            </div>
            <Link className="btn-ghost" to="/companies">
              All employers
            </Link>
          </div>
          <div className="company-grid">
            {hiringCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section" id="opportunities">
          <div className="section-head">
            <div>
              <h2>Explore opportunities</h2>
              <p>Filter by industry, then open the full list to refine by role, level, company, and location.</p>
            </div>
            <Link className="btn-ghost" to="/jobs">
              All {jobs.length} roles
            </Link>
          </div>
          <div className="chip-row">
            {categoryCounts.slice(0, 8).map((item) => (
              <Link className="chip-link" key={item.name} to={`/jobs?category=${encodeURIComponent(item.name)}`}>
                {item.name}
                <em>{item.count}</em>
              </Link>
            ))}
          </div>
          <div className="job-grid">
            {featured.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section" id="schedule">
          <div className="section-head">
            <div>
              <h2>Event schedule</h2>
              <p>
                One open floor, {EVENT_HOURS}. There is no published talk timetable — this is how the day actually
                runs.
              </p>
            </div>
            <Link className="btn-ghost" to="/schedule">
              Full day plan
            </Link>
          </div>
          <Timeline />
        </section>
      </Reveal>

      <Reveal>
        <section className="section" id="recruiters">
          <div className="section-head">
            <div>
              <h2>Meet the recruiters</h2>
              <p>Hiring teams from every employer on the floor.</p>
            </div>
          </div>
          <RecruiterGrid />
        </section>
      </Reveal>

      <Reveal>
        <section className="section" id="map">
          <div className="section-head">
            <div>
              <h2>Career fair map</h2>
              <p>
                Booth numbers from the booklet — not an official floor plan. Use it to visit each employer once.
              </p>
            </div>
            <Link className="btn-ghost" to="/map">
              Open map
            </Link>
          </div>
          <FloorMap />
        </section>
      </Reveal>

      <section className="cta" id="register">
        <span className="blob blob-a" aria-hidden="true" />
        <span className="blob blob-b" aria-hidden="true" />
        <h2>Ready to find what&apos;s next?</h2>
        <p>
          Tuesday {event.date} · {EVENT_HOURS}
          <br />
          {event.venue}
        </p>
        <a className="btn btn-lime" href={REGISTER_URL} target="_blank" rel="noreferrer">
          Register Now →
        </a>
      </section>
    </main>
  );
}
