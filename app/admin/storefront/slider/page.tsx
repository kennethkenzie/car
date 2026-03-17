"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useFrontendData } from "@/lib/use-frontend-data";
import { writeFrontendData } from "@/lib/frontend-data-store";
import type { HeroSlide } from "@/lib/frontend-data";

type SliderFormData = {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

const emptyForm: SliderFormData = {
  image: "",
  title: "",
  description: "",
  buttonText: "",
  buttonLink: "",
};

export default function SliderPage() {
  const data = useFrontendData();
  const slides = Array.isArray(data?.hero?.slides) ? data.hero.slides : [];

  const [formData, setFormData] = useState<SliderFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const raw = await response.text();
      let payload: { url?: string; error?: string } = {};

      if (raw) {
        try {
          payload = JSON.parse(raw) as { url?: string; error?: string };
        } catch {
          payload = { error: raw };
        }
      }

      if (!response.ok) {
        throw new Error(payload.error || "Upload failed.");
      }

      if (payload.url) {
        setFormData((prev) => ({ ...prev, image: payload.url || "" }));
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingId(slide.id);
    setFormData({
      image: slide.image || "",
      title: slide.title || "",
      description: slide.description || "",
      buttonText: slide.ctaLabel || "",
      buttonLink: slide.ctaHref || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slider?")) return;

    const nextSlides = slides.filter((slide) => slide.id !== id);
    await writeFrontendData({
      ...data,
      hero: {
        ...data.hero,
        slides: nextSlides,
      },
    });

    if (editingId === id) {
      resetForm();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.image || !formData.title || !formData.buttonText || !formData.buttonLink) {
      alert("Image, title, button text, and button link are required.");
      return;
    }

    setIsSaving(true);

    try {
      const nextSlide: HeroSlide = {
        id: editingId || crypto.randomUUID(),
        image: formData.image,
        title: formData.title,
        description: formData.description,
        ctaLabel: formData.buttonText,
        ctaHref: formData.buttonLink,
      };

      const nextSlides = editingId
        ? slides.map((slide) => (slide.id === editingId ? nextSlide : slide))
        : [...slides, nextSlide];

      await writeFrontendData({
        ...data,
        hero: {
          ...data.hero,
          slides: nextSlides,
        },
      });

      resetForm();
      alert(editingId ? "Slider updated." : "Slider created.");
    } catch (error) {
      console.error(error);
      alert("Failed to save slider.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#f7f7f8]">
      <div className="mb-6 flex items-start gap-3">
        <span className="mt-2 h-2.5 w-8 rounded-full bg-[#0b63ce]" />
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-gray-900">Hero Slider</h1>
          <p className="mt-1 text-sm text-gray-500">Manage homepage hero slides and CTA content.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.55fr_0.95fr]">
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg font-bold text-gray-900">Slides</h2>
            <span className="text-sm text-gray-500">{slides.length} total</span>
          </div>

          <div className="divide-y divide-gray-100">
            {slides.length === 0 ? (
              <div className="px-5 py-10 text-center text-gray-400">No hero slides added yet.</div>
            ) : (
              slides.map((slide, index) => (
                <div key={slide.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[160px_minmax(0,1fr)_auto]">
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-[96px] w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="mb-1 text-xs font-bold uppercase tracking-[0.08em] text-[#0b63ce]">
                      Slide {index + 1}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">{slide.title}</div>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{slide.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                        {slide.ctaLabel}
                      </span>
                      <Link href={slide.ctaHref} className="text-[#0b63ce] hover:underline">
                        {slide.ctaHref}
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(slide)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(slide.id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-red-50 text-red-500 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="self-start rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg font-bold text-gray-900">
              {editingId ? "Edit Slide" : "Add Slide"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-5 py-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">Slider Image</label>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleUpload(file);
                }}
              />

              <div className="overflow-hidden rounded-md border border-gray-300 bg-white">
                <div className="flex items-center">
                  <div className="flex h-11 flex-1 items-center px-4 text-sm text-gray-500">
                    {isUploading ? "Uploading..." : formData.image ? "Image uploaded" : "No file chosen"}
                  </div>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="h-11 border-l border-gray-200 bg-gray-50 px-5 text-sm font-bold text-gray-700 transition hover:bg-gray-100"
                  >
                    Choose File
                  </button>
                </div>
              </div>

              <div className="mt-4 relative">
                {formData.image ? (
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img src={formData.image} alt="Slider preview" className="h-[180px] w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                      className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-[180px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-400">
                    <ImageIcon className="h-10 w-10" />
                  </div>
                )}
              </div>
            </div>

            <Field
              label="Title"
              value={formData.title}
              onChange={(value) => setFormData((prev) => ({ ...prev, title: value }))}
              placeholder="Slide headline"
            />

            <Field
              label="Description"
              value={formData.description}
              onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
              placeholder="Short hero description"
              multiline
            />

            <Field
              label="Button Text"
              value={formData.buttonText}
              onChange={(value) => setFormData((prev) => ({ ...prev, buttonText: value }))}
              placeholder="Shop Now"
            />

            <Field
              label="Button Link"
              value={formData.buttonLink}
              onChange={(value) => setFormData((prev) => ({ ...prev, buttonLink: value }))}
              placeholder="/inventory"
            />

            <div className="flex justify-end gap-3 pt-2">
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex h-11 items-center justify-center rounded-md border border-gray-300 bg-white px-6 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              ) : null}
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1f2937] px-7 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {isSaving ? "Saving..." : editingId ? "Update Slide" : "Save Slide"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-h-[110px] w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none transition hover:border-gray-400 focus:border-[#0b63ce]"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-md border border-gray-300 px-4 text-sm text-gray-700 outline-none transition hover:border-gray-400 focus:border-[#0b63ce]"
        />
      )}
    </div>
  );
}
