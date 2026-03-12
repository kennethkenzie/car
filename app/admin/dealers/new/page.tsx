"use client";

import { DealerProfileForm } from "@/components/DealerProfileForm";
import { useAuth } from "@/components/providers/AuthProvider";

export default function RegisterDealerPage() {
  const { user, updateUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Register Dealer</h1>
        <p className="mt-2 text-gray-500 max-w-xl">
          Create a professional dealer profile and link it to your admin account. After registration, your inventory uploads will be automatically attributed to this location.
        </p>
      </div>
      
      <DealerProfileForm
        mode="create"
        user={user}
        onLinkedDealer={(dealerId) => {
          if (user && updateUser) updateUser({ ...user, dealerId });
        }}
      />
    </div>
  );
}
