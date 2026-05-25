import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-sm font-medium text-[#2193f8]">Not found</p>
      <h1 className="display mt-5 text-4xl text-slate-950">This item does not exist.</h1>
      <p className="mt-5 text-slate-600">Only fictional seeded tickets and documentation are available in this public demonstration.</p>
      <Link href="/demo" className="btn-primary mt-9">Return to queue</Link>
    </main>
  );
}
