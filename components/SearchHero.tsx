"use client";

import { Search, MapPin, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const MAKES = ["Any Make", "BMW", "Mercedes", "Audi", "Ford", "Toyota", "Honda", "Volkswagen"];
const BUDGETS = ["Any Budget", "UGX 5,000", "UGX 10,000", "UGX 15,000", "UGX 20,000", "UGX 30,000", "UGX 50,000"];

export function SearchHero() {
  const [vehicleType, setVehicleType] = useState("CAR");
  const [make, setMake] = useState("");
  const [price, setPrice] = useState("");
  const [postcode, setPostcode] = useState("");
  const router = useRouter();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const path = vehicleType === "VAN" ? "/vans" : "/cars";
    const params = new URLSearchParams();
    if (make && make !== "Any Make") params.set("make", make);
    if (price && price !== "Any Budget") params.set("priceMax", price.replace(/[^0-9]/g, ""));
    if (postcode) params.set("postcode", postcode);
    params.set("sort", "relevance");
    params.set("page", "1");
    router.push(`${path}?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/12658203/pexels-photo-12658203.jpeg?auto=compress&cs=tinysrgb&w=2400')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/55" />

      <div className="relative mx-auto max-w-[1600px] px-6 xl:px-8">
        <div className="max-w-3xl mb-12">
          <h1 className="mb-6 text-5xl font-semibold leading-[1.1] tracking-tight text-white/95 lg:text-7xl">
            Find your next car.<br />
            <span className="text-[#c9d0ff]">All online.</span>
          </h1>
          <p className="max-w-xl text-xl font-semibold text-white/75">
            Search thousands of quality used cars from trusted dealers.
            Transparent pricing, no hidden fees.
          </p>
        </div>

        {/* Search Card */}
        <div className="relative z-10 w-full max-w-6xl">
          <div className="rounded-md border border-white/30 bg-white/10 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:p-3">
            {/* Tabs */}
            <div className="mb-2 flex gap-2 px-4 pt-2">
              {["CAR", "VAN"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setVehicleType(t)}
                  className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${vehicleType === t
                      ? "border border-orange-500/40 bg-[#ff6a00] text-white shadow-md shadow-orange-500/30"
                      : "border border-black/30 bg-black/70 text-white/85 hover:bg-black hover:text-white"
                    }`}
                >
                  {t === "CAR" ? "Cars" : "Vans"}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 p-2">
              {/* Make */}
              <div className="relative">
                <label className="absolute left-4 top-2 z-10 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Make</label>
                <select
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="h-16 w-full cursor-pointer appearance-none rounded-md border border-white/30 bg-white/75 px-4 pt-5 pb-1 pr-11 text-sm font-semibold text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  {MAKES.map((m) => (
                    <option
                      key={m}
                      value={m === "Any Make" ? "" : m}
                      style={{ backgroundColor: "#111111", color: "#ffffff" }}
                    >
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>

              {/* Budget */}
              <div className="relative">
                <label className="absolute left-4 top-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Budget</label>
                <select
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-16 w-full cursor-pointer appearance-none rounded-md border border-white/30 bg-white/75 px-4 pt-5 pb-1 text-sm font-semibold text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  {BUDGETS.map((b) => (
                    <option
                      key={b}
                      value={b === "Any Budget" ? "" : b}
                      style={{ backgroundColor: "#111111", color: "#ffffff" }}
                    >
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Postcode */}
              <div className="relative">
                <label className="absolute left-4 top-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Postcode</label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-4 top-[22px] h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. SW1A 1AA"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="h-16 w-full rounded-md border border-white/30 bg-white/75 pt-5 pb-1 pl-10 pr-4 text-sm font-semibold text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex h-16 items-center justify-center rounded-xl border border-orange-500/40 bg-[#ff6a00] px-10 font-semibold text-white shadow-lg shadow-orange-500/40 transition hover:-translate-y-0.5 hover:bg-[#e65f00]"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </button>
            </form>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6 px-4">
            <span className="text-sm font-semibold text-white/65">Popular:</span>
            {["SUV", "Hybrid", "Electric", "Automatic", "Under UGX 10,000"].map((s) => (
              <button
                key={s}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white/85 transition hover:bg-white/15 hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
