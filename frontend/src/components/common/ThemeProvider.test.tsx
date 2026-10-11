import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { Theme } from "../../lib/types";
import { ThemeProvider } from "./ThemeProvider";

const readVariable = (name: string): string =>
  document.documentElement.style.getPropertyValue(name);

const renderTheme = (theme: Theme | null) =>
  render(
    <ThemeProvider theme={theme}>
      <p>Inhalt</p>
    </ThemeProvider>,
  );

describe("ThemeProvider", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("style");
  });

  it("sets color variables on the document element", () => {
    renderTheme({
      id: 1,
      primary_color: "#112233",
      accent_color: "rgb(10, 20, 30)",
      surface_color: "#eef2ef",
    });

    expect(readVariable("--cb-primary")).toBe("#112233");
    expect(readVariable("--cb-accent")).toBe("rgb(10, 20, 30)");
    expect(readVariable("--cb-surface")).toBe("#eef2ef");
  });

  it("maps presets to the loaded fonts and design tokens", () => {
    renderTheme({
      id: 1,
      font_heading: "serif",
      font_body: "sans",
      border_radius: "lg",
      spacing_scale: "airy",
      container_width: "wide",
      shadow_style: "none",
    });

    expect(readVariable("--cb-font-heading")).toContain("Fraunces");
    expect(readVariable("--cb-font-body")).toContain("DM Sans");
    expect(readVariable("--cb-radius")).toBe("1rem");
    expect(readVariable("--cb-section-y")).toContain("7rem");
    expect(readVariable("--cb-container")).toBe("80rem");
    expect(readVariable("--cb-shadow")).toBe("none");
  });

  it("discards invalid colors and unknown presets", () => {
    renderTheme({
      id: 1,
      primary_color: "not-a-color",
      text_color: "#12",
      background_color: "#ffffff",
      font_heading: "comic",
      spacing_scale: "huge",
      shadow_style: "glow",
    });

    expect(readVariable("--cb-primary")).toBe("");
    expect(readVariable("--cb-text")).toBe("");
    expect(readVariable("--cb-font-heading")).toBe("");
    expect(readVariable("--cb-section-y")).toBe("");
    expect(readVariable("--cb-shadow")).toBe("");
    expect(readVariable("--cb-bg")).toBe("#ffffff");
  });

  it("sets nothing without a theme", () => {
    renderTheme(null);

    expect(document.documentElement.getAttribute("style") ?? "").toBe("");
  });

  it("removes the variables on unmount", () => {
    const { unmount } = renderTheme({ id: 1, primary_color: "#112233" });
    expect(readVariable("--cb-primary")).toBe("#112233");

    unmount();

    expect(readVariable("--cb-primary")).toBe("");
  });

  it("renders its children without a wrapper element", () => {
    const { container } = renderTheme({ id: 1 });

    expect(container.firstElementChild?.tagName).toBe("P");
  });
});
