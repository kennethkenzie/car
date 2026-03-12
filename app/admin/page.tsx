"use client";

import { DataTable } from "@/components/DataTable";
import { EnquiryChart, PriceTrendChart } from "@/components/Charts";
import { KpiCard } from "@/components/KpiCard";
import { useAuth } from "@/components/providers/AuthProvider";
import { Car, Edit, Inbox, Clock, Database } from "lucide-react";
import { getDashboardSummary, getDatabaseHealth } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const dashboard = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
  });

  const dbHealth = useQuery({
    queryKey: ["db-health"],
    queryFn: getDatabaseHealth,
    enabled: isAdmin,
    refetchInterval: 30000,
  });

  const dbValue = dbHealth.isLoading
    ? "Checking"
    : dbHealth.data?.database === "connected"
      ? "Online"
      : "Offline";
  const dbHint = dbHealth.isLoading
    ? "live probe"
    : dbHealth.data?.details ?? "No response";
  const dbHintTone = dbHealth.data?.database === "connected" ? "success" : "danger";

  const stats = dashboard.data;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-extrabold text-[#121212] tracking-tight mb-2">Performance Overview</h1>
        <p className="text-gray-500 font-medium">Real-time statistics for your dealership inventory and enquiries.</p>
      </div>

      <div className={`grid gap-6 ${isAdmin ? "md:grid-cols-5" : "md:grid-cols-4"}`}>
        <KpiCard
          label="Active listings"
          value={stats?.activeListings ?? (dashboard.isLoading ? "..." : "0")}
          hint="+12%"
          icon={Car}
        />
        <KpiCard
          label="Draft listings"
          value={stats?.draftListings ?? (dashboard.isLoading ? "..." : "0")}
          icon={Edit}
        />
        <KpiCard
          label="Total Enquiries"
          value={stats?.enquiriesThisWeek ?? (dashboard.isLoading ? "..." : "0")}
          hint="+5.4k"
          icon={Inbox}
        />
        <KpiCard
          label="Avg days to sell"
          value={stats?.avgDaysToSell ?? "-"}
          hint="-2d"
          icon={Clock}
        />
        {isAdmin ? (
          <KpiCard
            label="Database"
            value={dbValue}
            hint={dbHint}
            hintTone={dbHintTone}
            icon={Database}
          />
        ) : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-8">Enquiry Volume</h3>
          <EnquiryChart />
        </div>
        <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-8">Price Trends</h3>
          <PriceTrendChart />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-gray-900">Recent Enquiries</h3>
          <button className="text-sm font-bold text-[#4228c4] hover:underline">View all enquiries →</button>
        </div>
        <DataTable
          loading={dashboard.isLoading}
          data={stats?.recentEnquiries ?? []}
          searchKey="name"
          columns={[
            {
              key: "name",
              label: "Customer",
              render: (row) => (
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">{row.name}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{new Date(row.createdAt).toLocaleDateString()}</span>
                </div>
              )
            },
            { key: "email", label: "Email" },
            {
              key: "vehicle",
              label: "Vehicle",
              render: (row) => (
                <span className="text-xs font-medium text-gray-600">
                  {row.vehicle ? `${row.vehicle.make} ${row.vehicle.model}` : "General Enquiry"}
                </span>
              )
            },
            {
              key: "status",
              label: "Status",
              render: (row) => (
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${row.status === 'NEW' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'
                  }`}>
                  {row.status}
                </span>
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
