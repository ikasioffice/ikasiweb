import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ThemeProvider } from "@/lib/theme/theme-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-src",
  weight: ["400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading-src",
  weight: ["600", "700", "800"],
});

// Set the theme class before paint to avoid a flash. Default: light.
const themeInitScript = `(function(){try{var t=localStorage.getItem('ikasi-theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export const metadata: Metadata = {
  title: "IKASI Polban — Ikatan Alumni Teknik Sipil",
  description:
    "Platform resmi Ikatan Alumni Teknik Sipil Politeknik Negeri Bandung (IKASI). Berdiri 28 April 2001. Direktori alumni, bisnis, acara, dan berita.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  // Tanpa metadataBase, Next.js membuat URL absolut og:image dari
  // http://localhost:3000 -- membuat preview link di WhatsApp/Instagram gagal
  // memuat gambar. Harus domain produksi.
  metadataBase: new URL("https://ikasipolban.com"),
  openGraph: {
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8FH1JMW1DD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8FH1JMW1DD');
          `}
        </Script>
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
