import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Navigation } from "../../lib/types";
import { Header } from "./Header";

const navigation: Navigation = {
  id: 1,
  brand_text: "Verein",
  items: [
    { id: 1, label: "Verein", type: "group" },
    {
      id: 2,
      parent: 1,
      label: "Kontakt",
      type: "page",
      page: { id: 2, slug: "kontakt" },
    },
  ],
};

describe("Header navigation", () => {
  it("opens and closes the mobile menu with focus restored on Escape", () => {
    render(<Header navigation={navigation} />);
    const trigger = screen.getByRole("button", { name: "Navigation öffnen" });

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(
      within(
        screen.getByRole("navigation", { name: "Mobile Hauptnavigation" }),
      ).getByRole("link", { name: "Kontakt" }),
    ).toHaveAttribute("href", "/kontakt");
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("shows decorative icons before labels and ignores unknown keys", () => {
    render(
      <Header
        navigation={{
          id: 1,
          items: [
            {
              id: 1,
              label: "Gewässer",
              icon: "gewaesser",
              type: "page",
              page: { id: 1, slug: "gewaesser" },
            },
            {
              id: 2,
              label: "Sonstiges",
              icon: "gibt-es-nicht",
              type: "page",
              page: { id: 2, slug: "sonstiges" },
            },
          ],
        }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Navigation öffnen" }));
    const mobile = screen.getByRole("navigation", {
      name: "Mobile Hauptnavigation",
    });

    const withIcon = within(mobile).getByRole("link", { name: "Gewässer" });
    expect(withIcon.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(
      within(mobile)
        .getByRole("link", { name: "Sonstiges" })
        .querySelector("svg"),
    ).toBeNull();
  });

  it("opens a desktop submenu and returns focus to its summary", () => {
    render(<Header navigation={navigation} />);
    const desktop = screen.getByRole("navigation", { name: "Hauptnavigation" });
    const trigger = within(desktop).getByText("Verein");
    fireEvent.click(trigger);

    const link = within(desktop).getByRole("link", { name: "Kontakt" });
    link.focus();
    fireEvent.keyDown(link, { key: "Escape" });
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
