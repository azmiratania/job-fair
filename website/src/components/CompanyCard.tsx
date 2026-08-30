import { Link } from "react-router-dom";
import type { Company } from "../types";
import { pad } from "../lib";
import CompanyLogo from "./CompanyLogo";

export default function CompanyCard({ company }: { company: Company }) {
  return (
    <Link className="company-card" to={`/companies/${company.id}`}>
      <div className="company-card-top">
        <CompanyLogo id={company.id} name={company.name} />
        <span className="num">#{pad(company.number)}</span>
      </div>
      <h3>{company.name}</h3>
      <p className="muted" style={{ margin: 0 }}>
        {company.tagline}
      </p>
      <div className="chips">
        <span className="chip">{company.jobCount ? `${company.jobCount} open roles` : "Career services"}</span>
        <span className="chip">{company.sector}</span>
      </div>
      <span className="btn-ghost">View opportunities</span>
    </Link>
  );
}
