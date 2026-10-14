import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api";
import { useClaims } from "../App";
import {
  ArrowRight,
  Beaker,
  Check,
  ChevronRight,
  FlaskConical,
  History,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "../icons";
import type { Assessment, Health } from "../types";
import { Badge, ErrorBox, Eyebrow, Loading } from "./ResuableComponents";
import { Result } from "./Results";

export function Evaluation({ health }: { health: Health | null }) {
  const { claims, loading, error, reload } = useClaims();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("claimId") || "";
  const selected = claims.find((c) => c.id === selectedId);
  const [evidence, setEvidence] = useState("");
  const [result, setResult] = useState<Assessment | null>(null);
  const [history, setHistory] = useState<Assessment[]>([]);
  const [busy, setBusy] = useState(false);
  const [runError, setRunError] = useState("");
  const [detailError, setDetailError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let active = true;
    setResult(null);
    setRunError("");
    setDetailError("");
    setHistory([]);
    const claim = claims.find((c) => c.id === selectedId);
    setEvidence(claim?.evidence || "");
    if (claim)
      api
        .claim(claim.id)
        .then((c) => {
          if (active) {
            setHistory(c.assessments || []);
            setResult(c.assessments?.[0] || null);
          }
        })
        .catch((e) => {
          if (active) setDetailError(e.message);
        });
    return () => {
      active = false;
    };
  }, [selectedId, claims]);

  async function evaluate() {
    if (!selected || busy) return;
    setBusy(true);
    setRunError("");
    setResult(null);
    try {
      const assessment = await api.assess(
        selected.id,
        selected.claimText,
        evidence.trim(),
      );
      setResult(assessment);
      setHistory((previous) => [assessment, ...previous]);
      setTimeout(
        () =>
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        100,
      );
    } catch (e) {
      setRunError(e instanceof Error ? e.message : "Assessment failed.");
    } finally {
      setBusy(false);
    }
  }
  const edited = !!result && result.evidenceText !== evidence.trim();
  return (
    <>
      <div className="breadcrumb">
        <Link to="/claims">Claims</Link>
        <ChevronRight size={13} />
        <span>Evidence evaluation</span>
      </div>
      <div className="page-heading evaluation-heading">
        <div>
          <Eyebrow>LOOK BEYOND THE CLAIM</Eyebrow>
          <h1>
            Let the evidence speak<span className="pink-period">.</span>
          </h1>
          <p>A thoughtful assessment starts with the right context.</p>
        </div>
        <span className="step-indicator">
          <i /> Scientific review
        </span>
      </div>

      {health?.mode === "demo" && (
        <div className="demo-banner">
          <Sparkles size={17} />
          <p>
            <strong>Demo mode</strong> · Predefined results for the supplied
            examples. Custom evidence requires live mode.
          </p>
          <span>NO API KEY NEEDED</span>
        </div>
      )}
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorBox message={error} retry={reload} />
      ) : (
        <div className="evaluation-grid">
          <div className="evaluation-inputs">
            <section className="panel">
              <div className="panel-heading">
                <span className="step-number">01</span>
                <div>
                  <h2>Select a claim</h2>
                  <p>The product promise you want to evaluate</p>
                </div>
              </div>
              <label className="field-label" htmlFor="claim-select">
                PRODUCT CLAIM
              </label>
              <select
                id="claim-select"
                disabled={busy}
                value={selectedId}
                onChange={(e) =>
                  setParams(e.target.value ? { claimId: e.target.value } : {})
                }
              >
                <option value="">Choose a product claim…</option>
                {claims.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.productName} — {c.claimText}
                  </option>
                ))}
              </select>
              {selectedId && !selected && (
                <ErrorBox message="This claim does not exist. Choose a claim from the list." />
              )}
              {selected && (
                <div className="selected-claim">
                  <div>
                    <span className="category">{selected.category}</span>
                    <span className="subtle">{selected.id.toUpperCase()}</span>
                  </div>
                  <h3>“{selected.claimText}”</h3>
                  <p>
                    <FlaskConical size={15} />
                    {selected.formulaDescription}
                  </p>
                </div>
              )}
            </section>
            <section className="panel">
              <div className="panel-heading">
                <span className="step-number">02</span>
                <div>
                  <h2>Add study evidence</h2>
                  <p>Include methods, endpoints, results, and limitations</p>
                </div>
                <Beaker size={21} />
              </div>
              <div className="evidence-label">
                <label className="field-label" htmlFor="evidence">
                  CLINICAL OR INSTRUMENTAL STUDY
                </label>
                <button
                  className="text-button"
                  disabled={!selected || busy}
                  onClick={() => {
                    setEvidence(selected?.evidence || "");
                    setRunError("");
                  }}
                >
                  Restore example
                </button>
              </div>
              <textarea
                id="evidence"
                disabled={!selected || busy}
                value={evidence}
                maxLength={20000}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="Select a claim to load fictional study evidence, or paste your own study summary in live mode."
              />
              <div className="textarea-note">
                <span>Minimum 30 characters · Plain text</span>
                <span>{evidence.length.toLocaleString()} / 20,000</span>
              </div>
              <div className="input-note">
                <ShieldCheck size={15} />
                <span>
                  Provide study summaries without personal participant
                  information.
                </span>
              </div>
              {runError && <ErrorBox message={runError} />}
              <button
                className="button primary full-width"
                onClick={evaluate}
                disabled={!selected || evidence.trim().length < 30 || busy}
              >
                {busy ? (
                  <>
                    <LoaderCircle size={18} className="spin" /> Evaluating the
                    evidence…
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    {health?.mode === "demo" ? "Run demo assessment" : "Evaluate evidence"}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
              <p className="action-caption">
                {health?.mode === "demo" ? "Demo output is saved and labelled. No AI call is made." : "AI recommendation saved for human review."}
              </p>
            </section>
          </div>
          <aside className="result-column" ref={resultRef} aria-live="polite">
            {busy ? (
              <section className="panel result-placeholder">
                <div className="placeholder-icon">
                  <LoaderCircle size={31} className="spin" />
                </div>
                <Eyebrow>REVIEW IN PROGRESS</Eyebrow>
                <h2>Connecting the dots.</h2>
                <p>
                  Comparing the claim with the supplied evidence.
                  <br />
                  Your assessment will appear here.
                </p>
              </section>
            ) : result ? (
              <Result result={result} edited={edited} />
            ) : (
              <section className="panel result-placeholder">
                <div className="placeholder-icon">
                  <Sparkles size={31} strokeWidth={1.3} />
                </div>
                <Eyebrow>A CLEARER PERSPECTIVE AWAITS</Eyebrow>
                <h2>
                  From findings
                  <br />
                  to understanding.
                </h2>
                <p>
                  Select a claim and add study evidence to see the verdict,
                  confidence, and reasoning.
                </p>
                <div className="result-checklist">
                  <span>
                    <Check size={14} /> Claim justification
                  </span>
                  <span>
                    <Check size={14} /> Model confidence
                  </span>
                  <span>
                    <Check size={14} /> Reasoning & evidence gaps
                  </span>
                </div>
              </section>
            )}
            {detailError && <ErrorBox message={detailError} />}
            {!!history.length && (
              <section className="panel history-panel">
                <h2>
                  <History size={17} /> Assessment history{" "}
                  <span>{history.length}</span>
                </h2>
                {history.map((a) => (
                  <button
                    disabled={busy}
                    key={a.id}
                    className={`history-item ${result?.id === a.id ? "active" : ""}`}
                    onClick={() => {
                      setResult(a);
                      setEvidence(a.evidenceText);
                    }}
                  >
                    <div>
                      <Badge assessment={a} />
                      <small>{new Date(a.createdAt).toLocaleString()}</small>
                    </div>
                    <ChevronRight size={15} />
                  </button>
                ))}
              </section>
            )}
            <div className="review-note">
              <ShieldCheck size={19} />
              <p>
                <strong>Support for your judgment.</strong> Assessments assist
                scientific review. A qualified evaluator makes the final
                decision.
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
