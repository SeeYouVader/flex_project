"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createCandidate } from "@/lib/api";

export default function NewCandidatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const candidate = await createCandidate({ name, email });
      router.push(`/candidates/${candidate.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create candidate");
      setSubmitting(false);
    }
  }

  return (
    <main>
      <h1>New candidate</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
        </div>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create"}
        </button>
      </form>
    </main>
  );
}
