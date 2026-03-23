"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Package, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  CreditCard, 
  Clock, 
  ShieldCheck,
  Truck,
  Download,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ExternalLink,
  Wallet,
  Home,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { getOrders, updateEnquiryStatus, addEnquiryNote } from "@/lib/api";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import SafeImage from "@/components/SafeImage";
import { getPaymentMethodLabel, getPaymentStatusLabel, formatOrderCurrency } from "@/lib/order-utils";
import { useState } from "react";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState("");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const order = orders?.find((o) => o.id === id);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateEnquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => addEnquiryNote(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setReplyText("");
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#4228c4]/20 border-t-[#4228c4]" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Order Details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <div className="h-20 w-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-6 font-black uppercase text-4xl">?</div>
        <h2 className="text-2xl font-black text-gray-900">Order Not Found</h2>
        <p className="mt-2 text-gray-500 mb-8 max-w-sm">The order you're looking for doesn't exist or has been removed from the registry.</p>
        <Button onClick={() => router.push("/admin/orders")}>Back to Queue</Button>
      </div>
    );
  }

  const statusColors: Record<string, any> = {
    NEW: "blue",
    CONTACTED: "yellow",
    TEST_DRIVE: "purple",
    NEGOTIATION: "orange",
    WON: "green",
    LOST: "red",
  };

  const metadata = order.metadata;

  return (
    <div className="space-y-8 pb-20">
      {/* Header Area */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Link 
            href="/admin/orders"
            className="group inline-flex items-center gap-2 text-sm font-bold text-gray-400 transition hover:text-black mb-2"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Orders
          </Link>
          <div className="flex items-center gap-4 text-nowrap">
            <h1 className="text-4xl font-black tracking-tight text-gray-900">{order.orderNumber}</h1>
            <Badge variant={statusColors[order.status] || "gray"} className="px-4 py-1.5 text-xs font-bold uppercase transition-all">
              {order.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Clock size={14} className="text-gray-400" />
            Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 rounded-xl h-12 shadow-sm">
            <Download size={18} />
            Export Invoice
          </Button>
          <Button 
            className="gap-2 bg-[#4228c4] hover:bg-[#3621a1] rounded-xl px-10 h-12 shadow-lg shadow-[#4228c4]/20"
            onClick={() => updateStatusMutation.mutate({ id: order.id, status: "WON" })}
          >
            <CheckCircle2 size={18} />
            Mark as Completed
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Line Items & Billing */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Item List */}
          <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                 <Package className="text-[#4228c4]" size={22} />
                 Order Line Items
               </h3>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                 {metadata?.items.length || (order.vehicle ? 1 : 0)} unique positions
               </span>
            </div>

            <div className="divide-y divide-gray-50">
              {metadata ? (
                metadata.items.map((item) => (
                  <div key={item.id} className="py-6 flex gap-6 items-center group">
                    <div className="h-24 w-24 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <SafeImage src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="font-bold text-gray-900 leading-tight group-hover:text-[#4228c4] transition-colors">{item.name}</h4>
                       <div className="mt-2 flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                         <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100">SKU: {item.id.split('-')[0].toUpperCase()}</span>
                         <span>Qty: {item.qty}</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-lg font-black text-gray-900">{formatOrderCurrency(item.price * item.qty)}</div>
                       <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                         {item.qty} x {formatOrderCurrency(item.price)}
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                   <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                      <ShoppingBag size={24} />
                   </div>
                   <div className="max-w-md">
                      <div className="text-sm font-bold text-gray-900">External Order Data</div>
                      <p className="mt-1 text-xs font-medium text-gray-400 leading-relaxed whitespace-pre-wrap">
                        {order.message}
                      </p>
                   </div>
                </div>
              )}
            </div>

            {metadata && (
              <div className="mt-8 pt-8 border-t border-dashed border-gray-100 flex flex-col gap-3 items-end">
                <div className="flex justify-between w-full max-w-[280px] text-sm font-bold text-gray-500">
                   <span>Cart Subtotal</span>
                   <span className="text-gray-900">{formatOrderCurrency(metadata.subtotal)}</span>
                </div>
                <div className="flex justify-between w-full max-w-[280px] text-sm font-bold text-gray-500">
                   <span>Service Fee</span>
                   <span className="text-gray-900">{formatOrderCurrency(metadata.fee)}</span>
                </div>
                <div className="flex justify-between w-full max-w-[280px] pt-4 border-t border-gray-200 mt-2">
                   <span className="text-sm font-black text-gray-400 uppercase">Paid & Charged</span>
                   <span className="text-2xl font-black text-[#4228c4]">{formatOrderCurrency(metadata.total)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Logistics / Customer Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm h-fit">
               <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                 <Truck className="text-orange-500" size={20} />
                 Shipping Instructions
               </h3>
               {metadata?.notes ? (
                 <div className="p-6 rounded-xl bg-orange-50/50 border border-orange-100">
                    <p className="text-sm font-medium text-gray-700 leading-relaxed italic">
                      "{metadata.notes}"
                    </p>
                 </div>
               ) : (
                 <p className="text-sm font-bold text-gray-300 italic border border-dashed border-gray-200 p-8 rounded-xl text-center">No delivery requirements provided.</p>
               )}
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
               <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                 <Clock className="text-gray-400" size={20} />
                 Activity Log
               </h3>
               <div className="space-y-4">
                  {order.notes ? (
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 text-[13px] font-bold text-gray-700 leading-relaxed max-h-[150px] overflow-y-auto">
                       {order.notes}
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-gray-300 italic text-center py-4">No internal audit trails yet.</p>
                  )}
                  
                  <div className="space-y-4 pt-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#4228c4]">Record Manifest</div>
                    <textarea
                      className="w-full h-24 p-4 rounded-xl border border-gray-100 bg-gray-50 text-[13px] font-medium focus:ring-4 focus:ring-[#4228c4]/5 focus:border-[#4228c4]/30 transition-all outline-none resize-none"
                      placeholder="Add status update or internal log..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <Button 
                      className="w-full h-11 text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#4228c4]/5"
                      disabled={!replyText.trim() || addNoteMutation.isPending}
                      onClick={() => addNoteMutation.mutate({ id: order.id, note: replyText })}
                    >
                      {addNoteMutation.isPending ? "Recording..." : "Save Activity"}
                    </Button>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Profile & Payment */}
        <div className="space-y-8">
          
          {/* Customer Profile */}
          <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm overflow-hidden relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-[#4228c4]" />
             <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-2">
               <User className="text-[#4228c4]" size={20} />
               Customer Profile
             </h3>
             <div className="flex items-center gap-5 mb-10">
                <div className="h-20 w-20 rounded-[1.25rem] bg-[#4228c4] flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-[#4228c4]/30">
                  {order.name.charAt(0)}
                </div>
                <div>
                   <h4 className="text-2xl font-black text-gray-900 leading-none">{order.name}</h4>
                   <p className="mt-2 text-[10px] font-black text-green-500 uppercase tracking-[0.2em] bg-green-50 px-2 py-1 rounded inline-block">Registered Buyer</p>
                </div>
             </div>

             <div className="space-y-4">
                <ProfileItem icon={<Mail size={16} />} label="Email Address" value={order.email} />
                <ProfileItem icon={<Phone size={16} />} label="Contact" value={order.phone || 'N/A'} />
                <ProfileItem 
                   icon={<MapPin size={16} />} 
                   label="Delivery Dest." 
                   value={`${metadata?.customer.address || 'N/A'}, ${metadata?.customer.city || order.notes || ''}`} 
                />
             </div>
          </div>

          {/* Payment Card - Premium Design */}
          <div className="rounded-3xl bg-gray-950 p-10 shadow-2xl text-white relative h-fit overflow-hidden border border-white/5">
             <div className="absolute top-0 right-0 w-40 h-40 bg-[#4228c4]/20 rounded-full blur-[80px] -mr-20 -mt-20" />
             <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] -ml-20 -mb-20" />
             
             <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-black text-white">Payment</h3>
                   <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <CreditCard size={20} className="text-blue-400" />
                   </div>
                </div>

                <div>
                   <div className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40 mb-3">Method & Type</div>
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                         {metadata?.paymentMethod === 'mm' && <Phone size={20} className="text-yellow-400" />}
                         {metadata?.paymentMethod === 'bank' && <Briefcase size={20} className="text-blue-400" />}
                         {metadata?.paymentMethod === 'bond' && <Home size={20} className="text-orange-400" />}
                      </div>
                      <div>
                         <div className="text-lg font-black">{metadata ? getPaymentMethodLabel(metadata.paymentMethod) : 'Standard Enquiry'}</div>
                         <div className="text-[10px] font-bold text-white/50">{metadata ? getPaymentStatusLabel(metadata.paymentMethod) : 'Manual Review'}</div>
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                   <div className="flex items-end justify-between">
                      <div>
                         <div className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40 mb-1">Final Amount</div>
                         <div className="text-4xl font-black text-[#86efac] tracking-tight">
                           {metadata ? formatOrderCurrency(metadata.total).split(' ')[1] : order.vehicle?.price.toLocaleString()}
                           <span className="text-sm font-bold text-white/30 ml-2">UGX</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Verification Status */}
          <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
                <ShieldCheck className="text-green-500" size={24} />
                <h3 className="text-lg font-black text-gray-900">Compliance</h3>
             </div>
             <div className="space-y-6">
                <ComplianceItem status="pass" label="Verified Physical Address" />
                <ComplianceItem status="pass" label="Email Identification" />
                <ComplianceItem status="wait" label="Funds Reconciliation" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-50 transition-colors hover:bg-gray-100">
       <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-gray-400 shrink-0">
         {icon}
       </div>
       <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">{label}</div>
          <div className="text-[13px] font-black text-gray-950 truncate leading-tight">{value}</div>
       </div>
    </div>
  );
}

function ComplianceItem({ status, label }: { status: 'pass' | 'wait' | 'fail', label: string }) {
   return (
      <div className="flex items-center gap-4">
         <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
            status === 'pass' ? 'bg-green-100 text-green-600' : 
            status === 'wait' ? 'bg-blue-100 text-blue-600' : 
            'bg-red-100 text-red-600'
         }`}>
            {status === 'pass' ? <CheckCircle2 size={16} /> : status === 'wait' ? <Clock size={16} /> : <AlertCircle size={16} />}
         </div>
         <span className={`text-[13px] font-bold ${status === 'wait' ? 'text-gray-400' : 'text-gray-900'}`}>{label}</span>
      </div>
   );
}
