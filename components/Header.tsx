"use client";

import { Heart, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SafeImage from "./SafeImage";
import TopContactBar from "./TopContactBar";

const links = [
  { label: "Cars", href: "/cars" },
  { label: "Vans", href: "/vans" },
  { label: "Car Hire", href: "/car-hire" },
  { label: "Dealers", href: "/dealers" },
  { label: "Advice", href: "/advice" },
  { label: "Finance", href: "/finance" }
];

const HEADER_LOGO_URL =
  "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773677628/CAR_2_wl4xru.svg";

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
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-4 sm:px-6 sm:py-5 xl:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Home">
          <SafeImage
            src={HEADER_LOGO_URL}
            alt="Modern logo"
            className="h-9 w-auto object-contain sm:h-12"
          />
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-4 lg:flex xl:gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="whitespace-nowrap text-sm font-semibold text-gray-600 transition-colors duration-200 hover:text-[#4228c4]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-4 md:flex">
          <button aria-label="Saved" className="rounded-full p-2 text-gray-400 hover:text-[#4228c4] hover:bg-gray-50 transition-all">
            <Heart className="h-5 w-5" />
          </button>
          <Link href="/login">
            <button className="flex items-center gap-2 rounded-xl bg-[#ff6a00] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e65f00]">
              <User className="h-4 w-4" />
              Login
            </button>
          </Link>
        </div>

        <button
          className="ml-auto rounded-xl p-3 text-gray-900 lg:hidden hover:bg-gray-100 transition"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="min-h-[calc(100vh-92px)] border-t border-gray-100 bg-white/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-2 px-4 py-6 sm:px-6 sm:py-8">
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
                <button className="w-full rounded-xl bg-[#ff6a00] py-4 text-lg font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-[#e65f00]">
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
