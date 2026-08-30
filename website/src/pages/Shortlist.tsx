import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { fair, readShortlist, toggleShortlist } from "../lib";
import JobCard from "../components/JobCard";

export default function Shortlist() {
  const [tick, bump] = useState(0);
  const jobs = useMemo(() => {
    const ids = new Set(readShortlist());
    return fair.jobs.filter((job) => ids.has(job.id));
  }, [tick]);

  return (
    <main>
      <p className="kicker">Your booth plan</p>
      <div className="section-head">
        <div>
          <h2>Shortlist</h2>
          <p className="muted">Saved on this device only — handy for walking the fair floor.</p>
        </div>
        <Link to="/jobs">Add more roles</Link>
      </div>
      {jobs.length === 0 ? (
        <div className="empty">
          Nothing saved yet. Open a role and tap “Save to shortlist”.
        </div>
      ) : (
        <>
          <div className="job-grid">
            {jobs.map((job) => (
              <div key={job.id}>
                <JobCard job={job} />
                <button
                  className="btn-ghost"
                  style={{ marginTop: 8 }}
                  type="button"
                  onClick={() => {
                    toggleShortlist(job.id);
                    bump((n) => n + 1);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
