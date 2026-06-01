import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

describe("Avatar", () => {
  it("inisial dari nama ALL CAPS tetap 2 huruf Title Case", () => {
    const { container } = render(<Avatar name="AJENG MELIANA RIZKY" />);
    expect(container.textContent).toBe("AM");
  });
  it("aman untuk nama satu kata", () => {
    const { container } = render(<Avatar name="budi" />);
    expect(container.textContent).toBe("B");
  });
});

describe("Badge", () => {
  it("menampilkan children", () => {
    const { container } = render(<Badge>2023</Badge>);
    expect(container.textContent).toContain("2023");
  });
  it("varian gold & neutral berbeda kelas", () => {
    const { container: g } = render(<Badge variant="gold">a</Badge>);
    const { container: n } = render(<Badge variant="neutral">a</Badge>);
    expect(g.firstElementChild?.className).not.toBe(n.firstElementChild?.className);
  });
});
