import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CardsBlock } from "./CardsBlock";

describe("CardsBlock", () => {
  it("renders plain card text unchanged", () => {
    render(
      <CardsBlock
        item={{
          id: "block",
          cards: [{ id: "a", title: "Stoteler See", text: "Rund 30 Hektar." }],
        }}
      />,
    );

    expect(screen.getByText("Rund 30 Hektar.")).toBeVisible();
  });

  it("renders links from rich card text and strips unsafe markup", () => {
    const href =
      "https://www.google.com/maps/search/?api=1&query=Zur+hohen+Lieth+11";
    render(
      <CardsBlock
        item={{
          id: "block",
          cards: [
            {
              id: "a",
              title: "Verkaufsstelle",
              text: `<p>Zur hohen Lieth 11</p><p><a href="${href}">Standort in Google Maps öffnen</a></p><script>alert(1)</script>`,
            },
          ],
        }}
      />,
    );

    const link = screen.getByRole("link", {
      name: "Standort in Google Maps öffnen (öffnet in neuem Tab)",
    });
    expect(link).toHaveAttribute("href", href);
    expect(link).toHaveAttribute("target", "_blank");
    expect(document.querySelector("script")).toBeNull();
  });
});
