import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nusa Antara — Peta Petualangan Wisata & Trip Plan Budaya Nusantara",
  description:
    "Portal Peta Petualangan Wisata Budaya Indonesia dengan integrasi OpenStreetMap, BMKG SATU PETA MKG, AI Concierge, dan Backsound Musik Gamelan Nusantara.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full w-full overflow-hidden bg-slate-950 text-white select-none">
        {children}
      </body>
    </html>
  );
}
