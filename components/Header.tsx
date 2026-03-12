"use client";

import { Car, Heart, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import TopContactBar from "./TopContactBar";

const links = [
  { label: "Cars", href: "/cars" },
  { label: "Vans", href: "/vans" },
  { label: "Dealers", href: "/dealers" },
  { label: "Advice", href: "/advice" },
  { label: "Sell", href: "/sell-my-car" },
  { label: "Finance", href: "/finance" }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
          : "bg-white border-b border-transparent"
        }`}
    >
      <TopContactBar />
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 font-bold text-black text-xl tracking-tight">
          <Car className="h-8 w-8" />
          <span className="font-display font-semibold uppercase">Car Baazar</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-gray-600 hover:text-[#4228c4] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <button aria-label="Saved" className="rounded-full p-2 text-gray-400 hover:text-[#4228c4] hover:bg-gray-50 transition-all">
            <Heart className="h-5 w-5" />
          </button>
          <Link href="/login">
            <button className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-md shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800">
              <User className="h-4 w-4" />
              Login
            </button>
          </Link>
        </div>

        <button
          className="rounded-xl p-3 text-gray-900 md:hidden hover:bg-gray-100 transition"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-100 bg-white/95 backdrop-blur-md md:hidden min-h-screen">
          <div className="flex flex-col gap-2 px-6 py-8">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-xl px-4 py-3 text-lg font-normal text-gray-800 hover:text-[#4228c4] hover:bg-gray-50 hover:font-bold transition-all"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link href="/login" onClick={() => setOpen(false)}>
                <button className="w-full rounded-xl bg-black py-4 text-lg font-semibold text-white shadow-lg shadow-black/20 transition-all hover:bg-neutral-800">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
