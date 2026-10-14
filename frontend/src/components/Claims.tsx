import { useState } from "react";
import { Link } from "react-router-dom";
import { useClaims } from "../App";
import { ArrowUpRight, Beaker, FlaskConical, Search, Sparkles } from "../icons";
import { Badge, ErrorBox, Eyebrow, Loading } from "./ResuableComponents";

export function Claims() {
  const { claims, loading, error, reload } = useClaims();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All claims");
  const filtered = claims.filter(
    (c) =>
      `${c.productName} ${c.claimText} ${c.category}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === "All claims" ||
        (filter === "Awaiting review"
          ? !c.latestAssessment || c.latestAssessment.confidenceScore === 0
          : filter === "Justified"
            ? c.latestAssessment?.justified
            : c.latestAssessment &&
              c.latestAssessment.confidenceScore > 0 &&
              !c.latestAssessment.justified)),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <Eyebrow>THE CLAIM LIBRARY</Eyebrow>
          <h1>
            Claims, in focus<span className="pink-period">.</span>
          </h1>
          <p>Explore product promises and the evidence behind them.</p>
        </div>
        <Link to="/evaluate" className="button primary">
          <Sparkles size={17} /> Evaluate a claim
        </Link>
      </div>
      <div className="library-toolbar">
        <div className="filter-tabs">
          {["All claims", "Awaiting review", "Justified", "Not justified"].map(
            (f) => (
              <button
                className={filter === f ? "selected" : ""}
                key={f}
                onClick={() => setFilter(f)}
              >
                {f}
                {f === "All claims" && <span>{claims.length}</span>}
              </button>
            ),
          )}
        </div>
        <label className="search-field">
          <Search size={17} />
          <input
            aria-label="Search claims"
            placeholder="Search product or claim…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorBox message={error} retry={reload} />
      ) : (
        <section className="claim-list">
          <div className="list-header">
            <span>PRODUCT & CLAIM</span>
            <span>CATEGORY</span>
            <span>LATEST ASSESSMENT</span>
            <span />
          </div>
          {filtered.map((claim, index) => (
            <article key={claim.id} className="claim-row">
              <div className="product-cell">
                <span className={`product-icon product-${index % 3}`}>
                  <FlaskConical size={23} strokeWidth={1.5} />
                </span>
                <div>
                  <h3>{claim.productName}</h3>
                  <p>“{claim.claimText}”</p>
                  <small>
                    {claim.id.replace("clm-", "CL-").toUpperCase()} ·{" "}
                    {claim.assessmentCount} assessment
                    {claim.assessmentCount !== 1 ? "s" : ""}
                  </small>
                </div>
              </div>
              <span className="category">{claim.category}</span>
              <Badge assessment={claim.latestAssessment} />
              <Link
                className="button secondary compact"
                to={`/evaluate?claimId=${claim.id}`}
              >
                Evaluate <ArrowUpRight size={15} />
              </Link>
            </article>
          ))}
          {!filtered.length && (
            <div className="empty">
              <Search size={30} />
              <h3>No matching claims</h3>
              <p>Try another search or assessment filter.</p>
            </div>
          )}
        </section>
      )}
      <div className="info-note">
        <Beaker size={17} />
        <p>
          All products, formulations, and study findings in this workspace are
          fictional examples for demonstration.
        </p>
      </div>
    </>
  );
}
