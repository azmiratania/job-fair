import { fair } from "../lib";
import { useTitle } from "../hooks";
import CompanyCard from "../components/CompanyCard";
import RecruiterGrid from "../components/RecruiterGrid";

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
      <div className="section-head" style={{ marginTop: 48 }}>
        <div>
          <h2>Meet the recruiters</h2>
          <p className="muted">Hiring teams on the floor — names are not listed in the booklet.</p>
        </div>
      </div>
      <RecruiterGrid />
    </main>
  );
}
