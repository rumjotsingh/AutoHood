"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Fuel, Gauge, Calendar, Zap, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore, useAuthStore } from "@/store/useStore";
import { useState } from "react";
import toast from "react-hot-toast";

interface CarCardProps {
  car: any;
}

export default function CarCard({ car }: CarCardProps) {
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const inWishlist = isInWishlist(car._id);
  const [imageLoaded, setImageLoaded] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      return;
    }
    
    if (inWishlist) {
      removeItem(car._id);
      toast.success("Removed from wishlist");
    } else {
      addItem(car._id);
      toast.success("Added to wishlist");
    }
  };

  return (
    <Link href={`/cars/${car._id}`} className="group block">
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden card-hover border border-gray-100">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 shimmer"></div>
          )}
          <Image
            src={car.images?.[0]?.url || car.images?.[0] || "/placeholder-car.jpg"}
            alt={car.title}
            fill
            className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {car.featured && (
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Featured
              </span>
            )}
            {car.condition === "new" && (
              <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs font-bold rounded-full shadow-lg">
                New
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:scale-110 transition-all duration-300 group/heart"
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                inWishlist 
                  ? "fill-red-500 text-red-500 scale-110" 
                  : "text-gray-600 group-hover/heart:text-red-500 group-hover/heart:scale-110"
              }`}
            />
          </button>

          {/* Quick View on Hover */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <div className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center gap-2 text-sm font-medium">
              <Eye className="w-4 h-4" />
              Quick View
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {car.title}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {formatPrice(car.pricing?.sellingPrice || car.price)}
            </p>
            {car.pricing?.originalPrice && car.pricing.originalPrice > car.pricing.sellingPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(car.pricing.originalPrice)}
              </span>
            )}
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <Gauge className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{car.kmDriven || car.specifications?.mileage || car.mileage || "N/A"} km</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <Fuel className="w-4 h-4 text-green-500" />
              <span className="font-medium capitalize">{car.fuelType || car.specifications?.fuelType || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span className="font-medium">{car.year || car.specifications?.year || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="font-medium truncate">{car.location?.city || "India"}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {car.owner?.dealerProfile && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Verified Dealer</span>
                </div>
              )}
            </div>
            <div className="text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
              View Details →
            </div>
          </div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/50 transition-all duration-500 pointer-events-none"></div>
      </div>
    </Link>
  );
}
