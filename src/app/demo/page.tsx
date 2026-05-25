import { tickets } from "@/data/seed";
import { TicketInbox } from "@/components/ticket-inbox";
import { Disclaimer } from "@/components/disclaimer";
import { ConsoleShell } from "@/components/console-shell";

export default function DemoInbox() {
  return (
    <ConsoleShell
      title="Ticket inbox"
      description="Select one of eight fictional SecureDesk tickets for assisted triage."
      action={<div className="max-w-md"><Disclaimer /></div>}
    >
      <TicketInbox tickets={tickets} />
    </ConsoleShell>
  );
}
