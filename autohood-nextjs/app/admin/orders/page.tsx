"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersAPI } from "@/lib/api";
import toast from "react-hot-toast";

const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"];

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => ordersAPI.getAll({ limit: 100 }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => ordersAPI.updateStatus(id, { status, note: `Updated to ${status} by admin` }),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-recent-orders"] });
    },
  });

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">Order Management</h2>
        <p className="text-sm text-gray-600">Track payment state and move orders through fulfillment.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-3 pr-4 font-medium">Order</th>
              <th className="pb-3 pr-4 font-medium">Customer</th>
              <th className="pb-3 pr-4 font-medium">Type</th>
              <th className="pb-3 pr-4 font-medium">Payment</th>
              <th className="pb-3 pr-4 font-medium">Total</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="py-6 text-gray-500" colSpan={6}>Loading orders...</td>
              </tr>
            ) : (
              ordersData?.data?.data?.map((order: any) => (
                <tr key={order._id} className="border-b border-gray-100 align-top">
                  <td className="py-4 pr-4">
                    <p className="font-semibold text-gray-900">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="py-4 pr-4 text-gray-700">{order.user?.name || "Unknown"}</td>
                  <td className="py-4 pr-4 text-gray-700 capitalize">{order.orderType}</td>
                  <td className="py-4 pr-4 text-gray-700 capitalize">{order.paymentStatus}</td>
                  <td className="py-4 pr-4 text-gray-700">₹{order.pricing?.total?.toLocaleString()}</td>
                  <td className="py-4">
                    <select
                      value={order.orderStatus}
                      onChange={(event) => updateMutation.mutate({ id: order._id, status: event.target.value })}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
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