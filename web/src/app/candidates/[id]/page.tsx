"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { deleteCandidate, getCandidate, updateCandidate, type Candidate } from "@/lib/api";

export default function CandidatePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCandidate(id)
      .then((found) => {
        setCandidate(found);
        setName(found.name);
        setEmail(found.email);
        setStage(found.stage);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load candidate"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await updateCandidate(id, { name, email, stage });
      setCandidate(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update candidate");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setError(null);
    try {
      await deleteCandidate(id);
      router.push("/candidates");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete candidate");
    }
  }

  if (loading) {
    return <main>Loading...</main>;
  }

  if (!candidate) {
    return <main>{error ?? "Candidate not found"}</main>;
  }

  return (
    <main>
      <h1>{candidate.name}</h1>
      <form onSubmit={handleSave}>
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
        <div>
          <label>
            Stage
            <input value={stage} onChange={(event) => setStage(event.target.value)} />
          </label>
        </div>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
      <button type="button" onClick={handleDelete}>
        Delete
      </button>
    </main>
  );
}
