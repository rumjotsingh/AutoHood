"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Truck, 
  Filter,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

export default function DealerOrdersPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["dealer-orders", selectedStatus],
    queryFn: async () => {
      const params = selectedStatus !== "all" ? { orderStatus: selectedStatus } : {};
      return api.get("/orders", { params });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status, note }: any) => {
      return api.patch(`/orders/${orderId}/status`, { status, note });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dealer-orders"] });
      toast.success("Order status updated successfully");
    },
    onError: (error: any) => {
      console.error("Status update error:", error);
      toast.error(error?.response?.data?.message || "Failed to update order status");
    },
  });

  const orders = ordersData?.data?.data || [];

  const statusOptions = [
    { value: "all", label: "All", icon: Package, color: "gray", bgColor: "bg-gray-100", textColor: "text-gray-700", hoverColor: "hover:bg-gray-200" },
    { value: "pending", label: "Pending", icon: Clock, color: "yellow", bgColor: "bg-yellow-100", textColor: "text-yellow-700", hoverColor: "hover:bg-yellow-200" },
    { value: "confirmed", label: "Confirmed", icon: CheckCircle, color: "blue", bgColor: "bg-blue-100", textColor: "text-blue-700", hoverColor: "hover:bg-blue-200" },
    { value: "processing", label: "Processing", icon: Package, color: "purple", bgColor: "bg-purple-100", textColor: "text-purple-700", hoverColor: "hover:bg-purple-200" },
    { value: "shipped", label: "Shipped", icon: Truck, color: "indigo", bgColor: "bg-indigo-100", textColor: "text-indigo-700", hoverColor: "hover:bg-indigo-200" },
    { value: "delivered", label: "Delivered", icon: CheckCircle, color: "green", bgColor: "bg-green-100", textColor: "text-green-700", hoverColor: "hover:bg-green-200" },
    { value: "cancelled", label: "Cancelled", icon: CheckCircle, color: "red", bgColor: "bg-red-100", textColor: "text-red-700", hoverColor: "hover:bg-red-200" },
  ];

  const getStatusOption = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({
      orderId,
      status: newStatus,
      note: `Status updated to ${newStatus}`,
    });
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow: { [key: string]: string } = {
      pending: "confirmed",
      confirmed: "processing",
      processing: "shipped",
      shipped: "delivered",
    };
    return statusFlow[currentStatus];
  };

  const getNextStatusLabel = (currentStatus: string) => {
    const labels: { [key: string]: string } = {
      pending: "Confirm Order",
      confirmed: "Start Processing",
      processing: "Mark as Shipped",
      shipped: "Mark as Delivered",
    };
    return labels[currentStatus];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">Manage and process customer orders</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 rounded-xl px-4 py-2">
                <p className="text-xs text-gray-600">Total Orders</p>
                <p className="text-xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-6 md:py-8 pb-20 md:pb-8">
        {/* Status Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Filter by Status</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              const isActive = selectedStatus === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                    isActive
                      ? "bg-gray-900 text-white shadow-lg scale-105"
                      : `${option.bgColor} ${option.textColor} ${option.hoverColor}`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Orders will appear here when customers make purchases</p>
            </div>
          ) : (
            orders.map((order: any, index: number) => {
              const statusOption = getStatusOption(order.orderStatus);
              const StatusIcon = statusOption.icon;
              const isExpanded = expandedOrder === order._id;
              const nextStatus = getNextStatus(order.orderStatus);
              const nextStatusLabel = getNextStatusLabel(order.orderStatus);

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Order Header */}
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900">
                            #{order.orderNumber}
                          </h3>
                          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusOption.bgColor} ${statusOption.textColor}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {order.orderStatus}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {order.user?.email || "N/A"}
                          </p>
                          <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="flex items-center gap-2 md:justify-end mb-1">
                          <DollarSign className="w-5 h-5 text-gray-400" />
                          <p className="text-2xl font-bold text-gray-900">
                            {formatPrice(order.pricing?.total)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 capitalize">{order.orderType}</p>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      {order.car && (
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {order.car.images?.[0] && (
                              <Image
                                src={order.car.images[0].url || order.car.images[0]}
                                alt={order.car.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{order.car.title}</p>
                            <p className="text-sm text-gray-600">{formatPrice(order.car.price)}</p>
                          </div>
                        </div>
                      )}
                      {order.items?.length > 0 && (
                        <div className="space-y-2">
                          {order.items.slice(0, 2).map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                                <p className="text-xs text-gray-600">
                                  Qty: {item.quantity} × {formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-gray-500 mt-2">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && order.shippingAddress && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-blue-50 rounded-xl p-4 mb-4"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-sm text-gray-900 mb-1">Shipping Address</p>
                            <p className="text-sm text-gray-700">
                              {order.shippingAddress.address}
                            </p>
                            <p className="text-sm text-gray-700">
                              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            </p>
                            {order.shippingAddress.phone && (
                              <p className="text-sm text-gray-700 flex items-center gap-2 mt-1">
                                <Phone className="w-3.5 h-3.5" />
                                {order.shippingAddress.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {nextStatus && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, nextStatus)}
                          disabled={updateStatusMutation.isPending}
                          className="flex-1 md:flex-none px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2 font-medium text-sm disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>{nextStatusLabel}</span>
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 active:scale-95 transition-all flex items-center gap-2 font-medium text-sm"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            <span className="hidden sm:inline">Less</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            <span className="hidden sm:inline">More</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
