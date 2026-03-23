"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Info,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
  Wallet,
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
} from "@/lib/cart";

const formatCurrency = (value: number) => `UGX ${value.toLocaleString("en-US")}`;

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"mm" | "bank" | "bond">("bond");

  useEffect(() => {
    setIsMounted(true);
    const cartItems = readCart();
    if (cartItems.length === 0) {
      router.push("/cart");
      return;
    }
    setItems(cartItems);
  }, [router]);

  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const itemCount = useMemo(() => cartCount(items), [items]);
  const serviceFee = useMemo(() => (subtotal > 0 ? Math.round(subtotal * 0.015) : 0), [subtotal]);
  const total = subtotal + serviceFee;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const orderData = {
      customer: {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
      },
      paymentMethod,
      items,
      subtotal,
      fee: serviceFee,
      total,
      notes: formData.get("notes"),
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
         const errorBody = await response.json();
         throw new Error(errorBody.error || "Submission failed");
      }

      const result = await response.json();
      console.log("[Checkout] Order created:", result);
      
      clearCart();
      router.push(`/checkout/success?orderId=${encodeURIComponent(result.orderId)}`);
    } catch (err: any) {
      console.error("Order failed", err);
      alert(`Checkout failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted || items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900">
      <Header />
      
      <main className="pt-32 sm:pt-36 bg-gradient-to-b from-[#f8f9fb] to-[#ffffff]">
        <div className="mx-auto max-w-[1400px] px-6 py-12">
          
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/cart"
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-black"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to basket
              </Link>
              <h1 className="text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
                Ready to secure your ride?
              </h1>
              <p className="mt-2 text-gray-500 font-medium">
                Complete your details below to process your reservation and delivery requirements.
              </p>
            </div>
            
            <div className="flex h-fit items-center gap-3 rounded-lg bg-black px-6 py-3 text-white">
              <ShieldCheck className="h-5 w-5 text-green-400" />
              <div className="text-xs font-bold uppercase tracking-widest">Secure Checkout</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_450px]">
            
            {/* Left Column: Forms */}
            <div className="space-y-10">
              
              {/* Personal Details */}
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <User size={20} />
                  </div>
                  <h2 className="text-2xl font-bold">Contact Information</h2>
                </div>
                
                <div className="grid gap-6 rounded-xl border border-gray-100 bg-white p-8 shadow-sm sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name</label>
                    <input
                      name="name"
                      required
                      placeholder="e.g. John Doe"
                      className="w-full rounded-lg border border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold outline-none transition focus:border-black focus:ring-4 focus:ring-black/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="w-full rounded-lg border border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold outline-none transition focus:border-black focus:ring-4 focus:ring-black/5"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">+256</span>
                      <input
                        name="phone"
                        required
                        placeholder="700 000 000"
                        className="w-full rounded-lg border border-gray-100 bg-gray-50 py-4 pl-16 pr-6 text-sm font-semibold outline-none transition focus:border-black focus:ring-4 focus:ring-black/5"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Delivery info */}
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <MapPin size={20} />
                  </div>
                  <h2 className="text-2xl font-bold">Delivery Address</h2>
                </div>
                
                <div className="grid gap-6 rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Street / Area</label>
                    <input
                      name="address"
                      required
                      placeholder="Plot/Avenue, Area Name"
                      className="w-full rounded-lg border border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold outline-none transition focus:border-black focus:ring-4 focus:ring-black/5"
                    />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">City / Town</label>
                      <input
                        name="city"
                        required
                        placeholder="Kampala"
                        className="w-full rounded-lg border border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold outline-none transition focus:border-black focus:ring-4 focus:ring-black/5"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Postcode (Optional)</label>
                      <input
                        name="postcode"
                        placeholder="0000"
                        className="w-full rounded-lg border border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold outline-none transition focus:border-black focus:ring-4 focus:ring-black/5"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Info */}
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <Wallet size={20} />
                  </div>
                  <h2 className="text-2xl font-bold">Payment Preference</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("mm")}
                    className={`flex flex-col items-start gap-4 rounded-xl border p-6 text-left transition-all ${
                      paymentMethod === "mm"
                        ? "border-black bg-black text-white shadow-xl shadow-black/10"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                  >
                    <Phone className={`h-6 w-6 ${paymentMethod === "mm" ? "text-yellow-400" : "text-gray-400"}`} />
                    <div>
                      <div className="font-bold underline decoration-yellow-400 underline-offset-4">Mobile Money</div>
                      <div className={`mt-1 text-[10px] font-bold uppercase tracking-widest ${paymentMethod === "mm" ? "text-white/60" : "text-gray-400"}`}>
                        Airtel or MTN
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank")}
                    className={`flex flex-col items-start gap-4 rounded-xl border p-6 text-left transition-all ${
                      paymentMethod === "bank"
                        ? "border-black bg-black text-white shadow-xl shadow-black/10"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                  >
                    <CreditCard className={`h-6 w-6 ${paymentMethod === "bank" ? "text-blue-400" : "text-gray-400"}`} />
                    <div>
                      <div className="font-bold underline decoration-blue-400 underline-offset-4">Bank Transfer</div>
                      <div className={`mt-1 text-[10px] font-bold uppercase tracking-widest ${paymentMethod === "bank" ? "text-white/60" : "text-gray-400"}`}>
                        Local RTGS/EFT
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bond")}
                    className={`flex flex-col items-start gap-4 rounded-xl border p-6 text-left transition-all ${
                      paymentMethod === "bond"
                        ? "border-black bg-black text-white shadow-xl shadow-black/10"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                  >
                    <Calendar className={`h-6 w-6 ${paymentMethod === "bond" ? "text-orange-400" : "text-gray-400"}`} />
                    <div>
                      <div className="font-bold underline decoration-orange-400 underline-offset-4">Pay at Bond</div>
                      <div className={`mt-1 text-[10px] font-bold uppercase tracking-widest ${paymentMethod === "bond" ? "text-white/60" : "text-gray-400"}`}>
                        Reserve & Visit
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-6 flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-6">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                    <Info size={14} />
                  </div>
                  <p className="text-xs font-semibold leading-relaxed text-gray-500">
                    {paymentMethod === 'mm' && "We'll send a prompt to your registered phone number once you submit your order."}
                    {paymentMethod === 'bank' && "You'll receive our Stanbic or Centenary bank details in your confirmation email."}
                    {paymentMethod === 'bond' && "Payment will be handled at our showroom (Plot 12, Entebbe Road) upon physical inspection."}
                  </p>
                </div>
              </section>

              <section>
                 <div className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-gray-400">Additional Instructions</div>
                 <textarea
                    name="notes"
                    rows={4}
                    placeholder="Any specific requests for delivery or viewing time?"
                    className="w-full rounded-xl border border-gray-100 bg-white p-8 text-sm font-semibold outline-none transition focus:border-black focus:ring-4 focus:ring-black/5"
                 />
              </section>
            </div>

            {/* Right Column: Sticky Summary */}
            <aside className="lg:sticky lg:top-36 lg:self-start">
              <div className="rounded-xl bg-white border border-gray-100 p-8 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.06)]">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-xl font-black">Order Summary</h3>
                  <div className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                    {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                  </div>
                </div>

                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                        <SafeImage src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-gray-900">{item.name}</div>
                        <div className="mt-1 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Qty: {item.qty}</div>
                        <div className="mt-1 text-sm font-black text-[#ff6a00]">{formatCurrency(item.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-4 border-t border-dashed border-gray-100 pt-8">
                  <div className="flex items-center justify-between text-sm font-semibold text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold text-gray-500">
                    <div className="flex items-center gap-1.5">
                      Service Fee
                      <Info size={12} className="text-gray-300" />
                    </div>
                    <span className="text-gray-900">{formatCurrency(serviceFee)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold text-gray-500">
                    <span>Delivery</span>
                    <span className="font-bold text-green-500 uppercase tracking-widest text-[10px]">TBC</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xl font-black">
                    <span>Total</span>
                    <span className="text-black">{formatCurrency(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-10 flex w-full items-center justify-center gap-3 rounded-lg bg-black py-6 font-black text-white shadow-2xl shadow-black/20 transition-all hover:scale-[1.02] active:scale-95 disabled:scale-100 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  ) : (
                    <>
                      Confirm Order
                      <ShoppingBag size={18} />
                    </>
                  )}
                </button>
                
                <p className="mt-6 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Secure checkout handled by Car Baazar
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
                   <ShieldCheck className="mx-auto mb-2 h-6 w-6 text-gray-300" />
                   <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">100% Genuine</div>
                </div>
                <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
                   <Truck className="mx-auto mb-2 h-6 w-6 text-gray-300" />
                   <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Global Support</div>
                </div>
              </div>
            </aside>

          </form>
        </div>
      </main>

      <Footer />
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
