import { NavLink, Route, Routes } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { fair, readShortlist } from "./lib";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Visit from "./pages/Visit";
import Shortlist from "./pages/Shortlist";

function useShortlistCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const sync = () => setCount(readShortlist().length);
    sync();
    window.addEventListener("shortlist-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("shortlist-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return count;
}

function Layout({ children }: { children: ReactNode }) {
  const saved = useShortlistCount();
  return (
    <div className="shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark">e2i</span>
          <span className="brand-text">
            <strong>Talent Career Fair</strong>
            <em>Tech & Accountancy · 2026</em>
          </span>
        </NavLink>
        <nav className="nav">
          <NavLink to="/jobs">Roles</NavLink>
          <NavLink to="/companies">Employers</NavLink>
          <NavLink to="/visit">Visit</NavLink>
          <NavLink to="/shortlist" className="nav-saved">
            Shortlist{saved ? <span>{saved}</span> : null}
          </NavLink>
        </nav>
      </header>
      {children}
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
          <a href={fair.event.website} target="_blank" rel="noreferrer">
            e2i.com.sg
          </a>
          <a href="https://www.e2i.com.sg/locate-us/" target="_blank" rel="noreferrer">
            Career centres
          </a>
          <a href="https://www.e2i.com.sg/JSCTelegram/PMET" target="_blank" rel="noreferrer">
            PMET job alerts
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />
        <Route path="/visit" element={<Visit />} />
        <Route path="/shortlist" element={<Shortlist />} />
      </Routes>
    </Layout>
  );
}
