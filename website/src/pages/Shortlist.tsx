import { Link } from "react-router-dom";
import { fair, groupJobsByCompany, pad, writeShortlist } from "../lib";
import { useShortlist, useTitle } from "../hooks";
import JobCard from "../components/JobCard";

export default function Shortlist() {
  useTitle("Shortlist");
  const { ids, count } = useShortlist();
  const jobs = fair.jobs.filter((job) => ids.includes(job.id));
  const groups = groupJobsByCompany(jobs);

  return (
    <main>
      <p className="kicker">Your booth plan</p>
      <div className="section-head">
        <div>
          <h2>Shortlist</h2>
          <p className="muted">
            {count
              ? `${count} role${count === 1 ? "" : "s"} grouped by employer — visit each booth once.`
              : "Saved on this device only. Handy while you walk the floor."}
          </p>
        </div>
        <div className="actions">
          {count ? (
            <>
              <button className="btn-ghost no-print" type="button" onClick={() => window.print()}>
                Print plan
              </button>
              <button className="btn-ghost no-print" type="button" onClick={() => writeShortlist([])}>
                Clear all
              </button>
            </>
          ) : (
            <Link to="/jobs">Add roles</Link>
          )}
        </div>
      </div>
      {jobs.length === 0 ? (
        <div className="empty">
          <p>Nothing saved yet. Tap Save on any role to build a booth order.</p>
          <Link className="btn" to="/jobs">
            Browse roles
          </Link>
        </div>
      ) : (
        <div className="booth-list">
          {groups.map((group) => (
            <section className="booth" key={group.company?.id ?? "other"}>
              <header className="booth-head">
                <span className="num">#{pad(group.company?.number ?? 0)}</span>
                <div>
                  <h3 className="serif">{group.company?.name}</h3>
                  <p className="muted">
                    {group.jobs.length} saved role{group.jobs.length === 1 ? "" : "s"}
                  </p>
                </div>
                <Link className="no-print" to={`/companies/${group.company?.id}`}>
                  All roles
                </Link>
              </header>
              <div className="job-grid">
                {group.jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
