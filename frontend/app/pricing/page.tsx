"use client";

import Pricing from "../components/Pricing";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-16 selection-page">
      <Navbar />
      <div className="py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Select your Trading Tier</h1>
        <p className="text-gray-600">Choose a starting plan to continue to the dashboard.</p>
      </div>
      <Pricing isSelectionMode={true} />
      <Footer />
    </main>
  );
}
