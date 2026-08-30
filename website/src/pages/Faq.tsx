import { REGISTER_URL, faqs } from "../lib";
import { useTitle } from "../hooks";

export default function Faq() {
  useTitle("FAQ");
  return (
    <main>
      <p className="kicker">Before you go</p>
      <div className="section-head">
        <div>
          <h1 className="page-title">FAQ</h1>
          <p className="muted" style={{ maxWidth: "48ch" }}>
            Practical answers for the day. Registration still happens on e2i.
          </p>
        </div>
        <a className="btn" href={REGISTER_URL} target="_blank" rel="noreferrer">
          Register
        </a>
      </div>
      <div className="faq-list">
        {faqs.map((item) => (
          <article className="faq-item" key={item.q}>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
