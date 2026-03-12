"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { carsAPI, brandsAPI } from "@/lib/api";
import CarCard from "@/components/CarCard";
import { SlidersHorizontal } from "lucide-react";

export default function CarsPage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">Browse Cars</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Filters</h2>
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              </div>

              <div className="space-y-4">
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

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Fuel Type</label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Types</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="cng">CNG</option>
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-sm font-medium mb-2">Transmission</label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </select>
                </div>

                {/* Body Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Body Type</label>
                  <select
                    value={filters.bodyType}
                    onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Types</option>
                    <option value="suv">SUV</option>
                    <option value="sedan">Sedan</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="coupe">Coupe</option>
                    <option value="convertible">Convertible</option>
                  </select>
                </div>

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
                  className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
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
                    {cars?.data?.pagination?.totalItems || 0} cars found
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars?.data?.data?.map((car: any) => (
                    <CarCard key={car._id} car={car} />
                  ))}
                </div>

                {cars?.data?.data?.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No cars found matching your criteria</p>
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
