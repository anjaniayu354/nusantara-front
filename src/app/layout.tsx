import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Cinzel } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const nusantara = localFont({
  src: "./fonts/NUSANTARA.ttf",
  variable: "--font-nusantara",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nusa Antara — Peta Petualangan Wisata & Trip Plan Budaya Nusantara",
  description:
    "Portal Peta Petualangan Wisata Budaya Indonesia dengan integrasi OpenStreetMap, BMKG SATU PETA MKG, Bar Hala Ai, dan Backsound Musik Gamelan Nusantara.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${cinzel.variable} ${nusantara.variable} h-full antialiased`}
    >
      <body className="h-full w-full overflow-hidden bg-slate-950 text-white select-none">
        {children}
      </body>
    </html>
  );
}
