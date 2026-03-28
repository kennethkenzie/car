"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createVehicleReal, updateVehicleReal, getDealers } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useFrontendData } from "@/lib/use-frontend-data";
import {
  ArrowLeft, Car, Upload, X, CheckCircle2,
  MapPin, Tag, Layers, ImageIcon,
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

type VehicleData = {
  id?: string;
  make: string;
  model: string;
  trim: string;
  bodyType: string;
  type: "CAR" | "VAN";
  listingCategory: "SALE" | "HIRE";
  stockType: "NEW" | "USED";
  year: string | number;
  mileage: string | number;
  fuel: string;
  transmission: string;
  colour: string;
  condition: string;
  doors: string | number;
  price: string | number;
  postcode: string;
  city: string;
  description: string;
  features: string | string[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "SOLD";
  dealerId: string;
  images?: any[];
};

const EMPTY: VehicleData = {
  make: "", model: "", trim: "", bodyType: "", type: "CAR",
  listingCategory: "SALE",
  stockType: "USED",
  year: "", mileage: "", fuel: "", transmission: "", colour: "", condition: "Excellent", doors: "5",
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
  PETROL: "PETROL",
  DIESEL: "DIESEL",
  HYBRID: "HYBRID",
  ELECTRIC: "ELECTRIC"
};

const TRANSMISSION_VALUE_MAP: Record<string, string> = {
  Manual: "MANUAL",
  Automatic: "AUTOMATIC",
  "Semi-Automatic": "AUTOMATIC",
  MANUAL: "MANUAL",
  AUTOMATIC: "AUTOMATIC"
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

const inputCls = "w-full border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#4228c4] focus:ring-1 focus:ring-[#4228c4] transition rounded-xl";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

interface VehicleWizardProps {
  initialData?: VehicleData;
  mode: "create" | "edit";
}

export function VehicleWizard({ initialData, mode }: VehicleWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<VehicleData>({ ...EMPTY, ...initialData });
  const [thumbnail, setThumbnail] = useState<{ src: string; file?: File; id?: string } | null>(null);
  const [images, setImages] = useState<{ src: string; file?: File; id?: string }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: dealers } = useQuery({
    queryKey: ["dealers"],
    queryFn: getDealers,
  });

  const frontendData = useFrontendData();
  const makes = frontendData.brands.filter(b => b.isActive).map(b => b.title);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData?.images) {
      const mappedImages = initialData.images.map(img => ({
        src: typeof img === 'string' ? img : img.url,
        id: img.id
      }));
      setThumbnail(mappedImages[0] ?? null);
      setImages(mappedImages.slice(1));
    }
  }, [initialData]);

  const set = (k: keyof VehicleData, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const src = ev.target?.result as string;
      setThumbnail({ src, file });
    };
    reader.readAsDataURL(file);
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        const src = ev.target?.result as string;
        setImages(imgs => imgs.length < 9 ? [...imgs, { src, file }] : imgs);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i: number) => setImages(imgs => imgs.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const normalizedFuel = FUEL_VALUE_MAP[form.fuel as string] || "PETROL";
      const normalizedTransmission = TRANSMISSION_VALUE_MAP[form.transmission as string] || "AUTOMATIC";

      const formData = new FormData();
      
      const payload: any = {
        ...form,
        fuel: normalizedFuel,
        transmission: normalizedTransmission,
        features: Array.isArray(form.features) ? form.features.join("\n") : form.features
      };

      Object.keys(payload).forEach((key) => {
        if (key === "images") return;
        if (payload[key] !== undefined && payload[key] !== null) {
          formData.append(key, payload[key].toString());
        }
      });

      if (thumbnail?.file) {
        formData.append("images", thumbnail.file);
      } else if (thumbnail?.src) {
        formData.append("existingImages", thumbnail.src);
      }

      images.forEach(img => {
        if (img.file) {
          formData.append("images", img.file);
        } else if (img.src) {
          formData.append("existingImages", img.src);
        }
      });

      if (mode === "edit" && form.id) {
        await updateVehicleReal(form.id, formData);
      } else {
        await createVehicleReal(formData);
      }
      
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
        <div className="mb-6 flex h-20 w-20 items-center justify-center bg-[#4228c4] rounded-3xl">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          {mode === "edit" ? "Changes Saved!" : (form.status === "PUBLISHED" ? "Car Listed!" : "Draft Saved!")}
        </h2>
        <p className="mb-8 text-gray-500">
          {form.year} {form.make} {form.model} has been successfully {mode === "edit" ? "updated" : (form.status === "PUBLISHED" ? "published" : "saved as draft")}.
        </p>
        <div className="flex gap-3">
          {mode === "create" && (
            <button
              onClick={() => { setForm(EMPTY); setThumbnail(null); setImages([]); setSubmitted(false); setStep(0); }}
              className="border border-gray-200 px-6 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Add another
            </button>
          )}
          <button 
            onClick={() => router.push("/admin/inventory")}
            className="bg-[#4228c4] px-6 py-3 rounded-2xl text-sm font-bold text-white hover:bg-[#3621a1] transition-all shadow-xl shadow-[#4228c4]/20"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{mode === "edit" ? "Edit Vehicle" : "Register a Vehicle"}</h1>
          <p className="text-gray-500 font-medium mt-1">
            {mode === "edit" ? `Updating details for ${form.make} ${form.model}` : "List your vehicle on the Car Bazaar marketplace"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => set("status", "DRAFT")}
            className={`px-5 py-3 text-sm font-bold rounded-2xl transition-all ${form.status === "DRAFT" ? "bg-[#ff6a00] text-white shadow-lg shadow-orange-500/20" : "bg-white text-gray-500 border border-gray-200 hover:border-[#ff6a00] hover:text-[#ff6a00]"}`}
          >
            Draft
          </button>
          <button
            onClick={() => set("status", "PUBLISHED")}
            className={`px-5 py-3 text-sm font-bold rounded-2xl transition-all ${form.status === "PUBLISHED" ? "bg-[#4228c4] text-white shadow-lg shadow-[#4228c4]/20" : "bg-white text-gray-500 border border-gray-200 hover:border-[#4228c4] hover:text-[#4228c4]"}`}
          >
            Publish
          </button>
        </div>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-0 overflow-x-auto border-b border-gray-100">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = step === i;
          const done = step > i;
          return (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={`flex flex-1 min-w-0 items-center justify-center gap-2 border-b-2 px-4 py-4 text-xs font-bold transition-all whitespace-nowrap ${active ? "border-[#4228c4] text-[#4228c4]" : done ? "border-gray-300 text-gray-400" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{s.label}</span>
              {done && <CheckCircle2 className="ml-1 h-3.5 w-3.5 text-[#4228c4]" />}
            </button>
          );
        })}
      </div>

      {/* Form Steps */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 border border-red-100 text-sm text-red-600 flex items-center gap-3">
             <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {/* ── Step 0: Brand & Category ── */}
        {step === 0 && (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Vehicle Type">
                <div className="flex gap-3">
                  {["CAR", "VAN"].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set("type", t as "CAR" | "VAN")}
                      className={`flex-1 flex gap-2 items-center justify-center rounded-2xl border-2 py-4 text-sm font-bold transition-all ${form.type === t ? "border-[#ff6a00] bg-[#ff6a00] text-white shadow-lg shadow-orange-500/10" : "border-gray-100 text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00]"}`}
                    >
                      {t === "CAR" ? <CarFront className="h-4 w-4" /> : <Car className="h-4 w-4" />}
                      {t === "CAR" ? "Car" : "Van"}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Inventory Type">
                <div className="flex gap-3">
                  {[
                    { value: "NEW", label: "New" },
                    { value: "USED", label: "Used" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => set("stockType", option.value as "NEW" | "USED")}
                      className={`flex-1 rounded-2xl border-2 py-4 text-sm font-bold transition-all ${
                        form.stockType === option.value
                          ? "border-[#4228c4] bg-[#4228c4]/5 text-[#4228c4]"
                          : "border-gray-100 text-gray-500 hover:border-[#4228c4] hover:text-[#4228c4]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Listing Category">
                <div className="flex gap-3">
                  {[
                    { value: "SALE", label: "For Sale" },
                    { value: "HIRE", label: "Car Hire" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => set("listingCategory", option.value as "SALE" | "HIRE")}
                      className={`flex-1 rounded-2xl border-2 py-4 text-sm font-bold transition-all ${
                        form.listingCategory === option.value
                          ? "border-[#0b63ce] bg-[#0b63ce]/5 text-[#0b63ce]"
                          : "border-gray-100 text-gray-500 hover:border-[#0b63ce] hover:text-[#0b63ce]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Make / Brand">
                <select className={selectCls} value={form.make} onChange={e => set("make", e.target.value)}>
                  <option value="">Select make</option>
                  {makes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>

              <Field label="Model">
                <input className={inputCls} placeholder="e.g. 3 Series" value={form.model} onChange={e => set("model", e.target.value)} />
              </Field>

              <Field label="Trim / Variant">
                <input className={inputCls} placeholder="e.g. M Sport" value={form.trim} onChange={e => set("trim", e.target.value)} />
              </Field>

              <Field label="Body Type">
                <select className={selectCls} value={form.bodyType} onChange={e => set("bodyType", e.target.value)}>
                  <option value="">Select body type</option>
                  {BODY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>

              {dealers && (
                <Field label="Assigned Dealer">
                  <select className={selectCls} value={form.dealerId} onChange={e => set("dealerId", e.target.value)}>
                    <option value="">Selection dealer...</option>
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
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Year">
                <select className={selectCls} value={form.year} onChange={e => set("year", e.target.value)}>
                  <option value="">Select year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </Field>

              <Field label="Mileage (km)">
                <input className={inputCls} type="number" placeholder="e.g. 25000" value={form.mileage} onChange={e => set("mileage", e.target.value)} />
              </Field>

              <Field label="Fuel Type">
                <select className={selectCls} value={form.fuel} onChange={e => set("fuel", e.target.value)}>
                  <option value="">Select fuel</option>
                  {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>

              <Field label="Transmission">
                <select className={selectCls} value={form.transmission} onChange={e => set("transmission", e.target.value)}>
                  <option value="">Select transmission</option>
                  {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>

              <Field label="Colour">
                <select className={selectCls} value={form.colour} onChange={e => set("colour", e.target.value)}>
                  <option value="">Select colour</option>
                  {COLOURS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Number of Doors">
               <input className={inputCls} type="number" value={form.doors} onChange={e => set("doors", e.target.value)} />
              </Field>
            </div>
            
            <Field label="Condition">
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set("condition", c)}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border-2 ${form.condition === c ? "border-[#4228c4] bg-[#4228c4]/5 text-[#4228c4]" : "border-gray-100 text-gray-500 hover:border-gray-200"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* ── Step 2: Location & Price ── */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Asking Price (UGX)">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">UGX</span>
                  <input
                    className={`${inputCls} pl-12`}
                    type="number"
                    placeholder="e.g. 15000000"
                    value={form.price}
                    onChange={e => set("price", e.target.value)}
                  />
                </div>
              </Field>

              <Field label="Location Postcode">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    className={`${inputCls} pl-12`}
                    placeholder="e.g. KLA-01"
                    value={form.postcode}
                    onChange={e => set("postcode", e.target.value.toUpperCase())}
                  />
                </div>
              </Field>

              <Field label="City / Area">
                <input className={inputCls} placeholder="e.g. Kampala" value={form.city} onChange={e => set("city", e.target.value)} />
              </Field>
            </div>

            {form.price && (
              <div className="bg-[#4228c4]/5 rounded-xl p-6 border border-[#4228c4]/10">
                <p className="text-xs font-bold uppercase tracking-widest text-[#4228c4] mb-2">Pricing Snapshot</p>
                <p className="text-4xl font-extrabold text-[#4228c4]">
                  UGX {Number(form.price).toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-medium">
                   <span>{form.year || 'YYYY'}</span>
                   <span className="text-gray-300">|</span>
                   <span>{form.make || 'Make'}</span>
                   <span>{form.model || 'Model'}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Photos ── */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
               <h3 className="text-lg font-bold text-gray-900">Vehicle Photos</h3>
               <p className="text-sm text-gray-500">Upload a thumbnail plus up to 9 gallery images for this inventory item.</p>
            </div>

            <div className="rounded-2xl border border-gray-100 p-6">
              <div className="mb-4 flex flex-col gap-1">
                <h4 className="text-sm font-bold text-gray-900">Product Thumbnail</h4>
                <p className="text-sm text-gray-500">This image will be used as the primary listing cover.</p>
              </div>

              {thumbnail ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative h-36 w-36 overflow-hidden rounded-2xl border border-gray-100">
                    <img src={thumbnail.src} alt="Thumbnail preview" className="h-full w-full object-cover" />
                    <div className="absolute left-2 top-2 rounded-lg bg-[#4228c4] px-3 py-1 text-[10px] font-bold text-white">PRIMARY</div>
                  </div>
                  <div className="flex gap-3">
                    <label className="cursor-pointer rounded-2xl bg-[#4228c4] px-5 py-3 text-sm font-bold text-white hover:bg-[#3621a1] transition-all">
                      Replace Thumbnail
                      <input type="file" accept="image/*" className="hidden" onChange={handleThumbnail} />
                    </label>
                    <button
                      type="button"
                      onClick={() => setThumbnail(null)}
                      className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => document.getElementById("vehicle-thumbnail-upload")?.click()}
                    className="flex w-full flex-col items-center gap-4 rounded-2xl border-4 border-dashed border-gray-100 py-12 text-center hover:border-[#4228c4]/30 hover:bg-[#4228c4]/5 transition-all group"
                  >
                    <div className="h-16 w-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-gray-400 group-hover:text-[#4228c4]" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-700">Upload thumbnail</p>
                      <p className="text-sm text-gray-400 mt-1">Recommended for cards and listing previews</p>
                    </div>
                  </button>
                  <input id="vehicle-thumbnail-upload" type="file" accept="image/*" className="hidden" onChange={handleThumbnail} />
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center gap-4 rounded-2xl border-4 border-dashed border-gray-100 py-16 text-center hover:border-[#4228c4]/30 hover:bg-[#4228c4]/5 transition-all group"
            >
              <div className="h-16 w-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="h-8 w-8 text-gray-400 group-hover:text-[#4228c4]" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-700">Click to select gallery photos</p>
                <p className="text-sm text-gray-400 mt-1">Supports JPG, PNG, WEBP (Max 10MB each, up to 9 images)</p>
              </div>
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />

            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] group rounded-2xl overflow-hidden border border-gray-100">
                    <img src={img.src} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button
                        onClick={() => removeImage(i)}
                        className="bg-white/20 backdrop-blur-md p-2 rounded-xl text-white hover:bg-red-500 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-300 italic">No images uploaded yet.</div>
            )}
          </div>
        )}

        {/* ── Step 4: Description ── */}
        {step === 4 && (
          <div className="space-y-8">
            <Field label="Description" hint="Include condition, history, and unique selling points">
              <textarea
                className={`${inputCls} h-40 resize-none`}
                placeholder="e.g. This car is in pristine condition with only one previous owner..."
                value={form.description}
                onChange={e => set("description", e.target.value)}
              />
            </Field>

            <Field label="Features" hint="One feature per line (e.g. Leather Seats, Navigation)">
              <textarea
                className={`${inputCls} h-32 resize-none`}
                placeholder={"Panoramic Sunroof\nHeated Seats\nApple CarPlay"}
                value={Array.isArray(form.features) ? form.features.join("\n") : form.features}
                onChange={e => set("features", e.target.value)}
              />
            </Field>

            <div className="rounded-2xl bg-gray-50 p-8 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Final Summary</p>
              <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{form.year} {form.make} {form.model}</h3>
                    <p className="text-gray-500 mt-1">{form.trim}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-[#4228c4]">UGX {Number(form.price || 0).toLocaleString()}</p>
                    <p className="text-sm text-gray-400 mt-1">{form.city}</p>
                  </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pb-10">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-0"
        >
          ← Previous
        </button>
        
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Step {step + 1} / {STEPS.length}</span>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="bg-[#ff6a00] px-10 py-4 rounded-2xl text-sm font-bold text-white hover:bg-[#e65f00] transition-all shadow-xl shadow-orange-500/10"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#4228c4] px-12 py-4 rounded-2xl text-sm font-bold text-white hover:bg-[#3621a1] transition-all shadow-xl shadow-[#4228c4]/20 disabled:opacity-50"
            >
              {loading ? "Processing..." : (mode === "edit" ? "Save Changes" : "Complete Listing")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
