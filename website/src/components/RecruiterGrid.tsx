import { Link } from "react-router-dom";
import { hiringCompanies, pad } from "../lib";
import CompanyLogo from "./CompanyLogo";

export default function RecruiterGrid() {
  return (
    <>
      <p className="muted" style={{ margin: "0 0 18px", maxWidth: "52ch" }}>
        Recruiter names are not listed in the booklet. Look for each hiring team at their numbered booth —
        they are the people who can move your application forward on the day.
      </p>
      <div className="people-grid">
        {hiringCompanies.map((company) => (
          <article className="person-card" key={company.id}>
            <CompanyLogo id={company.id} name={company.name} size={56} />
            <h3 style={{ margin: 0, fontSize: 20 }}>{company.name}</h3>
            <p>Hiring team on the floor</p>
            <div className="chips">
              <span className="chip">Booth {pad(company.number)}</span>
              <span className="chip">{company.sector}</span>
            </div>
            <Link className="btn-ghost" to={`/companies/${company.id}`}>
              Meet at booth {pad(company.number)}
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
