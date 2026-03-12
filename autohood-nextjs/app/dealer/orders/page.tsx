"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package, Eye, CheckCircle, XCircle, Clock, Truck, Filter } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";

export default function DealerOrdersPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["dealer-orders", selectedStatus],
    queryFn: async () => {
      const params = selectedStatus !== "all" ? { orderStatus: selectedStatus } : {};
      return api.get("/orders", { params });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status, note }: any) => {
      return api.put(`/orders/${orderId}/status`, { status, note });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dealer-orders"] });
      toast.success("Order status updated successfully");
      setSelectedOrder(null);
    },
    onError: () => {
      toast.error("Failed to update order status");
    },
  });

  const orders = ordersData?.data?.data || [];

  const statusOptions = [
    { value: "all", label: "All Orders", color: "gray" },
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "confirmed", label: "Confirmed", color: "blue" },
    { value: "processing", label: "Processing", color: "purple" },
    { value: "shipped", label: "Shipped", color: "indigo" },
    { value: "delivered", label: "Delivered", color: "green" },
    { value: "cancelled", label: "Cancelled", color: "red" },
  ];

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || "gray";
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({
      orderId,
      status: newStatus,
      note: `Status updated to ${newStatus}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Order Management
            </h1>
            <p className="text-gray-600 mt-2">Manage and process customer orders</p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Filter by Status</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedStatus === option.value
                    ? `bg-${option.color}-500 text-white shadow-lg`
                    : `bg-${option.color}-50 text-${option.color}-700 hover:bg-${option.color}-100`
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Orders will appear here when customers make purchases</p>
            </div>
          ) : (
            orders.map((order: any, index: number) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-${getStatusColor(
                          order.orderStatus
                        )}-100 text-${getStatusColor(order.orderStatus)}-700`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Customer: {order.user?.name || "N/A"} • {order.user?.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      Placed: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatPrice(order.pricing?.total)}
                    </p>
                    <p className="text-sm text-gray-600">{order.orderType}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  {order.car && (
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                      <div>
                        <p className="font-semibold">{order.car.title}</p>
                        <p className="text-sm text-gray-600">{formatPrice(order.car.price)}</p>
                      </div>
                    </div>
                  )}
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="font-semibold text-sm text-gray-700 mb-2">Shipping Address:</p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {order.orderStatus === "pending" && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, "confirmed")}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm Order</span>
                    </button>
                  )}
                  {order.orderStatus === "confirmed" && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, "processing")}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center space-x-2"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Start Processing</span>
                    </button>
                  )}
                  {order.orderStatus === "processing" && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, "shipped")}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all flex items-center space-x-2"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Mark as Shipped</span>
                    </button>
                  )}
                  {order.orderStatus === "shipped" && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, "delivered")}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark as Delivered</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
