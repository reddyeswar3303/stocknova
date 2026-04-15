"use client";

import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const footerSections = [
  {
    title: "Products",
    links: [
      { name: "Stocks", href: "/auth" },
      { name: "Mutual Funds", href: "/auth" },
      { name: "F&O", href: "/auth" },
      { name: "IPO", href: "/auth" },
      { name: "Gold Bonds", href: "/auth" },
      { name: "US Stocks", href: "/auth" },
    ],
  },
  {
    title: "Platform",
    links: [
      { name: "Web Trading", href: "/auth" },
      { name: "Mobile App", href: "/auth" },
      { name: "API Trading", href: "/auth" },
      { name: "Partner Program", href: "/auth" },
    ],
  },
  {
    title: "Learn",
    links: [
      { name: "Learning Center", href: "/auth" },
      { name: "Market News", href: "/auth" },
      { name: "Research Reports", href: "/auth" },
      { name: "Blog", href: "/auth" },
      { name: "Help Center", href: "/auth" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/auth" },
      { name: "Careers", href: "/auth" },
      { name: "Contact Us", href: "/auth" },
      { name: "Partners", href: "/auth" },
    ],
  },
];

const socials = [
  { Icon: Twitter,   href: "https://twitter.com",   label: "Twitter" },
  { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: Linkedin,  href: "https://linkedin.com",  label: "LinkedIn" },
  { Icon: Youtube,   href: "https://youtube.com",   label: "YouTube" },
  { Icon: Facebook,  href: "https://facebook.com",  label: "Facebook" },
];

export default function Footer() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer style={{ backgroundColor: "#1A1A2E", color: "#B0B3C1" }}>

      {/* CTA strip — Groww green band */}
      <div style={{ backgroundColor: "#00D09C" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                Start investing in minutes
              </h3>
              <p className="text-white/80">
                Join 1.5M+ investors. Open a free account — no minimum balance required.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/auth">
                <motion.span
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold cursor-pointer text-sm"
                  style={{ backgroundColor: "#FFFFFF", color: "#00D09C" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Open Free Account <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
              <motion.button
                onClick={() => scrollTo("pricing")}
                className="px-6 py-3 rounded-xl font-semibold border-2 border-white/40 text-white text-sm"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.97 }}
              >
                View Plans
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Brand col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#00D09C" }}>
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-white">
                Trade<span style={{ color: "#00D09C" }}>Verse</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#8A8D9F" }}>
              India's trusted investing platform. Trade stocks, mutual funds, F&amp;O, and gold bonds with zero delivery brokerage.
            </p>
            <div className="space-y-3">
              <a href="mailto:support@tradeverse.com" className="flex items-center gap-3 text-sm hover:text-white transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "#00D09C" }} />
                support@tradeverse.com
              </a>
              <a href="tel:+918001234567" className="flex items-center gap-3 text-sm hover:text-white transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "#00D09C" }} />
                +91 800-123-4567
              </a>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "#00D09C" }} />
                Mumbai, Maharashtra, India
              </div>
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((sec) => (
            <div key={sec.title}>
              <h4 className="text-sm font-bold text-white mb-4">{sec.title}</h4>
              <ul className="space-y-3">
                {sec.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: "#8A8D9F" }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Page nav */}
        <div className="mt-10 pt-8 border-t flex flex-wrap gap-6 justify-center" style={{ borderColor: "#2D2D45" }}>
          {["features", "pricing", "tools", "testimonials"].map((id) => (
            <motion.button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-xs font-medium capitalize transition-colors hover:text-white"
              style={{ color: "#8A8D9F" }}
              whileHover={{ y: -1 }}
            >
              {id}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid #2D2D45" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-5">

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: "#2D2D45" }}
                  whileHover={{ backgroundColor: "#00D09C", scale: 1.05 } as any}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4 text-white" />
                </motion.a>
              ))}
            </div>

            {/* Legal links */}
            <div className="flex flex-wrap justify-center gap-5 text-xs" style={{ color: "#8A8D9F" }}>
              {["Privacy Policy", "Terms of Service", "Disclosure", "Sitemap"].map((l) => (
                <Link key={l} href="/auth" className="hover:text-white transition-colors">{l}</Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 text-xs leading-relaxed text-center" style={{ color: "#5F6368" }}>
            Disclaimer: Investments in securities market are subject to market risks. Read all the related documents carefully before investing.
            Registration granted by SEBI, membership of BSE &amp; NSE. TradeVerse is a trademark of TradeVerse Financial Technologies Pvt Ltd.
            © 2026 TradeVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
