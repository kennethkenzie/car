"use client";

import { Button } from "./Button";
import { Input } from "./Input";
import { Search, RotateCcw, Bookmark } from "lucide-react";

export type FilterValue = {
  q: string;
  make: string;
  model: string;
  priceMin: string;
  priceMax: string;
  yearMin: string;
  yearMax: string;
  mileageMax: string;
  fuel: string;
  transmission: string;
  bodyType: string;
  distance: string;
  postcode: string;
};

function CleanSelect({
  value,
  onChange,
  options,
  label
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  label: string;
}) {
  return (
    <div className="relative group">
      <label className="absolute left-3 top-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-400 z-10">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 pt-5 pb-1 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4228c4]/20 transition appearance-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FiltersSidebar({
  value,
  modelOptions,
  makeOptions,
  onChange,
  onReset,
  onSave
}: {
  value: FilterValue;
  modelOptions: string[];
  makeOptions: string[];
  onChange: (next: Partial<FilterValue>) => void;
  onReset: () => void;
  onSave: () => void;
}) {
  return (
    <aside className="space-y-6 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-extrabold text-[#121212] text-lg">Filters</h2>
        <button onClick={onReset} className="text-gray-400 hover:text-[#4228c4] transition-colors p-1" title="Reset all">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search make or model..."
            value={value.q}
            onChange={(e) => onChange({ q: e.target.value })}
            className="w-full rounded-xl border border-gray-100 bg-gray-50 pl-10 pr-4 py-3 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4228c4]/20 transition"
          />
        </div>

        <CleanSelect
          label="Make"
          value={value.make || "any_make"}
          onChange={(v) => onChange({ make: v === "any_make" ? "" : v, model: "" })}
          options={[{ label: "Any make", value: "any_make" }, ...makeOptions.map((x) => ({ label: x, value: x }))]}
        />

        <CleanSelect
          label="Model"
          value={value.model || "any_model"}
          onChange={(v) => onChange({ model: v === "any_model" ? "" : v })}
          options={[{ label: "Any model", value: "any_model" }, ...modelOptions.map((x) => ({ label: x, value: x }))]}
        />

        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <label className="absolute left-3 top-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-400">Min UGX</label>
            <input
              type="number"
              value={value.priceMin}
              onChange={(e) => onChange({ priceMin: e.target.value })}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 pt-5 pb-1 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4228c4]/20 transition"
            />
          </div>
          <div className="relative">
            <label className="absolute left-3 top-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-400">Max UGX</label>
            <input
              type="number"
              value={value.priceMax}
              onChange={(e) => onChange({ priceMax: e.target.value })}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 pt-5 pb-1 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4228c4]/20 transition"
            />
          </div>
        </div>

        <CleanSelect
          label="Fuel"
          value={value.fuel || "any_fuel"}
          onChange={(v) => onChange({ fuel: v === "any_fuel" ? "" : v })}
          options={[
            { label: "Any fuel", value: "any_fuel" },
            { label: "Petrol", value: "PETROL" },
            { label: "Diesel", value: "DIESEL" },
            { label: "Hybrid", value: "HYBRID" },
            { label: "Electric", value: "ELECTRIC" }
          ]}
        />

        <CleanSelect
          label="Transmission"
          value={value.transmission || "any_transmission"}
          onChange={(v) => onChange({ transmission: v === "any_transmission" ? "" : v })}
          options={[
            { label: "Any transmission", value: "any_transmission" },
            { label: "Manual", value: "MANUAL" },
            { label: "Automatic", value: "AUTOMATIC" }
          ]}
        />

        <div className="relative">
          <label className="absolute left-3 top-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-400">Postcode</label>
          <input
            placeholder="e.g. SW1A 1AA"
            value={value.postcode}
            onChange={(e) => onChange({ postcode: e.target.value })}
            className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 pt-5 pb-1 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4228c4]/20 transition"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-50">
        <button
          onClick={onSave}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#4228c4] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#4228c4]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Bookmark className="h-4 w-4" />
          Save Search
        </button>
      </div>
    </aside>
  );
}
