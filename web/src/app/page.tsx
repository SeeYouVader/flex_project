import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>flex_project</h1>
      <p>Sample ATS for full-cycle candidate tracking.</p>
      <p>
        <Link href="/candidates">View candidates</Link>
      </p>
    </main>
  );
}
