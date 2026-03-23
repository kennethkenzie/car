"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SafeImage from "@/components/SafeImage";
import {
  type CartItem,
  cartCount,
  cartSubtotal,
  clearCart,
  readCart,
  removeFromCart,
  updateQty,
} from "@/lib/cart";

const formatCurrency = (value: number) => `UGX ${value.toLocaleString("en-US")}`;

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setItems(readCart());

    const refresh = () => setItems(readCart());

    window.addEventListener("cart:updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("cart:updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const itemCount = useMemo(() => cartCount(items), [items]);
  const serviceFee = useMemo(() => (subtotal > 0 ? Math.round(subtotal * 0.015) : 0), [subtotal]);
  const total = subtotal + serviceFee;

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#f4f1ea] text-gray-900">
        <Header />
        <main className="pt-32 sm:pt-36">
           <div className="mx-auto max-w-[1500px] px-4 py-10 text-center animate-pulse">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-200" />
              <div className="mt-4 h-8 w-64 mx-auto bg-gray-200 rounded-full" />
           </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-gray-900">
      <Header />
      <main className="pt-32 sm:pt-36">
        <section className="border-b border-black/5 bg-gradient-to-br from-[#fff5e7] via-white to-[#eef5ff]">
          <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="text-[13px] text-gray-500">
              <Link href="/" className="hover:text-[#ff6a00]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Cart</span>
            </div>

            <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#ff6a00]/20 bg-[#ff6a00]/10 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#c24e00]">
                  <ShoppingBag className="h-4 w-4" />
                  Your Basket
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
                  Review your vehicles and parts before checkout.
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
                  Adjust quantities, remove items, or continue browsing the marketplace before
                  sending your order through.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[470px]">
                <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Line Items
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-gray-950">{itemCount}</div>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Merchandise
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-gray-950">
                    {formatCurrency(subtotal)}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/80 bg-[#1f2937] p-4 text-white shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                    Estimated Total
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{formatCurrency(total)}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-sm sm:p-12">
              <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fff2e8] text-[#ff6a00]">
                  <ShoppingBag className="h-9 w-9" />
                </div>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-gray-950">
                  Your cart is empty.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
                  Explore the latest stock, shortlist the right model, and come back here when
                  you&apos;re ready to proceed.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/cars"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff6a00] px-6 py-3 font-semibold text-white transition hover:bg-[#e65f00]"
                  >
                    Browse Cars
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/wishlist"
                    className="inline-flex items-center justify-center rounded-full border border-gray-200 px-6 py-3 font-semibold text-gray-900 transition hover:border-gray-300 hover:bg-gray-50"
                  >
                    View Wishlist
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
              <div className="space-y-5">
                <div className="flex flex-col gap-4 rounded-xl border border-black/5 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-950">Items in your cart</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {itemCount} item{itemCount === 1 ? "" : "s"} prepared for checkout.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/cars"
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:border-gray-300 hover:bg-gray-50"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Continue Shopping
                    </Link>
                    <button
                      onClick={() => clearCart()}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear Cart
                    </button>
                  </div>
                </div>

                {items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-xl border border-black/5 bg-white p-4 shadow-sm sm:p-5"
                  >
                    <div className="flex flex-col gap-5 md:flex-row">
                      <Link
                        href={item.href}
                        className="relative block overflow-hidden rounded-xl bg-[#f4f1ea] md:h-[220px] md:w-[260px] md:flex-shrink-0"
                      >
                        <SafeImage
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="max-w-2xl">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">
                              Reserved in Cart
                            </div>
                            <Link
                              href={item.href}
                              className="mt-2 block text-2xl font-semibold tracking-tight text-gray-950 transition hover:text-[#ff6a00]"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-600">
                              Stock is updated frequently. Submit checkout or enquiry details to
                              secure current pricing and availability.
                            </p>
                          </div>

                          <div className="rounded-lg bg-[#f8f7f3] px-4 py-3 text-left sm:min-w-[170px] sm:text-right">
                            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">
                              Unit Price
                            </div>
                            <div className="mt-2 text-2xl font-semibold text-gray-950">
                              {formatCurrency(item.price)}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-4 border-t border-dashed border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white p-1">
                              <button
                                onClick={() => updateQty(item.id, item.qty - 1)}
                                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-35"
                                disabled={item.qty <= 1}
                                aria-label={`Decrease quantity for ${item.name}`}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-12 px-3 text-center text-base font-semibold text-gray-950">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(item.id, item.qty + 1)}
                                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100"
                                aria-label={`Increase quantity for ${item.name}`}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="inline-flex h-12 items-center gap-2 rounded-lg bg-gray-50 px-6 text-[13px] font-bold text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove Item
                            </button>
                          </div>

                          <div className="rounded-lg border border-gray-100 bg-[#fcfbf8] px-4 py-3">
                            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">
                              Item Total
                            </div>
                            <div className="mt-1 text-xl font-semibold text-gray-950">
                              {formatCurrency(item.price * item.qty)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="space-y-5 xl:sticky xl:top-32 xl:self-start">
                <div className="rounded-[28px] bg-[#111827] p-6 text-white shadow-xl shadow-slate-900/10">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
                        Order Summary
                      </div>
                      <h2 className="mt-2 text-2xl font-semibold">Ready to proceed?</h2>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3">
                      <CreditCard className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-6 space-y-4 text-sm">
                    <div className="flex items-center justify-between gap-4 text-white/70">
                      <span>Merchandise</span>
                      <span className="font-medium text-white">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-white/70">
                      <span>Service & handling</span>
                      <span className="font-medium text-white">{formatCurrency(serviceFee)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-white/70">
                      <span>Delivery</span>
                      <span className="font-medium text-[#86efac]">Calculated on enquiry</span>
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-base font-semibold">Estimated total</span>
                        <span className="text-2xl font-semibold">{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Link
                      href="/checkout"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff6a00] px-5 py-3.5 font-semibold text-white transition hover:bg-[#e65f00]"
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/wishlist"
                      className="inline-flex w-full items-center justify-center rounded-lg border border-white/15 px-5 py-3.5 font-semibold text-white transition hover:bg-white/5"
                    >
                      Move Back to Wishlist
                    </Link>
                  </div>
                </div>

                <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-950">Why order with Modern?</h3>
                  <div className="mt-5 space-y-4">
                    <div className="flex gap-3">
                      <div className="mt-0.5 rounded-lg bg-[#eef5ff] p-2 text-[#114f8f]">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Verified stock listings</div>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          Listings are reviewed so you can compare with more confidence.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-0.5 rounded-lg bg-[#fff2e8] p-2 text-[#ff6a00]">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Delivery support</div>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          Our team helps confirm pickup, shipping, or local delivery options.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
