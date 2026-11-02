import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RookStudio // AI Documentary & Motion Graphics Engine",
  description: "Next-gen YouTube documentary explainer studio for @byrook_tv powered by NVIDIA NIM (DeepSeek-R1, Qwen Coder) and Remotion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050608] text-white min-h-screen antialiased selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}

