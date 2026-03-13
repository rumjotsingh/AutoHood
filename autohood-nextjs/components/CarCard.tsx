"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Fuel, Gauge, Calendar, Zap, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore, useAuthStore } from "@/store/useStore";
import { useState } from "react";
import toast from "react-hot-toast";
import { trackEvent } from "@/lib/analytics";

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
      trackEvent("remove_from_wishlist", {
        car_id: car._id,
        car_title: car.title,
        car_price: car.pricing?.sellingPrice || car.price,
      });
    } else {
      addItem(car._id);
      toast.success("Added to wishlist");
      trackEvent("add_to_wishlist", {
        car_id: car._id,
        car_title: car.title,
        car_price: car.pricing?.sellingPrice || car.price,
      });
    }
  };

  // Get primary image
  const primaryImage = car.images?.find((img: any) => img.isPrimary) || car.images?.[0];
  const imageUrl = primaryImage?.url || primaryImage || "/placeholder-car.jpg";

  return (
    <Link href={`/cars/${car._id}`} className="group block">
      <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 shimmer"></div>
          )}
          <Image
            src={imageUrl}
            alt={car.title}
            fill
            className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {car.featured && (
              <span className="px-2.5 py-1 bg-gray-900 text-white text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1 backdrop-blur-sm">
                <Zap className="w-3 h-3" />
                Featured
              </span>
            )}
            {car.condition === "new" && (
              <span className="px-2.5 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg shadow-lg backdrop-blur-sm">
                New
              </span>
            )}
            {car.verified && (
              <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-lg backdrop-blur-sm">
                Verified
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 active:scale-95 transition-all duration-200 group/heart"
          >
            <Heart
              className={`w-4 h-4 transition-all duration-200 ${
                inWishlist 
                  ? "fill-red-500 text-red-500" 
                  : "text-gray-700 group-hover/heart:text-red-500"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Brand Logo & Title */}
          <div className="flex items-start gap-3 mb-3">
            {car.brand?.logo?.url && (
              <div className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-200 p-1.5 flex-shrink-0 group-hover:border-gray-300 transition-colors">
                <Image
                  src={car.brand.logo.url}
                  alt={car.brand.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg line-clamp-1 text-gray-900 group-hover:text-gray-700 transition-colors">
                {car.title}
              </h3>
              {car.brand?.name && (
                <p className="text-xs text-gray-500 mt-0.5">{car.brand.name}</p>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(car.pricing?.sellingPrice || car.price)}
            </p>
            {car.pricing?.originalPrice && car.pricing.originalPrice > car.pricing.sellingPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(car.pricing.originalPrice)}
              </span>
            )}
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2.5 hover:bg-gray-100 transition-colors">
              <Gauge className="w-4 h-4 text-gray-900 flex-shrink-0" />
              <span className="font-medium truncate">{car.kmDriven?.toLocaleString() || car.mileage?.toLocaleString() || "N/A"} km</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2.5 hover:bg-gray-100 transition-colors">
              <Fuel className="w-4 h-4 text-gray-900 flex-shrink-0" />
              <span className="font-medium capitalize truncate">{car.fuelType || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2.5 hover:bg-gray-100 transition-colors">
              <Calendar className="w-4 h-4 text-gray-900 flex-shrink-0" />
              <span className="font-medium">{car.year || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2.5 hover:bg-gray-100 transition-colors">
              <MapPin className="w-4 h-4 text-gray-900 flex-shrink-0" />
              <span className="font-medium truncate">{car.location?.city || "India"}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 flex-wrap">
              {car.owner?.dealerProfile && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600 font-medium">Verified Dealer</span>
                </div>
              )}
              {car.negotiable && (
                <span className="text-xs text-gray-900 font-semibold px-2 py-1 bg-gray-100 rounded-md">
                  Negotiable
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gray-900 transition-all duration-300 pointer-events-none"></div>
      </div>
    </Link>
  );
}
