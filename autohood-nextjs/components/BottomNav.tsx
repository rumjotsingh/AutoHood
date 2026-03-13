"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, ShoppingCart, User } from "lucide-react";
import { useAuthStore, useCartStore, useWishlistStore } from "@/store/useStore";

export default function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/cars", icon: Search },
    { name: "Wishlist", href: "/wishlist", icon: Heart, badge: wishlistItems.length },
    { name: "Cart", href: "/cart", icon: ShoppingCart, badge: cartItems.length },
    {
      name: "Account",
      href: isAuthenticated ? (user?.role === "admin" ? "/admin" : "/dashboard") : "/login",
      icon: User,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-0 right-0 z-50 px-4 flex justify-center">
      
      <nav className="flex justify-between items-center w-full max-w-md px-6 py-3 bg-white/70 backdrop-blur-xl shadow-2xl border border-gray-200 rounded-2xl">
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center relative group"
            >
              
              <div className="relative">
                
                <Icon
                  className={`w-6 h-6 transition ${
                    isActive
                      ? "text-black"
                      : "text-gray-400 group-hover:text-gray-700"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[16px] h-[16px] text-[10px] flex items-center justify-center bg-red-500 text-white rounded-full px-1">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}

              </div>

              <span
                className={`text-[11px] mt-1 ${
                  isActive ? "text-black font-medium" : "text-gray-400"
                }`}
              >
                {item.name}
              </span>

            </Link>
          );
        })}
      </nav>
    </div>
  );
}