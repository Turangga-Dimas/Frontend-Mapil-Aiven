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
  title: "FinPinjam - Sistem Fintech Pinjaman Online (Aiven MySQL)",
  description: "Aplikasi Fullstack Desktop Dashboard Pengelolaan Pinjaman Online dengan Next.js, Express.js & MySQL Aiven Cloud",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-900 text-slate-100 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
