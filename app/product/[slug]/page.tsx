"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronDown,
  MapPin,
  Share2,
  PlayCircle,
  Star,
  Check,
} from "lucide-react";
import { Header } from "@/components/Header";
import RelatedProductsCarousel from "@/components/RelatedProductsCarousel";
import SafeImage from "@/components/SafeImage";
import { addToCart } from "@/lib/cart";
import { useFrontendData } from "@/lib/use-frontend-data";
import { toCloudinaryUrl } from "@/lib/cloudinary";

export default function ProductDetailsPage() {
  const data = useFrontendData();
  const pd = data.productDetails;
  const gallery = pd.gallery;
  const sizes = pd.sizes;
  const params = useParams<{ slug: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : "item";
  const [selectedImageId, setSelectedImageId] = useState(gallery[0]?.id ?? 0);
  const [selectedSize, setSelectedSize] = useState(sizes[0]?.label ?? "");
  const [quantity, setQuantity] = useState(1);
  const selectedImage = gallery.find((item) => item.id === selectedImageId) ?? gallery[0];

  const selectedSizeInfo = sizes.find((size) => size.label === selectedSize) ?? sizes[0];
  const selectedPrice = Number(
    (selectedSizeInfo?.price ?? "UGX 0").replace("UGX", "").replace(/,/g, "").trim()
  );

  return (
    <>
      <Header />
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-6 lg:px-6">
          <div className="mb-4 text-[13px] text-gray-500">
            <Link href="/" className="hover:text-[#0b63ce] hover:underline">
              Home
            </Link>
            <span className="mx-1">{">"}</span>
            <Link
              href="/cars"
              className="hover:text-[#0b63ce] hover:underline"
            >
              Cars
            </Link>
            <span className="mx-1">{">"}</span>
            <Link
              href="/cars/luxury"
              className="hover:text-[#0b63ce] hover:underline"
            >
              Luxury
            </Link>
            <span className="mx-1">{">"}</span>
            <Link
              href="/cars/luxury/sedans"
              className="hover:text-[#0b63ce] hover:underline"
            >
              Sedans
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[520px_minmax(0,1fr)_290px]">
            <div className="xl:sticky xl:top-4 xl:self-start">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[76px_minmax(0,1fr)]">
                <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
                  {gallery.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedImageId(item.id)}
                      className={`relative flex h-[72px] min-w-[72px] items-center justify-center overflow-hidden rounded-md border bg-white ${selectedImage?.id === item.id
                          ? "border-[#007185] ring-2 ring-[#c8f3fa]"
                          : "border-gray-200 hover:border-gray-400"
                        }`}
                    >
                      <SafeImage
                        src={item.image}
                        alt={item.alt}
                        className="h-full w-full object-cover"
                      />
                      {item.isVideo && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <PlayCircle size={22} className="text-white" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="order-1 md:order-2">
                  <div className="relative overflow-hidden rounded-xl bg-white">
                    <div className="absolute right-3 top-3 z-10">
                      <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50">
                        <Share2 size={18} />
                      </button>
                    </div>

                    <div className="flex min-h-[520px] items-center justify-center rounded-xl bg-[#fafafa] p-6">
                      <SafeImage
                        src={selectedImage?.image ?? gallery[0]?.image ?? ""}
                        alt={selectedImage?.alt ?? gallery[0]?.alt ?? "Product image"}
                        className="max-h-[500px] w-auto max-w-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-center text-[13px] text-[#0b63ce] hover:underline">
                    <Link href="#">Click to see full view</Link>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-[28px] font-normal leading-snug text-gray-900">
                {pd.title}
              </h1>

              <div className="mt-2">
                <Link
                  href="#"
                  className="text-[14px] text-[#0b63ce] hover:underline"
                >
                  {pd.storeLabel}
                </Link>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px]">
                <div className="flex items-center gap-1 text-[#f59e0b]">
                  <span>{pd.rating.toFixed(1)}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className={
                          i < Math.round(pd.rating)
                            ? "fill-[#f59e0b] text-[#f59e0b]"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                <Link href="#" className="text-[#0b63ce] hover:underline">
                  {pd.ratingsLabel}
                </Link>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-[13px]">
                <span className="rounded bg-[#cc6600] px-2 py-1 font-bold text-white">
                  {pd.bestsellerLabel}
                </span>
                <Link href="#" className="text-[#0b63ce] hover:underline">
                  {pd.bestsellerCategory}
                </Link>
              </div>

              <div className="mt-3 border-b border-gray-200 pb-3 text-[14px] text-gray-700">
                {pd.boughtLabel}
              </div>

              <div className="mt-4">
                <div className="flex items-start gap-1">
                  <span className="mt-2 text-[14px] text-gray-700">UGX</span>
                  <span className="text-[42px] leading-none text-gray-900">
                    {pd.priceMajor}
                  </span>
                  <span className="mt-1 text-[22px] text-gray-900">{pd.priceMinor}</span>
                </div>

                <div className="mt-2 text-[14px] text-gray-700">
                  <span className="font-medium">{pd.shippingLabel}</span>{" "}
                  <Link href="#" className="text-[#0b63ce] hover:underline">
                    Details
                  </Link>
                </div>

              </div>

              <div className="mt-5">
                <div className="text-[14px] text-gray-700">
                  Size: <span className="font-semibold">{selectedSize}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-3">
                  {sizes.map((size) => {
                    const active = selectedSize === size.label;
                    return (
                      <button
                        key={size.label}
                        onClick={() => setSelectedSize(size.label)}
                        className={`min-w-[120px] rounded-md border px-3 py-2 text-left ${active
                            ? "border-[#007185] bg-[#f0fdff] ring-2 ring-[#c8f3fa]"
                            : "border-gray-300 bg-white hover:border-gray-500"
                          }`}
                      >
                        <div className="text-[14px] font-semibold text-gray-900">
                          {size.label}
                        </div>
                        <div className="mt-1 text-[13px] text-gray-900">
                          {size.price}
                        </div>
                        <div className="text-[12px] text-gray-400 line-through">
                          {size.oldPrice}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 grid max-w-[640px] grid-cols-[140px_minmax(0,1fr)] gap-y-2 text-[14px]">
                {pd.specs.map((spec) => (
                  <div key={spec.label} className="contents">
                    <div className="font-semibold text-gray-900">{spec.label}</div>
                    <div className="text-gray-700">{spec.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <Link
                  href="#"
                  className="text-[14px] text-[#0b63ce] hover:underline"
                >
                  See less
                </Link>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-4">
                <h2 className="text-[24px] font-bold text-gray-900">
                  {pd.aboutTitle}
                </h2>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-6 text-gray-800">
                  {pd.aboutItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="xl:sticky xl:top-4 xl:self-start">
              <div className="rounded-xl border border-gray-300 p-4">
                <div className="flex items-start gap-1">
                  <span className="mt-2 text-[13px] text-gray-700">UGX</span>
                  <span className="text-[38px] leading-none text-gray-900">
                    {pd.priceMajor}
                  </span>
                  <span className="mt-1 text-[20px] text-gray-900">{pd.priceMinor}</span>
                </div>

                <div className="mt-2 text-[14px] text-gray-700">
                  <span className="font-medium">{pd.shippingLabel}</span>{" "}
                  <Link href="#" className="text-[#0b63ce] hover:underline">
                    Details
                  </Link>
                </div>

                <div className="mt-1 text-[14px] text-gray-700">
                  Delivery <span className="font-semibold">{pd.deliveryLabel}</span>
                </div>

                <div className="mt-2 flex items-center gap-1 text-[13px] text-[#0b63ce]">
                  <MapPin size={14} />
                  <Link href="#" className="hover:underline">
                    Deliver to Uganda
                  </Link>
                </div>

                <div className="mt-4 text-[24px] text-[#007600]">{pd.inStockLabel}</div>

                <div className="mt-3">
                  <div className="relative">
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full appearance-none rounded-lg border border-gray-400 bg-[#f0f2f2] px-4 py-2 pr-10 text-[14px] text-gray-900 outline-none"
                    >
                      <option value={1}>Quantity: 1</option>
                      <option value={2}>Quantity: 2</option>
                      <option value={3}>Quantity: 3</option>
                      <option value={4}>Quantity: 4</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                    />
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <button
                    onClick={() =>
                      addToCart(
                        {
                          id: `${slug}-${selectedSize.toLowerCase().replace(/\s+/g, "-")}`,
                          name: `Instant Pot Duo Plus (${selectedSize})`,
                          price: selectedPrice,
                          image: toCloudinaryUrl(selectedImage?.image ?? gallery[0]?.image ?? ""),
                          href: `/product/${slug}`,
                        },
                        quantity
                      )
                    }
                    className="w-full rounded-full bg-[#ffd814] px-4 py-2.5 text-[14px] font-medium text-gray-900 hover:bg-[#f7ca00]"
                  >
                    Add to cart
                  </button>
                  <button className="w-full rounded-full bg-[#ffa41c] px-4 py-2.5 text-[14px] font-medium text-gray-900 hover:bg-[#fa8900]">
                    Buy Now
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-[70px_minmax(0,1fr)] gap-y-2 text-[13px]">
                  <div className="text-gray-600">Ships from</div>
                  <div className="text-gray-900">Car Bazaar Ltd</div>

                  <div className="text-gray-600">Sold by</div>
                  <div>
                    <Link href="#" className="text-[#0b63ce] hover:underline">
                      Car Bazaar Ltd
                    </Link>
                  </div>

                  <div className="text-gray-600">Returns</div>
                  <div>
                    <Link href="#" className="text-[#0b63ce] hover:underline">
                      7-day refund / replacement
                    </Link>
                  </div>

                  <div className="text-gray-600">Payment</div>
                  <div>
                    <Link href="#" className="text-[#0b63ce] hover:underline">
                      Secure transaction
                    </Link>
                  </div>
                </div>

                <div className="mt-3">
                  <Link
                    href="#"
                    className="text-[13px] text-[#0b63ce] hover:underline"
                  >
                    See more
                  </Link>
                </div>

                <div className="mt-4 border-t border-gray-200 pt-4">
                  <button className="w-full rounded-lg border border-gray-400 bg-white px-4 py-2 text-[14px] text-gray-900 hover:bg-gray-50">
                    Add to List
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-gray-300 p-3">
                <div className="flex items-center gap-3">
                  <SafeImage
                    src="https://images.unsplash.com/photo-1585515656973-94d1ea4f5b0b?auto=format&fit=crop&w=400&q=80"
                    alt="Related cooker"
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                  <div>
                    <div className="line-clamp-2 text-[14px] text-gray-900">
                      CEUGS 10 in 1 Electric Pressure Cooker, Smart Digital Pot
                    </div>
                    <div className="mt-2 text-[18px] font-medium text-gray-900">
                      UGX 275,000
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[13px] text-[#007185]">
                      <Check size={14} />
                      Fast delivery
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <RelatedProductsCarousel />
    </>
  );
}
