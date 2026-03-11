"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Home,
  Info,
  Mail,
  Menu,
  MessageSquare,
  Search,
  ShoppingBag,
  User,
  UserPlus,
  ChevronRight,
} from "lucide-react";
import SafeImage from "@/components/SafeImage";
import { cartCount, cartSubtotal } from "@/lib/cart";
import { useFrontendData } from "@/lib/use-frontend-data";


export default function NavBar() {
  const data = useFrontendData();
  const nav = data.navbar;
  const [count, setCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const promoLink = nav.quickLinks[2]
    ? {
        ...nav.quickLinks[2],
        label:
          nav.quickLinks[2].label.trim().toLowerCase() === "wholesale"
            ? "Hot Deals!"
            : nav.quickLinks[2].label || "Hot Deals!",
      }
    : null;

  useEffect(() => {
    const sync = () => {
      setCount(cartCount());
      setSubtotal(cartSubtotal());
    };
    sync();
    window.addEventListener("cart:updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart:updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <header className="w-full">
      <div className="w-full bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 text-[13px] text-gray-600">
          {nav.topLinks.map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center gap-2 hover:text-gray-900">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                {link.icon === "home" ? <Home size={14} /> : null}
                {link.icon === "info" ? <Info size={14} /> : null}
                {link.icon === "mail" ? <Mail size={14} /> : null}
              </span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="w-full bg-white">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 items-center gap-4 px-4 py-3">
          <div className="col-span-12 flex items-center justify-center gap-3 sm:col-span-3 sm:justify-start">
            <Link href="/" aria-label="Easy Spares Home">
              <SafeImage
                src={nav.logoUrl}
                alt={nav.logoAlt}
                className="h-10 w-auto object-contain sm:h-12"
              />
            </Link>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <div className="flex h-11 w-full overflow-hidden rounded-[2px] border border-[#cfcfcf] bg-white">
              <input
                className="h-full w-full px-4 text-[14px] outline-none placeholder:text-gray-400"
                placeholder={nav.searchPlaceholder}
              />
              <button
                className="flex h-full w-12 items-center justify-center bg-[#2f2f2f] text-white hover:bg-black"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="col-span-12 sm:col-span-3">
            <div className="grid grid-cols-4 gap-3 sm:flex sm:items-center sm:justify-end sm:gap-6">
              <Link
                href="/login"
                className="group flex flex-col items-center gap-1 text-gray-700 hover:text-black"
              >
                <User size={20} className="text-gray-500 group-hover:text-black" />
                <span className="text-[11px] sm:text-[12px]">Login</span>
              </Link>

              <Link
                href="/register"
                className="group flex flex-col items-center gap-1 text-gray-700 hover:text-black"
              >
                <UserPlus size={20} className="text-gray-500 group-hover:text-black" />
                <span className="text-[11px] sm:text-[12px]">Register</span>
              </Link>

              <Link
                href="/wishlist"
                className="group flex flex-col items-center gap-1 text-gray-700 hover:text-black"
              >
                <Heart size={20} className="text-gray-500 group-hover:text-black" />
                <span className="text-[11px] sm:text-[12px]">Wishlist</span>
              </Link>

              <div className="flex items-center justify-center md:justify-end">
                <div className="hidden text-[13px] text-gray-600 md:block">
                  <span className="text-gray-500">{count} item(s)</span> -{" "}
                  <span className="font-semibold text-gray-800">
                    UGX {subtotal.toLocaleString("en-US")}
                  </span>
                </div>
                <Link
                  href="/cart"
                  className="relative flex h-10 w-10 items-center justify-center rounded-[2px] border border-gray-300 bg-white hover:border-gray-400 md:ml-3"
                  aria-label="Cart"
                >
                  <ShoppingBag size={18} className="text-gray-700" />
                  <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff6a00] px-1 text-[11px] font-bold text-white">
                    {count}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="mx-auto max-w-[1400px] px-0">
          <div className="grid grid-cols-12 items-stretch">
            <div className="group relative col-span-12 flex sm:col-span-3">
              <button className="flex h-full min-h-[48px] w-full items-center gap-3 bg-[#114f8f] px-4 py-3 text-[13px] font-bold uppercase text-white">
                <Menu size={18} />
                All Departments
              </button>

              <div className="invisible absolute left-0 top-full z-[100] w-full border-b-2 border-[#114f8f] bg-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <nav className="flex flex-col py-2">
                  {data.categories && data.categories.filter(c => c.isActive).length > 0 ? (
                    data.categories
                      .filter(c => c.isActive)
                      .sort((a, b) => a.order - b.order)
                      .map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          className="flex items-center justify-between px-5 py-3 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#0b63ce]"
                        >
                          <span className="flex items-center gap-3">
                            {cat.thumbnail ? (
                              <SafeImage
                                src={cat.thumbnail}
                                alt=""
                                className="h-5 w-5 object-contain"
                              />
                            ) : (
                              <div className="flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-gray-400">
                                <Menu size={10} />
                              </div>
                            )}
                            {cat.title}
                          </span>
                          <ChevronRight size={14} className="text-gray-300" />
                        </Link>
                      ))
                  ) : (
                    <div className="px-5 py-4 text-[12px] text-gray-400">
                      No categories registered
                    </div>
                  )}
                </nav>
              </div>
            </div>

            <nav className="col-span-12 flex flex-wrap items-stretch gap-x-6 gap-y-0 bg-[#3f3f3f] px-4 py-0 text-[12px] font-bold uppercase text-white sm:col-span-7 sm:px-6 sm:text-[13px]">
              {nav.quickLinks.slice(0, 2).map((link) => (
                <Link key={link.href} href={link.href} className="inline-flex items-center py-3 hover:text-[#f6c400]">
                  {link.label}
                </Link>
              ))}

              {promoLink ? (
                <div className="relative flex items-stretch">
                  <Link
                    href={promoLink.href}
                    className="relative inline-flex h-full items-center justify-center bg-[#d62828] px-5 py-3 text-white hover:bg-[#b91c1c]"
                  >
                    {promoLink.label}
                  </Link>
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-[2px] bg-[#f6c400] px-2 py-[2px] text-[10px] font-black text-black">
                    New
                  </span>
                </div>
              ) : null}
            </nav>

            {nav.quickLinks[3] ? (
              <Link
                href={nav.quickLinks[3].href}
                className="col-span-12 flex items-center justify-between gap-3 bg-[#114f8f] px-4 py-3 text-[13px] font-bold uppercase text-white sm:col-span-2"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare size={18} />
                  {nav.quickLinks[3].label}
                </span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-[2px] bg-white/15 text-white">
                  <Menu size={16} />
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
