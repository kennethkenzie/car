"use client";

import Link from "next/link";
import { 
    Car, 
    Truck, 
    Zap, 
    Crown, 
    ShieldCheck, 
    Timer, 
    Key, 
    Fuel,
    ChevronRight,
    LucideIcon,
    CarFront,
    Gauge,
    Wind,
    BatteryCharging,
    LayoutGrid
} from "lucide-react";
import { useFrontendData } from "@/lib/use-frontend-data";

const iconMap: Record<string, LucideIcon> = {
    car: Car,
    "car-front": CarFront,
    truck: Truck,
    zap: Zap,
    crown: Crown,
    shield: ShieldCheck,
    timer: Timer,
    key: Key,
    fuel: Fuel,
    gauge: Gauge,
    wind: Wind,
    "battery-charging": BatteryCharging,
    "layout-grid": LayoutGrid,
};

export default function DynamicCategorySection() {
    const data = useFrontendData();
    const categories = data.categories || [];

    // Only show active and featured categories on the homepage
    const featuredCategories = categories
        .filter(c => c.isActive && c.isFeatured)
        .sort((a, b) => a.order - b.order);

    if (featuredCategories.length === 0) return null;

    return (
        <section className="relative w-full overflow-hidden bg-white py-20 pb-24">
            {/* Ambient Background Elements */}
            <div className="absolute left-0 top-0 -z-10 h-72 w-72 translate-x-[-10%] translate-y-[-10%] rounded-full bg-[#f6c400]/5 blur-[100px]" />
            <div className="absolute right-0 bottom-0 -z-10 h-96 w-96 translate-x-[10%] translate-y-[10%] rounded-full bg-[#0b63ce]/5 blur-[120px]" />

            <div className="mx-auto max-w-[1400px] px-6">
                <div className="mb-12 flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-8 sm:flex-row sm:items-end">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Browse by <span className="text-[#0b63ce]">Category</span>
                        </h2>
                        <p className="mt-2 text-lg text-gray-500">
                            Find the perfect vehicle that fits your lifestyle.
                        </p>
                    </div>
                    <Link
                        href="/categories"
                        className="group flex items-center gap-2 text-sm font-bold text-gray-900 transition-colors hover:text-[#0b63ce]"
                    >
                        View All Categories
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                    {featuredCategories.map((cat) => {
                        const IconComponent = iconMap[cat.icon?.toLowerCase()] || Car;
                        
                        return (
                            <Link
                                key={cat.id}
                                href={`/cars?category=${cat.slug}`}
                                className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white/50 p-6 text-center shadow-sm transition-all duration-500 backdrop-blur-md hover:-translate-y-1 hover:border-gray-200 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50"
                            >
                                {/* Glassy Icon Container */}
                                <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50/80 transition-all duration-500 group-hover:bg-white group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <div className="absolute inset-0 rounded-2xl border border-gray-200/50 transition-all group-hover:border-[#0b63ce]/20" />
                                    <IconComponent className="h-10 w-10 text-gray-900 transition-all duration-500 group-hover:scale-110 group-hover:text-[#0b63ce]" strokeWidth={1.5} />
                                </div>
                                
                                <span className="text-[14px] font-bold tracking-tight text-gray-900 transition-colors group-hover:text-[#0b63ce]">
                                    {cat.title}
                                </span>
                                
                                <div className="mt-1 h-0.5 w-0 bg-[#0b63ce] transition-all duration-500 group-hover:w-8" />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
