import { fair } from "../lib";

export default function Visit() {
  const { event, centres, hoursNote } = fair;
  return (
    <main>
      <p className="kicker">Plan your day</p>
      <h1 className="serif" style={{ fontSize: "clamp(36px, 5vw, 56px)", marginTop: 0 }}>
        {event.name}
      </h1>
      <div className="job-layout">
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>Fair details</h2>
          <dl className="side-meta">
            <dt>Date</dt>
            <dd>
              {event.day}, {event.date}
            </dd>
            <dt>Venue</dt>
            <dd>{event.venue}</dd>
            <dt>Address</dt>
            <dd>{event.address}</dd>
            <dt>Nearest MRT</dt>
            <dd>Raffles Place</dd>
          </dl>
          <p>{event.about}</p>
          <p>
            <a className="btn" href={event.website} target="_blank" rel="noreferrer">
              e2i website
            </a>
          </p>
        </div>
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>How to use this site</h2>
          <ol className="bullets">
            <li>Search roles by skill, employer, or location before you arrive.</li>
            <li>Save a shortlist so you know which booths to visit first.</li>
            <li>Bring copies of your resume and questions for each role.</li>
            <li>Return the printed booklet at the exit after interviews.</li>
          </ol>
        </div>
      </div>

      <div className="section-head" style={{ marginTop: 32 }}>
        <div>
          <h2>e2i career centres</h2>
          <p className="muted">{hoursNote}</p>
        </div>
      </div>
      <div className="centre-grid">
        {centres.map((centre) => (
          <article className="panel" key={centre.name}>
            <h3 className="serif" style={{ marginTop: 0 }}>{centre.name}</h3>
            <p>{centre.address}</p>
            <p className="muted">Nearest MRT: {centre.mrt}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
