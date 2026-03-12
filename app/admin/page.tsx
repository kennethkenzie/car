"use client";

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
  Database,
  Eye,
  Inbox,
  MoreVertical,
  RefreshCcw,
  Truck,
} from "lucide-react";

type StatCard = {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
  headline: string;
  subtext: string;
};

const statCards: StatCard[] = [
  {
    title: "Total Sales",
    value: "UGX 18.4M",
    change: "+18.2%",
    positive: true,
    headline: "Sales increased this month",
    subtext: "Compared to the previous 30 days",
  },
  {
    title: "Orders",
    value: "1,284",
    change: "+9.4%",
    positive: true,
    headline: "Order volume is healthy",
    subtext: "Average 42 orders per day",
  },
  {
    title: "Products",
    value: "8,642",
    change: "+4.1%",
    positive: true,
    headline: "Catalog keeps expanding",
    subtext: "New SKUs added this week",
  },
  {
    title: "Database",
    value: "Online",
    change: "Healthy",
    positive: true,
    headline: "API and content store connected",
    subtext: "Last checked just now",
  },
];

const recentOrders = [
  ["#ES-1042", "Sarah Namukasa", "T-CON Board Sony 42\"", "UGX 85,000", "Pending", "Today, 10:45 AM"],
  ["#ES-1041", "David Kato", "LG Power Supply Board", "UGX 120,000", "Shipped", "Today, 09:10 AM"],
  ["#ES-1039", "Brian Ssemanda", "Universal TV Remote", "UGX 35,000", "Delivered", "Yesterday"],
  ["#ES-1036", "Mariam Achieng", "Backlight Strips Set", "UGX 95,000", "Cancelled", "Yesterday"],
] as const;

function SmallCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {action ? (
          <button className="text-sm font-semibold text-[#4228c4] hover:underline">
            {action}
          </button>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function OrderBadge({ status }: { status: string }) {
  const tone =
    status === "Pending"
      ? "bg-orange-50 text-orange-700 border-orange-200"
      : status === "Shipped"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : status === "Delivered"
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-red-50 text-red-700 border-red-200";

  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}>
      {status}
    </span>
  );
}

