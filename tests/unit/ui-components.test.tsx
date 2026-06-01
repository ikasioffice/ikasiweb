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
import { FeatureIcon } from "@/components/ui/icons";

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

describe("FeatureIcon", () => {
  it("render svg untuk nama ikon dikenal", () => {
    const { container } = render(<FeatureIcon name="directory" />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
  it("fallback tetap render svg untuk nama tak dikenal", () => {
    // @ts-expect-error sengaja nama tak dikenal
    const { container } = render(<FeatureIcon name="zzz" />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});

import { LineIcon } from "@/components/ui/icons";

describe("LineIcon", () => {
  it("render svg untuk nama dikenal", () => {
    const { container } = render(<LineIcon name="pin" />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
  it("fallback render svg untuk nama tak dikenal", () => {
    // @ts-expect-error sengaja
    const { container } = render(<LineIcon name="zzz" />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});

import { InfoField } from "@/components/ui/info-field";

describe("InfoField", () => {
  it("menampilkan label & value bila ada isinya", () => {
    const { container } = render(<InfoField label="Domisili" value="Bandung" />);
    expect(container.textContent).toContain("Domisili");
    expect(container.textContent).toContain("Bandung");
  });
  it("render null (tidak ada output) bila value kosong", () => {
    const { container } = render(<InfoField label="Domisili" value="" />);
    expect(container.firstChild).toBeNull();
  });
  it("render null bila value placeholder dash", () => {
    const { container } = render(<InfoField label="X" value="—" />);
    expect(container.firstChild).toBeNull();
  });
});
