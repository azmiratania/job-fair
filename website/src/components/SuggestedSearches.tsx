import { Link } from "react-router-dom";
import { suggestedSearches } from "../lib";

export default function SuggestedSearches({
  active,
  onPick,
}: {
  active?: string;
  onPick?: (term: string) => void;
}) {
  return (
    <div className="chip-row" aria-label="Suggested searches">
      {suggestedSearches.map((term) =>
        onPick ? (
          <button
            type="button"
            key={term}
            className={active?.toLowerCase() === term.toLowerCase() ? "chip-link on" : "chip-link"}
            onClick={() => onPick(term)}
          >
            {term}
          </button>
        ) : (
          <Link className="chip-link" key={term} to={`/jobs?q=${encodeURIComponent(term)}`}>
            {term}
          </Link>
        ),
      )}
    </div>
  );
}
