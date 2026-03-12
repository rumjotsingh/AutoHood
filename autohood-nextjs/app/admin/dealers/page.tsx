"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dealersAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminDealersPage() {
  const queryClient = useQueryClient();

  const { data: dealersData, isLoading } = useQuery({
    queryKey: ["admin-dealers"],
    queryFn: () => dealersAPI.getAll({ limit: 100 }),
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => dealersAPI.verify(id),
    onSuccess: () => {
      toast.success("Dealer verified");
      queryClient.invalidateQueries({ queryKey: ["admin-dealers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">Dealer Management</h2>
        <p className="text-sm text-gray-600">Verify dealer profiles and review business details.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading dealers...</p>
        ) : (
          dealersData?.data?.data?.map((dealer: any) => (
            <div key={dealer._id} className="rounded-3xl border border-white/30 bg-white/60 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{dealer.companyName}</h3>
                  <p className="text-sm text-gray-600">{dealer.contactEmail}</p>
                  <p className="text-sm text-gray-500">
                    {[dealer.location?.city, dealer.location?.state].filter(Boolean).join(", ") || "Location unavailable"}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${dealer.verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {dealer.verified ? "Verified" : "Pending"}
                </span>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-gray-700">
                <p><span className="font-medium">Phone:</span> {dealer.contactPhone}</p>
                <p><span className="font-medium">Business Type:</span> {dealer.businessType}</p>
                <p><span className="font-medium">Rating:</span> {dealer.rating?.average || 0} ({dealer.rating?.count || 0})</p>
              </div>

              {!dealer.verified && (
                <button
                  onClick={() => verifyMutation.mutate(dealer._id)}
                  className="mt-5 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Verify Dealer
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}