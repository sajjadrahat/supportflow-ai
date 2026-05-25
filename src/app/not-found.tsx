import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="eyebrow">Not found</p>
      <h1 className="display mt-5 text-5xl">No case here.</h1>
      <p className="mt-5 text-[#59645f]">Only fictional seeded tickets and documentation are available in this public demonstration.</p>
      <Link href="/demo" className="btn-primary mt-9">Return to queue</Link>
    </main>
  );
}
