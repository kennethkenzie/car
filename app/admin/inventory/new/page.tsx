"use client";

import { VehicleWizard } from "@/components/VehicleWizard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewVehiclePage() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6">
        <Link href="/admin/inventory" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Link>
      </div>
      <VehicleWizard mode="create" />
    </div>
  );
}
