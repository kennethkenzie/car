"use client";

import { RefreshCw, ChevronDown, ImagePlus, Upload, X } from "lucide-react";
import { useState, type ChangeEvent } from "react";

const tabs = [
    "Product Information",
    "Images & Videos",
    "Product Price & Stock",
    "Description & Specification",
    "Shipping Info",
    "Others",
    "SEO",
];

export default function ProductInformationPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextUrl = URL.createObjectURL(file);
    setThumbnail((current) => {
      if (current) URL.revokeObjectURL(current);
      return nextUrl;
    });
    event.target.value = "";
  };

  const clearThumbnail = () => {
    setThumbnail((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
  };

  return (
    <div className="bg-[#f7f7f8] p-4 sm:p-6">
      <div className="mx-auto max-w-[1220px]">
        <div className="mb-6 flex items-start gap-3">
          <span className="mt-2 h-2.5 w-8 rounded-full bg-[#0b63ce]" />
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight text-gray-900">Add New Product</h1>
            <p className="mt-1 text-sm text-gray-500">Fill in the information below to register a new product.</p>
          </div>
        </div>

        <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <section className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50/30 px-6 py-5">
            <h2 className="text-lg font-bold text-gray-900">
              {tabs[activeTab]}
            </h2>
          </div>

          <div className="px-6 py-8">
            {activeTab === 0 && (
              <form className="space-y-6">
                <div className="max-w-3xl">
                  <Label text="Product Name" required />
                  <TextInput placeholder="e.g. Samsung Galaxy S24 Ultra" />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-3xl">
                  <div>
                    <Label text="Category" required />
                    <SelectInput value="Computers & IT" />
                  </div>

                  <div>
                    <Label text="Brand" />
                    <SelectInput value="Select Brand" muted />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-3xl">
                  <div>
                    <Label text="Unit" required />
                    <TextInput placeholder="e.g kg, pc, box" />
                  </div>

                  <div>
                    <Label text="Min. Order Quantity" required />
                    <TextInput defaultValue="1" type="number" />
                  </div>
                </div>

                <div className="max-w-3xl">
                  <Label text="Barcode" />
                  <div className="flex overflow-hidden rounded-md border border-gray-300 bg-white transition hover:border-gray-400">
                    <input
                      type="text"
                      placeholder="Enter product barcode"
                      className="h-11 w-full border-0 bg-transparent px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      className="flex h-11 w-12 items-center justify-center border-l border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="max-w-3xl">
                  <Label text="Tags" />
                  <TextInput placeholder="Write & hit enter" />
                  <p className="mt-1.5 text-[12px] text-gray-400">Type a tag and press enter to add it.</p>
                </div>

                <div className="max-w-3xl">
                  <Label text="Slug" />
                  <TextInput placeholder="product-slug-here" />
                </div>

                <div className="flex items-start gap-4 py-2">
                  <div className="flex h-11 items-center">
                    <button
                      type="button"
                      aria-label="Toggle digital product"
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-[#0b63ce] focus:ring-offset-2"
                    >
                      <span className="inline-block h-5 w-5 transform rounded-full bg-white transition translate-x-1" />
                    </button>
                  </div>
                  <div>
                    <Label text="Digital Product" className="mb-0.5" />
                    <p className="text-sm text-gray-500">
                      If enabled, this product won't require shipping.
                    </p>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 1 && (
              <div className="space-y-8">
                <div className="max-w-3xl">
                  <Label text="Product Thumbnail" required />
                  <p className="mb-4 text-sm text-gray-500">
                    Upload a square thumbnail image for product cards and previews.
                  </p>

                  <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 p-5">
                    {thumbnail ? (
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <img
                          src={thumbnail}
                          alt="Product thumbnail preview"
                          className="h-36 w-36 rounded-xl border border-gray-200 object-cover bg-white"
                        />
                        <div className="flex gap-3">
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#1f2937] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-black">
                            <Upload className="h-4 w-4" />
                            Replace thumbnail
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleThumbnailChange}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={clearThumbnail}
                            className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                          >
                            <X className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center transition hover:border-[#0b63ce] hover:bg-blue-50/30">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#0b63ce]">
                          <ImagePlus className="h-6 w-6" />
                        </div>
                        <div className="text-sm font-bold text-gray-900">Upload thumbnail</div>
                        <div className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleThumbnailChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 0 && activeTab !== 1 && (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                  <RefreshCw className="h-10 w-10 animate-spin-slow" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Module under development</h3>
                <p className="mt-2 max-w-xs text-sm text-gray-500">
                  We are currently integrating the <span className="font-medium text-gray-900">{tabs[activeTab]}</span> module into the new design system.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 z-10 mt-8 border-t border-gray-200 bg-white/95 px-4 py-5 backdrop-blur-md md:px-8">
        <div className="mx-auto flex max-w-[1220px] items-center justify-end gap-3">
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-md bg-gray-100 px-6 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
          >
            SAVE & UNPUBLISH
          </button>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#1f2937] px-8 text-sm font-bold tracking-wide text-white transition hover:bg-black shadow-sm"
          >
            SAVE & PUBLISH
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductTabs({ activeTab, setActiveTab }: { activeTab: number; setActiveTab: (idx: number) => void }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex min-w-max items-center gap-1.5 px-3 py-2.5">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(index)}
            className={`rounded-md px-5 py-2.5 text-sm font-semibold transition ${
              index === activeTab
                ? "bg-indigo-50 text-[#0b63ce]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

function Label({
  text,
  required,
  className = "",
}: {
  text: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label
      className={`mb-2 block text-sm font-bold text-gray-700 ${className}`}
    >
      {text}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function TextInput({
  placeholder,
  defaultValue,
  type = "text",
}: {
  placeholder?: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="h-11 w-full rounded-md border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none transition hover:border-gray-400 focus:border-[#0b63ce] focus:ring-0 placeholder:text-gray-400"
    />
  );
}

function SelectInput({
  value,
  muted,
}: {
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="relative group">
      <select
        defaultValue={value}
        className={`h-11 w-full appearance-none rounded-md border border-gray-300 bg-white px-4 pr-10 text-sm outline-none transition group-hover:border-gray-400 focus:border-[#0b63ce] focus:ring-0 ${
          muted ? "text-gray-400" : "text-gray-700"
        }`}
      >
        <option>{value}</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition group-hover:text-gray-600" />
    </div>
  );
}
