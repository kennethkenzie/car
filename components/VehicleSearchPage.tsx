"use client";

import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { FiltersSidebar, FilterValue } from "./FiltersSidebar";
import { VehicleCard } from "./VehicleCard";
import { Vehicle } from "@/lib/types";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Grid2X2, List as ListIcon, SlidersHorizontal } from "lucide-react";

const INITIAL_FILTERS: FilterValue = {
  q: "",
  make: "",
  model: "",
  priceMin: "",
  priceMax: "",
  yearMin: "",
  yearMax: "",
  mileageMax: "",
  fuel: "",
  transmission: "",
  bodyType: "",
  distance: "",
  postcode: "",
};

export function VehicleSearchPage({ type }: { type?: "CAR" | "VAN" }) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterValue>(INITIAL_FILTERS);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setFilters({
      ...INITIAL_FILTERS,
      q: searchParams.get("q") ?? "",
      make: searchParams.get("make") ?? "",
      model: searchParams.get("model") ?? "",
      priceMin: searchParams.get("priceMin") ?? "",
      priceMax: searchParams.get("priceMax") ?? "",
      yearMin: searchParams.get("yearMin") ?? "",
      yearMax: searchParams.get("yearMax") ?? "",
      mileageMax: searchParams.get("mileageMax") ?? "",
      fuel: (searchParams.get("fuel") ?? "").toUpperCase(),
      transmission: (searchParams.get("transmission") ?? "").toUpperCase(),
      bodyType: searchParams.get("bodyType") ?? "",
      distance: searchParams.get("distance") ?? "",
      postcode: searchParams.get("postcode") ?? "",
    });
  }, [searchParams]);

  const { data: vData, isLoading } = useQuery({
    queryKey: ["vehicles", type || "all"],
    queryFn: async () => {
      const res = await fetch(`/api/vehicles/public${type ? `?type=${type}` : ""}`);
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      return res.json();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const vehicles = (vData as Vehicle[]) || [];

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const q = filters.q.toLowerCase();
      if (q && !v.make.toLowerCase().includes(q) && !v.model.toLowerCase().includes(q)) return false;
      if (filters.make && v.make.toLowerCase() !== filters.make.toLowerCase()) return false;
      if (filters.model && v.model.toLowerCase() !== filters.model.toLowerCase()) return false;
      if (filters.priceMin && Number(v.price) < Number(filters.priceMin)) return false;
      if (filters.priceMax && Number(v.price) > Number(filters.priceMax)) return false;
      if (filters.yearMin && Number(v.year) < Number(filters.yearMin)) return false;
      if (filters.yearMax && Number(v.year) > Number(filters.yearMax)) return false;
      if (filters.mileageMax && Number(v.mileage) > Number(filters.mileageMax)) return false;
      if (filters.fuel && v.fuel.toUpperCase() !== filters.fuel.toUpperCase()) return false;
      if (filters.transmission && v.transmission.toUpperCase() !== filters.transmission.toUpperCase()) return false;
      if (filters.bodyType && ((v as any).bodyType ?? "").toLowerCase() !== filters.bodyType.toLowerCase()) return false;
      if (filters.postcode && !v.postcode.toLowerCase().includes(filters.postcode.toLowerCase())) return false;
      return true;
    });
  }, [vehicles, filters]);

  const makeOptions = useMemo(() => Array.from(new Set(vehicles.map((v) => v.make))), [vehicles]);
  const modelOptions = useMemo(() => {
    const filtered = filters.make ? vehicles.filter((v) => v.make === filters.make) : vehicles;
    return Array.from(new Set(filtered.map((v) => v.model)));
  }, [vehicles, filters.make]);

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Header />
      
      <main className="mx-auto max-w-[1440px] px-6 py-12 pt-44">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar - Desktop */}
          <div className="hidden w-80 shrink-0 lg:block">
            <FiltersSidebar
              value={filters}
              makeOptions={makeOptions}
              modelOptions={modelOptions}
              onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
              onReset={() => setFilters(INITIAL_FILTERS)}
              onSave={() => alert("Search saved!")}
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  {type === "CAR" ? "Premium Cars" : type === "VAN" ? "Reliable Vans" : "Premium Inventory"}
                </h1>
                <p className="mt-1 text-sm font-bold text-gray-400 uppercase tracking-widest">
                  {filteredVehicles.length} vehicles available
                </p>
              </div>

              <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
                <button 
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-900 lg:hidden shadow-sm active:scale-95 transition-transform"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </button>

                <div className="flex items-center rounded-xl bg-white p-1 shadow-sm border border-gray-100">
                  <button
                    onClick={() => setView("grid")}
                    className={`rounded-lg p-2 transition-all ${view === "grid" ? "bg-[#4228c4] text-white shadow-md shadow-[#4228c4]/20" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <Grid2X2 size={18} />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`rounded-lg p-2 transition-all ${view === "list" ? "bg-[#4228c4] text-white shadow-md shadow-[#4228c4]/20" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <ListIcon size={18} />
                  </button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[16/10] animate-pulse rounded-[2rem] bg-gray-100" />
                ))}
              </div>
            ) : filteredVehicles.length > 0 ? (
              <div className={`grid gap-6 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {filteredVehicles.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} view={view} />
                ))}
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-gray-200 bg-white/50 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-6">
                  <SlidersHorizontal className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No results found</h3>
                <p className="mt-2 text-gray-500 font-medium">Try adjusting your filters to find your perfect vehicle.</p>
                <button
                  onClick={() => setFilters(INITIAL_FILTERS)}
                  className="mt-6 text-sm font-bold text-[#4228c4] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            <button onClick={() => setShowMobileFilters(false)} className="text-sm font-bold text-gray-400">Close</button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <FiltersSidebar
              value={filters}
              makeOptions={makeOptions}
              modelOptions={modelOptions}
              onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
              onReset={() => {
                setFilters(INITIAL_FILTERS);
                setShowMobileFilters(false);
              }}
              onSave={() => {
                alert("Search saved!");
                setShowMobileFilters(false);
              }}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
