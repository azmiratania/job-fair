import { dayPlan } from "../lib";

export default function Timeline() {
  return (
    <div className="timeline">
      {dayPlan.map((item) => (
        <article className="tl-card" key={item.title}>
          <time>{item.time}</time>
          <div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
