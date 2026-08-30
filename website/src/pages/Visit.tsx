import { fair, mapsUrl } from "../lib";
import { useTitle } from "../hooks";

export default function Visit() {
  useTitle("Visit");
  const { event, centres, hoursNote } = fair;
  return (
    <main>
      <p className="kicker">Plan your day</p>
      <h1 className="serif page-title">{event.name}</h1>
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
          <div className="actions" style={{ marginTop: 16 }}>
            <a className="btn" href={mapsUrl(event.address)} target="_blank" rel="noreferrer">
              Directions
            </a>
            <a className="btn-ghost" href={event.website} target="_blank" rel="noreferrer">
              e2i website
            </a>
          </div>
          <p className="muted" style={{ marginTop: 18 }}>
            {event.about}
          </p>
        </div>
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>Bring this</h2>
          <ul className="checklist">
            <li>IC and a few printed resumes</li>
            <li>Your shortlist, grouped by employer</li>
            <li>Questions for each booth — not a generic pitch</li>
            <li>Return the paper booklet at the exit after interviews</li>
          </ul>
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
            <h3 className="serif" style={{ marginTop: 0 }}>
              {centre.name}
            </h3>
            <p>{centre.address}</p>
            <p className="muted">Nearest MRT: {centre.mrt}</p>
            <a className="btn-ghost" href={mapsUrl(centre.address)} target="_blank" rel="noreferrer">
              Open in Maps
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}
