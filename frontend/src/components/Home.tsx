import { Link } from "react-router-dom";
import { useClaims } from "../App";
import {
  ArrowRight,
  ArrowUpRight,
  Beaker,
  Check,
  ClipboardList,
  FlaskConical,
  ShieldCheck,
  Sparkles,
} from "../icons";
import { ErrorBox, Eyebrow } from "./ResuableComponents";

export function Home() {
  const { claims, loading, error, reload } = useClaims();
  const reviewed = claims.filter(
    (c) => c.latestAssessment && !(c.latestAssessment.confidenceScore === 0),
  ).length;
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <Eyebrow>
            <span className="mini-line" /> FROM EVIDENCE TO CONFIDENCE
          </Eyebrow>
          <h1>
            Every claim.
            <br />
            <span className="gradient-text">A clearer perspective.</span>
          </h1>
          <p>
            Bring scientific evidence and product ambition together.
            <br className="desktop-break" /> Evaluate beauty claims with
            clarity, context, and confidence.
          </p>
          <Link className="button primary" to="/evaluate">
            Start an evaluation <ArrowUpRight size={18} />
          </Link>
          <div className="hero-note">
            <ShieldCheck size={15} /> Evidence-led decisions. Human-led
            approval.
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="orb-glow" />
          <div className="lens-core">
            <div className="lens-inner">
              <FlaskConical size={48} strokeWidth={1.1} />
            </div>
          </div>
          <div className="floating-label label-top">
            <span className="tiny-icon">
              <Beaker size={16} />
            </span>{" "}
            Scientific evidence
          </div>
          <div className="floating-label label-bottom">
            <span className="tiny-icon pink">
              <Check size={16} />
            </span>{" "}
            Informed decisions
          </div>
          <span className="visual-caption">
            THE SCIENCE BEHIND THE STATEMENT
          </span>
        </div>
      </section>
      <div className="section-heading">
        <div>
          <Eyebrow>YOUR WORKSPACE</Eyebrow>
          <h2>Where would you like to begin?</h2>
        </div>
        <span className="subtle">One connected review workflow</span>
      </div>
      <section className="workspace-cards">
        <Link to="/claims" className="workspace-card">
          <div className="card-top">
            <span className="icon-tile">
              <ClipboardList size={24} />
            </span>
            <ArrowUpRight size={22} />
          </div>
          <h3>Explore claims</h3>
          <p>
            Find proposed product claims, review their context, and see the
            latest assessment.
          </p>
          <div className="card-bottom">
            <span>
              {loading
                ? "Loading claims"
                : `${claims.length} claims in your library`}
            </span>
            <span className="round-arrow">
              <ArrowRight size={18} />
            </span>
          </div>
        </Link>
        <Link to="/evaluate" className="workspace-card evaluate-card">
          <div className="card-top">
            <span className="icon-tile pink">
              <Sparkles size={24} />
            </span>
            <ArrowUpRight size={22} />
          </div>
          <h3>Evaluate evidence</h3>
          <p>
            Compare study findings with a product claim and discover what the
            evidence supports.
          </p>
          <div className="card-bottom">
            <span>Turn research into a reasoned assessment</span>
            <span className="round-arrow">
              <ArrowRight size={18} />
            </span>
          </div>
        </Link>
      </section>
      {error ? (
        <ErrorBox message={error} retry={reload} />
      ) : (
        <section className="stats-strip">
          <div>
            <span className="stat-number">
              {loading ? "—" : String(claims.length).padStart(2, "0")}
            </span>
            <span>Product claims</span>
          </div>
          <div>
            <span className="stat-number">
              {loading
                ? "—"
                : String(claims.length - reviewed).padStart(2, "0")}
            </span>
            <span>Awaiting review</span>
          </div>
          <div>
            <span className="stat-number">
              {loading ? "—" : String(reviewed).padStart(2, "0")}
            </span>
            <span>Reviewed claims</span>
          </div>
          <div className="stat-context">
            <ShieldCheck size={22} />
            <p>
              Traceable by design
              <small>Evidence, reasoning, and history in one place</small>
            </p>
          </div>
        </section>
      )}
    </>
  );
}
