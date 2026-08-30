import { fair, mapsUrl } from "../lib";
import { useTitle } from "../hooks";
import FloorMap from "../components/FloorMap";
import DayOfCard from "../components/DayOfCard";

export default function MapPage() {
  useTitle("Map");
  const { event, centres, hoursNote } = fair;
  return (
    <main>
      <p className="kicker">The Exchange · Level 4</p>
      <div className="section-head">
        <div>
          <h1 className="page-title">Career fair map</h1>
          <p className="muted" style={{ maxWidth: "52ch" }}>
            Booth numbers match the printed job listing booklet. This is a wayfinding companion — not an
            official architectural floor plan.
          </p>
        </div>
        <a className="btn-ghost" href={mapsUrl(event.address)} target="_blank" rel="noreferrer">
          Directions
        </a>
      </div>
      <DayOfCard />
      <div className="section-head" style={{ marginTop: 36 }}>
        <div>
          <h2>Booths</h2>
          <p>Numbers match the printed booklet.</p>
        </div>
      </div>
      <FloorMap />
      <p className="muted" style={{ marginTop: 18 }}>
        {event.venue} · {event.address} · MRT: Raffles Place
      </p>

      <div className="section-head" style={{ marginTop: 48 }}>
        <div>
          <h2>e2i career centres</h2>
          <p>{hoursNote}</p>
        </div>
      </div>
      <div className="centre-grid">
        {centres.map((centre) => (
          <article className="panel" key={centre.name}>
            <h3 style={{ marginTop: 0, fontSize: 22 }}>{centre.name}</h3>
            <p>{centre.address}</p>
            <p className="muted">Nearest MRT: {centre.mrt}</p>
            <a className="btn-ghost" href={mapsUrl(centre.address)} target="_blank" rel="noreferrer">
              Open in Maps
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}
