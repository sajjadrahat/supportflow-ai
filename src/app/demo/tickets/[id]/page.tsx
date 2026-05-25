import Link from "next/link";
import { notFound } from "next/navigation";
import { getTicket } from "@/data/seed";
import { Disclaimer } from "@/components/disclaimer";
import { TicketWorkspace } from "@/components/ticket-workspace";
import { ConsoleShell } from "@/components/console-shell";

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = getTicket(id);
  if (!ticket) notFound();

  return (
    <ConsoleShell
      title={`Case ${ticket.id}`}
      description="Review the customer message, grounded analysis and recommended action."
      action={<Link href="/demo" className="btn-secondary">&larr; Inbox</Link>}
    >
      <div className="mb-5"><Disclaimer /></div>
      <TicketWorkspace ticket={ticket} />
    </ConsoleShell>
  );
}
