"use client";

import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SafeImage from "./SafeImage";
import TopContactBar from "./TopContactBar";
import { cartCount } from "@/lib/cart";

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
  const [count, setCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sync = () => setCount(cartCount());
    sync();
    window.addEventListener("cart:updated", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("cart:updated", sync);
      window.removeEventListener("storage", sync);
    };
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
          <Link
            href="/wishlist"
            aria-label="Saved"
            className="rounded-full p-2 text-gray-400 transition-all hover:bg-gray-50 hover:text-[#4228c4]"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative rounded-full p-2 text-gray-400 transition-all hover:bg-gray-50 hover:text-[#4228c4]"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff6a00] px-1 text-[10px] font-bold text-white">
              {count}
            </span>
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
              <Link
                href="/cart"
                className="mb-2 flex items-center justify-between rounded-xl px-4 py-3 text-lg font-normal text-gray-800 transition-all hover:bg-gray-50 hover:text-[#4228c4] hover:font-bold"
                onClick={() => setOpen(false)}
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5" />
                  Cart
                </span>
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#ff6a00] px-2 text-xs font-bold text-white">
                  {count}
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
