"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import Tools from "./components/Tools";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import MarketSection from "./components/MarketSection";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect only if they are logged in AND not trying to view a specific section (hash)
    if (localStorage.getItem("isLoggedIn") === "true" && !window.location.hash) {
      router.push("/dashboard");
    }
  }, [router]);
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <MarketSection />
      <Features />
      <Pricing />
      <Tools />
      <Testimonials />
      <Footer />
    </main>
  );
}
