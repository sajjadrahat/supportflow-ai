"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Ticket, Urgency } from "@/lib/types";

function urgencyStyle(urgency: Urgency) {
  if (urgency === "High" || urgency === "Critical") return "bg-red-50 text-red-700";
  if (urgency === "Medium") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-600";
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
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Open tickets", tickets.length],
          ["High priority", tickets.filter((ticket) => ticket.initialUrgency === "High").length],
          ["Visible results", filtered.length],
        ].map(([label, value]) => (
          <div className="card p-5" key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
          </div>
        ))}
      </div>
      <div className="card mt-5 flex flex-col gap-4 p-4 sm:flex-row sm:items-end">
        <label className="w-full max-w-xs text-sm font-medium text-slate-700">
          Status filter
          <select className="input mt-2" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All</option>
            <option>New</option>
            <option>Analyzed</option>
            <option>Needs Review</option>
          </select>
        </label>
        <label className="w-full max-w-xs text-sm font-medium text-slate-700">
          Priority filter
          <select className="input mt-2" value={urgency} onChange={(event) => setUrgency(event.target.value)}>
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </label>
        <p className="text-sm text-slate-500 sm:ml-auto">Sample data only</p>
      </div>

      {filtered.length === 0 ? (
        <div className="card mt-5 p-10 text-center text-sm text-slate-500">No tickets match these filters.</div>
      ) : (
        <div className="card mt-5 overflow-hidden">
          <div className="hidden grid-cols-[105px_1fr_175px_120px_120px] gap-4 border-b bg-slate-50 px-6 py-4 text-xs font-medium uppercase tracking-wider text-slate-400 md:grid">
            <span>Case</span><span>Incoming signal</span><span>Requester</span><span>Received</span><span>Priority</span>
          </div>
          {filtered.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/demo/tickets/${ticket.id}`}
              className="group block border-b border-slate-100 px-6 py-5 last:border-b-0 hover:bg-slate-50/70 md:grid md:grid-cols-[105px_1fr_175px_120px_120px] md:items-center md:gap-4"
            >
              <span className="font-mono text-xs font-semibold text-[#2193f8]">{ticket.id}</span>
              <div className="mt-2 md:mt-0">
                <p className="text-sm font-medium text-slate-900 group-hover:text-[#0574d4]">{ticket.subject}</p>
                <p className="mt-1.5 text-xs text-slate-500">{ticket.categoryHint}</p>
              </div>
              <span className="mt-2 block text-sm text-slate-600 md:mt-0">{ticket.customerName}</span>
              <span className="mt-2 block text-sm text-slate-500 md:mt-0">{new Date(ticket.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              <span className={`pill mt-3 w-fit md:mt-0 ${urgencyStyle(ticket.initialUrgency)}`}>{ticket.initialUrgency}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
