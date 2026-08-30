import { useEffect, useState, type ReactNode } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { REGISTER_URL, fair } from "./lib";
import { ScrollToTop, useShortlist } from "./hooks";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Shortlist from "./pages/Shortlist";
import Schedule, { VisitRedirect } from "./pages/Schedule";
import MapPage from "./pages/Map";
import Faq from "./pages/Faq";

function Layout({ children }: { children: ReactNode }) {
  const { count } = useShortlist();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="shell">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="topbar-wrap">
        <header className="topbar">
          <NavLink to="/" className="brand">
            <span className="brand-mark">e2i</span>
            <span className="brand-text">
              <strong>Career Fair 2026</strong>
              <em>Tech & Accountancy</em>
            </span>
          </NavLink>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
          <nav className={open ? "nav open" : "nav"}>
            <NavLink to="/companies">Companies</NavLink>
            <NavLink to="/jobs">Opportunities</NavLink>
            <NavLink to="/schedule">Schedule</NavLink>
            <NavLink to="/map">Map</NavLink>
            <NavLink to="/faq">FAQ</NavLink>
            <NavLink to="/shortlist" className="nav-saved">
              Saved{count ? <span>{count}</span> : null}
            </NavLink>
            <a className="btn" href={REGISTER_URL} target="_blank" rel="noreferrer">
              Register
            </a>
          </nav>
        </header>
      </div>
      <div id="main">{children}</div>
      <footer className="footer">
        <div>
          <p className="footer-kicker">Organised by</p>
          <p className="footer-name">{fair.event.organizer}</p>
          <p className="footer-note">
            A tripartite initiative of the National Trades Union Congress. Digital companion to the official
            job listing booklet — please still return the printed copy at the exit after your interviews.
          </p>
        </div>
        <div className="footer-links">
          <a href={REGISTER_URL} target="_blank" rel="noreferrer">
            Register for the fair
          </a>
          <a href={fair.event.website} target="_blank" rel="noreferrer">
            e2i.com.sg
          </a>
          <a href="https://www.e2i.com.sg/locate-us/" target="_blank" rel="noreferrer">
            Career centres
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/visit" element={<VisitRedirect />} />
          <Route path="/shortlist" element={<Shortlist />} />
        </Routes>
      </Layout>
    </>
  );
}
