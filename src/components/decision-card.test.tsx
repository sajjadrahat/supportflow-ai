import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DecisionCard } from "@/components/decision-card";

describe("DecisionCard", () => {
  it("renders an engineering escalation reason", () => {
    render(createElement(DecisionCard, { action: "Escalate to Engineering", reason: "A clicked suspicious link requires investigation." }));
    expect(screen.getByText("Escalate to Engineering")).toBeInTheDocument();
    expect(screen.getByText(/requires investigation/)).toBeInTheDocument();
  });

  it("does not display an escalation reason for support resolution", () => {
    render(createElement(DecisionCard, { action: "Resolve in Support", reason: "Not shown" }));
    expect(screen.queryByText("Not shown")).not.toBeInTheDocument();
  });
});
