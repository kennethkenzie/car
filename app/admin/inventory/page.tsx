"use client";

import { DataTable } from "@/components/DataTable";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  fetchDealerInventory,
  deleteVehicleReal,
  publishVehicleReal,
  archiveVehicleReal,
  featureVehicleReal,
  unfeatureVehicleReal,
  markSoldVehicleReal,
  unmarkSoldVehicleReal,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Plus, Car } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

const STOCK_TYPE_COLORS: Record<string, string> = {
  NEW: "bg-[#4228c4]/10 text-[#4228c4] border border-[#4228c4]/20",
  USED: "bg-slate-500/10 text-slate-600 border border-slate-500/20",
};

const LISTING_CATEGORY_COLORS: Record<string, string> = {
  SALE: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  HIRE: "bg-orange-500/10 text-orange-600 border border-orange-500/20",
};

function StatusToggles({ v, onRefetch }: { v: any; onRefetch: () => void }) {
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (key: string, fn: () => Promise<any>) => {
    setBusy(key);
    try {
      await fn();
      onRefetch();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  const isPublished = v.status === "PUBLISHED";
  const isSold = v.status === "SOLD";
  const isFeatured = Boolean(v.isFeatured);

  return (
    <div className="flex flex-col gap-2.5">
      {/* Published toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <Toggle
          checked={isPublished}
          disabled={!!busy}
          size="large"
          color={isPublished ? "green" : "gray"}
          onChange={() =>
            run("publish", () =>
              isPublished ? archiveVehicleReal(v.id) : publishVehicleReal(v.id)
            )
          }
        />
        <span className={`text-[11px] font-bold uppercase tracking-widest ${isPublished ? "text-green-600" : "text-gray-400"}`}>
          {busy === "publish" ? "…" : isPublished ? "Published" : "Unpublished"}
        </span>
      </label>

      {/* Sold toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <Toggle
          checked={isSold}
          disabled={!!busy}
          size="large"
          color={isSold ? "red" : "gray"}
          onChange={() =>
            run("sold", () =>
              isSold ? unmarkSoldVehicleReal(v.id) : markSoldVehicleReal(v.id)
            )
          }
        />
        <span className={`text-[11px] font-bold uppercase tracking-widest ${isSold ? "text-red-600" : "text-gray-400"}`}>
          {busy === "sold" ? "…" : isSold ? "Sold" : "Available"}
        </span>
      </label>

      {/* Featured toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <Toggle
          checked={isFeatured}
          disabled={!!busy}
          size="large"
          color={isFeatured ? "purple" : "gray"}
          onChange={() =>
            run("feature", () =>
              isFeatured ? unfeatureVehicleReal(v.id) : featureVehicleReal(v.id)
            )
          }
        />
        <span className={`text-[11px] font-bold uppercase tracking-widest ${isFeatured ? "text-[#4228c4]" : "text-gray-400"}`}>
          {busy === "feature" ? "…" : isFeatured ? "Featured" : "Not Featured"}
        </span>
      </label>
    </div>
  );
}

export default function InventoryPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const query = useQuery({
    queryKey: ["dealer-vehicles"],
    queryFn: fetchDealerInventory,
  });

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-[#121212] tracking-tight mb-2">Inventory Management</h1>
          <p className="text-gray-500 font-medium">Manage and monitor your vehicle listings effortlessly.</p>
        </div>
        {isAdmin && (
          <Link href="/admin/inventory/new">
            <button className="flex items-center gap-2 rounded-2xl bg-[#4228c4] px-6 py-4 text-sm font-bold text-white hover:bg-[#3621a1] transition-all shadow-xl shadow-[#4228c4]/20 active:scale-95 group">
              <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
              Register a Vehicle
            </button>
          </Link>
        )}
      </div>

      <DataTable
        loading={query.isLoading}
        data={query.data ?? []}
        searchKey="make"
        columns={[
          {
            key: "make",
            label: "Vehicle",
            render: (v: any) => (
              <div className="flex items-center gap-4">
                <div className="h-12 w-16 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                  {v.images?.[0] ? (
                    <img 
                      src={typeof v.images[0] === "string" ? v.images[0] : v.images[0].url}
                      alt="" 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <Car className="h-5 w-5 text-gray-300" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 leading-none mb-1">{v.make} {v.model}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{v.trim || "Standard"}</p>
                </div>
              </div>
            ),
          },
          { key: "year", label: "Year" },
          {
            key: "stockType",
            label: "Type",
            render: (v: any) => (
              <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${STOCK_TYPE_COLORS[v.stockType] ?? STOCK_TYPE_COLORS.USED}`}>
                {v.stockType ?? "USED"}
              </span>
            ),
          },
          {
            key: "listingCategory",
            label: "Category",
            render: (v: any) => (
              <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${LISTING_CATEGORY_COLORS[v.listingCategory] ?? LISTING_CATEGORY_COLORS.SALE}`}>
                {v.listingCategory ?? "SALE"}
              </span>
            ),
          },
          {
            key: "price",
            label: "Price",
            render: (v: any) => (
              <span className="font-bold text-[#4228c4]">
                UGX {Number(v.price).toLocaleString()}
              </span>
            ),
          },
          {
            key: "mileage",
            label: "Mileage",
            render: (v: any) => (
              <span className="text-gray-500 font-medium">{v.mileage.toLocaleString()} km</span>
            ),
          },
          {
            key: "status",
            label: "Status / Controls",
            render: (v: any) => <StatusToggles v={v} onRefetch={() => query.refetch()} />,
          },
          {
            key: "actions",
            label: "Actions",
            render: (v: any) => (
              <div className="flex flex-col gap-2 text-xs">
                <Link
                  href={`/admin/inventory/${v.id}/edit`}
                  className="font-bold text-[#4228c4] hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={async () => {
                    if (confirm("Permanently delete this vehicle listing? This cannot be undone.")) {
                      try {
                        await deleteVehicleReal(v.id);
                        query.refetch();
                      } catch (err: any) {
                        alert(err.message);
                      }
                    }
                  }}
                  className="font-bold text-red-500 hover:underline text-left"
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
