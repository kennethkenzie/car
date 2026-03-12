"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts";

export function EnquiryChart() {
  const data = [
    { name: "Mon", enquiries: 4 },
    { name: "Tue", enquiries: 6 },
    { name: "Wed", enquiries: 5 },
    { name: "Thu", enquiries: 8 },
    { name: "Fri", enquiries: 7 },
    { name: "Sat", enquiries: 3 },
    { name: "Sun", enquiries: 2 }
  ];
  return (
    <div className="h-72 rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-3 text-sm font-semibold">Weekly enquiries</p>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="enquiries" fill="#4228c4" radius={6} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PriceTrendChart() {
  const data = [
    { month: "Oct", avg: 17800 },
    { month: "Nov", avg: 18100 },
    { month: "Dec", avg: 17600 },
    { month: "Jan", avg: 18400 },
    { month: "Feb", avg: 18900 },
    { month: "Mar", avg: 19100 }
  ];
  return (
    <div className="h-72 rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-3 text-sm font-semibold">Average listing price trend</p>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line dataKey="avg" stroke="#4228c4" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
