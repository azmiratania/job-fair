import { Link } from "react-router-dom";
import { fair, pad } from "../lib";

export default function Companies() {
  return (
    <main>
      <p className="kicker">Booklet directory</p>
      <div className="section-head">
        <div>
          <h2>Employers & services</h2>
          <p className="muted">Ten hiring organisations plus e2i career services from the fair booklet.</p>
        </div>
      </div>
      <div className="company-grid">
        {fair.companies.map((company) => (
          <Link className="company-card" key={company.id} to={`/companies/${company.id}`}>
            <span className="num">#{pad(company.number)}</span>
            <h3>{company.name}</h3>
            <p className="muted" style={{ margin: 0 }}>{company.tagline}</p>
            <div className="chips">
              <span className="chip">
                {company.jobCount ? `${company.jobCount} roles` : "Career services"}
              </span>
              <span className="chip">{company.sector}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
