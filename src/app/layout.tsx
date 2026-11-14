import type { Metadata, Viewport } from "next";
import { Fraunces, Karla, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const nusantara = localFont({
  src: "./fonts/NUSANTARA.ttf",
  variable: "--font-nusantara",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nusa Antara — Portal Eksplorasi Budaya & Wisata Nusantara",
  description:
    "Portal Utama Budaya & Peta Petualangan Wisata Indonesia dengan integrasi OpenStreetMap, BMKG Telemetri Cuaca, Bar Hala AI, dan Warisan Musik Tradisional Nusantara.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A2E52",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-theme="light"
      suppressHydrationWarning
      className={`${fraunces.variable} ${karla.variable} ${jetbrainsMono.variable} ${nusantara.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('nusantara_theme') || localStorage.getItem('anvieo_theme');
                if (theme === 'dark') {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (e) {
                document.documentElement.setAttribute('data-theme', 'light');
              }
            `,
          }}
        />
      </head>
      <body className="h-full w-full font-sans antialiased select-none">
        {children}
      </body>
    </html>
  );
}
