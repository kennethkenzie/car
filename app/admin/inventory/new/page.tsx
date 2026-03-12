"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { createVehicleReal, getDealers } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft, Car, Upload, X, CheckCircle2,
  MapPin, Tag, Layers, DollarSign, Image as ImageIcon,
  CarFront, Banknote, List
} from "lucide-react";

const MAKES = ["Audi", "BMW", "Ford", "Honda", "Hyundai", "Jaguar", "Kia", "Land Rover", "Lexus", "Mercedes-Benz", "Nissan", "Peugeot", "Porsche", "Renault", "SEAT", "Skoda", "Tesla", "Toyota", "Vauxhall", "Volkswagen", "Volvo"];
const BODY_TYPES = ["Hatchback", "Saloon", "Estate", "SUV / 4x4", "Coupe", "Convertible", "MPV", "Pickup", "Van"];
const FUELS = ["Petrol", "Diesel", "Hybrid", "Plug-in Hybrid", "Electric", "LPG"];
const TRANSMISSIONS = ["Manual", "Automatic", "Semi-Automatic"];
const COLOURS = ["Black", "White", "Silver", "Grey", "Blue", "Red", "Green", "Orange", "Yellow", "Brown", "Purple", "Gold"];
const CURRENT_YEAR = 2025;
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);
const CONDITIONS = ["Excellent", "Good", "Fair", "Poor"];

type FormData = {
  // Brand & Category
  make: string;
  model: string;
  trim: string;
  bodyType: string;
  type: string;
  // Vehicle Details
  year: string;
  mileage: string;
  fuel: string;
  transmission: string;
  colour: string;
  condition: string;
  doors: string;
  // Location & Price
  price: string;
  postcode: string;
  city: string;
  // Description
  description: string;
  features: string;
  // Status
  status: string;
  dealerId: string;
};

const EMPTY: FormData = {
  make: "", model: "", trim: "", bodyType: "", type: "CAR",
  year: "", mileage: "", fuel: "", transmission: "", colour: "", condition: "", doors: "5",
  price: "", postcode: "", city: "",
  description: "", features: "",
  status: "DRAFT",
  dealerId: ""
};

const STEPS = [
  { id: 0, label: "Brand & Category", icon: List },
  { id: 1, label: "Vehicle Details", icon: CarFront },
  { id: 2, label: "Location & Price", icon: Banknote },
  { id: 3, label: "Photos", icon: ImageIcon },
  { id: 4, label: "Description", icon: Layers },
];

const FUEL_VALUE_MAP: Record<string, string> = {
  Petrol: "PETROL",
  Diesel: "DIESEL",
  Hybrid: "HYBRID",
  "Plug-in Hybrid": "HYBRID",
  Electric: "ELECTRIC",
};

