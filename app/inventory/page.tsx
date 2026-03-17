"use client";

import { Suspense } from "react";
import { VehicleSearchPage } from "@/components/VehicleSearchPage";

export default function InventoryPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#f8f9fc]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#4228c4]" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Inventory...</p>
        </div>
      </div>
    }>
      <VehicleSearchPage />
    </Suspense>
  );
}
