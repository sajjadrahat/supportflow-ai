import { tickets } from "@/data/seed";
import { TicketInbox } from "@/components/ticket-inbox";
import { Disclaimer } from "@/components/disclaimer";

export default function DemoInbox() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
        <div>
          <p className="eyebrow">Case queue / SecureDesk</p>
          <h1 className="display mt-4 text-5xl">Inbox</h1>
          <p className="mt-4 max-w-sm leading-7 text-[#68716c]">Eight controlled sample tickets ready for grounded triage and human review.</p>
        </div>
        <Disclaimer />
      </div>
      <TicketInbox tickets={tickets} />
    </main>
  );
}
