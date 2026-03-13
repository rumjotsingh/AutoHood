"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { carsAPI, brandsAPI } from "@/lib/api";
import CarCard from "@/components/CarCard";
import { SlidersHorizontal, X } from "lucide-react";

export default function CarsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    brand: "",
    minPrice: "",
    maxPrice: "",
    fuelType: "",
    transmission: "",
    bodyType: "",
    page: 1,
  });

  const { data: cars, isLoading } = useQuery({
    queryKey: ["cars", filters],
    queryFn: () => carsAPI.getAll(filters),
  });

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandsAPI.getAll(),
  });

  const hasActiveFilters = Object.values(filters).some((v) => v && v !== 1);

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse cars</h1>
            <p className="text-gray-600">
              {cars?.data?.pagination?.totalItems || 0} cars available
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
                        brand: "",
                        minPrice: "",
                        maxPrice: "",
                        fuelType: "",
                        transmission: "",
                        bodyType: "",
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

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-medium mb-3">Fuel type</label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                    className="input"
                  >
                    <option value="">All types</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="cng">CNG</option>
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-sm font-medium mb-3">Transmission</label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                    className="input"
                  >
                    <option value="">All</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </select>
                </div>

                {/* Body Type */}
                <div>
                  <label className="block text-sm font-medium mb-3">Body type</label>
                  <select
                    value={filters.bodyType}
                    onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })}
                    className="input"
                  >
                    <option value="">All types</option>
                    <option value="suv">SUV</option>
                    <option value="sedan">Sedan</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="coupe">Coupe</option>
                    <option value="convertible">Convertible</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
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
                  {cars?.data?.data?.map((car: any) => (
                    <CarCard key={car._id} car={car} />
                  ))}
                </div>

                {cars?.data?.data?.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-gray-500 text-lg mb-4">No cars found</p>
                    <button
                      onClick={() =>
                        setFilters({
                          brand: "",
                          minPrice: "",
                          maxPrice: "",
                          fuelType: "",
                          transmission: "",
                          bodyType: "",
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
        <div className="fixed inset-0 z-50 md:hidden">
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

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium mb-3">Fuel type</label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                  className="input"
                >
                  <option value="">All types</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="cng">CNG</option>
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-sm font-medium mb-3">Transmission</label>
                <select
                  value={filters.transmission}
                  onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                  className="input"
                >
                  <option value="">All</option>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-sm font-medium mb-3">Body type</label>
                <select
                  value={filters.bodyType}
                  onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })}
                  className="input"
                >
                  <option value="">All types</option>
                  <option value="suv">SUV</option>
                  <option value="sedan">Sedan</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="coupe">Coupe</option>
                  <option value="convertible">Convertible</option>
                </select>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
              <button
                onClick={() => {
                  setFilters({
                    brand: "",
                    minPrice: "",
                    maxPrice: "",
                    fuelType: "",
                    transmission: "",
                    bodyType: "",
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
