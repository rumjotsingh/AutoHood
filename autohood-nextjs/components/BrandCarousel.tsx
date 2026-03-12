"use client";

import Link from "next/link";
import Image from "next/image";

interface BrandCarouselProps {
  brands: any[];
}

export default function BrandCarousel({ brands }: BrandCarouselProps) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex space-x-6">
        {brands.map((brand) => {
          const logoSrc = typeof brand.logo === "string" ? brand.logo : brand.logo?.url;
          const hasLogo = typeof logoSrc === "string" && logoSrc.trim().length > 0;

          return (
            <Link
              key={brand._id}
              href={`/cars?brand=${brand._id}`}
              className="flex-shrink-0 w-32 h-32 bg-white rounded-lg shadow-md hover:shadow-xl transition flex items-center justify-center p-4"
            >
              {hasLogo ? (
                <Image
                  src={logoSrc}
                  alt={brand.name}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              ) : (
                <span className="text-lg font-semibold text-gray-700 text-center">{brand.name}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
