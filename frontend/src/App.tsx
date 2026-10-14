import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { api } from "./api";
import { Layers3 } from "./icons";
import type { Claim, Health } from "./types";
import { Home } from "./components/Home";
import { Claims } from "./components/Claims";
import { Evaluation } from "./components/Evaluation";

export function useClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reload = useCallback(() => {
    setLoading(true);
    setError("");
    api
      .claims()
      .then(setClaims)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(reload, [reload]);
  return { claims, loading, error, reload };
}

export function App() {
  const [health, setHealth] = useState<Health | null>(null);
  useEffect(() => {
    api
      .health()
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="nav-wrap">
          <Link className="brand" to="/">
            <span className="brand-icon">
              <Layers3 size={23} />
            </span>
            <span>
              claim<span className="brand-light">lens</span>
              <small>CLAIMS INTELLIGENCE STUDIO</small>
            </span>
          </Link>
          <nav aria-label="Main navigation">
            <NavLink to="/" end>
              Overview
            </NavLink>
            <NavLink to="/claims">Claims</NavLink>
            <NavLink to="/evaluate">Evaluate</NavLink>
          </nav>
          <span className="environment">
            <i className={health ? "online" : ""} />
            {health
              ? health.mode === "live"
                ? "Live AI mode"
                : "Demo workspace"
              : "Connecting to API"}
          </span>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/evaluate" element={<Evaluation health={health} />} />
          <Route
            path="*"
            element={
              <div className="empty">
                <h1>Page not found</h1>
                <Link className="button primary" to="/">
                  Back to overview
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
      <footer>
        <span>
          <span className="footer-dot" /> ClaimLens · Research & innovation
        </span>
        <span>
          Assessment prototype <span className="footer-divider">/</span> Human
          review remains essential
        </span>
      </footer>
    </div>
  );
}
