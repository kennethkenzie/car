"use client";

import { Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";

const enquiries = [
  { id: "e1", name: "Sarah N.", email: "sarah@example.com", phone: "+256 700 111222", status: "NEW", subject: "Samsung board availability", message: "Do you have Samsung BN94 boards in stock this week?" },
  { id: "e2", name: "David K.", email: "david@example.com", phone: "+256 700 222333", status: "CONTACTED", subject: "Bulk cable order", message: "I need 40 HDMI cables and 20 remotes for my shop." },
  { id: "e3", name: "Ruth A.", email: "ruth@example.com", phone: "+256 700 333444", status: "NEGOTIATION", subject: "Signal finder quote", message: "Please share your best price for 5 digital signal finders." },
  { id: "e4", name: "Paul K.", email: "paul@example.com", phone: "+256 700 444555", status: "WON", subject: "Backlight strips", message: "I am ready to confirm the order for the LG backlights." },
];

const statuses = ["NEW", "CONTACTED", "NEGOTIATION", "WON"] as const;

export default function EnquiriesPage() {
  const [selectedId, setSelectedId] = useState(enquiries[0]?.id ?? null);
  const selected = enquiries.find((entry) => entry.id === selectedId) ?? null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-extrabold tracking-tight text-[#121212]">Enquiries Inbox</h2>
        <p className="mt-2 text-gray-500">Track and respond to product and wholesale requests.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statuses.map((status) => (
            <div key={status} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{status}</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-500">
                  {enquiries.filter((entry) => entry.status === status).length}
                </span>
              </div>
              <div className="space-y-3">
                {enquiries
                  .filter((entry) => entry.status === status)
                  .map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => setSelectedId(entry.id)}
                      className={[
                        "w-full rounded-[1.5rem] border p-5 text-left transition-all duration-300",
                        selectedId === entry.id
                          ? "border-[#4228c4] bg-[#4228c4] text-white shadow-xl shadow-[#4228c4]/20"
                          : "border-gray-100 bg-white text-gray-900 hover:border-[#4228c4]/30 hover:shadow-sm",
                      ].join(" ")}
                    >
                      <p className="mb-1 text-sm font-bold">{entry.name}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${selectedId === entry.id ? "text-white/60" : "text-gray-400"}`}>
                        {entry.subject}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <aside>
          {selected ? (
            <div className="sticky top-28 space-y-6 rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-xl shadow-gray-200/50">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4228c4]/10 text-[#4228c4]">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selected.name}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#4228c4]">Enquiry Details</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <Mail className="h-4 w-4 text-gray-300" />
                  {selected.email}
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <Phone className="h-4 w-4 text-gray-300" />
                  {selected.phone}
                </div>
              </div>
              <div className="rounded-2xl bg-gray-50 p-6">
                <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Message</div>
                <p className="text-sm font-medium leading-relaxed text-gray-700">"{selected.message}"</p>
              </div>
              <div className="flex flex-col gap-3 border-t border-gray-50 pt-6">
                <button className="w-full rounded-2xl bg-[#4228c4] py-4 text-sm font-bold text-white shadow-lg shadow-[#4228c4]/20 transition hover:bg-[#3621a1]">
                  Send Response
                </button>
                <button className="w-full rounded-2xl border border-gray-100 bg-white py-4 text-sm font-bold text-gray-900 transition hover:bg-gray-50">
                  Mark as Contacted
                </button>
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
