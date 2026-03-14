"use client";

import { Search, Pencil, Trash2, Image as ImageIcon, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useFrontendData } from "@/lib/use-frontend-data";
import { writeFrontendData } from "@/lib/frontend-data-store";
import { Brand } from "@/lib/frontend-data";

function Toggle({ enabled = true, onToggle }: { enabled?: boolean; onToggle?: () => void }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-pressed={enabled}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${enabled ? "bg-indigo-500" : "bg-slate-300"
                }`}
        >
            <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${enabled ? "translate-x-6" : "translate-x-1"
                    }`}
            />
        </button>
    );
}

function ImagePlaceholder({ className = "", src = "" }: { className?: string; src?: string }) {
    if (src) {
        return (
            <div className={`relative flex items-center justify-center rounded-md border border-slate-200 bg-slate-100 overflow-hidden ${className}`}>
                <img src={src} alt="Preview" className="h-full w-full object-contain" />
            </div>
        );
    }
    return (
        <div className={`flex items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-slate-400 ${className}`}>
            <ImageIcon className="h-7 w-7" strokeWidth={1.5} />
        </div>
    );
}

export default function BrandsPage() {
    const data = useFrontendData();
    const brands = Array.isArray(data?.brands) ? data.brands : [];

    const [isSaving, setIsSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        logo: "",
        banner: "",
        metaTitle: "",
        metaDescription: "",
        isFeatured: false,
    });

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        // Sync with server on mount
        const { fetchFrontendData } = require("@/lib/frontend-data-store");
        void fetchFrontendData();
    }, []);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File, type: "logo" | "banner") => {
        if (type === "logo") setUploadingLogo(true);
        else setUploadingBanner(true);

        try {
            const upData = new FormData();
            upData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: upData,
            });

            const raw = await res.text();
            let result: { url?: string; error?: string } = {};

            if (raw) {
                try {
                    result = JSON.parse(raw) as { url?: string; error?: string };
                } catch {
                    result = { error: raw };
                }
            }

            if (!res.ok) {
                throw new Error(result.error || `Upload failed with status ${res.status}`);
            }

            if (result.url) {
                setFormData(prev => ({ ...prev, [type]: result.url }));
            } else {
                alert("Upload failed: " + (result.error || "Unknown error"));
            }
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : "Upload failed");
        } finally {
            if (type === "logo") setUploadingLogo(false);
            else setUploadingBanner(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return alert("Title is required");
        if (!formData.logo) return alert("Logo is required");

        setIsSaving(true);
        try {
            const nextOrder =
                brands.reduce((maxOrder, brand) => Math.max(maxOrder, brand.order ?? 0), 0) + 1;

            const newBrand: Brand = {
                id: crypto.randomUUID(),
                title: formData.title,
                slug: formData.slug || formData.title.toLowerCase().replace(/ /g, "-"),
                logo: formData.logo,
                banner: formData.banner,
                metaTitle: formData.metaTitle,
                metaDescription: formData.metaDescription,
                isActive: true,
                isFeatured: formData.isFeatured,
                order: nextOrder,
            };

            const updatedData = {
                ...data,
                brands: [newBrand, ...brands],
            };

            await writeFrontendData(updatedData);

            // Reset form
            setFormData({
                title: "",
                slug: "",
                logo: "",
                banner: "",
                metaTitle: "",
                metaDescription: "",
                isFeatured: false,
            });
            alert("Brand added successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to save brand");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this brand?")) return;

        try {
            const updatedData = {
                ...data,
                brands: brands.filter(b => b.id !== id),
            };
            await writeFrontendData(updatedData);
        } catch (err) {
            console.error(err);
            alert("Failed to delete brand");
        }
    };

    const handleToggleStatus = async (brand: Brand) => {
        try {
            const updatedData = {
                ...data,
                brands: brands.map(b => b.id === brand.id ? { ...b, isActive: !b.isActive } : b),
            };
            await writeFrontendData(updatedData);
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleFeatured = async (brand: Brand) => {
        try {
            const updatedData = {
                ...data,
                brands: brands.map(b => b.id === brand.id ? { ...b, isFeatured: !b.isFeatured } : b),
            };
            await writeFrontendData(updatedData);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6">
            <div className="mb-6 flex items-start gap-3">
                <span className="mt-2 h-2.5 w-8 rounded-full bg-[#0b63ce]" />
                <div>
                    <h1 className="text-[28px] font-semibold tracking-tight text-gray-900">All Brands</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        You have a total of {mounted ? brands.length : "..."} {brands.length === 1 ? "Brand" : "Brands"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.9fr]">
                <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
                        <h2 className="text-[22px] font-semibold text-gray-900">Brands</h2>

                        <div className="flex w-full max-w-[420px] overflow-hidden rounded-md border border-gray-300 bg-white">
                            <input
                                type="text"
                                placeholder="Search"
                                className="h-11 w-full border-0 px-4 text-sm outline-none placeholder:text-gray-400"
                            />
                            <button className="flex h-11 w-14 items-center justify-center bg-[#1f2937] text-white hover:bg-black transition-colors">
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
                                    <th className="px-5 py-4 font-semibold">#</th>
                                    <th className="px-5 py-4 font-semibold">Title</th>
                                    <th className="px-5 py-4 font-semibold">Logo</th>
                                    <th className="px-5 py-4 font-semibold text-center">Featured</th>
                                    <th className="px-5 py-4 font-semibold">Status</th>
                                    <th className="px-5 py-4 font-semibold text-right">Options</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {brands.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-10 text-center text-gray-400 font-medium">
                                            No brands available. Please add a new brand.
                                        </td>
                                    </tr>
                                ) : (
                                    brands.map((brand, idx) => (
                                        <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-4 text-gray-500 font-medium">{idx + 1}</td>
                                            <td className="px-5 py-4 font-semibold text-gray-900">{brand.title}</td>
                                            <td className="px-5 py-4">
                                                <div className="h-10 w-14 rounded border border-gray-200 bg-gray-50 p-1">
                                                    <img src={brand.logo} alt={brand.title} className="h-full w-full object-contain" />
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <Toggle
                                                    enabled={brand.isFeatured}
                                                    onToggle={() => handleToggleFeatured(brand)}
                                                />
                                            </td>
                                            <td className="px-5 py-4">
                                                <Toggle
                                                    enabled={brand.isActive}
                                                    onToggle={() => handleToggleStatus(brand)}
                                                />
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(brand.id)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 px-5 py-6">
                        <button className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 transition-colors">
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {[1].map((page) => (
                            <button
                                key={page}
                                className={`h-9 min-w-9 rounded-md border px-3 text-sm font-medium transition-colors ${page === 1
                                    ? "border-[#0b63ce] bg-[#0b63ce] text-white"
                                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 transition-colors">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </section>

                <section className="rounded-lg border border-gray-200 bg-white shadow-sm self-start">
                    <div className="border-b border-gray-200 px-5 py-4">
                        <h2 className="text-[22px] font-semibold text-gray-900">Add Brand</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 px-5 py-6">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Title *</label>
                            <input
                                value={formData.title}
                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g. Samsung"
                                required
                                className="h-11 w-full rounded-md border border-gray-300 px-4 outline-none ring-0 transition hover:border-gray-400 focus:border-[#0b63ce]"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Slug</label>
                            <input
                                value={formData.slug}
                                onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                placeholder="e.g. samsung"
                                className="h-11 w-full rounded-md border border-gray-300 px-4 outline-none ring-0 transition hover:border-gray-400 focus:border-[#0b63ce]"
                            />
                        </div>

                        <div className="flex items-center gap-3 py-1">
                            <label className="text-sm font-medium text-gray-700">Featured</label>
                            <Toggle
                                enabled={formData.isFeatured}
                                onToggle={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Logo (130x93) *</label>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                ref={logoInputRef}
                                onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], "logo")}
                            />
                            <div className="overflow-hidden rounded-md border border-gray-300 hover:border-gray-400 transition-colors">
                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex h-11 flex-1 items-center px-4 text-sm text-gray-500 bg-white truncate">
                                        {formData.logo ? (
                                            <span className="text-green-600 font-medium">Image uploaded successfully</span>
                                        ) : uploadingLogo ? (
                                            <span className="flex items-center gap-2 italic">
                                                <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                                            </span>
                                        ) : (
                                            "No file chosen"
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => logoInputRef.current?.click()}
                                        disabled={uploadingLogo}
                                        className="h-11 border-l border-gray-300 bg-gray-50 px-5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                    >
                                        Choose File
                                    </button>
                                </div>
                            </div>
                            <div className="relative mt-3 inline-block">
                                <ImagePlaceholder className="h-20 w-28" src={formData.logo} />
                                {formData.logo && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, logo: "" }))}
                                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Banner (835x200)</label>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                ref={bannerInputRef}
                                onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], "banner")}
                            />
                            <div className="overflow-hidden rounded-md border border-gray-300 hover:border-gray-400 transition-colors">
                                <div className="flex flex-col sm:flex-row">
                                    <div className="flex h-11 flex-1 items-center px-4 text-sm text-gray-500 bg-white truncate">
                                        {formData.banner ? (
                                            <span className="text-green-600 font-medium">Image uploaded successfully</span>
                                        ) : uploadingBanner ? (
                                            <span className="flex items-center gap-2 italic">
                                                <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                                            </span>
                                        ) : (
                                            "No file chosen"
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => bannerInputRef.current?.click()}
                                        disabled={uploadingBanner}
                                        className="h-11 border-l border-gray-300 bg-gray-50 px-5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                    >
                                        Choose File
                                    </button>
                                </div>
                            </div>
                            <div className="relative mt-3 w-full">
                                <ImagePlaceholder className="h-24 w-full" src={formData.banner} />
                                {formData.banner && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, banner: "" }))}
                                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Meta Title</label>
                            <input
                                value={formData.metaTitle}
                                onChange={e => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                                placeholder="SEO Title"
                                className="h-11 w-full rounded-md border border-gray-300 px-4 outline-none ring-0 transition hover:border-gray-400 focus:border-[#0b63ce]"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Meta Description</label>
                            <textarea
                                value={formData.metaDescription}
                                onChange={e => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                                placeholder="SEO Description..."
                                className="min-h-[110px] w-full rounded-md border border-gray-300 px-4 py-3 outline-none ring-0 transition hover:border-gray-400 focus:border-[#0b63ce]"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isSaving || uploadingLogo || uploadingBanner}
                                className="inline-flex h-11 items-center justify-center rounded-md bg-[#1f2937] px-8 text-[13px] font-semibold tracking-wide text-white transition hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[160px]"
                            >
                                {isSaving ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> SAVING...
                                    </span>
                                ) : "SAVE BRAND"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}

