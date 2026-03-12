"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/useStore";
import {
  BarChart3,
  Building2,
  Car,
  LogOut,
  Package,
  Shield,
  Tags,
  Users,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/brands", label: "Brands", icon: Tags },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/dealers", label: "Dealers", icon: Building2 },
  { href: "/admin/cars", label: "Cars", icon: Car },
  { href: "/admin/orders", label: "Orders", icon: Package },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated());

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }

    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [hydrated, isAuthenticated, router, user?.role]);

  const currentSection = useMemo(() => {
    return navItems.find((item) => item.href === pathname)?.label || "Dashboard";
  }, [pathname]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  if (!hydrated || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="container-custom py-12">
        <div className="glass-card rounded-3xl p-10 animate-pulse">
          <div className="h-10 w-56 rounded-xl bg-gray-200 mb-6" />
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-32 rounded-2xl bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="glass-card rounded-3xl p-6 h-fit sticky top-24">
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 p-5 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-blue-100">Admin</p>
                <h2 className="text-xl font-bold">Control Center</h2>
              </div>
            </div>
            <p className="text-sm text-blue-100">Manage marketplace operations, approvals, and core data.</p>
          </div>

          <div className="mb-6 rounded-2xl border border-white/30 bg-white/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Signed In As</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-white/70"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-6 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </aside>

        <section className="min-w-0 space-y-6">
          <div className="glass-card rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Admin Section</p>
            <div className="mt-2 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{currentSection}</h1>
                <p className="text-sm text-gray-600">Operational controls and marketplace management.</p>
              </div>
              <Link href="/dashboard" className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white">
                Back To Dashboard
              </Link>
            </div>
          </div>

          {children}
        </section>
      </div>
    </div>
  );
}