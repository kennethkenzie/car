"use client";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Seller Profile</h2>
        <p className="mt-2 text-gray-500">Manage store contact details and seller-facing information.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
        <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">Store Name</label>
              <input className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" defaultValue="Car Bazaar Ltd" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">Support Email</label>
              <input className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" defaultValue="admin@carbazaar.co.ug" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">Support Phone</label>
              <input className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" defaultValue="+256 700 000000" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">Store Slug</label>
              <input className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" defaultValue="car-bazaar" />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-gray-800">About the Store</label>
            <textarea className="h-36 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black" defaultValue="Car Bazaar Ltd is a premium car bond specializing in luxury sedans, SUVs, and high-performance vehicles. We provide quality cars and professional automotive services." />
          </div>

          <button className="mt-6 rounded-xl bg-[#4228c4] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#351ea3]">
            Save Profile
          </button>
        </div>

        <aside className="rounded-[2.5rem] border border-gray-100 bg-[#111827] p-8 text-white shadow-xl">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Store Status</div>
          <div className="mt-3 text-3xl font-extrabold">Active</div>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Your seller profile is visible to the internal dashboard and ready for future role-based integrations.
          </p>
        </aside>
      </div>
    </div>
  );
}
