"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import SafeImage from "@/components/SafeImage";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import { readWishlist, removeFromWishlist, type WishlistItem } from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(() => readWishlist());

  const refresh = () => setItems(readWishlist());

  useEffect(() => {
    window.addEventListener("wishlist:updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("wishlist:updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const handleMoveToCart = (item: WishlistItem) => {
    addToCart({ ...item });
    removeFromWishlist(item.id);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <NavBar />
      <main className="flex-grow">
        <section className="mx-auto max-w-[1400px] px-4 py-12">
          <div className="mb-8 flex items-center gap-3">
            <Heart size={28} className="text-[#ff6a00]" />
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-sm">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50">
                <Heart size={48} className="text-gray-300" />
              </div>
              <p className="mb-8 text-xl text-gray-500">Your wishlist is currently empty.</p>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg bg-[#0b63ce] px-8 py-3 font-semibold text-white transition-all hover:bg-[#07469a] active:scale-95"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <Link href={item.href} className="relative aspect-square overflow-hidden">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(item.id);
                      }}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-white"
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </Link>
                  <div className="flex flex-1 flex-col p-4">
                    <Link
                      href={item.href}
                      className="mb-2 line-clamp-2 text-sm font-semibold text-gray-800 hover:text-[#ff6a00] sm:text-base"
                    >
                      {item.name}
                    </Link>
                    <div className="mb-4 text-lg font-bold text-[#d62828]">
                      UGX {item.price.toLocaleString("en-US")}
                    </div>
                    <div className="mt-auto flex gap-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2f2f2f] px-3 py-2 text-xs font-bold uppercase text-white transition-colors hover:bg-black sm:text-[11px]"
                      >
                        <ShoppingCart size={14} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
