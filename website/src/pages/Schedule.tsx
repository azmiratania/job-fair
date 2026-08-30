import { Navigate } from "react-router-dom";
import { EVENT_HOURS, fair } from "../lib";
import { useTitle } from "../hooks";
import Reveal from "../components/Reveal";
import Timeline from "../components/Timeline";

export default function Schedule() {
  useTitle("Schedule");
  const { event } = fair;
  return (
    <main>
      <p className="kicker">
        {event.day} · {event.date} · {EVENT_HOURS}
      </p>
      <div className="section-head">
        <div>
          <h1 className="page-title">Event schedule</h1>
          <p className="muted" style={{ maxWidth: "52ch" }}>
            The fair is an open floor from 10:00 AM to 4:00 PM. There is no published speaker timetable — plan
            around booths, coaching, and SkillsFuture conversations.
          </p>
        </div>
      </div>
      <Reveal>
        <Timeline />
      </Reveal>
    </main>
  );
}

export function VisitRedirect() {
  return <Navigate to="/map" replace />;
}
