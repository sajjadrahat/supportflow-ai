import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TicketWorkspace } from "@/components/ticket-workspace";
import { getTicket } from "@/data/seed";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("TicketWorkspace analysis loading state", () => {
  it("shows progress stages while an analysis request is in flight", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() => new Promise(() => undefined));
    render(<TicketWorkspace ticket={getTicket("SD-1051")!} />);

    fireEvent.click(screen.getByRole("button", { name: "Analyze with AI" }));

    expect(await screen.findByText("Analyzing ticket")).toBeInTheDocument();
    expect(screen.getByText("Retrieve")).toBeInTheDocument();
    expect(screen.getByText("Ground")).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });
});
