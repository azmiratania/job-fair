import { useState } from "react";
import { Link } from "react-router-dom";
import { fair, groupJobsByCompany, pad, shareShortlistText, whatsappHref, writeShortlist } from "../lib";
import { useShortlist, useTitle } from "../hooks";
import ApplyButton from "../components/ApplyButton";
import AskList from "../components/AskList";
import CompanyLogo from "../components/CompanyLogo";

export default function Shortlist() {
  useTitle("Booth plan");
  const { ids, count } = useShortlist();
  const jobs = fair.jobs.filter((job) => ids.includes(job.id));
  const groups = groupJobsByCompany(jobs);
  const text = shareShortlistText(jobs);
  const [copied, setCopied] = useState(false);

  async function copyPlan() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function sharePlan() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "e2i Career Fair booth plan", text });
        return;
      } catch {
        /* user cancelled or share failed — fall through to copy */
      }
    }
    await copyPlan();
  }

  return (
    <main>
      <p className="kicker">Tuesday on the floor</p>
      <div className="section-head">
        <div>
          <h1 className="page-title">Your booth plan</h1>
          <p className="muted">
            {count
              ? `${count} role${count === 1 ? "" : "s"} · ${groups.length} booth${groups.length === 1 ? "" : "s"}. Visit each employer once.`
              : "Save roles while you browse. This plan stays on this phone until you clear it."}
          </p>
        </div>
        {count ? (
          <div className="actions no-print">
            <button className="btn btn-lime" type="button" onClick={sharePlan}>
              Share
            </button>
            <button className="btn-ghost" type="button" onClick={copyPlan}>
              {copied ? "Copied" : "Copy plan"}
            </button>
            <a className="btn-ghost" href={whatsappHref(text)} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <button className="btn-ghost" type="button" onClick={() => window.print()}>
              Print
            </button>
            <button className="btn-ghost" type="button" onClick={() => writeShortlist([])}>
              Clear
            </button>
          </div>
        ) : (
          <Link className="btn" to="/jobs">
            Add roles
          </Link>
        )}
      </div>
      {jobs.length === 0 ? (
        <div className="empty">
          <p>Nothing saved yet. Tap Save on any role, then come back here for booth order and questions.</p>
          <Link className="btn" to="/jobs">
            Browse roles
          </Link>
        </div>
      ) : (
        <div className="booth-list">
          {groups.map((group) => (
            <article className="plan-card" key={group.company?.id ?? "other"}>
              <header className="plan-head">
                {group.company ? <CompanyLogo id={group.company.id} name={group.company.name} size={48} /> : null}
                <div>
                  <span className="num">Booth {pad(group.company?.number ?? 0)}</span>
                  <h3>{group.company?.name}</h3>
                </div>
                <Link className="btn-ghost no-print" to={`/companies/${group.company?.id}`}>
                  All roles
                </Link>
              </header>
              <ul className="plan-roles">
                {group.jobs.map((job) => (
                  <li key={job.id}>
                    <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    <span className="muted">{job.category}</span>
                    <ApplyButton job={job} />
                  </li>
                ))}
              </ul>
              {group.company ? <AskList companyId={group.company.id} /> : null}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
