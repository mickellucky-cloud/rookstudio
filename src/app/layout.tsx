import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bricolageGrotesk = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07080B",
};

export const metadata: Metadata = {
  title: "Rook Studio — Documentary & Motion Direction Suite",
  description:
    "Investigative YouTube documentary motion suite for @byrook_tv powered by NVIDIA NIM & Remotion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${bricolageGrotesk.variable} ${jetbrainsMono.variable} ${plusJakarta.variable} font-sans bg-[#07080B] text-zinc-100 min-h-screen antialiased selection:bg-amber-500 selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}
