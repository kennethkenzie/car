"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPublicVehicles } from "@/lib/api";
import { Vehicle } from "@/lib/types";

import {
  CalendarDays,
  MapPin,
  Users,
  Car,
  ChevronDown,
  ChevronLeft,
  ArrowRight,
  CheckCircle,
  Key,
  ShieldCheck,
  Clock3,
} from "lucide-react";

const CARS_PER_PAGE = 6;

const LOCATIONS = [
  "Select Location",
  "Kampala - City Centre",
  "Entebbe International Airport",
  "Jinja",
  "Mbarara",
  "Gulu",
];

/* ─── Floating-label field wrapper ─────────────────────── */
function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <label className="absolute left-4 top-2 z-10 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </label>
      {Icon && (
        <Icon className="pointer-events-none absolute left-4 top-[28px] z-10 h-4 w-4 text-gray-400" />
      )}
      {children}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function CarHirePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getPublicVehicles("CAR", "HIRE")
      .then((data) => setVehicles(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const selectedVehicle = vehicles.find((v) => v.id === selectedCar);

  const totalPages = Math.ceil(vehicles.length / CARS_PER_PAGE);
  const paginatedVehicles = vehicles.slice(
    (currentPage - 1) * CARS_PER_PAGE,
    currentPage * CARS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const days =
    pickupDate && returnDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setSelectedCar(null);
    setName("");
    setPhone("");
    setPickupDate("");
    setReturnDate("");
    setPickupLocation("");
    setDropoffLocation("");
  };

  const inputBase =
    "h-16 w-full border border-gray-200 bg-white text-sm font-semibold text-gray-900 transition focus:border-[#4228c4] focus:outline-none focus:ring-2 focus:ring-[#4228c4]/20 placeholder:text-gray-300";

  const getImage = (v: Vehicle) => {
    const img = v.images?.[0];
    if (!img) return "/placeholder-car.jpg";
    return typeof img === "string" ? img : img.url;
  };

  return (
    <>
      <Header />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-44 lg:pb-28">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=2400')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/40" />

        <div className="relative mx-auto max-w-[1600px] px-6 xl:px-8">
          <div className="max-w-2xl">
            <span className="mb-4 inline-block text-[10px] font-bold uppercase tracking-widest text-[#ff6a00]">
              Car Hire
            </span>
            <h1 className="mb-5 text-5xl font-semibold leading-[1.1] tracking-tight text-white/95 lg:text-6xl">
              Drive away today.{" "}
              <span className="text-[#c9d0ff]">Hire with ease.</span>
            </h1>
            <p className="max-w-xl text-lg font-medium text-white/70">
              Premium vehicles available for daily hire across Uganda.
              Transparent pricing, fully insured, zero hassle.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: ShieldCheck, label: "Fully Insured" },
                { icon: Key, label: "Easy Pickup" },
                { icon: Clock3, label: "Flexible Duration" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85"
                >
                  <Icon className="h-4 w-4 text-[#ff6a00]" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <a
            href="#book"
            className="mt-10 inline-flex h-14 items-center gap-2 border border-orange-500/40 bg-[#ff6a00] px-10 text-sm font-bold text-white shadow-lg shadow-orange-500/40 transition hover:-translate-y-0.5 hover:bg-[#e65f00]"
          >
            Book Now <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ── Main ─────────────────────────────────────────── */}
      <main id="book" className="bg-[#f8f9fc]">
        <div className="border-b border-gray-100 bg-white px-4 py-8">
          <div className="mx-auto max-w-[1400px]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#4228c4]">
              Available Fleet
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              Choose your vehicle &amp; complete your booking
            </h2>
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] px-4 py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">

            {/* ── Fleet Grid ──────────────────────────────── */}
            <div>
              <p className="mb-5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Step 1 — Select a Vehicle
              </p>

              {/* Loading state */}
              {loading && (
                <div className="flex h-64 items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#4228c4]" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Loading vehicles...
                    </p>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!loading && vehicles.length === 0 && (
                <div className="flex h-64 flex-col items-center justify-center border border-gray-100 bg-white text-center">
                  <Car className="mb-3 h-10 w-10 text-gray-200" />
                  <p className="text-sm font-bold text-gray-400">No vehicles available right now.</p>
                  <p className="text-xs text-gray-300">Please check back soon.</p>
                </div>
              )}

              {/* Vehicle cards */}
              {!loading && vehicles.length > 0 && (
                <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedVehicles.map((v) => {
                    const active = selectedCar === v.id;
                    const imgSrc = getImage(v);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedCar(v.id)}
                        className={`group relative flex flex-col overflow-hidden border bg-white text-left transition-all duration-300 cursor-pointer hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] ${
                          active
                            ? "border-[#4228c4] shadow-[0_8px_32px_rgba(66,40,196,0.14)]"
                            : "border-gray-100 hover:border-[#4228c4]/30"
                        }`}
                      >
                        {/* Image */}
                        <div className="relative aspect-[16/10] overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgSrc}
                            alt={`${v.make} ${v.model}`}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Type badge */}
                          <span className="absolute top-3 left-3 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-900">
                            {v.type}
                          </span>
                          {/* Selected check */}
                          {active && (
                            <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#4228c4]">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col p-5">
                          <h3
                            className={`text-base font-bold leading-tight transition-colors ${
                              active
                                ? "text-[#4228c4]"
                                : "text-gray-900 group-hover:text-[#4228c4]"
                            }`}
                          >
                            {v.make} {v.model}
                          </h3>
                          <p className="mb-3 text-xs text-gray-400">{v.trim}</p>

                          {/* Specs */}
                          <div className="mb-3 flex flex-wrap gap-x-2 gap-y-1 text-[11px] font-bold text-gray-400">
                            <span>{v.year}</span>
                            <span className="text-gray-200">•</span>
                            <span>{v.mileage.toLocaleString()} mi</span>
                            <span className="text-gray-200">•</span>
                            <span>{v.fuel}</span>
                            <span className="text-gray-200">•</span>
                            <span>{v.transmission}</span>
                          </div>

                          {/* Location */}
                          <div className="mb-4 flex items-center gap-1 text-[11px] font-bold text-gray-400">
                            <MapPin className="h-3 w-3" />
                            {v.postcode}
                          </div>


                        </div>

                        {active && <div className="h-1 w-full bg-[#4228c4]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                    {/* Count info */}
                    <p className="text-xs font-bold text-gray-400">
                      Showing {(currentPage - 1) * CARS_PER_PAGE + 1}–
                      {Math.min(currentPage * CARS_PER_PAGE, vehicles.length)} of{" "}
                      {vehicles.length} vehicles
                    </p>

                    {/* Page buttons */}
                    <div className="flex items-center gap-1">
                      {/* Prev */}
                      <button
                        type="button"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="inline-flex h-9 w-9 items-center justify-center border border-gray-200 bg-white text-gray-500 transition hover:border-[#4228c4] hover:text-[#4228c4] disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => goToPage(page)}
                          className={`inline-flex h-9 w-9 items-center justify-center border text-xs font-bold transition ${
                            page === currentPage
                              ? "border-[#4228c4] bg-[#4228c4] text-white"
                              : "border-gray-200 bg-white text-gray-600 hover:border-[#4228c4] hover:text-[#4228c4]"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      {/* Next */}
                      <button
                        type="button"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="inline-flex h-9 w-9 items-center justify-center border border-gray-200 bg-white text-gray-500 transition hover:border-[#4228c4] hover:text-[#4228c4] disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Next page"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
                </>
              )}
            </div>

            {/* ── Booking Form ────────────────────────────── */}
            <div>
              <p className="mb-5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Step 2 — Fill Booking Details
              </p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center border border-gray-100 bg-white px-8 py-16 text-center shadow-sm">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#4228c4]/10">
                    <CheckCircle className="h-8 w-8 text-[#4228c4]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Booking Request Sent!</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    We've received your request for a{" "}
                    <strong>
                      {selectedVehicle?.make} {selectedVehicle?.model}
                    </strong>
                    . Our team will contact you on <strong>{phone}</strong> shortly.
                  </p>
                  <button
                    onClick={resetForm}
                    className="mt-6 inline-flex items-center gap-2 bg-[#ff6a00] px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:-translate-y-0.5 hover:bg-[#e65f00]"
                  >
                    Make Another Booking
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="border border-gray-100 bg-white shadow-sm"
                >
                  {/* Selected car banner */}
                  <div
                    className={`border-b border-gray-100 px-6 py-4 transition-colors ${
                      selectedVehicle ? "bg-[#4228c4]/5" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Car
                        className={`h-5 w-5 ${
                          selectedVehicle ? "text-[#4228c4]" : "text-gray-300"
                        }`}
                      />
                      <span
                        className={`text-sm font-bold ${
                          selectedVehicle ? "text-[#4228c4]" : "text-gray-400"
                        }`}
                      >
                        {selectedVehicle
                          ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year})`
                          : "No vehicle selected yet"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    {/* Pickup location */}
                    <Field label="Pickup Location" icon={MapPin}>
                      <div className="relative">
                        <select
                          required
                          value={pickupLocation}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          className={`${inputBase} cursor-pointer appearance-none pl-10 pr-10 pt-5 pb-1`}
                        >
                          {LOCATIONS.map((l) => (
                            <option key={l} value={l === "Select Location" ? "" : l}>
                              {l}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      </div>
                    </Field>

                    {/* Drop-off location */}
                    <Field label="Drop-off Location" icon={MapPin}>
                      <div className="relative">
                        <select
                          required
                          value={dropoffLocation}
                          onChange={(e) => setDropoffLocation(e.target.value)}
                          className={`${inputBase} cursor-pointer appearance-none pl-10 pr-10 pt-5 pb-1`}
                        >
                          {LOCATIONS.map((l) => (
                            <option key={l} value={l === "Select Location" ? "" : l}>
                              {l}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      </div>
                    </Field>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Pickup Date" icon={CalendarDays}>
                        <input
                          type="date"
                          required
                          value={pickupDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className={`${inputBase} pl-10 pr-3 pt-5 pb-1`}
                        />
                      </Field>
                      <Field label="Return Date" icon={CalendarDays}>
                        <input
                          type="date"
                          required
                          value={returnDate}
                          min={pickupDate || new Date().toISOString().split("T")[0]}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className={`${inputBase} pl-10 pr-3 pt-5 pb-1`}
                        />
                      </Field>
                    </div>

                    {/* Name */}
                    <Field label="Full Name">
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`${inputBase} px-4 pt-5 pb-1`}
                      />
                    </Field>

                    {/* Phone */}
                    <Field label="Phone Number">
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +256 700 000 000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`${inputBase} px-4 pt-5 pb-1`}
                      />
                    </Field>



                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!selectedCar}
                      className="inline-flex h-14 w-full items-center justify-center gap-2 border border-orange-500/40 bg-[#ff6a00] text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e65f00] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {selectedCar ? "Request Booking" : "Select a Vehicle First"}
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    {!selectedCar && (
                      <p className="text-center text-[11px] text-gray-400">
                        ← Select a vehicle from the grid on the left
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
