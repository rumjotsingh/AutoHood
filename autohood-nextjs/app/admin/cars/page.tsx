"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Car, Search, Trash2, CheckCircle, XCircle, Star, ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";
import { formatPrice } from "@/lib/utils";

export default function AdminCarsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; carId: string; carTitle: string }>({
    isOpen: false,
    carId: "",
    carTitle: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isAuthenticated || user?.role !== "admin") {
    router.push("/");
    return null;
  }

  const { data: carsData, isLoading } = useQuery({
    queryKey: ["admin-cars", statusFilter, search],
    queryFn: () => api.get("/cars", { 
      params: { 
        status: statusFilter === "all" ? undefined : statusFilter,
        search 
      } 
    }),
  });

  const handleDeleteCar = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/cars/${deleteDialog.carId}`);
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      toast.success("Car deleted successfully");
      setDeleteDialog({ isOpen: false, carId: "", carTitle: "" });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete car");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ carId, featured }: any) => 
      api.put(`/cars/${carId}`, { featured }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      toast.success("Featured status updated");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ carId, status }: any) => 
      api.put(`/cars/${carId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      toast.success("Car status updated");
    },
  });

  const cars = carsData?.data?.data || [];

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
              Car Management
            </h1>
            <p className="text-gray-600 mt-2">Manage all car listings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Cars Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : cars.length === 0 ? (
            <div className="p-12 text-center">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No cars found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Car</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Owner</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Featured</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cars.map((car: any) => (
                    <tr key={car._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {car.images?.[0]?.url && (
                            <img
                              src={car.images[0].url}
                              alt={car.title}
                              className="w-16 h-16 rounded-lg object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-800">{car.title}</div>
                            <div className="text-sm text-gray-500">{car.year} • {car.fuelType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {formatPrice(car.price)}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {car.owner?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {car.location?.city}, {car.location?.state}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={car.status}
                          onChange={(e) => toggleStatusMutation.mutate({ carId: car._id, status: e.target.value })}
                          className={`px-3 py-1 rounded-full text-sm font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            car.status === "active"
                              ? "bg-green-100 text-green-700"
                              : car.status === "sold"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="sold">Sold</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleFeaturedMutation.mutate({ carId: car._id, featured: !car.featured })}
                          className={`p-2 rounded-lg transition-colors ${
                            car.featured
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <Star className={`w-5 h-5 ${car.featured ? "fill-yellow-600" : ""}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/cars/${car._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setDeleteDialog({ isOpen: true, carId: car._id, carTitle: car.title })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
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
          onClose={() => setDeleteDialog({ isOpen: false, carId: "", carTitle: "" })}
          onConfirm={handleDeleteCar}
          title="Delete Car"
          message={`Are you sure you want to delete ${deleteDialog.carTitle}? This action cannot be undone and will remove all associated data.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          loading={isDeleting}
        />
      </div>
    </div>
  );
}
