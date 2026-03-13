"use client";

import Link from "next/link";
import { Car, Instagram, Twitter, Facebook } from "lucide-react";

const sections = [
  {
    title: "Buy",
    links: [
      { label: "Used cars", href: "/cars" },
      { label: "Used vans", href: "/vans" },
      { label: "Finance", href: "/finance" },
      { label: "Part exchange", href: "/finance" },
    ],
  },
  {
    title: "Sell",
    links: [
      { label: "Sell my car", href: "/sell-my-car" },
      { label: "Valuation", href: "/sell-my-car" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help centre", href: "/help-centre" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-black pt-24 pb-12 border-t border-gray-800">
      <div className="mx-auto max-w-[1600px] px-6 xl:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="max-w-xs">
            <Link href="/" className="mb-6 flex items-center gap-2 text-2xl font-bold tracking-tighter text-gray-100">
              <Car className="h-10 w-10" />
              <span className="font-display font-semibold uppercase">Car Baazar</span>
            </Link>
            <p className="text-gray-300 font-normal leading-relaxed mb-8">
              Uganda's most trusted online marketplace for quality used vehicles.
              Find, finance and buy your next car entirely online.
            </p>
            <div className="flex gap-4">
              <button className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gray-200 hover:text-[#9fa8ff] transition-all">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gray-200 hover:text-[#9fa8ff] transition-all">
                <Instagram className="h-4 w-4" />
              </button>
              <button className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gray-200 hover:text-[#9fa8ff] transition-all">
                <Facebook className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-8 grid-cols-2 md:grid-cols-4">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-6 text-sm font-bold text-white">{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm font-normal text-gray-300 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-normal text-gray-300 underline decoration-gray-600 decoration-2 underline-offset-4 pointer-events-none">
            © 2026 Car Baazar Marketplace Limited
          </p>
          <div className="flex gap-8">
            <span className="text-xs font-normal text-gray-400 uppercase tracking-widest">UA Regulated</span>
            <span className="text-xs font-normal text-gray-400 uppercase tracking-widest">BVRLA Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
