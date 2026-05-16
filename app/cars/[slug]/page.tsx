export const dynamic = "force-dynamic";

import { EnquiryModal } from "@/components/EnquiryModal";
import { VehicleCard } from "@/components/VehicleCard";
import { VehicleGallery } from "@/components/VehicleGallery";
import { getSimilarVehiclesReal, getVehicleReal } from "@/lib/api";
import { formatGBP } from "@/lib/utils";
import { notFound } from "next/navigation";
import { MapPin, ShieldCheck, History, Fuel, Zap, Calendar, Gauge, Info } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VehiclePurchaseActions } from "@/components/VehiclePurchaseActions";

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = await getVehicleReal(slug);
  if (!vehicle) notFound();
  const similar = await getSimilarVehiclesReal(slug, vehicle.type as any);
  const features = Array.isArray(vehicle.features)
    ? vehicle.features
    : typeof vehicle.features === "string"
      ? (vehicle.features as string).split(/\r?\n/).map((feature: string) => feature.trim()).filter(Boolean)
      : [];

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <Header />
      
      <main className="pt-32 pb-32">
        {/* Full-width gallery — outside the content container */}
        <div className="mb-12">
          <VehicleGallery
            images={vehicle.images}
            title={`${vehicle.make} ${vehicle.model}`}
            sold={vehicle.status === "SOLD"}
          />
        </div>

        <div className="mx-auto max-w-[1440px] px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            <div className="space-y-12">
              {/* Header Info */}
              <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#4228c4]/10 text-[#4228c4] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Verified Stock
                    </span>
                    {vehicle.status === "SOLD" && (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Sold
                      </span>
                    )}
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{vehicle.postcode}</span>
                    </div>
                  </div>
                  <ShareButton title={`${vehicle.make} ${vehicle.model}`} />
                </div>

            <h1 className="text-4xl lg:text-5xl font-semibold text-[#121212] leading-tight mb-4 tracking-tight">
                  {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-xl font-light text-gray-400 mb-8">{vehicle.trim}</p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-gray-50">
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-2">Year</p>
                    <p className="text-sm font-bold text-gray-900">{vehicle.year}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Gauge className="h-6 w-6" />
                    </div>
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-2">Mileage</p>
                    <p className="text-sm font-bold text-gray-900">{vehicle.mileage.toLocaleString()} km</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Fuel className="h-6 w-6" />
                    </div>
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-2">Fuel</p>
                    <p className="text-sm font-bold text-gray-900">{vehicle.fuel}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Zap className="h-6 w-6" />
                    </div>
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-2">Trans</p>
                    <p className="text-sm font-bold text-gray-900">{vehicle.transmission}</p>
                  </div>
                </div>
              </div>

              {/* Car History & Features */}
              <div className="grid gap-8">
                <section className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100/50">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <History className="h-7 w-7 text-[#4228c4]" />
                    Car History
                  </h2>
                  <div className="grid lg:grid-cols-2 gap-4">
                    {[
                      "HPI Clear & Fully Vetted",
                      "No Recorded Damage",
                      "Full Service History",
                      "Verified Source & Docs"
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3 p-5 rounded-2xl bg-gray-50/50 border border-gray-100">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-light text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100/50">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Key Features</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    {features.map((feature, index) => (
                      <li key={`${feature}-${index}`} className="flex items-start gap-3 text-sm font-light text-gray-500">
                        <div className="h-2 w-2 rounded-full bg-[#4228c4] mt-1.5 shrink-0 shadow-sm shadow-[#4228c4]/40" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100/50">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">About this car</h2>
                  <p className="text-gray-500 leading-relaxed font-light whitespace-pre-wrap">
                    {vehicle.description}
                  </p>
                </section>
              </div>
            </div>

            <aside>
              <div className="sticky top-32 space-y-6">
                <div className="bg-[#121212] rounded-2xl p-10 text-white shadow-[0_30px_60px_rgba(0,0,0,0.2)] overflow-hidden relative group">
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2">Total Price</p>
                  <p className="text-4xl font-bold mb-1">{formatGBP(vehicle.price)}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-10">Monthly Estimated Finance Available</p>

                  <div className="space-y-4 relative z-10">
                    <EnquiryModal vehicleId={vehicle.id} dealerId={vehicle.dealerId} />
                    <VehiclePurchaseActions vehicle={vehicle as any} />
                    <a
                      href={`https://wa.me/256700000000?text=${encodeURIComponent(`Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} listed on Car Bazaar. Could you provide more details?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-green-400/30 bg-green-500/10 py-4 text-sm font-bold text-green-400 transition-all hover:bg-green-500/20 active:scale-95"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Chat on WhatsApp
                    </a>
                  </div>

                  <div className="mt-10 pt-10 border-t border-white/10 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center">
                      <History className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">7-Day Return</p>
                      <p className="text-[9px] font-medium text-gray-600 uppercase tracking-widest">Confidence Guaranteed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-full bg-[#4228c4]/10 flex items-center justify-center text-[#4228c4]">
                      <Info size={16} />
                    </div>
                    <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Dealer Info</p>
                  </div>
                  <p className="text-xs font-bold text-gray-400 leading-relaxed mb-6 uppercase tracking-wider">
                    Listed by a Car Bazaar Verified Dealer. View dealer details and other stock below.
                  </p>
                  <button className="text-xs font-bold text-[#4228c4] border-b-2 border-transparent hover:border-[#4228c4] transition-all uppercase tracking-widest">
                    Visit Dealer Page →
                  </button>
                </div>
              </div>
            </aside>
          </div>

          {/* Similar Vehicles */}
          <section className="mt-32">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-[#121212] tracking-tight">Similar Vehicles</h2>
              <button className="text-[#4228c4] font-bold hover:underline tracking-tight">
                Browse all →
              </button>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {similar.slice(0, 4).map((item) => (
                <VehicleCard key={item.id} vehicle={item as any} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
