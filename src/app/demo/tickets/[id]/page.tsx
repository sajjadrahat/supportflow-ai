import Link from "next/link";
import { notFound } from "next/navigation";
import { getTicket } from "@/data/seed";
import { Disclaimer } from "@/components/disclaimer";
import { TicketWorkspace } from "@/components/ticket-workspace";

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = getTicket(id);
  if (!ticket) notFound();

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <Link href="/demo" className="text-sm font-medium text-[#305b9d] hover:underline">&larr; Back to ticket inbox</Link>
      <div className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#305b9d]">Analysis Workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{ticket.id}</h1>
        </div>
        <div className="md:max-w-lg"><Disclaimer /></div>
      </div>
      <TicketWorkspace ticket={ticket} />
    </main>
  );
}
