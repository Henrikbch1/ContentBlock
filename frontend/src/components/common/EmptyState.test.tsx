import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders the given message as status", () => {
    render(<EmptyState message="Nichts vorhanden." />);

    expect(screen.getByRole("status")).toHaveTextContent("Nichts vorhanden.");
  });
});
