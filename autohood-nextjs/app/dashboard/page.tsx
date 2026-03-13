"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore, useWishlistStore } from "@/store/useStore";
import Link from "next/link";
import { 
  Package, 
  Heart, 
  Car, 
  Plus, 
  Edit,
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowRight,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const wishlistItems = useWishlistStore((state) => state.items);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => api.get("/orders/my-orders"),
    enabled: isAuthenticated,
  });

  const { data: carsData, isLoading: carsLoading } = useQuery({
    queryKey: ["my-cars"],
    queryFn: () => api.get("/cars", { params: { owner: user?._id } }),
    enabled: isAuthenticated && (user?.role === "dealer" || user?.role === "admin"),
  });

  const { data: testDrivesData } = useQuery({
    queryKey: ["my-test-drives-count"],
    queryFn: () => api.get("/test-drives"),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return null;
  }

  const orders = ordersData?.data?.data || [];
  const cars = carsData?.data?.data || [];
  const testDrives = testDrivesData?.data?.data || [];
  const isDealer = user?.role === "dealer" || user?.role === "admin";

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: Package,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      link: "/orders",
    },
    {
      label: "Wishlist",
      value: wishlistItems.length,
      icon: Heart,
      gradient: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      link: "/wishlist",
    },
    ...(!isDealer
      ? [
          {
            label: "Test Drives",
            value: testDrives.length,
            icon: Calendar,
            gradient: "from-purple-500 to-indigo-500",
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600",
            link: "/dashboard/test-drives",
          },
        ]
      : []),
    ...(isDealer
      ? [
          {
            label: "My Listings",
            value: cars.length,
            icon: Car,
            gradient: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50",
            iconColor: "text-green-600",
            link: "/dashboard/add-car",
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Welcome back, {user?.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Here's what's happening with your account
              </p>
            </div>
            {isDealer && (
              <Link href="/dashboard/add-car" className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add New Car
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom py-6 md:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={stat.link || "#"}
                className="block bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md active:scale-[0.98] transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions - Dealer Only */}
        {isDealer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/dashboard/add-car"
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">Add New Car</div>
                    <div className="text-sm text-gray-600">List a new vehicle for sale</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
              <Link
                href="/dealer/orders"
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">Manage Orders</div>
                    <div className="text-sm text-gray-600">View and process orders</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
              <Link
                href="/dealer/inquiries"
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <ShoppingBag className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">View Inquiries</div>
                    <div className="text-sm text-gray-600">Customer inquiries</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Orders
            </h2>
            {orders.length > 0 && (
              <Link href="/orders" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1">
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
          {ordersLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Start shopping for cars and parts</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/cars" className="btn-primary">
                  Browse Cars
                </Link>
                <Link href="/parts" className="btn-secondary">
                  Browse Parts
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 3).map((order: any, index: number) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-semibold text-gray-900">
                          Order #{order.orderNumber || order._id.slice(-8)}
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          order.orderStatus === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.orderStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.orderStatus === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{(order.pricing?.total || order.totalAmount)?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600 capitalize">{order.orderType}</div>
                      </div>
                      <Link
                        href="/orders"
                        className="btn-secondary text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* My Listings (Dealer Only) */}
        {isDealer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Car className="w-5 h-5" />
                My Listings
              </h2>
              {cars.length > 0 && (
                <Link href="/dashboard/add-car" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  Add new
                  <Plus className="w-4 h-4" />
                </Link>
              )}
            </div>
            {carsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div className="aspect-video bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-5 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : cars.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
                <p className="text-gray-600 mb-6">Start selling by adding your first car</p>
                <Link href="/dashboard/add-car" className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Car
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cars.slice(0, 6).map((car: any, index: number) => (
                  <motion.div
                    key={car._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group"
                  >
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      {car.images?.[0] ? (
                        <img
                          src={car.images[0]?.url || car.images[0]}
                          alt={car.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="font-semibold text-gray-900 mb-1 truncate">{car.title}</div>
                      <div className="text-lg font-bold text-gray-900 mb-3">
                        ₹{car.price?.toLocaleString()}
                      </div>
                      <Link
                        href={`/dashboard/edit-car/${car._id}`}
                        className="w-full btn-secondary text-sm flex items-center justify-center"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Listing
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
