"use client";

import { useState } from "react";
import { User, Dealer } from "@/lib/types";
import { adminCreateDealer, updateDealerReal } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Button } from "./Button";
import { Store, Mail, Phone, MapPin, Building2 } from "lucide-react";

interface DealerProfileFormProps {
  mode: "create" | "edit";
  user: User | null;
  dealer?: Dealer;
  onLinkedDealer?: (dealerId: string) => void;
}

export function DealerProfileForm({ mode, user, dealer, onLinkedDealer }: DealerProfileFormProps) {
  const [form, setForm] = useState({
    name: dealer?.name || "",
    email: dealer?.email || "",
    phone: dealer?.phone || "",
    address: dealer?.address || "",
    postcode: dealer?.postcode || "",
  });
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) => formData.append(key, val as string));
      if (mode === "create") {
         return adminCreateDealer(formData);
      } else {
         return updateDealerReal(dealer?.slug || "", formData);
      }
    },
    onSuccess: (res: any) => {
      if (mode === "create" && onLinkedDealer && res.dealerId) {
        onLinkedDealer(res.dealerId);
      }
      alert("Dealer profile saved successfully!");
    },
    onError: (err: any) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate(form);
  };

  const inputCls = "w-full border border-gray-100 bg-gray-50 px-4 py-3 rounded-xl text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4228c4]/20 transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5 col-span-full">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
            <Store size={12} /> Dealership Name
          </label>
          <input
            className={inputCls}
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Car Baazar Kampala"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
            <Mail size={12} /> Contact Email
          </label>
          <input
            type="email"
            className={inputCls}
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="carbazar77@gmail.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
            <Phone size={12} /> Phone Number
          </label>
          <input
            className={inputCls}
            required
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            placeholder="+256 700 000 000"
          />
        </div>

        <div className="space-y-1.5 col-span-full">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
            <Building2 size={12} /> Street Address
          </label>
          <input
            className={inputCls}
            required
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            placeholder="Plot 12, Entebbe Road"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
            <MapPin size={12} /> Area/Postcode
          </label>
          <input
            className={inputCls}
            required
            value={form.postcode}
            onChange={e => setForm({ ...form, postcode: e.target.value })}
            placeholder="Kampala Central"
          />
        </div>
      </div>

      {error && <p className="text-xs font-bold text-red-500">{error}</p>}

      <div className="pt-6 border-t border-gray-50">
        <Button
          type="submit"
          disabled={mutation.isPending}
          variant="secondary"
          className="w-full py-4 text-base"
        >
          {mutation.isPending ? "Saving Profile..." : (mode === "create" ? "Register Dealership" : "Update Profile")}
        </Button>
      </div>
    </form>
  );
}
