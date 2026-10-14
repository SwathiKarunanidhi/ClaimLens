import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  XCircle,
} from "../icons";
import type { Assessment } from "../types";

export function ErrorBox({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="error-box" role="alert">
      <XCircle size={19} />
      <div>
        {message}
        {retry && (
          <button className="text-button" onClick={retry}>
            Try again <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export function Loading() {
  return (
    <div className="loading">
      <LoaderCircle className="spin" size={22} /> Loading your workspace…
    </div>
  );
}

export function Badge({ assessment }: { assessment?: Assessment | null }) {
  if (!assessment)
    return (
      <span className="badge pending">
        <Clock3 size={12} /> Awaiting review
      </span>
    );
  if (assessment.mode === "demo" && assessment.confidenceScore === 0)
    return <span className="badge pending">Demo unavailable</span>;
  return (
    <span
      className={`badge ${assessment.justified ? "supported" : "unsupported"}`}
    >
      {assessment.justified ? (
        <CheckCircle2 size={12} />
      ) : (
        <XCircle size={12} />
      )}{" "}
      {assessment.justified ? "Justified" : "Not justified"}
      {assessment.mode === "demo" && (
        <span className="demo-suffix"> · Demo</span>
      )}
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}
