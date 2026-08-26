import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito, Caveat, Outfit, Manrope } from "next/font/google";
import { OrientationGuard } from "@/components/layout/orientation-guard";
import { NavBar } from "@/components/landing/nav-bar";
import { NalaCompanion } from "@/components/nala/nala-companion";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tenun Nusantara - Petualangan Mengenali Dirimu",
  description: 
    "Platform gamifikasi naratif Nusantara untuk pemetaan minat bakat anak usia 7-14 tahun bersama NALA",
  keywords: [
    "pendidikan",
    "bakat",
    "anak",
    "Nusantara",
    "gamifikasi",
    "NALA",
    "Tenun Nusantara",
    "Profil Pelajar Pancasila",
  ],
  authors: [{ name: "ATEAM" }],
  openGraph: {
    title: "Tenun Nusantara",
    description: "Mainkan, Jelajahi, Temukan Bakatmu!",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2C3E50",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="id" 
      className={`${fredoka.variable} ${nunito.variable} ${caveat.variable} ${outfit.variable} ${manrope.variable}`}
    >
      <body className="antialiased">
        <NavBar />
        <OrientationGuard>
          {children}
        </OrientationGuard>
        <NalaCompanion />
      </body>
    </html>
  );
}