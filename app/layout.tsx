import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "./components/ui/SidebarContext";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Media Gallery",
    template: "%s | Media Gallery",
  },
  description: "Browse models and videos with a clean, fast interface.",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  themeColor: "#0b0f19",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-gray-950 to-black text-white antialiased min-h-screen`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-indigo-600 text-white px-3 py-2 rounded">Skip to content</a>
        <SidebarProvider>
          <main id="main">{children}</main>
        </SidebarProvider>
      </body>
    </html>
  );
}
