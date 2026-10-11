import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TickerBlock } from "./TickerBlock";

describe("TickerBlock", () => {
  it("hides the duplicated message list from assistive technology", () => {
    const { container } = render(
      <TickerBlock
        item={{
          id: 1,
          messages: [
            { id: 1, text: "Erste Meldung" },
            { id: 2, text: "Zweite Meldung" },
          ],
        }}
      />,
    );

    const lists = container.querySelectorAll("ul");
    expect(lists).toHaveLength(2);
    expect(lists[0]).not.toHaveAttribute("aria-hidden");
    expect(lists[1]).toHaveAttribute("aria-hidden", "true");
    expect(screen.getAllByText("Erste Meldung")).toHaveLength(2);
  });

  it("renders nothing without messages", () => {
    const { container } = render(
      <TickerBlock item={{ id: 1, messages: [] }} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
