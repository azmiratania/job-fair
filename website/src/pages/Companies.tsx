import { fair } from "../lib";
import { useTitle } from "../hooks";
import CompanyCard from "../components/CompanyCard";

export default function Companies() {
  useTitle("Companies");
  return (
    <main>
      <p className="kicker">Booklet directory</p>
      <div className="section-head">
        <div>
          <h1 className="page-title">Featured companies</h1>
          <p className="muted">Ten hiring organisations plus e2i career services from the fair booklet.</p>
        </div>
      </div>
      <div className="company-grid">
        {fair.companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </main>
  );
}
