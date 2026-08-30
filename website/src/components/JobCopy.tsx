import { isCopyLabel } from "../lib";

export default function JobCopy({ items, heading }: { items: string[]; heading: string }) {
  if (!items.length) return null;
  return (
    <section className="job-copy">
      <h3 className="serif">{heading}</h3>
      {items.map((item, i) =>
        isCopyLabel(item) ? (
          <p className="copy-label" key={i}>
            {item.replace(/:+$/, "")}
          </p>
        ) : (
          <p key={i}>{item}</p>
        ),
      )}
    </section>
  );
}
