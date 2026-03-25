"use client";

import { Mail, Plus, Shield, Trash2, User as UserIcon, X } from "lucide-react";
import { useState } from "react";

const members = [
  { id: "u1", name: "Kenneth", email: "carbazar77@gmail.com", role: "ADMIN" },
  { id: "u2", name: "Sarah", email: "carbazar77@gmail.com", role: "SALES" },
  { id: "u3", name: "David", email: "carbazar77@gmail.com", role: "MANAGER" },
];

export default function TeamPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Team Management</h2>
          <p className="mt-1 text-sm font-medium text-gray-500">Manage staff access and responsibilities.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      {showAdd ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add Team Member</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" placeholder="Username" />
              <input className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" placeholder="Email Address" />
              <input className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black" placeholder="Initial Password" type="password" />
              <select className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black">
                <option>Viewer</option>
                <option>Sales Agent</option>
                <option>Manager</option>
                <option>Admin</option>
              </select>
              <button className="w-full rounded-xl bg-black py-3 text-sm font-bold text-white transition hover:bg-zinc-800">
                Add Member
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                {["User", "Email", "Role", ""].map((head) => (
                  <th key={head} className="px-3 py-4">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 last:border-b-0">
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <span className="font-bold text-gray-900">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Mail className="h-3.5 w-3.5" />
                      {row.email}
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700">
                      <Shield className="h-3.5 w-3.5 text-blue-500" />
                      {row.role}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-right">
                    <button className="p-2 text-gray-300 transition hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
