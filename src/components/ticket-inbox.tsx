"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Ticket, Urgency } from "@/lib/types";

function urgencyStyle(urgency: Urgency) {
  if (urgency === "High" || urgency === "Critical") return "bg-[#f6e1d9] text-[#933c27]";
  if (urgency === "Medium") return "bg-[#efe7d4] text-[#85621e]";
  return "bg-[#e5ece8] text-[#426158]";
}

export function TicketInbox({ tickets }: { tickets: Ticket[] }) {
  const [status, setStatus] = useState("All");
  const [urgency, setUrgency] = useState("All");
  const filtered = useMemo(
    () => tickets.filter((ticket) => (status === "All" || ticket.status === status) && (urgency === "All" || ticket.initialUrgency === urgency)),
    [status, urgency, tickets],
  );

  return (
    <>
      <div className="mt-11 grid gap-5 lg:grid-cols-[250px_1fr]">
        <aside className="panel-dark h-fit rounded-[1.35rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8da7a0]">Queue status</p>
          <p className="display mt-5 text-6xl text-[#f8f3e8]">{String(filtered.length).padStart(2, "0")}</p>
          <p className="mt-2 text-sm text-[#abbcb6]">Visible sample cases</p>
          <div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-sm text-[#bdc8c3]">
            <p><span className="mr-3 inline-block h-2 w-2 rounded-full bg-[#f2a387]" />Security risk included</p>
            <p><span className="mr-3 inline-block h-2 w-2 rounded-full bg-[#65bd9e]" />Grounding enabled</p>
          </div>
        </aside>
        <div>
      <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-end">
        <label className="w-full max-w-xs text-sm font-medium text-[#52605a]">
          Status filter
          <select className="input mt-2" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All</option>
            <option>New</option>
            <option>Analyzed</option>
            <option>Needs Review</option>
          </select>
        </label>
        <label className="w-full max-w-xs text-sm font-medium text-[#52605a]">
          Priority filter
          <select className="input mt-2" value={urgency} onChange={(event) => setUrgency(event.target.value)}>
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </label>
        <p className="text-sm text-[#68716c] sm:ml-auto">Sample data only</p>
      </div>

      {filtered.length === 0 ? (
        <div className="card mt-5 p-10 text-center text-sm text-[#68716c]">No tickets match these filters.</div>
      ) : (
        <div className="card mt-5 overflow-hidden">
          <div className="hidden grid-cols-[105px_1fr_175px_120px_120px] gap-4 border-b bg-[#f0ece3] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6d756c] md:grid">
            <span>Case</span><span>Incoming signal</span><span>Requester</span><span>Received</span><span>Priority</span>
          </div>
          {filtered.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/demo/tickets/${ticket.id}`}
              className="group block border-b px-6 py-5 last:border-b-0 hover:bg-[#f8f5ee] md:grid md:grid-cols-[105px_1fr_175px_120px_120px] md:items-center md:gap-4"
            >
              <span className="font-mono text-xs font-semibold text-[#15715f]">{ticket.id}</span>
              <div className="mt-2 md:mt-0">
                <p className="text-sm font-semibold text-[#152329] group-hover:text-[#15715f]">{ticket.subject}</p>
                <p className="mt-1.5 text-xs text-[#68716c]">{ticket.categoryHint}</p>
              </div>
              <span className="mt-2 block text-sm text-[#53605c] md:mt-0">{ticket.customerName}</span>
              <span className="mt-2 block text-sm text-[#68716c] md:mt-0">{new Date(ticket.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              <span className={`pill mt-3 w-fit md:mt-0 ${urgencyStyle(ticket.initialUrgency)}`}>{ticket.initialUrgency}</span>
            </Link>
          ))}
        </div>
      )}
      </div>
      </div>
    </>
  );
}
