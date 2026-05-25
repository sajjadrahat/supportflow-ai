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
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <Link href="/demo" className="text-sm font-semibold text-[#15715f] hover:underline">&larr; Return to queue</Link>
      <div className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Case workspace</p>
          <h1 className="display mt-3 text-5xl">{ticket.id}</h1>
        </div>
        <div className="md:max-w-lg"><Disclaimer /></div>
      </div>
      <TicketWorkspace ticket={ticket} />
    </main>
  );
}
