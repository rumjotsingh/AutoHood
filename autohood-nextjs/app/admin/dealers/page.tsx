"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Store, Search, Trash2, CheckCircle, XCircle, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function AdminDealersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const [search, setSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; dealerId: string; dealerName: string }>({
    isOpen: false,
    dealerId: "",
    dealerName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isAuthenticated || user?.role !== "admin") {
    router.push("/");
    return null;
  }

  const { data: dealersData, isLoading } = useQuery({
    queryKey: ["admin-dealers", verifiedFilter, search],
    queryFn: () => api.get("/dealers", { 
      params: { 
        verified: verifiedFilter === "all" ? undefined : verifiedFilter === "verified",
        search 
      } 
    }),
  });

  const handleDeleteDealer = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/dealers/${deleteDialog.dealerId}`);
      queryClient.invalidateQueries({ queryKey: ["admin-dealers"] });
      toast.success("Dealer deleted successfully");
      setDeleteDialog({ isOpen: false, dealerId: "", dealerName: "" });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete dealer");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleVerificationMutation = useMutation({
    mutationFn: ({ dealerId, verified }: any) => 
      api.put(`/dealers/${dealerId}`, { verified }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dealers"] });
      toast.success("Verification status updated");
    },
  });

  const dealers = dealersData?.data?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="container-custom py-8">
        <Link
          href="/admin"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Dealer Management
            </h1>
            <p className="text-gray-600 mt-2">Manage and verify all dealers</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by company name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Dealers</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>

        {/* Dealers Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : dealers.length === 0 ? (
            <div className="p-12 text-center">
              <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No dealers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Dealer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {dealers.map((dealer: any) => (
                    <tr key={dealer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-800">{dealer.companyName}</div>
                          <div className="text-sm text-gray-500 capitalize">{dealer.businessType}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-800">{dealer.contactEmail}</div>
                          <div className="text-gray-500">{dealer.contactPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {dealer.location?.city}, {dealer.location?.state}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="font-medium">{dealer.rating?.average || 0}</span>
                          <span className="text-gray-500 text-sm ml-1">
                            ({dealer.rating?.count || 0})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleVerificationMutation.mutate({ dealerId: dealer._id, verified: !dealer.verified })}
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                            dealer.verified
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {dealer.verified ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Verified
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Unverified
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, dealerId: dealer._id, dealerName: dealer.companyName })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, dealerId: "", dealerName: "" })}
          onConfirm={handleDeleteDealer}
          title="Delete Dealer"
          message={`Are you sure you want to delete ${deleteDialog.dealerName}? This action cannot be undone and will remove all associated data.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          loading={isDeleting}
        />
      </div>
    </div>
  );
}
