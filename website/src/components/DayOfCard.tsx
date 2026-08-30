import { Link } from "react-router-dom";
import { EVENT_HOURS, REGISTER_URL, fair, mapsUrl } from "../lib";
import { useShortlist } from "../hooks";

export default function DayOfCard() {
  const { event } = fair;
  const { count } = useShortlist();

  return (
    <section className="day-card" id="today">
      <div>
        <p className="kicker" style={{ marginBottom: 10 }}>
          Tuesday morning
        </p>
        <h2>Show up with a plan.</h2>
        <p className="muted" style={{ margin: "0 0 18px", maxWidth: "46ch" }}>
          {event.day} {event.date} · {EVENT_HOURS}
          <br />
          {event.venue} · Raffles Place MRT · Level 4
        </p>
        <ol className="day-steps">
          <li>Register on e2i before you travel — walk-ins may be limited.</li>
          <li>Alight at Raffles Place. The Exchange is Level 4, Singapore Land Tower.</li>
          <li>Check in, then walk booths in the order on your saved plan.</li>
        </ol>
        <p className="muted" style={{ margin: "0 0 16px" }}>
          Bring IC, a few printed resumes, and this phone. Return the paper booklet at the exit.
        </p>
        <p className="install-note">
          Add this site to your Home Screen so your booth plan still opens in a lift with weak signal. iPhone: Share →
          Add to Home Screen. Android: browser menu → Install app.
        </p>
      </div>
      <div className="day-actions">
        <a className="btn" href={REGISTER_URL} target="_blank" rel="noreferrer">
          Register on e2i
        </a>
        <a className="btn-ghost" href={mapsUrl(event.address)} target="_blank" rel="noreferrer">
          Open in Maps
        </a>
        <Link className="btn btn-lime" to="/shortlist">
          {count ? `Open your booth plan (${count})` : "Open your booth plan"}
        </Link>
      </div>
    </section>
  );
}
