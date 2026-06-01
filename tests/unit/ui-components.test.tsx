import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("render sebagai <a> bila ada href", () => {
    const { container } = render(<Button href="/x">Klik</Button>);
    const a = container.querySelector("a");
    expect(a).not.toBeNull();
    expect(a?.getAttribute("href")).toBe("/x");
    expect(a?.textContent).toBe("Klik");
  });
  it("render sebagai <button> bila tanpa href", () => {
    const { container } = render(<Button>Kirim</Button>);
    expect(container.querySelector("button")).not.toBeNull();
  });
  it("varian outline memakai kelas berbeda dari gold", () => {
    const { container: gold } = render(<Button variant="gold">a</Button>);
    const { container: out } = render(<Button variant="outline">a</Button>);
    expect(gold.firstElementChild?.className).not.toBe(out.firstElementChild?.className);
  });
});
