import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchModal } from "@/components/search/SearchModal";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Odda | Premium Dental Tools",
  description: "Precision Dental Tools for the Modern Student. Clinical excellence starts with the right equipment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[var(--background)] text-[var(--navy)] font-display antialiased min-h-screen flex flex-col">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <SearchModal />
      </body>
    </html>
  );
}
