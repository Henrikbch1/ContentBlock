import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeroBlock } from "./HeroBlock";

describe("HeroBlock", () => {
  it("keeps titles with a sharp s out of uppercase display", () => {
    render(<HeroBlock item={{ id: 1, title: "Mindestmaße im Überblick" }} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Mindestmaße im Überblick",
      }),
    ).toHaveAttribute("data-sharp-s", "true");
  });

  it("allows uppercase display for other titles and keeps labelled actions", () => {
    render(
      <HeroBlock
        item={{
          id: 1,
          title: "Am Wasser zuhause.",
          buttons: [{ id: 1, label: "Gastkarte holen", href: "/gastkarten" }],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Am Wasser zuhause." }),
    ).not.toHaveAttribute("data-sharp-s");
    expect(
      screen.getByRole("link", { name: "Gastkarte holen" }),
    ).toHaveAttribute("href", "/gastkarten");
  });
});
