import { tickets } from "@/data/seed";
import { TicketInbox } from "@/components/ticket-inbox";
import { Disclaimer } from "@/components/disclaimer";

export default function DemoInbox() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#305b9d]">SecureDesk Demo</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Ticket Inbox</h1>
          <p className="mt-2 text-slate-600">Select a seeded support request to begin a human-reviewed analysis.</p>
        </div>
        <div className="sm:max-w-md"><Disclaimer /></div>
      </div>
      <TicketInbox tickets={tickets} />
    </main>
  );
}
