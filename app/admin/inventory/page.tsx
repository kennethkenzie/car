"use client";

import { DataTable } from "@/components/DataTable";
import { useAuth } from "@/components/providers/AuthProvider";
import { getDealerVehicles, deleteVehicleReal, publishVehicleReal, archiveVehicleReal } from "@/lib/api";
import { formatGBP } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Plus } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: "bg-green-500/10 text-green-600 border border-green-500/20",
  DRAFT: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  SOLD: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
  ARCHIVED: "bg-gray-500/10 text-gray-600 border border-gray-500/20"
};

export default function InventoryPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const query = useQuery({
    queryKey: ["dealer-vehicles"],
    queryFn: getDealerVehicles
  });

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-[#121212] tracking-tight mb-2">Inventory Management</h1>
          <p className="text-gray-500 font-medium">Manage and monitor your vehicle listings effortlessly.</p>
        </div>
        {isAdmin ? (
          <Link href="/admin/inventory/new">
            <button className="flex items-center gap-2 rounded-2xl bg-[#4228c4] px-6 py-4 text-sm font-bold text-white hover:bg-[#3621a1] transition-all shadow-xl shadow-[#4228c4]/20 active:scale-95 group">
              <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
              Register a Vehicle
            </button>
          </Link>
        ) : null}
      </div>

      <DataTable
        data={query.data ?? []}
        searchKey="make"
        columns={[
          {
            key: "make",
            label: "Vehicle",
            render: (v: any) => (
              <div className="flex items-center gap-4">
                <div className="h-12 w-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  {v.images?.[0] ? <img src={typeof v.images[0] === 'string' ? v.images[0] : v.images[0].url} alt="" className="h-full w-full object-cover" /> : <Plus className="h-4 w-4 text-gray-300" />}
                </div>
                <div>
                  <p className="font-bold text-gray-900 leading-none mb-1">{v.make} {v.model}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{v.trim}</p>
                </div>
              </div>
            )
          },
          { key: "year", label: "Year" },
          {
            key: "price",
            label: "Price",
            render: (v: any) => <span className="font-black text-gray-900">{formatGBP(v.price)}</span>
          },
          {
            key: "mileage",
            label: "Mileage",
            render: (v: any) => <span className="text-gray-500">{v.mileage.toLocaleString()} mi</span>
          },
          {
            key: "status",
            label: "Status",
            render: (v: any) => (
              <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${STATUS_COLORS[v.status] ?? "bg-gray-100 text-gray-500"}`}>
                {v.status}
              </span>
            )
          },
          {
            key: "actions",
            label: "Action",
            render: (v: any) => (
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <Link
                  href={`/admin/inventory/${v.id}/edit`}
                  className="inline-flex items-center font-bold text-[#4228c4] hover:underline"
                >
                  Edit
                </Link>
                {v.status === 'PUBLISHED' ? (
                  <button
                    onClick={async () => {
                      if (confirm("Unpublish this listing? It will be moved to archived.")) {
                        try {
                          await archiveVehicleReal(v.id);
                          query.refetch();
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }
                    }}
                    className="font-bold text-amber-600 hover:underline"
                  >
                    Unpublish
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        await publishVehicleReal(v.id);
                        query.refetch();
                      } catch (err: any) {
                        alert(err.message);
                      }
                    }}
                    className="font-bold text-green-600 hover:underline"
                  >
                    Publish
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (confirm("Permanently delete this listing?")) {
                      try {
                        await deleteVehicleReal(v.id);
                        query.refetch();
                      } catch (err: any) {
                        alert(err.message);
                      }
                    }
                  }}
                  className="font-bold text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            )
          }
        ]}
      />
    </div>
  );
}
