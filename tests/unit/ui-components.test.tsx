import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionShell } from "@/components/ui/section-shell";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StatBlock } from "@/components/ui/stat-block";

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

describe("Card", () => {
  it("render sebagai <a> bila ada href", () => {
    const { container } = render(<Card href="/y">isi</Card>);
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/y");
  });
  it("render sebagai <div> bila tanpa href", () => {
    const { container } = render(<Card>isi</Card>);
    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("div")).not.toBeNull();
  });
});

describe("SectionShell", () => {
  it("menambahkan kelas bp-grid saat grid=true", () => {
    const { container } = render(<SectionShell grid>x</SectionShell>);
    expect(container.querySelector(".bp-grid")).not.toBeNull();
  });
  it("tanpa grid tidak ada bp-grid", () => {
    const { container } = render(<SectionShell>x</SectionShell>);
    expect(container.querySelector(".bp-grid")).toBeNull();
  });
});

describe("PageHeader", () => {
  it("menampilkan title dalam <h1>", () => {
    const { container } = render(<PageHeader title="Direktori" />);
    expect(container.querySelector("h1")?.textContent).toContain("Direktori");
  });
  it("menampilkan subtitle bila ada", () => {
    const { container } = render(<PageHeader title="A" subtitle="Sub" />);
    expect(container.textContent).toContain("Sub");
  });
});

describe("EmptyState", () => {
  it("menampilkan title & description", () => {
    const { container } = render(<EmptyState title="Belum ada acara" description="Nantikan." />);
    expect(container.textContent).toContain("Belum ada acara");
    expect(container.textContent).toContain("Nantikan.");
  });
  it("menampilkan action bila diberikan", () => {
    const { container } = render(
      <EmptyState title="x" action={<a href="/daftar">Daftar</a>} />,
    );
    expect(container.querySelector('a[href="/daftar"]')).not.toBeNull();
  });
});

describe("StatBlock", () => {
  it("menampilkan placeholder saat value null", () => {
    const { container } = render(<StatBlock value={null} label="Alumni" />);
    expect(container.textContent).toContain("—");
    expect(container.textContent).toContain("Alumni");
  });
  it("menampilkan label", () => {
    const { container } = render(<StatBlock value={10} label="Angkatan" />);
    expect(container.textContent).toContain("Angkatan");
  });
});
