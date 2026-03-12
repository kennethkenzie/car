"use client";

import { VehicleWizard } from "@/components/VehicleWizard";
import { getVehicleById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditVehiclePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => getVehicleById(id as string),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#4228c4]" />
        <p className="text-gray-500 font-medium">Fetching vehicle details...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Vehicle Not Found</h2>
        <p className="text-gray-500 mt-2">The record you're looking for doesn't exist.</p>
        <Link href="/admin/inventory">
          <button className="mt-6 bg-black text-white px-8 py-3 rounded-2xl font-bold">Back to Inventory</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6">
        <Link href="/admin/inventory" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Link>
      </div>
      <VehicleWizard mode="edit" initialData={vehicle as any} />
    </div>
  );
}
