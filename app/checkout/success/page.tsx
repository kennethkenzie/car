"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SafeImage from "@/components/SafeImage";
import {
  ArrowRight,
  CheckCircle2,
  Home,
  Package,
  ShoppingBag,
} from "lucide-react";
import {
  formatOrderCurrency,
  getPaymentStatusLabel,
  type OrderRecord,
} from "@/lib/order-utils";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order reference missing.");
      setIsLoading(false);
      return;
    }

    async function loadOrder() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/orders/${orderId}`);
        const body = await response.json();

        if (!response.ok) {
          throw new Error(body.error || "Order lookup failed.");
        }

        setOrder(body);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Order lookup failed.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900">
      <Header />

      <main className="px-6 pb-24 pt-44">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative mb-10">
              <div className="absolute inset-0 animate-ping rounded-full bg-green-100/50" />
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-xl shadow-green-600/10">
                <CheckCircle2 size={64} />
              </div>
            </div>

            <div className="mb-12 max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-white">
                Booking Received
              </div>
              <h1 className="text-5xl font-black tracking-tight text-gray-950 sm:text-6xl">
                Order Confirmed!
              </h1>
              <p className="mt-6 text-xl font-medium leading-relaxed text-gray-500">
                Your reservation has been received. The details below are from your actual
                checkout submission.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
              <div className="text-sm font-semibold text-gray-500">Loading order details...</div>
            </div>
          ) : error || !order || !order.metadata ? (
            <div className="rounded-2xl border border-red-100 bg-white p-12 text-center shadow-sm">
              <div className="text-lg font-bold text-gray-900">Unable to load order details</div>
              <p className="mt-2 text-sm text-gray-500">{error || "Order information is unavailable."}</p>
            </div>
          ) : (
            <>
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
                    <Package size={24} />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</div>
                  <div className="mt-2 text-2xl font-black text-gray-950">{order.orderNumber}</div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
                    <Home size={24} />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Delivery City</div>
                  <div className="mt-2 text-2xl font-black text-gray-950">{order.metadata.customer.city}</div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
                    <ShoppingBag size={24} />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</div>
                  <div className="mt-2 text-xl font-black uppercase text-orange-500">
                    {getPaymentStatusLabel(order.metadata.paymentMethod)}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
                <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                  <h2 className="text-2xl font-black text-gray-950">Order Details</h2>
                  <div className="mt-6 space-y-5">
                    {order.metadata.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4 sm:flex-row"
                      >
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                          <SafeImage src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-lg font-bold text-gray-900">{item.name}</div>
                          <div className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-400">
                            Qty: {item.qty}
                          </div>
                          <div className="mt-3 text-sm font-semibold text-gray-500">
                            Unit Price: {formatOrderCurrency(item.price)}
                          </div>
                          <div className="mt-1 text-base font-black text-[#ff6a00]">
                            Line Total: {formatOrderCurrency(item.price * item.qty)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <aside className="space-y-8">
                  <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                    <h3 className="text-xl font-black text-gray-950">Customer Details</h3>
                    <div className="mt-5 space-y-3 text-sm text-gray-600">
                      <div><span className="font-bold text-gray-900">Name:</span> {order.metadata.customer.name}</div>
                      <div><span className="font-bold text-gray-900">Email:</span> {order.metadata.customer.email}</div>
                      <div><span className="font-bold text-gray-900">Phone:</span> {order.metadata.customer.phone}</div>
                      <div><span className="font-bold text-gray-900">Address:</span> {order.metadata.customer.address}</div>
                      <div><span className="font-bold text-gray-900">City:</span> {order.metadata.customer.city}</div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                    <h3 className="text-xl font-black text-gray-950">Payment Summary</h3>
                    <div className="mt-5 space-y-3 text-sm">
                      <div className="flex items-center justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span className="font-bold text-gray-900">{formatOrderCurrency(order.metadata.subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-500">
                        <span>Service Fee</span>
                        <span className="font-bold text-gray-900">{formatOrderCurrency(order.metadata.fee)}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-base">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-black text-gray-950">{formatOrderCurrency(order.metadata.total)}</span>
                      </div>
                    </div>

                    {order.metadata.notes ? (
                      <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                        <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                          Additional Instructions
                        </div>
                        <div className="mt-2">{order.metadata.notes}</div>
                      </div>
                    ) : null}
                  </div>
                </aside>
              </div>
            </>
          )}

          <div className="mt-20 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-full bg-black px-10 py-5 font-black text-white shadow-2xl shadow-black/20 transition-all hover:scale-105 active:scale-95"
            >
              Back to Home
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>
            <Link
              href="/cars"
              className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-10 py-5 font-black text-gray-900 shadow-sm transition-all hover:border-gray-300 active:scale-95"
            >
              Explore More Vehicles
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fcfcfc] text-gray-900">
          <Header />
          <main className="px-6 pb-24 pt-44">
            <div className="mx-auto max-w-4xl rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
              <div className="text-sm font-semibold text-gray-500">Loading order details...</div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
