import Link from "next/link";
import { listCandidates } from "@/lib/api";

export default async function CandidatesPage() {
  const candidates = await listCandidates();

  return (
    <main>
      <h1>Candidates</h1>
      <p>
        <Link href="/candidates/new">New candidate</Link>
      </p>
      {candidates.length === 0 ? (
        <p>No candidates yet.</p>
      ) : (
        <ul>
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              <Link href={`/candidates/${candidate.id}`}>{candidate.name}</Link>
              {" — "}
              {candidate.email} ({candidate.stage})
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
