"use client";

import Link from "next/link";
import { Edit2, Mail, MapPin, Phone, Plus, Store, Trash2 } from "lucide-react";

const dealers = [
  { slug: "kampala-central", name: "Modern Kampala Central", email: "kampala@modern.co.ug", phone: "+256 700 111222", postcode: "KLA-001", status: "ACTIVE" },
  { slug: "nakawa-branch", name: "Modern Nakawa", email: "nakawa@modern.co.ug", phone: "+256 700 333444", postcode: "KLA-014", status: "PENDING" },
  { slug: "mbarara-branch", name: "Modern Mbarara", email: "mbarara@modern.co.ug", phone: "+256 700 555666", postcode: "MBR-003", status: "ACTIVE" },
];

export default function DealersPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">Dealer Management</h2>
          <p className="mt-1 text-sm font-medium text-gray-500">Register and manage dealership locations.</p>
        </div>
        <Link href="/admin/dealers/new" className="inline-flex items-center gap-2 rounded-2xl bg-[#4228c4] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-[#4228c4]/20 transition hover:bg-[#351ea3]">
          <Plus className="h-4 w-4" />
          Add Dealer
        </Link>
      </div>

      <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                {["Dealer", "Contact", "Location", "Status", ""].map((head) => (
                  <th key={head} className="px-3 py-4">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dealers.map((row) => (
                <tr key={row.slug} className="border-b border-gray-50 last:border-b-0">
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50">
                        <Store className="h-5 w-5 text-gray-300" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{row.name}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{row.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <Mail className="h-3 w-3" />
                        {row.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <Phone className="h-3 w-3" />
                        {row.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      <MapPin className="h-3.5 w-3.5 text-gray-300" />
                      {row.postcode}
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${row.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-gray-300 transition hover:text-[#4228c4]">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-300 transition hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
