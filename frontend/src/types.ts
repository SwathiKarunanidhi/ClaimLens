export interface Assessment {
  id: number;
  claimId: number;
  claimTextSnapshot: string;
  evidenceText: string;
  justified: boolean;
  confidenceScore: number;
  reasoning: string;
  evidenceGaps: string[];
  mode: "demo" | "live";
  model: string;
  promptVersion: string;
  createdAt: string;
}
export interface Claim {
  id: number;
  productName: string;
  category: string;
  claimText: string;
  formulaDescription: string;
  evidence: string;
  createdAt: string;
  latestAssessment: Assessment | null;
  assessmentCount: number;
  assessments?: Assessment[];
}
export interface Health {
  status: string;
  mode: "demo" | "live";
  model: string;
  storage: string;
}
