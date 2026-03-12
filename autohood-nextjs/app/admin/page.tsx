"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { 
  Users, 
  Car, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Package,
  Store,
  Tag,
  BarChart3,
  Settings
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/admin/stats"),
    enabled: isAuthenticated && user?.role === "admin",
  });

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const statsData = stats?.data?.data || {};

  const statCards = [
    { title: "Total Users", value: statsData.totalUsers || 0, icon: Users, color: "blue", link: "/admin/users" },
    { title: "Total Cars", value: statsData.totalCars || 0, icon: Car, color: "green", link: "/admin/cars" },
    { title: "Total Orders", value: statsData.totalOrders || 0, icon: ShoppingBag, color: "purple", link: "/admin/orders" },
    { title: "Revenue", value: `₹${(statsData.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "yellow", link: "/admin/analytics" },
    { title: "Dealers", value: statsData.totalDealers || 0, icon: Store, color: "red", link: "/admin/dealers" },
    { title: "Brands", value: statsData.totalBrands || 0, icon: Tag, color: "indigo", link: "/admin/brands" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your AutoHood platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                href={stat.link}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/users"
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
            >
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold text-gray-800">Manage Users</p>
            </Link>
            <Link
              href="/admin/cars"
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-center"
            >
              <Car className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="font-semibold text-gray-800">Manage Cars</p>
            </Link>
            <Link
              href="/admin/dealers"
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all text-center"
            >
              <Store className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="font-semibold text-gray-800">Manage Dealers</p>
            </Link>
            <Link
              href="/admin/brands"
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center"
            >
              <Tag className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <p className="font-semibold text-gray-800">Manage Brands</p>
            </Link>
            <Link
              href="/admin/orders"
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
            >
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="font-semibold text-gray-800">View Orders</p>
            </Link>
            <Link
              href="/admin/parts"
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-yellow-500 hover:bg-yellow-50 transition-all text-center"
            >
              <Package className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <p className="font-semibold text-gray-800">Manage Parts</p>
            </Link>
            <Link
              href="/admin/analytics"
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-cyan-500 hover:bg-cyan-50 transition-all text-center"
            >
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
              <p className="font-semibold text-gray-800">Analytics</p>
            </Link>
            <Link
              href="/admin/settings"
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-500 hover:bg-gray-50 transition-all text-center"
            >
              <Settings className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <p className="font-semibold text-gray-800">Settings</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">New user registered</p>
                <p className="text-sm text-gray-600">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Car className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">New car listed</p>
                <p className="text-sm text-gray-600">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">New order placed</p>
                <p className="text-sm text-gray-600">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
