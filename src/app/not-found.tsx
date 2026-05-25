import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-sm font-semibold text-[#305b9d]">NOT FOUND</p>
      <h1 className="mt-4 text-3xl font-semibold">This demo item does not exist.</h1>
      <p className="mt-3 text-slate-600">Only fictional seeded tickets and documentation are available in this public demonstration.</p>
      <Link href="/demo" className="mt-8 inline-flex rounded-lg bg-[#142c54] px-5 py-3 font-medium text-white">Return to inbox</Link>
    </main>
  );
}
