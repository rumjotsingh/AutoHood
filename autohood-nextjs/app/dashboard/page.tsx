"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authAPI, ordersAPI, carsAPI } from "@/lib/api";
import { useAuthStore } from "@/store/useStore";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Car, 
  Settings, 
  LogOut,
  Package,
  Calendar,
  TrendingUp,
  DollarSign,
  Eye,
  Plus,
  Edit,
  BarChart3
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: userData } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => authAPI.getMe(),
    enabled: isAuthenticated,
  });

  const { data: ordersData } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => ordersAPI.getMyOrders(),
    enabled: isAuthenticated,
  });

  const { data: carsData } = useQuery({
    queryKey: ["my-cars"],
    queryFn: () => carsAPI.getAll(),
    enabled: isAuthenticated && user?.role === "dealer",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      router.replace("/admin");
    }
  }, [isAuthenticated, router, user?.role]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  if (!isAuthenticated || user?.role === "admin") {
    return null;
  }

  const isDealer = user?.role === "dealer";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-card rounded-2xl shadow-xl p-6 sticky top-24">
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-white/20">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{user?.name}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    {user?.role}
                  </span>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === "overview"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                      : "hover:bg-white/50 text-gray-700"
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">Overview</span>
                </button>
                <Link
                  href="/orders"
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/50 text-gray-700 transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-medium">My Orders</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/50 text-gray-700 transition-all"
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Wishlist</span>
                </Link>
                {isDealer && (
                  <>
                    <button
                      onClick={() => setActiveTab("listings")}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === "listings"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                          : "hover:bg-white/50 text-gray-700"
                      }`}
                    >
                      <Car className="w-5 h-5" />
                      <span className="font-medium">My Listings</span>
                    </button>
                    <Link
                      href="/dealer/orders"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/50 text-gray-700 transition-all"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span className="font-medium">Manage Orders</span>
                    </Link>
                    <Link
                      href="/dealer/test-drives"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/50 text-gray-700 transition-all"
                    >
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">Test Drives</span>
                    </Link>
                    <Link
                      href="/dashboard/add-car"
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/50 text-gray-700 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="font-medium">Add New Car</span>
                    </Link>
                  </>
                )}
                <Link
                  href="/dashboard/settings"
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/50 text-gray-700 transition-all"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Welcome back, {user?.name?.split(' ')[0]}!
                    </h1>
                    <p className="text-gray-600 mt-2">Here's what's happening with your account</p>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm mb-1 font-medium">Total Orders</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          {ordersData?.data?.pagination?.totalItems || 0}
                        </p>
                        <p className="text-xs text-green-600 mt-2 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +12% from last month
                        </p>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <ShoppingBag className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm mb-1 font-medium">Wishlist Items</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                          {userData?.data?.data?.wishlist?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Saved for later</p>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Heart className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm mb-1 font-medium">
                          {isDealer ? "Active Listings" : "Total Spent"}
                        </p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {isDealer ? (carsData?.data?.pagination?.totalItems || 0) : "₹0"}
                        </p>
                        <p className="text-xs text-green-600 mt-2 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {isDealer ? "Live on platform" : "This month"}
                        </p>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        {isDealer ? <Car className="w-7 h-7 text-white" /> : <DollarSign className="w-7 h-7 text-white" />}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
                    <Link href="/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                      View All
                      <TrendingUp className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                  {ordersData?.data?.data && ordersData.data.data.length > 0 ? (
                    <div className="space-y-4">
                      {ordersData.data.data.slice(0, 5).map((order: any) => (
                        <motion.div
                          key={order._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 bg-white/50 border border-white/20 rounded-xl hover:shadow-lg transition-all"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                              <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">Order #{order.orderNumber}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">
                              ₹{order.pricing?.total?.toLocaleString()}
                            </p>
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                order.orderStatus === "delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.orderStatus === "processing"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 mb-4">No orders yet</p>
                      <Link href="/cars" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all">
                        Start Shopping
                        <TrendingUp className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "listings" && isDealer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    My Listings
                  </h1>
                  <Link
                    href="/dashboard/add-car"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Car
                  </Link>
                </div>

                {carsData?.data?.data?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {carsData?.data?.data?.map((car: any) => (
                      <motion.div
                        key={car._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all"
                      >
                        <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
                          {car.images?.[0]?.url && (
                            <img
                              src={car.images[0].url}
                              alt={car.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute top-4 right-4 flex space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              car.status === 'active' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-500 text-white'
                            }`}>
                              {car.status}
                            </span>
                            {car.featured && (
                              <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{car.title}</h3>
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-2xl font-bold text-blue-600">
                              ₹{car.price?.toLocaleString()}
                            </p>
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Eye className="w-4 h-4" />
                              <span>{car.stats?.views || 0} views</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                            <span>{car.year}</span>
                            <span>•</span>
                            <span>{car.kmDriven?.toLocaleString()} km</span>
                            <span>•</span>
                            <span className="capitalize">{car.fuelType}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Link
                              href={`/cars/${car._id}`}
                              className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-center font-medium"
                            >
                              View
                            </Link>
                            <Link
                              href={`/dashboard/edit-car/${car._id}`}
                              className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium flex items-center justify-center"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card rounded-2xl shadow-xl p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Car className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No listings yet</h3>
                    <p className="text-gray-600 mb-6">Start by adding your first car to the platform</p>
                    <Link
                      href="/dashboard/add-car"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Your First Car
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
