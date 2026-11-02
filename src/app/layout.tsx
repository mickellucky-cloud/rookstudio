import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
  openGraph: {
    title: "Rook Studio — Documentary & Motion Direction Suite",
    description:
      "Investigative YouTube documentary motion suite for @byrook_tv powered by NVIDIA NIM & Remotion.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Suppress unhandled errors and rejections from third-party browser extensions (e.g. MetaMask inpage.js) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  function isExtensionError(msg, stack, filename) {
    try {
      var text = (msg || "") + " " + (stack || "") + " " + (filename || "");
      if (typeof msg === 'object' && msg !== null) {
        text += " " + (msg.message || "") + " " + (msg.stack || "") + " " + (msg.code || "") + " " + JSON.stringify(msg);
      }
      return /chrome-extension:\\/\\/|moz-extension:\\/\\/|safari-extension:\\/\\/|MetaMask|inpage\\.js|Failed to connect to MetaMask/i.test(text);
    } catch (e) {
      return false;
    }
  }

  if (typeof window !== "undefined") {
    var originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      if (isExtensionError(message, error && error.stack, source)) {
        return true; // suppresses the error
      }
      if (typeof originalOnError === 'function') {
        return originalOnError.apply(this, arguments);
      }
      return false;
    };

    window.addEventListener("unhandledrejection", function(event) {
      var reason = event && event.reason;
      var msg = (typeof reason === "string" ? reason : (reason && reason.message)) || reason;
      var stack = (reason && reason.stack) || "";
      if (isExtensionError(msg, stack, "")) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);

    window.addEventListener("error", function(event) {
      var msg = (event && event.message) || "";
      var filename = (event && event.filename) || "";
      var stack = (event && event.error && event.error.stack) || "";
      if (isExtensionError(msg, stack, filename)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  }
})();
`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${bricolageGrotesk.variable} ${jetbrainsMono.variable} ${plusJakarta.variable} font-sans bg-[#07080B] text-zinc-100 min-h-screen antialiased selection:bg-amber-500 selection:text-black`}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
