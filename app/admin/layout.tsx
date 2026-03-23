"use client";

import DashboardFooter from "./DashboardFooter";
import Link from "next/link";
import { useMemo, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
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
  Loader2,
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
        "flex items-center justify-between rounded-xl px-5 py-4 text-sm transition-all",
        active
          ? "bg-[#4228c4] text-white shadow-xl shadow-[#4228c4]/20 font-bold"
          : "text-gray-500 font-medium hover:bg-white/5 hover:text-white",
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
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const dashboardItems: NavItem[] = useMemo(
    () => [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/inventory", label: "Inventory", icon: List },
      { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
      { href: "/admin/orders", label: "Orders", icon: Package },
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

  const userInitial =
    user?.name?.trim().charAt(0) || user?.email?.trim().charAt(0) || "U";

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#4228c4]" />
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#111827]">
      <div className="flex min-h-screen">
        <aside className="hidden sticky top-0 h-screen w-72 shrink-0 bg-[#0a0a0a] p-8 xl:flex xl:flex-col overflow-y-auto">
          <Link href="/admin" className="mb-12 flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black shadow-lg shadow-white/5 transition-transform group-hover:scale-105">
              <Car className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold leading-none tracking-tight text-white uppercase">
                Car Baazar
              </span>
              <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.24em] text-gray-600">
                Bond Dashboard
              </span>
            </div>
          </Link>

          <div>
            <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.24em] text-gray-700">
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
            <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.24em] text-gray-700">
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

          <div className="mt-auto px-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4228c4] text-[15px] font-bold text-white uppercase">
                  {userInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-white">
                    {user?.name || "Member"}
                  </div>
                  <div className="truncate text-[11px] font-medium text-gray-500">
                    {user?.email}
                  </div>
                </div>
              </div>
              <button
                onClick={async () => {
                  await signOut();
                  window.location.href = "/login";
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-bold text-white transition hover:bg-red-500 hover:border-red-500"
              >
                Sign out
              </button>
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
