"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { carsAPI } from "@/lib/api";
import toast from "react-hot-toast";

const statuses = ["all", "pending", "active", "sold", "inactive", "rejected"];

export default function AdminCarsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: carsData, isLoading } = useQuery({
    queryKey: ["admin-cars", statusFilter],
    queryFn: () => carsAPI.getAdminAll({ status: statusFilter === "all" ? undefined : statusFilter, limit: 100 }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => carsAPI.updateStatus(id, { status }),
    onSuccess: () => {
      toast.success("Car status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-pending-cars"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => carsAPI.delete(id),
    onSuccess: () => {
      toast.success("Car deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-pending-cars"] });
    },
  });

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Car Management</h2>
          <p className="text-sm text-gray-600">Approve, reject, deactivate, or remove listings.</p>
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-3"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>{status === "all" ? "All statuses" : status}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-3 pr-4 font-medium">Car</th>
              <th className="pb-3 pr-4 font-medium">Owner</th>
              <th className="pb-3 pr-4 font-medium">Price</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 pr-4 font-medium">Views</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="py-6 text-gray-500" colSpan={6}>Loading cars...</td>
              </tr>
            ) : (
              carsData?.data?.data?.map((car: any) => (
                <tr key={car._id} className="border-b border-gray-100 align-top">
                  <td className="py-4 pr-4">
                    <p className="font-semibold text-gray-900">{car.title}</p>
                    <p className="text-xs text-gray-500">{car.brand?.name || "Unknown brand"} · {car.year}</p>
                  </td>
                  <td className="py-4 pr-4 text-gray-700">{car.owner?.name || "Unknown"}</td>
                  <td className="py-4 pr-4 text-gray-700">₹{car.price?.toLocaleString()}</td>
                  <td className="py-4 pr-4">
                    <select
                      value={car.status}
                      onChange={(event) => statusMutation.mutate({ id: car._id, status: event.target.value })}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2"
                    >
                      {statuses.filter((status) => status !== "all").map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 pr-4 text-gray-700">{car.stats?.views || 0}</td>
                  <td className="py-4">
                    <button
                      onClick={() => deleteMutation.mutate(car._id)}
                      className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}