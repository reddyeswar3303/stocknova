"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import AnimatedLogout from "./AnimatedLogout";
import SparkleNavbar from "./SparkleNavbar";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Tools", href: "#tools" },
  { name: "Testimonials", href: "#testimonials" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("traderLevel");
    localStorage.removeItem("user");
    localStorage.removeItem("availableFunds");
    localStorage.removeItem("adminToken");
    setIsLogged(false);
    window.location.href = "/";
  };

  useEffect(() => {
    setMounted(true);
    // Fixed: Only rely on 'isLoggedIn' marker for true authentication state
    const isAuth = localStorage.getItem("isLoggedIn") === "true";
    setIsLogged(isAuth);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    if (window.location.pathname === "/") {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = `/${href}`;
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-white shadow-sm border-b border-gray-100" : "bg-white"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo — Groww-style green wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105" style={{ backgroundColor: "#00D09C" }}>
              <span className="text-white font-bold text-xl leading-none">S</span>
            </div>
            <span
              className="text-2xl font-black"
              style={{ color: "#231F20", letterSpacing: "-0.04em", fontFamily: '"Outfit", sans-serif' }}
            >
              Stock<span style={{ color: "#EB5B3C" }}>N</span>ova
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center">
            <SparkleNavbar 
              items={[
                { id: "#features", label: "Features" },
                { id: "#pricing", label: "Pricing" },
                { id: "#tools", label: "Tools" },
                { id: "#testimonials", label: "Testimonials" },
              ]}
              activeId="" // Landing page is scroll-based, we'll let it be stateless for now or add scroll observer later
              onTabChange={(id) => scrollToSection(id)}
              color="#00D09C"
            />
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {mounted && isLogged ? (
              <>
                <Link href="/dashboard">
                  <motion.span
                    className="text-sm font-semibold px-5 py-2 rounded-lg cursor-pointer border transition-colors"
                    style={{
                      color: "#00D09C",
                      borderColor: "#00D09C",
                      backgroundColor: "transparent",
                    }}
                    whileHover={{ backgroundColor: "#E8FBF6" } as any}
                    whileTap={{ scale: 0.97 }}
                  >
                    Dashboard
                  </motion.span>
                </Link>
                <AnimatedLogout onLogout={handleLogout} />
              </>
            ) : mounted ? (
              <>
                <Link href="/auth">
                  <motion.span
                    className="text-sm font-semibold px-5 py-2 rounded-lg cursor-pointer border transition-colors"
                    style={{
                      color: "#00D09C",
                      borderColor: "#00D09C",
                      backgroundColor: "transparent",
                    }}
                    whileHover={{ backgroundColor: "#E8FBF6" } as any}
                    whileTap={{ scale: 0.97 }}
                  >
                    Log In
                  </motion.span>
                </Link>
                <Link href="/auth">
                  <motion.span
                    className="text-sm font-semibold px-5 py-2 rounded-lg cursor-pointer text-white"
                    style={{ backgroundColor: "#00D09C" }}
                    whileHover={{ backgroundColor: "#00A87D" } as any}
                    whileTap={{ scale: 0.97 }}
                  >
                    Sign Up Free
                  </motion.span>
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg"
              style={{ color: "#5F6368" }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-white border-t px-4 pb-6 space-y-1"
            style={{ borderColor: "#E8E8E8" }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="block w-full text-left px-3 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{ color: "#5F6368" }}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ backgroundColor: "#F8F8F8", color: "#00D09C" } as any}
              >
                {link.name}
              </motion.button>
            ))}
            <div className="pt-4 border-t flex flex-col gap-3" style={{ borderColor: "#E8E8E8" }}>
              {mounted && isLogged ? (
                <>
                  <Link href="/dashboard">
                    <motion.span
                      className="block w-full text-center py-3 rounded-xl text-sm font-semibold border cursor-pointer"
                      style={{ color: "#00D09C", borderColor: "#00D09C" }}
                    >
                      Dashboard
                    </motion.span>
                  </Link>
                  <div className="flex justify-center py-2">
                    <AnimatedLogout onLogout={handleLogout} />
                  </div>
                </>
              ) : mounted ? (
                <>
                  <Link href="/auth">
                    <motion.span
                      className="block w-full text-center py-3 rounded-xl text-sm font-semibold border cursor-pointer"
                      style={{ color: "#00D09C", borderColor: "#00D09C" }}
                    >
                      Log In
                    </motion.span>
                  </Link>
                  <Link href="/auth">
                    <motion.span
                      className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-white cursor-pointer"
                      style={{ backgroundColor: "#00D09C" }}
                    >
                      Sign Up Free
                    </motion.span>
                  </Link>
              </>
            ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
