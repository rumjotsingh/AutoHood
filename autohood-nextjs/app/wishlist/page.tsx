"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { carsAPI } from "@/lib/api";
import { useAuthStore, useWishlistStore } from "@/store/useStore";
import CarCard from "@/components/CarCard";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { items } = useWishlistStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const { data: carsData, isLoading } = useQuery({
    queryKey: ["wishlist-cars", items],
    queryFn: async () => {
      if (items.length === 0) return { data: { data: [] } };
      const promises = items.map((id) => carsAPI.getById(id));
      const results = await Promise.all(promises);
      return { data: { data: results.map((r) => r.data.data) } };
    },
    enabled: isAuthenticated && items.length > 0,
  });

  if (!isAuthenticated) {
    return null;
  }

  const cars = carsData?.data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8 md:py-12 pb-20 md:pb-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card h-80 animate-pulse bg-gray-100"></div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="card p-12 md:p-20 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding cars you love to your wishlist and come back to them later
            </p>
            <Link href="/cars" className="btn-primary inline-flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Browse cars
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cars.map((car: any) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
