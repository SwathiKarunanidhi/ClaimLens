import type { Assessment, Claim, Health } from "./types";
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`/api${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        Array.isArray(data.message)
          ? data.message.join(" · ")
          : data.message || "Request failed.",
      );
    return data;
  } catch (error) {
    throw error;
  }
}
export const api = {
  health: () => request<Health>("/health"),
  claims: () => request<Claim[]>("/claims"),
  claim: (id: number) => request<Claim>(`/claims/${encodeURIComponent(id)}`),
  assess: (claimId: number, claim: string, evidence: string) =>
    request<Assessment>("/claims/assess", {
      method: "POST",
      body: JSON.stringify({ claimId, claim, evidence }),
    }),
};
