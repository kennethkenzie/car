import { EnquiryModal } from "@/components/EnquiryModal";
import { VehicleCard } from "@/components/VehicleCard";
import { VehicleGallery } from "@/components/VehicleGallery";
import { getSimilarVehiclesReal, getVehicleReal } from "@/lib/api";
import { formatGBP } from "@/lib/utils";
import { notFound } from "next/navigation";
import { MapPin, ShieldCheck, History, Fuel, Zap, Calendar, Gauge, Info } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default async function VanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = await getVehicleReal(slug);
  if (!vehicle || vehicle.type !== "VAN") notFound();
  const similar = await getSimilarVehiclesReal(slug, "VAN");
  const features = Array.isArray(vehicle.features)
    ? vehicle.features
    : typeof vehicle.features === "string"
      ? (vehicle.features as string).split(/\r?\n/).map((feature: string) => feature.trim()).filter(Boolean)
      : [];

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <Header />
      
      <main className="pt-32 pb-32">
        <div className="mx-auto max-w-[1440px] px-6">
          {/* Gallery Section */}
          <div className="mb-12">
            <VehicleGallery images={vehicle.images} title={`${vehicle.make} ${vehicle.model}`} />
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            <div className="space-y-12">
              {/* Header Info */}
              <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-[#4228c4]/10 text-[#4228c4] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Verified Stock
                  </span>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{vehicle.postcode}</span>
                  </div>
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
                    <p className="text-sm font-bold text-gray-900">{vehicle.mileage.toLocaleString()}</p>
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

              {/* Vehicle Details */}
              <div className="grid gap-8">
                <section className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100/50">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <ShieldCheck className="h-7 w-7 text-[#4228c4]" />
                    Reliability Check
                  </h2>
                  <div className="grid lg:grid-cols-2 gap-4">
                    {[
                      "VAT Qualifying / Price inc VAT",
                      "Commercial Use Vetted",
                      "Full Service History",
                      "Verified Load Capacity"
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3 p-5 rounded-2xl bg-gray-50/50 border border-gray-100">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-light text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100/50">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Operational Features</h2>
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Van Specifications</h2>
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
                  <p className="text-5xl font-bold mb-1">{formatGBP(vehicle.price)}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-10">Low Interest Commercial Finance Available</p>

                  <div className="space-y-4 relative z-10">
                    <EnquiryModal vehicleId={vehicle.id} dealerId={vehicle.dealerId} />
                    <button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl py-4 font-bold text-sm transition-all active:scale-95">
                      Business Lease Enquiry
                    </button>
                  </div>

                  <div className="mt-10 pt-10 border-t border-white/10 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center">
                      <History className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">6-Month Warranty</p>
                      <p className="text-[9px] font-medium text-gray-600 uppercase tracking-widest">Comprehensive Cover</p>
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
                    Listed by a Car Bazaar Verified Commercial Dealer.
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
              <h2 className="text-3xl font-bold text-[#121212] tracking-tight">Similar Vans</h2>
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
