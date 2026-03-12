"use client";

import { useState } from "react";
import { Badge } from "@/components/Badge";
import { DataTable } from "@/components/DataTable";
import { getDealers, adminCreateDealer, deleteDealerReal, updateDealerReal } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, X, Phone, Mail, MapPin, Store, Edit2, CheckCheck } from "lucide-react";

export default function DealersPage() {
    const queryClient = useQueryClient();
    const [showAdd, setShowAdd] = useState(false);
    const [editingDealer, setEditingDealer] = useState<any>(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        postcode: "",
        username: "",
        password: ""
    });
    const [error, setError] = useState<string | null>(null);

    const { data: dealers = [], isLoading } = useQuery({
        queryKey: ["dealers"],
        queryFn: getDealers,
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, val]) => formData.append(key, val as string));
            return adminCreateDealer(formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dealers"] });
            closeModal();
        },
        onError: (err: any) => setError(err.message),
    });

    const updateMutation = useMutation({
        mutationFn: ({ slug, data }: { slug: string; data: any }) => {
            const formData = new FormData();
            ["name", "email", "phone", "address", "postcode", "status"].forEach(key => {
                if (data[key]) formData.append(key, data[key]);
            });
            return updateDealerReal(slug, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dealers"] });
            closeModal();
        },
        onError: (err: any) => setError(err.message),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteDealerReal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dealers"] });
        },
    });

    const closeModal = () => {
        setShowAdd(false);
        setEditingDealer(null);
        setForm({ name: "", email: "", phone: "", address: "", postcode: "", username: "", password: "" });
        setError(null);
    };

    const handleEdit = (dealer: any) => {
        setEditingDealer(dealer);
        setForm({
            name: dealer.name,
            email: dealer.email,
            phone: dealer.phone,
            address: dealer.address,
            postcode: dealer.postcode,
            username: "",
            password: ""
        });
        setShowAdd(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (editingDealer) {
            updateMutation.mutate({ slug: editingDealer.slug, data: form });
        } else {
            createMutation.mutate(form);
        }
    };

    const inputCls = "w-full border border-gray-100 bg-gray-50 px-3 py-3 rounded-xl text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4228c4]/20 transition";

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dealer Management</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Register and manage dealership locations.</p>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 rounded-2xl bg-[#4228c4] px-6 py-4 text-sm font-bold text-white hover:bg-[#351ea3] transition-all shadow-xl shadow-[#4228c4]/20 active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    Add Dealer
                </button>
            </div>

            {showAdd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900">
                                {editingDealer ? "Edit Dealer" : "Register New Dealer"}
                            </h2>
                            <button onClick={closeModal} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Dealer Name</label>
                                    <input
                                        className={inputCls}
                                        required
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. Car Bazaar London"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Dealer Email</label>
                                    <input
                                        type="email"
                                        className={inputCls}
                                        required
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        placeholder="london@carbazaar.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                                    <input
                                        className={inputCls}
                                        required
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                        placeholder="+44 20 7946 0958"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Postcode</label>
                                    <input
                                        className={inputCls}
                                        required
                                        value={form.postcode}
                                        onChange={e => setForm({ ...form, postcode: e.target.value })}
                                        placeholder="W1A 1AA"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Address</label>
                                <input
                                    className={inputCls}
                                    required
                                    value={form.address}
                                    onChange={e => setForm({ ...form, address: e.target.value })}
                                    placeholder="123 Dealer St, London"
                                />
                            </div>

                            {!editingDealer && (
                                <div className="border-t border-gray-100 pt-6 mt-6">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4">Initial Account Credentials</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Admin Username</label>
                                            <input
                                                className={inputCls}
                                                required
                                                value={form.username}
                                                onChange={e => setForm({ ...form, username: e.target.value })}
                                                placeholder="e.g. dealer_admin"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Password</label>
                                            <input
                                                type="password"
                                                className={inputCls}
                                                required
                                                value={form.password}
                                                onChange={e => setForm({ ...form, password: e.target.value })}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium mt-2">This will create a DEALER_OWNER account associated with this location.</p>
                                </div>
                            )}

                            {error && <p className="text-xs font-bold text-red-500">{error}</p>}

                            <button
                                type="submit"
                                disabled={createMutation.isPending || updateMutation.isPending}
                                className="w-full bg-[#4228c4] py-4 rounded-2xl text-sm font-bold text-white hover:bg-[#351ea3] transition-all shadow-xl shadow-[#4228c4]/20 disabled:opacity-50 mt-4"
                            >
                                {createMutation.isPending || updateMutation.isPending ? "Saving..." : (editingDealer ? "Update Dealer" : "Register Dealer")}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <DataTable
                    loading={isLoading}
                    data={dealers}
                    searchKey="name"
                    columns={[
                        {
                            key: "name",
                            label: "Dealer",
                            render: (row) => (
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                                        {row.logoUrl ? (
                                            <img src={row.logoUrl} alt="" className="h-6 w-6 object-contain" />
                                        ) : (
                                            <Store className="h-5 w-5 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900">{row.name}</span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{row.slug}</span>
                                    </div>
                                </div>
                            )
                        },
                        {
                            key: "email",
                            label: "Contact",
                            render: (row) => (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                        <Mail className="h-3 w-3" />
                                        {row.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                        <Phone className="h-3 w-3" />
                                        {row.phone}
                                    </div>
                                </div>
                            )
                        },
                        {
                            key: "postcode",
                            label: "Location",
                            render: (row) => (
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                    <MapPin className="h-3.5 w-3.5 text-gray-300" />
                                    <span>{row.postcode}</span>
                                </div>
                            )
                        },
                        {
                            key: "status",
                            label: "Status",
                            render: (row) => (
                                <Badge variant={row.status === "ACTIVE" ? "success" : "default"}>{row.status}</Badge>
                            )
                        },
                        {
                            key: "actions",
                            label: "",
                            render: (row) => (
                                <div className="flex items-center gap-1">
                                    {row.status === "PENDING" && (
                                        <button
                                            onClick={() => {
                                                if (confirm(`Approve ${row.name}?`)) {
                                                    updateMutation.mutate({ slug: row.slug, data: { ...row, status: "ACTIVE" } });
                                                }
                                            }}
                                            className="p-2 text-gray-300 hover:text-green-500 transition-colors"
                                            title="Approve Dealer"
                                        >
                                            <CheckCheck className="h-4 w-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEdit(row)}
                                        className="p-2 text-gray-300 hover:text-[#4228c4] transition-colors"
                                        title="Edit Dealer"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm("Are you sure you want to delete this dealership? This will NOT delete associated vehicles or users.")) {
                                                deleteMutation.mutate(row.slug);
                                            }
                                        }}
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                        title="Delete Dealer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )
                        }
                    ]}
                />
            </div>
        </div>
    );
}
