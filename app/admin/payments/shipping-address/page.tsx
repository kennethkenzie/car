"use client";

import { Button } from "@/components/Button";
import { CheckCircle2, MapPin, PackageCheck, Phone } from "lucide-react";

const inputClassName =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#4228c4]";

export default function ShippingAddressPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Shipping Address
          </h2>
          <p className="mt-2 text-gray-500">
            Review the warehouse collection point and payout delivery contact details used for
            payment and fulfilment workflows.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Route active
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Recipient Name
              </label>
              <input className={inputClassName} defaultValue="Car Bazaar Dispatch Team" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Contact Phone
              </label>
              <input className={inputClassName} defaultValue="+256 700 000000" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Alternate Phone
              </label>
              <input className={inputClassName} defaultValue="+256 750 000000" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Street Address
              </label>
              <input
                className={inputClassName}
                defaultValue="Plot 14, Bond Warehouse Road"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">City</label>
              <input className={inputClassName} defaultValue="Kampala" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">Region</label>
              <input className={inputClassName} defaultValue="Central Region" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Postal Code
              </label>
              <input className={inputClassName} defaultValue="256" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">Country</label>
              <input className={inputClassName} defaultValue="Uganda" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Delivery Notes
              </label>
              <textarea
                className="h-32 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#4228c4]"
                defaultValue="Use this address for shipping confirmations, carrier bookings, and payout-related paperwork."
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary">Save Address</Button>
            <Button variant="outline">Reset</Button>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-[#111827] p-8 text-white shadow-xl">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
              Payment Fulfilment
            </div>
            <div className="mt-3 text-3xl font-extrabold">Primary Dispatch Point</div>
            <p className="mt-3 text-sm leading-6 text-white/70">
              This route is now available and can be linked to future shipping and payment
              modules without returning a 404.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Address Checklist</h3>
            <div className="mt-5 space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[#4228c4]" />
                <span>Use a physical receiving address for bonded inventory and parts.</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-[#4228c4]" />
                <span>Keep at least one reachable phone number for carrier coordination.</span>
              </div>
              <div className="flex items-start gap-3">
                <PackageCheck className="mt-0.5 h-4 w-4 text-[#4228c4]" />
                <span>Confirm any special receiving notes before enabling automated payments.</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
