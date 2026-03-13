"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { partsAPI, brandsAPI } from "@/lib/api";
import PartCard from "@/components/PartCard";
import { SlidersHorizontal, X } from "lucide-react";

export default function PartsPage() {
  const [showFilters, setShowFilters] = useState(false);
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

  const hasActiveFilters = Object.values(filters).some((v) => v && v !== 1);

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-8 md:py-12 pb-20 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Parts Marketplace</h1>
            <p className="text-gray-600">
              {parts?.data?.pagination?.totalItems || 0} parts available
            </p>
          </div>
          
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(true)}
            className="md:hidden btn-secondary"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 w-2 h-2 bg-gray-900 rounded-full"></span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg">Filters</h2>
                {hasActiveFilters && (
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
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-3">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="input"
                  >
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium mb-3">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                    className="input"
                  >
                    <option value="">All brands</option>
                    {brands?.data?.data?.map((brand: any) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium mb-3">Price range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="input"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium mb-3">Condition</label>
                  <select
                    value={filters.condition}
                    onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                    className="input"
                  >
                    <option value="">All</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Parts Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card h-80 animate-pulse bg-gray-100" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {parts?.data?.data?.map((part: any) => (
                    <PartCard key={part._id} part={part} />
                  ))}
                </div>

                {parts?.data?.data?.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-gray-500 text-lg mb-4">No parts found</p>
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
                      className="btn-secondary"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div 
            className="absolute inset-0 bg-black/20"
            onClick={() => setShowFilters(false)}
          ></div>
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-3">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="input"
                >
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium mb-3">Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                  className="input"
                >
                  <option value="">All brands</option>
                  {brands?.data?.data?.map((brand: any) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-3">Price range</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="input"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium mb-3">Condition</label>
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  className="input"
                >
                  <option value="">All</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
              <button
                onClick={() => {
                  setFilters({
                    category: "",
                    brand: "",
                    minPrice: "",
                    maxPrice: "",
                    condition: "",
                    page: 1,
                  });
                }}
                className="flex-1 btn-secondary"
              >
                Clear all
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 btn-primary"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
