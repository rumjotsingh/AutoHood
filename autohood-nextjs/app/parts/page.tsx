"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { partsAPI, brandsAPI } from "@/lib/api";
import PartCard from "@/components/PartCard";
import { SlidersHorizontal } from "lucide-react";

export default function PartsPage() {
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    condition: "",
    page: 1,
  });

  const { data: parts, isLoading } = useQuery({
    queryKey: ["parts", filters],
    queryFn: () => partsAPI.getAll(filters),
  });

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandsAPI.getAll(),
  });

  const categories = [
    "Engine Parts",
    "Transmission",
    "Brakes",
    "Suspension",
    "Electrical",
    "Body Parts",
    "Interior",
    "Wheels & Tires",
    "Exhaust",
    "Cooling System",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">Car Parts Marketplace</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Filters</h2>
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              </div>

              <div className="space-y-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Brands</option>
                    {brands?.data?.data?.map((brand: any) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium mb-2">Condition</label>
                  <select
                    value={filters.condition}
                    onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </div>

                <button
                  onClick={() =>
                    setFilters({
                      category: "",
                      brand: "",
                      minPrice: "",
                      maxPrice: "",
                      condition: "",
                      page: 1,
                    })
                  }
                  className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Parts Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md h-80 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    {parts?.data?.pagination?.totalItems || 0} parts found
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {parts?.data?.data?.map((part: any) => (
                    <PartCard key={part._id} part={part} />
                  ))}
                </div>

                {parts?.data?.data?.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No parts found matching your criteria</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
