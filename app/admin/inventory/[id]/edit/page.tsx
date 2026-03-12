"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useParams } from "next/navigation";

export default function EditInventoryPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : "item";

  return (
    <div className="space-y-6">
      <Link href="/admin/inventory" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black">
        <ArrowLeft className="h-4 w-4" />
        Back to Inventory
      </Link>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Edit Inventory Item</h2>
          <p className="mt-2 text-gray-500">Updating item: {id}</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-[#4228c4] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3621a1]">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <input className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" defaultValue="Sample Inventory Item" />
          <input className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" defaultValue="SKU-001" />
          <input className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" defaultValue="UGX 120,000" />
          <input className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" defaultValue="18" />
        </div>
        <textarea className="mt-5 h-40 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" defaultValue="This placeholder edit page was added from the imported dashboard structure and adapted to the current store admin." />
      </div>
    </div>
  );
}
