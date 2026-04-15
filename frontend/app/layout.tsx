import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StockNova - Trade & Invest in Stocks, SIPs, IPOs, Mutual Funds",
  description: "Trade & Invest in stocks, SIPs, IPOs, Mutual funds, F&O and more. Join millions for a hassle-free trading experience on StockNova!",
};

import { Suspense } from "react";
import RedirectLoader from "./components/RedirectLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{ fontFamily: '"Outfit", sans-serif' }}>
        <Suspense fallback={null}>
          <RedirectLoader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
