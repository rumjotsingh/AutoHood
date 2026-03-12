"use client";

import { useQuery } from "@tanstack/react-query";
import { carsAPI } from "@/lib/api";
import { useWishlistStore } from "@/store/useStore";
import CarCard from "@/components/CarCard";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const wishlistItems = useWishlistStore((state) => state.items);

  const { data: carsData, isLoading } = useQuery({
    queryKey: ["wishlist-cars", wishlistItems],
    queryFn: async () => {
      if (wishlistItems.length === 0) return { data: { data: [] } };
      const promises = wishlistItems.map((id) => carsAPI.getById(id));
      const results = await Promise.all(promises);
      return { data: { data: results.map((r) => r.data.data) } };
    },
    enabled: wishlistItems.length > 0,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="flex items-center space-x-3 mb-6">
          <Heart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">My Wishlist</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-80 animate-pulse" />
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start adding cars you love!</p>
            <a href="/cars" className="btn-primary inline-block">
              Browse Cars
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {carsData?.data?.data?.map((car: any) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
