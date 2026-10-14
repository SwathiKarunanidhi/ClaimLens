import { CheckCircle2, XCircle } from "../icons";
import type { Assessment } from "../types";
import { Eyebrow } from "./ResuableComponents";

export function Result({
  result,
  edited,
}: {
  result: Assessment;
  edited: boolean;
}) {
  const unavailable = result.mode === "demo" && result.confidenceScore === 0;
  return (
    <section className="panel assessment-result">
      <div className="result-top">
        <Eyebrow>ASSESSMENT RESULT</Eyebrow>
        <span className="result-mode">
          {result.mode === "demo" ? "DEMO" : "LIVE AI"}
        </span>
      </div>
      {edited && (
        <div className="stale-note">
          Evidence has changed. This result applies to the previously submitted
          text.
        </div>
      )}
      <div className={`verdict-icon ${result.justified ? "yes" : "no"}`}>
        {result.justified ? <CheckCircle2 size={29} /> : <XCircle size={29} />}
      </div>
      <span className="field-label">JUSTIFIED BY THE SUPPLIED EVIDENCE?</span>
      <h2 className="verdict">
        {unavailable
          ? "Not assessed"
          : result.justified
            ? "Yes, justified."
            : "No, not justified."}
      </h2>
      <div className="confidence-block">
        <div>
          <span>Assessment confidence</span>
          <strong>{unavailable ? "N/A" : `${result.confidenceScore}%`}</strong>
        </div>
        <div className="confidence-track">
          <div style={{ width: `${result.confidenceScore}%` }} />
        </div>
        <small>
          {result.mode === "demo"
            ? "Illustrative demo score; not model-generated."
            : "Model-reported confidence; not a clinical probability."}
        </small>
      </div>
      <div className="reasoning">
        <h3>Why this result?</h3>
        <p>{result.reasoning}</p>
      </div>
      {!!result.evidenceGaps.length && (
        <div className="evidence-gaps">
          <h3>What to consider next</h3>
          <ul>
            {result.evidenceGaps.map((gap, i) => (
              <li key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="assessment-meta">
        <span>
          <CheckCircle2 size={13} /> Saved to assessment history
        </span>
        <small>
          {result.model} · {result.promptVersion}
          <br />
          {new Date(result.createdAt).toLocaleString()}
        </small>
      </div>
    </section>
  );
}
