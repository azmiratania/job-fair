import { Link } from "react-router-dom";
import { fair, pad } from "../lib";
import CompanyLogo from "./CompanyLogo";

export default function FloorMap() {
  return (
    <div className="floor">
      <div className="floor-label">The Exchange · Level 4 · booth numbers from the booklet</div>
      <div className="booths">
        {fair.companies.map((company) => (
          <Link
            key={company.id}
            className={company.jobCount ? "booth-tile" : "booth-tile service"}
            to={`/companies/${company.id}`}
          >
            <CompanyLogo id={company.id} name={company.name} size={36} />
            <span className="num">Booth {pad(company.number)}</span>
            <b>{company.name}</b>
            <span className="muted">{company.jobCount ? `${company.jobCount} open roles` : "Career services"}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
