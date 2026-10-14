export interface Assessment {
  id: string; claimId: string; claimTextSnapshot: string; evidenceText: string;
  justified: boolean; confidenceScore: number; reasoning: string; evidenceGaps: string[];
  model: string; promptVersion: string; mode: 'demo' | 'live'; createdAt: string;
}
export interface Claim {
  id: string; productName: string; category: string; claimText: string;
  formulaDescription: string; sampleEvidence: string; createdAt: string;
  latestAssessment: Assessment | null; assessmentCount: number; assessments?: Assessment[];
}
export interface Health { status: string; mode: 'demo' | 'live'; model: string; storage: string }
