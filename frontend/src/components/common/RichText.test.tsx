import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RichText } from "./RichText";

describe("RichText", () => {
  it("opens external links in a new tab and announces it", () => {
    render(
      <RichText content='<p><a href="https://www.google.com/maps/search/?api=1&amp;query=Loxstedt">Standort öffnen</a></p>' />,
    );

    const link = screen.getByRole("link", {
      name: "Standort öffnen (öffnet in neuem Tab)",
    });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("keeps internal and mail links in the same tab", () => {
    render(
      <RichText content='<p><a href="/downloads">Downloads</a> <a href="mailto:info@example.org">Mail</a></p>' />,
    );

    expect(screen.getByRole("link", { name: "Downloads" })).not.toHaveAttribute(
      "target",
    );
    expect(screen.getByRole("link", { name: "Mail" })).not.toHaveAttribute(
      "target",
    );
  });
});
