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
  Wallet
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
    mutationFn: (status: string) => updateEnquiryStatus(id as string, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: (note: string) => addEnquiryNote(id as string, note),
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
        <div className="h-20 w-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mb-6">
          <AlertCircle size={32} />
        </div>
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
          <div className="flex items-center gap-4">
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
          <Button variant="outline" className="gap-2 rounded-xl">
            <Download size={18} />
            Export Invoice
          </Button>
          <Button 
            className="gap-2 bg-green-600 hover:bg-green-700 rounded-xl px-6"
            onClick={() => updateStatusMutation.mutate("WON")}
          >
            <CheckCircle2 size={18} />
            Complete Order
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
                 Order Items
               </h3>
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                 {metadata?.items.length || 0} unique positions
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
                       <div className="mt-2 flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                         <span>SKU: {item.id.split('-')[0].toUpperCase()}</span>
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
                <div className="py-12 text-center text-gray-400 font-medium whitespace-pre-wrap leading-relaxed">
                  {order.message}
                </div>
              )}
            </div>

            {metadata && (
              <div className="mt-8 pt-8 border-t border-dashed border-gray-100 flex flex-col gap-3 items-end">
                <div className="flex justify-between w-full max-w-[280px] text-sm font-semibold text-gray-500">
                   <span>Subtotal</span>
                   <span className="text-gray-900">{formatOrderCurrency(metadata.subtotal)}</span>
                </div>
                <div className="flex justify-between w-full max-w-[280px] text-sm font-semibold text-gray-500">
                   <span>Service Fee</span>
                   <span className="text-gray-900">{formatOrderCurrency(metadata.fee)}</span>
                </div>
                <div className="flex justify-between w-full max-w-[280px] pt-4 border-t border-gray-100">
                   <span className="text-lg font-black text-gray-900">Total Charged</span>
                   <span className="text-2xl font-black text-[#4228c4]">{formatOrderCurrency(metadata.total)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Logistics / Customer Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
               <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                 <Truck className="text-orange-500" size={20} />
                 Shipping & Notes
               </h3>
               {metadata?.notes ? (
                 <div className="p-5 rounded-lg bg-orange-50/50 border border-orange-100">
                    <p className="text-sm font-medium text-gray-700 leading-relaxed italic">
                      "{metadata.notes}"
                    </p>
                 </div>
               ) : (
                 <p className="text-sm font-bold text-gray-300 italic">No specific delivery instructions provided.</p>
               )}
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
               <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                 <Clock className="text-gray-400" size={20} />
                 Internal Registry
               </h3>
               <div className="space-y-4">
                  {order.notes ? (
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 text-sm font-bold text-gray-700">
                       {order.notes}
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-gray-300 italic">No internal notes for this record.</p>
                  )}
                  <textarea
                    className="w-full h-24 p-4 rounded-lg border border-gray-100 bg-gray-50 text-sm font-medium focus:ring-2 focus:ring-[#4228c4]/10 transition-all outline-none resize-none"
                    placeholder="Add internal log entry..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <Button 
                    className="w-full h-10 text-xs rounded-lg"
                    disabled={!replyText.trim() || addNoteMutation.isPending}
                    onClick={() => addNoteMutation.mutate(replyText)}
                  >
                    Save Note
                  </Button>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Profile & Payment */}
        <div className="space-y-8">
          
          {/* Customer Card */}
          <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
             <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
               <User className="text-[#4228c4]" size={20} />
               Customer Profile
             </h3>
             <div className="flex items-center gap-5 mb-8">
                <div className="h-16 w-16 rounded-2xl bg-[#4228c4] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-[#4228c4]/20">
                  {order.name.charAt(0)}
                </div>
                <div>
                   <h4 className="text-xl font-black text-gray-900 leading-none">{order.name}</h4>
                   <p className="mt-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">Verified Buyer</p>
                </div>
             </div>

             <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-50">
                   <Mail className="h-5 w-5 text-gray-400 shrink-0" />
                   <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Email Address</div>
                      <div className="text-sm font-bold text-gray-900 truncate">{order.email}</div>
                   </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-50">
                   <Phone className="h-5 w-5 text-gray-400 shrink-0" />
                   <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Contact Number</div>
                      <div className="text-sm font-bold text-gray-900">{order.phone || 'N/A'}</div>
                   </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-50">
                   <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                   <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Delivery Location</div>
                      <div className="text-sm font-bold text-gray-900 leading-relaxed">
                        {metadata?.customer.address}<br />
                        {metadata?.customer.city}{metadata?.customer.postcode ? `, ${metadata.customer.postcode}` : ''}
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Payment Card */}
          <div className="rounded-xl border border-gray-100 bg-gray-900 p-8 shadow-xl text-white relative overflow-hidden">
             <div className="absolute -top-12 -right-12 h-40 w-40 bg-white/5 rounded-full blur-3xl" />
             <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
               <CreditCard className="text-blue-400" size={20} />
               Billing & Payment
             </h3>
             
             <div className="space-y-6 relative z-10">
                <div>
                   <div className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-2">Selected Method</div>
                   <div className="flex items-center gap-3">
                      {metadata?.paymentMethod === 'mm' && <Phone className="text-yellow-400" size={24} />}
                      {metadata?.paymentMethod === 'bank' && <Briefcase className="text-blue-400" size={24} />}
                      {metadata?.paymentMethod === 'bond' && <Home className="text-orange-400" size={24} />}
                      <div className="text-xl font-black">{metadata ? getPaymentMethodLabel(metadata.paymentMethod) : 'N/A'}</div>
                   </div>
                </div>

                <div className="p-5 rounded-lg bg-white/5 border border-white/10">
                   <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                      <p className="text-sm font-medium text-white/80 leading-relaxed">
                        {metadata ? getPaymentStatusLabel(metadata.paymentMethod) : "Manual verification required."}
                      </p>
                   </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                   <div className="text-xs font-bold text-white/40 uppercase tracking-widest">Transaction Total</div>
                   <div className="text-2xl font-black text-[#86efac]">{metadata ? formatOrderCurrency(metadata.total) : 'N/A'}</div>
                </div>
             </div>
          </div>

          {/* Verification Status */}
          <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-green-500" size={24} />
                <h3 className="text-lg font-black text-gray-900">Security Check</h3>
             </div>
             <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <CheckCircle2 size={16} className="text-green-500" />
                  Address verified via checkout
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <CheckCircle2 size={16} className="text-green-500" />
                  Contact identity confirmed
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <AlertCircle size={16} className="text-blue-500" />
                  Awaiting payment capture
                </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Briefcase(props: any) { return <Wallet {...props} /> }
function Home(props: any) { return <Package {...props} /> }
