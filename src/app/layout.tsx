import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ClientProviders } from "@/components/providers/ClientProviders";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Script Maker",
  description: "モバイル脚本作成ツール",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#121212",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <main className="mx-auto max-w-md min-h-dvh relative overflow-x-hidden">
          <ClientProviders>{children}</ClientProviders>
        </main>
      </body>
    </html>
  );
}
