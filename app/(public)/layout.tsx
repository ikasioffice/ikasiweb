import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <div className="min-h-[calc(100vh-200px)]">{children}</div>
      <Footer />
    </>
  );
}
