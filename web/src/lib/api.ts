const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type Candidate = {
  id: string;
  name: string;
  email: string;
  stage: string;
  createdAt: string;
  updatedAt: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

export function getHealth() {
  return request("/health");
}

export function listCandidates() {
  return request<Candidate[]>("/candidates");
}

export function getCandidate(id: string) {
  return request<Candidate>(`/candidates/${id}`);
}

export function createCandidate(data: { name: string; email: string; stage?: string }) {
  return request<Candidate>("/candidates", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCandidate(id: string, data: Partial<{ name: string; email: string; stage: string }>) {
  return request<Candidate>(`/candidates/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCandidate(id: string) {
  return request<void>(`/candidates/${id}`, { method: "DELETE" });
}
