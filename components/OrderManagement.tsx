"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  Download,
  Mail,
  MoreVertical,
  Package,
  Phone,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { DataTable } from "./DataTable";
import { Badge } from "./Badge";
import { Button } from "./Button";
import {
  deleteEnquiry,
  getOrders,
  updateEnquiryStatus,
  addEnquiryNote,
} from "@/lib/api";
import {
  formatOrderCurrency,
  getPaymentMethodLabel,
  getPaymentStatusLabel,
  type OrderRecord,
} from "@/lib/order-utils";

function downloadReport(order: OrderRecord) {
  if (!order.metadata) return;

  const report = [
    `Order Report: ${order.orderNumber}`,
    `Status: ${order.status}`,
    `Created: ${new Date(order.createdAt).toLocaleString()}`,
    `Payment: ${getPaymentMethodLabel(order.metadata.paymentMethod)}`,
    "",
    "Customer",
    `Name: ${order.metadata.customer.name}`,
    `Email: ${order.metadata.customer.email}`,
    `Phone: ${order.metadata.customer.phone}`,
    `Address: ${order.metadata.customer.address}`,
    `City: ${order.metadata.customer.city}`,
    "",
    "Items",
    ...order.metadata.items.map(
      (item) =>
        `- ${item.name} | Qty ${item.qty} | ${formatOrderCurrency(item.price)} each | ${formatOrderCurrency(item.price * item.qty)}`
    ),
    "",
    `Subtotal: ${formatOrderCurrency(order.metadata.subtotal)}`,
    `Service Fee: ${formatOrderCurrency(order.metadata.fee)}`,
    `Total: ${formatOrderCurrency(order.metadata.total)}`,
    "",
    `Customer Notes: ${order.metadata.notes || "None"}`,
    `Admin Notes: ${(order.metadata.adminNotes ?? []).join(" | ") || "None"}`,
  ].join("\n");

  const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${order.orderNumber.toLowerCase()}-report.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

export function OrderManagement() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const syncedSelectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrder?.id) ?? selectedOrder,
    [orders, selectedOrder]
  );

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateEnquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => addEnquiryNote(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      setReplyText("");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => deleteEnquiry(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }
    },
  });

  const handleReply = () => {
    if (!syncedSelectedOrder || !replyText.trim()) return;

    addNoteMutation.mutate({ id: syncedSelectedOrder.id, note: replyText.trim() });
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
      key: "orderNumber",
      label: "Order",
      render: (item: OrderRecord) => (
        <div>
          <div className="font-mono text-[11px] font-bold text-gray-500">{item.orderNumber}</div>
          <div className="mt-1 text-xs font-semibold text-gray-400">
            {item.metadata?.items.length ?? 0} item(s)
          </div>
        </div>
      ),
    },
    {
      key: "name",
      label: "Customer",
      render: (item: OrderRecord) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-500">
            {item.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-gray-900">{item.name}</div>
            <div className="text-[10px] font-medium text-gray-400">{item.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: OrderRecord) => (
        <Badge variant={statusColors[item.status] || "gray"}>{item.status}</Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Submitted",
      render: (item: OrderRecord) => (
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <Clock size={12} />
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (item: OrderRecord) => (
        <button
          onClick={() => setSelectedOrder(item)}
          className="rounded-xl bg-[#4228c4]/5 px-4 py-2 text-[11px] font-black text-[#4228c4] transition-colors hover:bg-[#4228c4]/10"
        >
          Details
        </button>
      ),
    },
  ];

  const selectedMetadata = syncedSelectedOrder?.metadata ?? null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#4228c4]">
            <ShoppingBag size={14} />
            Marketplace Orders
          </div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Checkout Orders</h1>
          <p className="mt-1 font-medium text-gray-500">
            Real purchase data submitted from the website checkout flow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Orders</div>
            <div className="text-2xl font-black text-gray-900">{orders.length}</div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Confirmed</div>
            <div className="text-2xl font-black text-green-600">
              {orders.filter((order) => order.status === "WON").length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTable data={orders} columns={columns} loading={isLoading} searchKey="searchText" />
        </div>

        <div className="lg:col-span-1">
          {syncedSelectedOrder && selectedMetadata ? (
            <div className="sticky top-24 space-y-8 rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4228c4] text-white shadow-lg shadow-[#4228c4]/20">
                    <Package size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Order Details</h2>
                    <div className="mt-0.5 text-xs font-bold text-gray-400">
                      {syncedSelectedOrder.orderNumber}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-50"
                >
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#4228c4]">
                  Customer Profile
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="text-sm font-bold text-gray-900">{selectedMetadata.customer.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <Mail size={12} />
                      {selectedMetadata.customer.email}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <Phone size={12} />
                      {selectedMetadata.customer.phone}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4 text-sm text-gray-700">
                    <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500">
                      <Truck size={12} />
                      Shipping Address
                    </div>
                    {selectedMetadata.customer.address}, {selectedMetadata.customer.city}
                    {selectedMetadata.customer.postcode ? `, ${selectedMetadata.customer.postcode}` : ""}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#4228c4]">
                  Purchase Details
                </div>
                <div className="rounded-[2rem] bg-gray-900 p-6 text-white shadow-xl">
                  <div className="space-y-3">
                    {selectedMetadata.items.map((item) => (
                      <div key={item.id} className="border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                        <div className="text-sm font-bold">{item.name}</div>
                        <div className="mt-1 text-xs text-white/60">
                          Qty {item.qty} • {formatOrderCurrency(item.price)} each
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
                    <div className="flex items-center justify-between text-white/70">
                      <span>Payment</span>
                      <span className="font-medium text-white">
                        {getPaymentMethodLabel(selectedMetadata.paymentMethod)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span>Current status</span>
                      <span className="font-medium text-white">
                        {getPaymentStatusLabel(selectedMetadata.paymentMethod)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span>Total</span>
                      <span className="font-black text-white">
                        {formatOrderCurrency(selectedMetadata.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedMetadata.notes ? (
                <div className="space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                    Customer Instructions
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5 text-sm font-medium leading-relaxed text-gray-700">
                    {selectedMetadata.notes}
                  </div>
                </div>
              ) : null}

              {selectedMetadata.adminNotes && selectedMetadata.adminNotes.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Admin Notes
                  </div>
                  <div className="space-y-2">
                    {selectedMetadata.adminNotes.map((note, index) => (
                      <div key={`${note}-${index}`} className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-sm font-medium text-gray-700">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="space-y-4 pt-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Admin Actions
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() =>
                      updateStatusMutation.mutate({ id: syncedSelectedOrder.id, status: "WON" })
                    }
                    className="bg-green-600 py-3 text-[11px] hover:bg-green-700"
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: syncedSelectedOrder.id,
                        status: "NEGOTIATION",
                      })
                    }
                    className="bg-orange-600 py-3 text-[11px] hover:bg-orange-700"
                  >
                    Processing
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="py-3 text-[11px]"
                    onClick={() => downloadReport(syncedSelectedOrder)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Report
                  </Button>
                  <Button
                    variant="outline"
                    className="py-3 text-[11px] text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (window.confirm(`Delete ${syncedSelectedOrder.orderNumber}?`)) {
                        deleteOrderMutation.mutate(syncedSelectedOrder.id);
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>

                <textarea
                  className="h-24 w-full resize-none rounded-2xl border border-gray-100 bg-gray-50 p-5 text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-[#4228c4]/5"
                  placeholder="Internal notes..."
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                />
                <Button
                  onClick={handleReply}
                  disabled={!replyText.trim() || addNoteMutation.isPending}
                  variant="outline"
                  className="w-full py-4 text-[11px]"
                >
                  {addNoteMutation.isPending ? "Saving..." : "Record Note"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="sticky top-24 flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-gray-100 bg-gray-50/30 p-12 text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white text-[#4228c4]/20 shadow-sm">
                <ShoppingBag size={40} />
              </div>
              <h3 className="mb-2 text-xl font-black text-gray-900">Order Queue</h3>
              <p className="max-w-[220px] text-sm font-medium leading-relaxed text-gray-400">
                Select a real website checkout to view payment, customer, and item details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