export default function EcommerceAdminDashboard() {
  const bars = [28, 22, 30, 35, 50, 58, 31, 62, 20, 40, 57, 38, 60, 27, 24, 22, 71, 56, 18, 24, 30, 26, 57, 19];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-extrabold tracking-tight text-[#121212]">
          Performance Overview
        </h2>
        <p className="mt-2 text-gray-500">
          Real-time statistics for your storefront, sales pipeline, and catalog health.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.title} className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="text-lg font-medium text-gray-500">{card.title}</div>
              <div className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-sm font-semibold text-gray-900">
                {card.positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {card.change}
              </div>
            </div>
            <div className="mt-3 text-[44px] font-semibold leading-none tracking-[-0.03em] text-[#0b1220]">
              {card.value}
            </div>
            <div className="mt-5 flex items-center gap-2 text-lg font-medium text-[#0b1220]">
              <span>{card.headline}</span>
              {card.title === "Database" ? <Database className="h-5 w-5" /> : card.positive ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
            </div>
            <p className="mt-2 text-base text-[#7b8394]">{card.subtext}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
        <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-[28px] font-semibold text-[#0b1220]">Sales Overview</h3>
              <p className="mt-1 text-base text-[#7b8394]">
                Revenue and order activity for the last quarter
              </p>
            </div>
            <div className="inline-flex overflow-hidden rounded-2xl border border-gray-200 bg-[#fafafa]">
              {["Last 3 months", "Last 30 days", "Last 7 days"].map((item, i) => (
                <button
                  key={item}
                  className={[
                    "px-6 py-3 text-sm font-medium",
                    i === 0 ? "bg-[#f3f4f6] text-[#111827]" : "text-[#111827]",
                    i !== 0 ? "border-l border-gray-200" : "",
                  ].join(" ")}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 h-[320px]">
            <svg viewBox="0 0 1200 320" className="h-full w-full">
              {[50, 100, 150, 200, 250].map((y) => (
                <line key={y} x1="0" y1={y} x2="1200" y2={y} stroke="#edf0f4" strokeWidth="1" />
              ))}
              <path
                d={
                  bars
                    .map((v, i) => {
                      const x = (i / (bars.length - 1)) * 1200;
                      const y = 260 - v * 2.2;
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                    })
                    .join(" ") + " L 1200 260 L 0 260 Z"
                }
                fill="rgba(96, 165, 250, 0.22)"
                stroke="#93c5fd"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        <div className="grid gap-6">
          <SmallCard title="Customer activity" action="See all">
            <div className="space-y-4">
              {[
                ["Kevin M.", "placed an order for TDA2822M IC", "5 min ago"],
                ["Ruth A.", "added 3 products to cart", "12 min ago"],
                ["Paul K.", "completed checkout", "20 min ago"],
                ["Janet N.", "requested return for TV remote", "1 hour ago"],
              ].map(([customer, action, time]) => (
                <div key={customer + time} className="flex items-start gap-3">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#eef3ff] text-[#2554e8]">
                    <Inbox className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-[#111827]">
                      <span className="font-semibold">{customer}</span>{" "}
                      <span className="text-[#4b5563]">{action}</span>
                    </p>
                    <p className="mt-1 text-xs text-[#9ca3af]">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </SmallCard>

          <SmallCard title="Revenue by category" action="View report">
            <div className="space-y-4">
              {[
                ["TV Spare Parts", 68, "UGX 12.5M"],
                ["Accessories", 48, "UGX 8.1M"],
                ["Repair Tools", 36, "UGX 5.4M"],
                ["Audio Parts", 24, "UGX 3.2M"],
              ].map(([name, value, amount]) => (
                <div key={String(name)}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[#111827]">{name}</span>
                    <span className="text-xs text-[#6b7280]">{amount}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#eef2f7]">
                    <div className="h-2.5 rounded-full bg-[#4f8cff]" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SmallCard>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.9fr)]">
        <div className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[#eef1f4] px-5 py-4">
            <div>
              <h3 className="text-lg font-semibold text-[#0b1220]">Recent orders</h3>
              <p className="text-sm text-[#7b8394]">Latest customer purchases and fulfillment status</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-[#111827]">
              <Eye className="h-4 w-4" />
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px]">
              <thead>
                <tr className="bg-[#fbfbfc] text-left">
                  {["Order ID", "Customer", "Product", "Amount", "Status", "Date", ""].map((head) => (
                    <th key={head} className="px-5 py-3 text-sm font-medium text-[#6b7280]">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((row, i) => (
                  <tr key={row[0]} className={i ? "border-t border-[#eef1f4]" : ""}>
                    <td className="px-5 py-4 text-sm font-semibold text-[#111827]">{row[0]}</td>
                    <td className="px-5 py-4 text-sm text-[#111827]">{row[1]}</td>
                    <td className="px-5 py-4 text-sm text-[#111827]">{row[2]}</td>
                    <td className="px-5 py-4 text-sm font-medium text-[#111827]">{row[3]}</td>
                    <td className="px-5 py-4"><OrderBadge status={row[4]} /></td>
                    <td className="px-5 py-4 text-sm text-[#6b7280]">{row[5]}</td>
                    <td className="px-5 py-4 text-right"><MoreVertical className="ml-auto h-4 w-4 text-[#6b7280]" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-6">
          <SmallCard title="Pending shipments">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#2563eb]">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[28px] font-semibold text-[#111827]">48</div>
                <div className="text-sm text-[#7b8394]">Orders waiting for dispatch</div>
              </div>
            </div>
          </SmallCard>
          <SmallCard title="Returns requested">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#ea580c]">
                <RefreshCcw className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[28px] font-semibold text-[#111827]">12</div>
                <div className="text-sm text-[#7b8394]">Awaiting review and approval</div>
              </div>
            </div>
          </SmallCard>
          <SmallCard title="Products to review">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fef2f2] text-[#dc2626]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[28px] font-semibold text-[#111827]">7</div>
                <div className="text-sm text-[#7b8394]">Missing images or incomplete details</div>
              </div>
            </div>
          </SmallCard>
          <SmallCard title="Average lead response">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5f3ff] text-[#6d28d9]">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[28px] font-semibold text-[#111827]">18m</div>
                <div className="text-sm text-[#7b8394]">First-response time this week</div>
              </div>
            </div>
          </SmallCard>
        </div>
      </div>
    </div>
  );
}
