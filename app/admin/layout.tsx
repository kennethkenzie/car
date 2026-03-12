"use client";

import DashboardFooter from "./DashboardFooter";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Car,
  ChevronRight,
  Grid2X2,
  LayoutDashboard,
  List,
  MessageSquare,
  Package,
  Plus,
  SlidersHorizontal,
  Store,
  Tag,
  UserCircle2,
  Users,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: NavItem & { active: boolean }) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center justify-between rounded-2xl px-5 py-4 text-sm transition-all",
        active
          ? "bg-[#4228c4] text-white shadow-xl shadow-[#4228c4]/20 font-bold"
          : "text-gray-400 font-normal hover:bg-gray-50 hover:text-gray-900 hover:font-bold",
      ].join(" ")}
    >
      <span className="flex items-center gap-3">
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </span>
      {active ? <ChevronRight className="h-4 w-4 text-white/50" /> : null}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const dashboardItems: NavItem[] = useMemo(
    () => [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/inventory", label: "Inventory", icon: List },
      { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
      { href: "/admin/team", label: "Team", icon: Users },
      { href: "/admin/dealers", label: "Dealers", icon: Store },
      { href: "/admin/profile", label: "Profile", icon: UserCircle2 },
    ],
    []
  );

  const commerceItems: NavItem[] = useMemo(
    () => [
      { href: "/admin/products/brand", label: "Brands", icon: Tag },
      { href: "/admin/products/category", label: "Categories", icon: Grid2X2 },
      { href: "/admin/storefront/slider", label: "Homepage Slider", icon: SlidersHorizontal },
    ],
    []
  );

  const title = useMemo(() => {
    const current = [...dashboardItems, ...commerceItems].find((item) =>
      pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
    );
    return current?.label ?? "Admin";
  }, [commerceItems, dashboardItems, pathname]);

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#111827]">
      <div className="flex min-h-screen">
        <aside className="hidden h-screen w-72 shrink-0 border-r border-gray-100 bg-white p-8 xl:flex xl:flex-col">
          <Link href="/admin" className="mb-12 flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white shadow-lg shadow-black/20 transition-transform group-hover:scale-105">
              <Car className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold leading-none tracking-tight text-gray-900 uppercase">
                Car Baazar
              </span>
              <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">
                Bond Dashboard
              </span>
            </div>
          </Link>

          <div>
            <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.24em] text-gray-300">
              Dashboard
            </p>
            <nav className="space-y-2">
              {dashboardItems.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  active={
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href))
                  }
                />
              ))}
            </nav>
          </div>

          <div className="mt-8">
            <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.24em] text-gray-300">
              Storefront
            </p>
            <nav className="space-y-2">
              {commerceItems.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                />
              ))}
            </nav>
          </div>

          <div className="mt-auto rounded-[28px] border border-gray-100 bg-gray-50 p-5">
            <div className="text-sm font-bold text-gray-900">Kenneth Store</div>
            <div className="mt-1 text-xs font-medium text-gray-500">
              seller@modernelectronics.com
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/90 px-4 py-5 backdrop-blur md:px-6 xl:px-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-gray-300">
                  <span>Portal</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-[#4228c4]">{title}</span>
                </div>
                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">
                  {title}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black"
                >
                  Back to Website
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/admin/inventory/new"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#4228c4] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4228c4]/20 transition hover:bg-[#3621a1]"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </Link>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-6 md:px-6 xl:px-10">{children}</div>
          <DashboardFooter />
        </main>
      </div>
    </div>
  );
}
