"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Package, Tag, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore, useAuthStore } from "@/store/useStore";
import { useState } from "react";
import toast from "react-hot-toast";

interface PartCardProps {
  part: any;
}

export default function PartCard({ part }: PartCardProps) {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get image URL - handle both url and public_id structures
  const getImageUrl = () => {
    if (!part.images || part.images.length === 0) {
      return "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800";
    }
    
    const firstImage = part.images[0];
    
    // If it's an object with url property
    if (typeof firstImage === 'object' && firstImage.url) {
      return firstImage.url;
    }
    
    // If it's a direct string
    if (typeof firstImage === 'string') {
      return firstImage;
    }
    
    return "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800";
  };

  const imageUrl = getImageUrl();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    
    addItem({
      id: part._id,
      name: part.name,
      price: part.price,
      quantity: 1,
      image: imageUrl,
      type: "part",
    });
    toast.success("Added to cart");
  };

  const isInStock = part.stock > 0 || part.isActive;

  return (
    <Link href={`/parts/${part._id}`} className="group block">
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden card-hover border border-gray-100">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 shimmer"></div>
          )}
          <Image
            src={imageUrl}
            alt={part.name}
            fill
            className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Stock Badge */}
          <div className="absolute top-3 left-3">
            {isInStock ? (
              <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs font-bold rounded-full shadow-lg">
                In Stock
              </span>
            ) : (
              <span className="px-3 py-1 bg-gradient-to-r from-red-400 to-pink-400 text-white text-xs font-bold rounded-full shadow-lg">
                Out of Stock
              </span>
            )}
          </div>

          {/* Condition Badge */}
          {part.condition && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full shadow-lg capitalize">
                {part.condition}
              </span>
            </div>
          )}

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
          {/* Category */}
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs text-gray-600 capitalize">{part.category}</p>
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {part.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {formatPrice(part.price)}
            </p>
          </div>

          {/* Stock Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 mb-4">
            <Package className="w-4 h-4 text-blue-500" />
            <span className="font-medium">Stock: {part.stock || 0} units</span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className="w-full bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {isInStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/50 transition-all duration-500 pointer-events-none"></div>
      </div>
    </Link>
  );
}
