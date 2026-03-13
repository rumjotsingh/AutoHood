"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { 
  Users, Car, Package, DollarSign, 
  TrendingUp, ShoppingBag, Store, Tag 
} from "lucide-react";

export default function AdminDashboard() {
  const { data: statsData } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/admin/stats"),
  });

  const stats = statsData?.data?.data || {};

  const statCards = [
    { 
      label: "Total users", 
      value: stats.totalUsers || 0, 
      icon: Users, 
      color: "bg-blue-50 text-blue-600",
      link: "/admin/users"
    },
    { 
      label: "Total cars", 
      value: stats.totalCars || 0, 
      icon: Car, 
      color: "bg-green-50 text-green-600",
      link: "/admin/cars"
    },
    { 
      label: "Total orders", 
      value: stats.totalOrders || 0, 
      icon: ShoppingBag, 
      color: "bg-purple-50 text-purple-600",
      link: "/admin/orders"
    },
    { 
      label: "Revenue", 
      value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: "bg-yellow-50 text-yellow-600",
      link: "/admin/orders"
    },
    { 
      label: "Dealers", 
      value: stats.totalDealers || 0, 
      icon: Store, 
      color: "bg-red-50 text-red-600",
      link: "/admin/dealers"
    },
    { 
      label: "Brands", 
      value: stats.totalBrands || 0, 
      icon: Tag, 
      color: "bg-indigo-50 text-indigo-600",
      link: "/admin/brands"
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-6 md:py-12 pb-20 md:pb-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600">Manage your platform</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              href={stat.link}
              className="card p-4 md:p-6 hover:shadow-lg active:scale-[0.98] transition-all group"
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${stat.color} flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="text-xl md:text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Link href="/admin/users" className="card p-5 md:p-6 hover:shadow-lg active:scale-[0.98] transition-all">
            <h3 className="font-semibold text-base md:text-lg mb-2">Manage Users</h3>
            <p className="text-sm text-gray-600">View and manage all users</p>
          </Link>
          <Link href="/admin/cars" className="card p-5 md:p-6 hover:shadow-lg active:scale-[0.98] transition-all">
            <h3 className="font-semibold text-base md:text-lg mb-2">Manage Cars</h3>
            <p className="text-sm text-gray-600">View and manage all listings</p>
          </Link>
          <Link href="/admin/orders" className="card p-5 md:p-6 hover:shadow-lg active:scale-[0.98] transition-all">
            <h3 className="font-semibold text-base md:text-lg mb-2">Manage Orders</h3>
            <p className="text-sm text-gray-600">View and process orders</p>
          </Link>
          <Link href="/admin/dealers" className="card p-5 md:p-6 hover:shadow-lg active:scale-[0.98] transition-all">
            <h3 className="font-semibold text-base md:text-lg mb-2">Manage Dealers</h3>
            <p className="text-sm text-gray-600">Verify and manage dealers</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
