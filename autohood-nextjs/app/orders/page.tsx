"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ordersAPI, bookingAPI } from "@/lib/api";
import { useAuthStore } from "@/store/useStore";
import { Package, Calendar, MapPin, CheckCircle, Car, CreditCard } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"orders" | "bookings">("orders");

  const success = searchParams.get("success");
  const orderNumber = searchParams.get("orderNumber");

  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => ordersAPI.getMyOrders(),
    enabled: isAuthenticated,
    retry: 1,
    onError: (error: any) => {
      console.error("Orders fetch error:", error);
      toast.error("Failed to load orders");
    }
  });

  const { data: bookingsData, isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => bookingAPI.getUserBookings(),
    enabled: isAuthenticated,
    retry: 1,
    onError: (error: any) => {
      console.error("Bookings fetch error:", error);
    }
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

  const isLoading = activeTab === "orders" ? ordersLoading : bookingsLoading;
  
  // Safely extract orders with multiple fallbacks
  let orders: any[] = [];
  try {
    if (ordersData) {
      orders = ordersData.data?.data || ordersData.data?.orders || ordersData.data || [];
      if (!Array.isArray(orders)) {
        console.warn("Orders is not an array:", orders);
        orders = [];
      }
    }
  } catch (e) {
    console.error("Error extracting orders:", e);
    orders = [];
  }
  
  // Safely extract bookings with multiple fallbacks
  let bookings: any[] = [];
  try {
    if (bookingsData) {
      bookings = bookingsData.data?.data || bookingsData.data?.bookings || bookingsData.data || [];
      if (!Array.isArray(bookings)) {
        console.warn("Bookings is not an array:", bookings);
        bookings = [];
      }
    }
  } catch (e) {
    console.error("Error extracting bookings:", e);
    bookings = [];
  }

  // Debug logging
  if (ordersData && !ordersLoading) {
    console.log("Orders API Response:", ordersData);
    console.log("Extracted orders:", orders);
  }
  if (bookingsData && !bookingsLoading) {
    console.log("Bookings API Response:", bookingsData);
    console.log("Extracted bookings:", bookings);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">My Orders & Bookings</h1>

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

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "orders"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Orders ({orders.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === "bookings"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Car className="w-5 h-5" />
                <span>Car Bookings ({bookings.length})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <>
            {ordersLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md h-48 animate-pulse" />
                ))}
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order: any) => (
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
                <a href="/parts" className="btn-primary inline-block">
                  Browse Parts
                </a>
              </div>
            )}
          </>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <>
            {bookingsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md h-48 animate-pulse" />
                ))}
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking: any) => (
                  <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          Booking #{booking.bookingNumber}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Car className="w-4 h-4 mr-1" />
                            {booking.car?.title || "Car"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            booking.bookingStatus === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.bookingStatus === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : booking.bookingStatus === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {booking.bookingStatus}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Car Price</p>
                          <p className="font-bold text-lg">{formatPrice(booking.carPrice)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Token Paid</p>
                          <p className="font-bold text-lg text-green-600">
                            {formatPrice(booking.bookingAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Remaining</p>
                          <p className="font-bold text-lg text-orange-600">
                            {formatPrice(booking.remainingAmount)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Payment Status</p>
                          <span
                            className={`text-sm font-semibold ${
                              booking.paymentStatus === "completed"
                                ? "text-green-600"
                                : booking.paymentStatus === "failed"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {booking.paymentStatus}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Offline Payment</p>
                          <span
                            className={`text-sm font-semibold ${
                              booking.offlinePaymentStatus === "completed"
                                ? "text-green-600"
                                : booking.offlinePaymentStatus === "partial"
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          >
                            {booking.offlinePaymentStatus}
                          </span>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                          View Details
                        </button>
                      </div>
                    </div>

                    {booking.bookingStatus === "confirmed" && booking.offlinePaymentStatus === "pending" && (
                      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          <CreditCard className="w-4 h-4 inline mr-1" />
                          Seller will contact you for remaining payment of {formatPrice(booking.remainingAmount)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">No bookings yet</h2>
                <p className="text-gray-600 mb-6">Book a car with token amount to see your bookings here</p>
                <a href="/cars" className="btn-primary inline-block">
                  Browse Cars
                </a>
              </div>
            )}
          </>
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
