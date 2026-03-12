"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ordersAPI } from "@/lib/api";
import { useAuthStore } from "@/store/useStore";
import { Package, Calendar, MapPin, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const success = searchParams.get("success");
  const orderNumber = searchParams.get("orderNumber");

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => ordersAPI.getMyOrders(),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (success === "true" && orderNumber) {
      toast.success(`Order #${orderNumber} placed successfully!`, {
        duration: 5000,
        icon: "🎉",
      });
      // Clean up URL
      router.replace("/orders", { scroll: false });
    }
  }, [success, orderNumber, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {success === "true" && orderNumber && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 flex items-start space-x-4">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-1">
                Order Placed Successfully!
              </h3>
              <p className="text-green-700">
                Your order <span className="font-bold">#{orderNumber}</span> has been confirmed. 
                You will receive an email confirmation shortly.
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-48 animate-pulse" />
            ))}
          </div>
        ) : ordersData?.data?.data?.length > 0 ? (
          <div className="space-y-4">
            {ordersData?.data?.data?.map((order: any) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Order #{order.orderNumber}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        {order.orderType}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary mb-1">
                      {formatPrice(order.pricing?.total)}
                    </p>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        order.orderStatus === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.orderStatus === "processing"
                          ? "bg-blue-100 text-blue-700"
                          : order.orderStatus === "shipped"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {order.shippingAddress && (
                  <div className="flex items-start text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                    <div>
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zipCode}
                      </p>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <span
                        className={`text-sm font-semibold ${
                          order.paymentStatus === "completed"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <a href="/cars" className="btn-primary inline-block">
              Browse Cars
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md h-48 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersFallback />}>
      <OrdersContent />
    </Suspense>
  );
}
