import { questionsForCompany } from "../lib";

export default function AskList({
  companyId,
  className = "",
}: {
  companyId: string;
  className?: string;
}) {
  return (
    <div className={`ask-block ${className}`}>
      <h4>Ask at this booth</h4>
      <ol className="ask-list">
        {questionsForCompany(companyId).map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ol>
    </div>
  );
}