const TRANSMISSION_VALUE_MAP: Record<string, string> = {
  Manual: "MANUAL",
  Automatic: "AUTOMATIC",
  "Semi-Automatic": "AUTOMATIC",
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-800">{label}</label>
      {hint && <p className="mb-1.5 text-xs text-gray-400">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

export default function NewVehiclePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [images, setImages] = useState<{ src: string; file: File }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: dealers } = useQuery({
    queryKey: ["dealers"],
    queryFn: getDealers,
    enabled: user?.role === "ADMIN"
  });

  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        const src = ev.target?.result as string;
        setImages(imgs => imgs.length < 10 ? [...imgs, { src, file }] : imgs);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i: number) => setImages(imgs => imgs.filter((_, idx) => idx !== i));

  if (user?.role !== "ADMIN") {
    return (
      <div className="space-y-6 border border-amber-200 bg-amber-50 p-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Admin access required</h1>
          <p className="mt-2 text-sm text-gray-600">
            Only administrators can upload vehicles via this portal.
          </p>
        </div>
        <Link
          href="/admin/inventory"
          className="inline-flex items-center gap-2 border border-black px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-black hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const normalizedFuel = FUEL_VALUE_MAP[form.fuel];
      const normalizedTransmission = TRANSMISSION_VALUE_MAP[form.transmission];

      if (!normalizedFuel) {
        throw new Error("Select a supported fuel type.");
      }

      if (!normalizedTransmission) {
        throw new Error("Select a supported transmission type.");
      }

      const formData = new FormData();

      // Append form fields
      const payload: Record<string, string> = {
        ...form,
        color: form.colour,
        fuel: normalizedFuel,
        transmission: normalizedTransmission,
        locationPostcode: form.postcode,
      };

      Object.keys(payload).forEach((key) => {
        if (["postcode", "colour"].includes(key)) return;
        if (payload[key as keyof typeof payload]) {
          formData.append(key, payload[key as keyof typeof payload] as string);
        }
      });

      // Append images
      images.forEach(img => {
        formData.append("images", img.file);
      });

      await createVehicleReal(formData);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center bg-black">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
        <h2 className="mb-2 text-2xl font-black text-gray-900">
          {form.status === "PUBLISHED" ? "Car Listed!" : "Draft Saved!"}
        </h2>
        <p className="mb-8 text-gray-500">
          {form.year} {form.make} {form.model} has been {form.status === "PUBLISHED" ? "published to the marketplace" : "saved as a draft"}.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => { setForm(EMPTY); setImages([]); setSubmitted(false); setStep(0); }}
            className="border border-black px-6 py-2.5 text-sm font-semibold text-black hover:bg-black hover:text-white transition-all"
          >
            Add another car
          </button>
          <Link href="/admin/inventory">
            <button className="bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-all">
              View Inventory
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/inventory" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Link>
      </div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Register a Car</h1>
          <p className="text-sm text-gray-400 mt-1">Fill in the details below to list a vehicle</p>
        </div>
        {/* Publish / Draft toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => set("status", "DRAFT")}
            className={`px-4 py-2 text-sm font-semibold border transition-all ${form.status === "DRAFT" ? "bg-black text-white border-black" : "border-gray-200 text-gray-500 hover:border-black"}`}
          >
            Save as Draft
          </button>
          <button
            onClick={() => set("status", "PUBLISHED")}
            className={`px-4 py-2 text-sm font-semibold border transition-all ${form.status === "PUBLISHED" ? "bg-black text-white border-black" : "border-gray-200 text-gray-500 hover:border-black"}`}
          >
            Publish
          </button>
        </div>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-0 overflow-x-auto">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = step === i;
          const done = step > i;
          return (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={`flex flex-1 min-w-0 items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold transition-all whitespace-nowrap ${active ? "border-black text-black" : done ? "border-black/30 text-black/40" : "border-gray-200 text-gray-400 hover:border-gray-400"
                }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{s.label}</span>
              {done && <CheckCircle2 className="ml-auto h-3.5 w-3.5 shrink-0 text-black/40" />}
            </button>
          );
        })}
      </div>

      {/* Form Steps */}
      <div className="border border-gray-100 bg-white p-6 shadow-sm">
        {error && (
          <div className="mb-6 border-l-4 border-red-600 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ── Step 0: Brand & Category ── */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-base font-black text-gray-900">Brand & Category</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Vehicle Type">
                <div className="flex gap-3">
                  {["CAR", "VAN"].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set("type", t)}
                      className={`flex-1 flex gap-2 items-center justify-center border py-3 text-sm font-semibold transition-all ${form.type === t ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-black"}`}
                    >
                      {t === "CAR" ? <CarFront className="h-4 w-4 shrink-0" /> : <Car className="h-4 w-4 shrink-0" />}
                      {t === "CAR" ? "Car" : "Van"}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Make / Brand" hint="E.g. BMW, Audi, Ford">
                <select className={selectCls} value={form.make} onChange={e => set("make", e.target.value)}>
                  <option value="">Select make</option>
                  {MAKES.map(m => <option key={m}>{m}</option>)}
                </select>
              </Field>

              <Field label="Model" hint="E.g. 3 Series, Golf, Focus">
                <input className={inputCls} placeholder="Enter model" value={form.model} onChange={e => set("model", e.target.value)} />
              </Field>

              <Field label="Trim / Variant" hint="E.g. SE, M Sport, GTI">
                <input className={inputCls} placeholder="Enter trim (optional)" value={form.trim} onChange={e => set("trim", e.target.value)} />
              </Field>

              <Field label="Body Type">
                <select className={selectCls} value={form.bodyType} onChange={e => set("bodyType", e.target.value)}>
                  <option value="">Select body type</option>
                  {BODY_TYPES.map(b => <option key={b}>{b}</option>)}
                </select>
              </Field>

              {user?.role === "ADMIN" && dealers && (
                <Field label="Assigned Dealer" hint="Which dealership is listing this?">
                  <select className={selectCls} value={form.dealerId} onChange={e => set("dealerId", e.target.value)}>
                    <option value="">Default (Official / Auto-detect)</option>
                    {dealers.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </Field>
              )}
            </div>
          </div>
        )}

        {/* ── Step 1: Vehicle Details ── */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-base font-black text-gray-900">Vehicle Details</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Year">
                <select className={selectCls} value={form.year} onChange={e => set("year", e.target.value)}>
                  <option value="">Select year</option>
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </Field>

              <Field label="Mileage (miles)">
                <input className={inputCls} type="number" placeholder="e.g. 25000" value={form.mileage} onChange={e => set("mileage", e.target.value)} />
              </Field>

              <Field label="Fuel Type">
                <select className={selectCls} value={form.fuel} onChange={e => set("fuel", e.target.value)}>
                  <option value="">Select fuel</option>
                  {FUELS.map(f => <option key={f}>{f}</option>)}
                </select>
              </Field>

              <Field label="Transmission">
                <select className={selectCls} value={form.transmission} onChange={e => set("transmission", e.target.value)}>
                  <option value="">Select transmission</option>
                  {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>

              <Field label="Colour">
                <select className={selectCls} value={form.colour} onChange={e => set("colour", e.target.value)}>
                  <option value="">Select colour</option>
                  {COLOURS.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Number of Doors">
                <select className={selectCls} value={form.doors} onChange={e => set("doors", e.target.value)}>
                  {["2", "3", "4", "5"].map(d => <option key={d}>{d}</option>)}
                </select>
              </Field>

              <Field label="Condition">
                <div className="grid grid-cols-2 gap-2">
                  {CONDITIONS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set("condition", c)}
                      className={`border py-2 text-sm font-medium transition-all ${form.condition === c ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-black"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </div>
        )}

        {/* ── Step 2: Location & Price ── */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-base font-black text-gray-900">Location & Price</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Asking Price (UGX)" hint="Set a competitive price">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">UGX</span>
                  <input
                    className={`${inputCls} pl-7`}
                    type="number"
                    placeholder="e.g. 15000"
                    value={form.price}
                    onChange={e => set("price", e.target.value)}
                  />
                </div>
              </Field>

              <Field label="Postcode" hint="Where is the car located?">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    className={`${inputCls} pl-9`}
                    placeholder="e.g. SW1A 1AA"
                    value={form.postcode}
                    onChange={e => set("postcode", e.target.value.toUpperCase())}
                  />
                </div>
              </Field>

              <Field label="City / Area">
                <input className={inputCls} placeholder="e.g. London" value={form.city} onChange={e => set("city", e.target.value)} />
              </Field>
            </div>

            {/* Price summary card */}
            {form.price && (
              <div className="border border-black/10 bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Listing Summary</p>
                <p className="text-3xl font-black text-black">
                  UGX {Number(form.price).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {form.year} {form.make} {form.model} · {form.city || form.postcode}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Photos ── */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-base font-black text-gray-900">Photos</h2>
            <p className="text-sm text-gray-400">Upload up to 10 photos. First photo will be used as the cover image.</p>

            {/* Upload zone */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center gap-3 border-2 border-dashed border-gray-200 py-10 text-center hover:border-black transition-colors"
            >
              <Upload className="h-8 w-8 text-gray-300" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Click to upload photos</p>
                <p className="text-xs text-gray-400">JPG, PNG, WEBP up to 10MB each</p>
              </div>
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />

            {/* Preview grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                {images.map((src, i) => (
                  <div key={i} className="relative aspect-square group overflow-hidden border border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src.src} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                    {i === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black py-0.5 text-center text-[10px] font-bold text-white tracking-widest">COVER</div>
                    )}
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-black opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {images.length === 0 && (
              <p className="text-center text-xs text-gray-300">No photos yet</p>
            )}
          </div>
        )}

        {/* ── Step 4: Description ── */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-base font-black text-gray-900">Description & Features</h2>

            <Field label="Description" hint="Describe the car's condition, history, and highlights">
              <textarea
                className={`${inputCls} h-36 resize-none`}
                placeholder="E.g. One owner from new, full service history, no accidents. Excellent condition throughout..."
                value={form.description}
                onChange={e => set("description", e.target.value)}
              />
              <p className="mt-1 text-right text-xs text-gray-300">{form.description.length} chars</p>
            </Field>

            <Field label="Key Features" hint="One feature per line — e.g. Heated seats, Navigation, Parking sensors">
              <textarea
                className={`${inputCls} h-28 resize-none`}
                placeholder={"Heated seats\nSatellite navigation\nParking sensors\nLane assist"}
                value={form.features}
                onChange={e => set("features", e.target.value)}
              />
            </Field>

            {/* Full summary */}
            <div className="border border-gray-100 bg-gray-50 p-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Listing Preview</p>
              <p className="text-lg font-black text-black">{form.year} {form.make} {form.model} {form.trim}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                {form.bodyType && <span>{form.bodyType}</span>}
                {form.fuel && <span>· {form.fuel}</span>}
                {form.transmission && <span>· {form.transmission}</span>}
                {form.mileage && <span>· {Number(form.mileage).toLocaleString()} mi</span>}
                {form.city && <span>· {form.city}</span>}
              </div>
              {form.price && <p className="text-2xl font-black text-black">UGX {Number(form.price).toLocaleString()}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-600 hover:border-black hover:text-black transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          ← Back
        </button>
        <span className="text-xs text-gray-400">Step {step + 1} of {STEPS.length}</span>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            className="bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-all"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black px-8 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : form.status === "PUBLISHED" ? "Publish Listing" : "Save Draft"}
          </button>
        )}
      </div>
    </div>
  );
}
