import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "IKASI Polban — Ikatan Alumni Teknik Sipil",
  description:
    "Platform resmi Ikatan Alumni Teknik Sipil Politeknik Negeri Bandung (IKASI). Berdiri 28 April 2001. Direktori alumni, bisnis, acara, dan berita.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={inter.variable}>
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
