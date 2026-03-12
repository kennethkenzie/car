"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewDealerPage() {
  return (
    <div className="space-y-6">
      <Link href="/admin/dealers" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black">
        <ArrowLeft className="h-4 w-4" />
        Back to Dealers
      </Link>

      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Register New Dealer</h2>
        <p className="mt-2 text-gray-500">Add branch details and assign an initial account owner.</p>
      </div>

      <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <input className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" placeholder="Dealer Name" />
          <input className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" placeholder="Dealer Email" />
          <input className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" placeholder="Phone Number" />
          <input className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" placeholder="Postcode / Branch Code" />
        </div>
        <input className="mt-5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" placeholder="Address" />
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <input className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" placeholder="Admin Username" />
          <input className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" placeholder="Initial Password" type="password" />
        </div>
        <button className="mt-6 rounded-xl bg-[#4228c4] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#351ea3]">
          Register Dealer
        </button>
      </div>
    </div>
  );
}
