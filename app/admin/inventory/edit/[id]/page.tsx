"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import { ArrowLeft } from "lucide-react";

export default function EditVehiclePage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  // Fixed typo in brand name and adapted for Car Bazaar admin
  const canUpload = (user?.email === "admin@carbazaar.com" || user?.role === "ADMIN");

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="mb-8">
        <Link href="/admin/inventory" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-4">
          <ArrowLeft size={16} />
          Back to Inventory
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Vehicle</h1>
        <p className="text-gray-500 mt-2">Vehicle ID: <span className="font-mono text-black">{params.id}</span></p>
      </div>

      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="max-w-xl">
          <h2 className="text-xl font-bold text-gray-900">Vehicle Wizard</h2>
          <p className="mt-2 text-slate-600">
            Use the centralized wizard to manage listing details, high-resolution photos, and the publication status of this vehicle.
          </p>
        </div>
        
        <div className="pt-6 border-t border-slate-100">
          {canUpload ? (
            <Link href="/admin/inventory/new">
              <Button size="lg">Open Wizard</Button>
            </Link>
          ) : (
            <div className="rounded-xl bg-amber-50 p-4 border border-amber-100 flex items-center gap-3 text-amber-800 text-sm font-medium">
              <span>You do not have permission to edit this listing. Please contact the administrator.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
