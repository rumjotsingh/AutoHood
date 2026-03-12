"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/useStore";

interface PartCardProps {
  part: any;
}

export default function PartCard({ part }: PartCardProps) {
  const addItem = useCartStore((state) => state.addItem);

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
    addItem({
      id: part._id,
      name: part.name,
      price: part.price,
      quantity: 1,
      image: imageUrl,
      type: "part",
    });
  };

  return (
    <Link href={`/parts/${part._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
        <div className="relative h-48">
          <Image
            src={imageUrl}
            alt={part.name}
            fill
            className="object-cover"
          />
          {part.stock > 0 || part.isActive ? (
            <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded">
              In Stock
            </span>
          ) : (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{part.name}</h3>
          <p className="text-sm text-gray-600 mb-2 capitalize">{part.category}</p>
          <p className="text-2xl font-bold text-primary mb-3">
            {formatPrice(part.price)}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <Package className="w-4 h-4" />
              <span className="capitalize">{part.condition || "New"}</span>
            </div>
            <span>Stock: {part.stock || 0}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!part.stock && !part.isActive}
            className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
