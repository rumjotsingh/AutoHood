"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown, LogOut, LayoutDashboard, Package } from "lucide-react";
import { useAuthStore, useCartStore, useWishlistStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { isAuthenticated, user, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/cars?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("accessToken");
    setShowUserMenu(false);
    router.push("/");
  };

  const dashboardHref = user?.role === "admin" ? "/admin" : "/dashboard";
  const dashboardLabel = user?.role === "admin" ? "Admin Panel" : "Dashboard";

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "glass-effect shadow-lg" 
        : "bg-white/95 backdrop-blur-sm border-b border-gray-200"
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-2xl">A</span>
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AutoHood
              </span>
              <div className="text-xs text-gray-500 -mt-1">Premium Marketplace</div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search cars, parts, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all group-hover:border-gray-300"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-colors" />
              {searchQuery && (
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                >
                  Search
                </button>
              )}
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            {/* Wishlist - Only show when authenticated */}
            {isAuthenticated && (
              <Link 
                href="/wishlist" 
                className="relative hidden md:flex items-center justify-center w-11 h-11 rounded-xl hover:bg-gray-100 transition-all group"
              >
                <Heart className="w-6 h-6 text-gray-700 group-hover:text-red-500 group-hover:scale-110 transition-all" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            )}

            {/* Cart - Only show when authenticated */}
            {isAuthenticated && (
              <Link 
                href="/cart" 
                className="relative hidden md:flex items-center justify-center w-11 h-11 rounded-xl hover:bg-gray-100 transition-all group"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-blue-600 group-hover:scale-110 transition-all" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all group"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-700 max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 glass-effect rounded-xl shadow-2xl py-2 z-50 animate-slide-up">
                      <Link
                        href={dashboardHref}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">{dashboardLabel}</span>
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Package className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">My Orders</span>
                      </Link>
                      <Link
                        href="/wishlist"
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Heart className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">Wishlist</span>
                      </Link>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden md:block btn-primary text-sm py-2.5 px-6">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center space-x-1 pb-4 border-t border-gray-100 pt-4">
          {[
            { name: "Cars", href: "/cars" },
            { name: "Car Parts", href: "/parts" },
            { name: "Dealers", href: "/dealers" },
            { name: "Orders", href: "/orders" },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 glass-effect animate-slide-up">
          <div className="container-custom py-6 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </form>

            {/* Mobile Links */}
            <div className="space-y-2">
              {[
                { name: "Cars", href: "/cars" },
                { name: "Car Parts", href: "/parts" },
                { name: "Dealers", href: "/dealers" },
                ...(user?.role === "admin" ? [{ name: "Admin", href: "/admin" }] : []),
                { name: "Wishlist", href: "/wishlist", badge: wishlistItems.length },
                { name: "Cart", href: "/cart", badge: cartItems.length },
                { name: "Orders", href: "/orders" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{link.name}</span>
                  {link.badge && link.badge > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Auth */}
            {!isAuthenticated && (
              <Link
                href="/login"
                className="block w-full btn-primary text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
