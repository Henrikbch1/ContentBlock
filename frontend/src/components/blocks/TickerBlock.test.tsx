import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TickerBlock } from "./TickerBlock";

describe("TickerBlock", () => {
  it("shows every message once as a static, labelled notice", () => {
    render(
      <TickerBlock
        item={{
          id: 1,
          messages: [
            { id: 1, text: "Erste Meldung", link: { id: 9, slug: "info" } },
            { id: 2, text: "Zweite Meldung" },
          ],
        }}
      />,
    );

    const notice = screen.getByRole("complementary", { name: "Hinweis" });
    expect(notice).toBeVisible();
    expect(screen.getAllByText("Erste Meldung")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Erste Meldung" })).toHaveAttribute(
      "href",
      "/info",
    );
    expect(screen.getByText("Zweite Meldung")).toBeVisible();
    expect(notice.querySelector("[class*='ticker']")).toBeNull();
  });

  it("renders nothing without messages", () => {
    const { container } = render(
      <TickerBlock item={{ id: 1, messages: [] }} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
