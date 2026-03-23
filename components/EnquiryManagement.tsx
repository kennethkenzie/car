"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  Car, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  User
} from "lucide-react";
import { DataTable } from "./DataTable";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { getEnquiries, updateEnquiryStatus, addEnquiryNote } from "@/lib/api";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  notes: string | null;
  status: string;
  createdAt: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    price: number;
  } | null;
};

export function EnquiryManagement() {
  const queryClient = useQueryClient();
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data: allEnquiries, isLoading } = useQuery({
    queryKey: ["enquiries"],
    queryFn: getEnquiries,
  });

  const enquiries = allEnquiries?.filter((e: any) => e.source !== "website_checkout") || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateEnquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => addEnquiryNote(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      setReplyText("");
    },
  });

  const handleReply = () => {
    if (!selectedEnquiry || !replyText.trim()) return;
    
    addNoteMutation.mutate({ id: selectedEnquiry.id, note: replyText });
    updateStatusMutation.mutate({ id: selectedEnquiry.id, status: "CONTACTED" });
  };

  const statusColors: Record<string, any> = {
    NEW: "blue",
    CONTACTED: "yellow",
    TEST_DRIVE: "purple",
    NEGOTIATION: "orange",
    WON: "green",
    LOST: "red",
  };

  const columns = [
    {
      key: "name",
      label: "Customer",
      render: (item: Enquiry) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 font-bold">
            {item.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-gray-900">{item.name}</div>
            <div className="text-xs text-gray-400 font-medium">{item.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "vehicle",
      label: "Vehicle",
      render: (item: Enquiry) => (
        item.vehicle ? (
          <div>
            <div className="font-bold text-gray-900">{item.vehicle.year} {item.vehicle.make} {item.vehicle.model}</div>
            <div className="text-xs text-[#4228c4] font-bold">UGX {Number(item.vehicle.price).toLocaleString()}</div>
          </div>
        ) : (
          <span className="text-gray-400 italic">General Enquiry</span>
        )
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: Enquiry) => (
        <Badge variant={statusColors[item.status] || "gray"}>{item.status}</Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (item: Enquiry) => (
        <div className="flex items-center gap-2 text-gray-500 font-medium">
          <Clock size={14} />
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (item: Enquiry) => (
        <button 
          onClick={() => setSelectedEnquiry(item)}
          className="flex items-center gap-1.5 rounded-xl bg-gray-50 px-4 py-2 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-100"
        >
          View & Reply
          <ChevronRight size={14} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Customer Enquiries</h1>
          <p className="text-gray-500 font-medium mt-1">Manage and respond to lead requests</p>
        </div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DataTable 
            data={enquiries || []} 
            columns={columns} 
            loading={isLoading}
            searchKey="name"
          />
        </div>

        {/* Details / Reply Side Panel */}
        <div className="lg:col-span-1">
          {selectedEnquiry ? (
            <div className="sticky top-24 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4228c4]/10 text-[#4228c4] font-black text-xl">
                    {selectedEnquiry.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 leading-tight">{selectedEnquiry.name}</h2>
                    <Badge variant={statusColors[selectedEnquiry.status] || "gray"} className="mt-1">{selectedEnquiry.status}</Badge>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"
                >
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <Mail className="text-gray-400" size={18} />
                  <div className="text-sm font-bold text-gray-900">{selectedEnquiry.email}</div>
                </div>
                {selectedEnquiry.phone && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <Phone className="text-gray-400" size={18} />
                    <div className="text-sm font-bold text-gray-900">{selectedEnquiry.phone}</div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Customer Message</div>
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium text-gray-700 leading-relaxed italic">
                  "{selectedEnquiry.message}"
                </div>
              </div>

              {selectedEnquiry.notes && (
                <div className="space-y-3 animate-in fade-in duration-500">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Internal Notes / Replies</div>
                  <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-sm font-bold text-gray-900 leading-relaxed">
                    {selectedEnquiry.notes}
                  </div>
                </div>
              )}

              <div className="pt-4 space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Record a Reply</div>
                <textarea
                  className="w-full h-32 p-5 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#4228c4]/5 transition-all outline-none resize-none"
                  placeholder="Type notes about your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <Button 
                  onClick={handleReply}
                  disabled={!replyText.trim() || addNoteMutation.isPending}
                  className="w-full py-4 flex items-center justify-center gap-2 shadow-xl shadow-[#4228c4]/10"
                >
                  {addNoteMutation.isPending ? "Saving..." : "Record & Mark Contacted"}
                  <Send size={16} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="sticky top-24 flex flex-col items-center justify-center p-12 rounded-[2.5rem] border-2 border-dashed border-gray-100 bg-gray-50/30 text-center animate-in fade-in duration-300">
              <div className="h-20 w-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 text-gray-200">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">No Enquiry Selected</h3>
              <p className="text-sm font-medium text-gray-400 leading-relaxed">Select an enquiry from the list to view details and record your response.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
