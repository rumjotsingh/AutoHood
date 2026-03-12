"use client";

import Link from "next/link";
import { Search, TrendingUp, Shield, Award, Zap, Users, Star, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { carsAPI, brandsAPI } from "@/lib/api";
import CarCard from "@/components/CarCard";
import BrandCarousel from "@/components/BrandCarousel";
import { useState } from "react";

export default function HomePage() {
  const [searchFilters, setSearchFilters] = useState({
    brand: "",
    model: "",
    priceRange: "",
  });

  const { data: featuredCars } = useQuery({
    queryKey: ["featured-cars"],
    queryFn: () => carsAPI.getFeatured(),
  });

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandsAPI.getAll(),
  });

  const stats = [
    { label: "Cars Available", value: "10,000+", icon: TrendingUp },
    { label: "Happy Customers", value: "50,000+", icon: Users },
    { label: "Verified Dealers", value: "500+", icon: Shield },
    { label: "5-Star Reviews", value: "25,000+", icon: Star },
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Dealers",
      description: "All dealers are thoroughly verified and trusted",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Every vehicle undergoes rigorous quality checks",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book test drives and make purchases instantly",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: TrendingUp,
      title: "Best Prices",
      description: "Competitive pricing on all vehicles and parts",
      color: "from-green-500 to-green-600",
    },
  ];

  const categories = [
    { name: "SUV", count: "2,500+", image: "🚙", gradient: "from-blue-500 to-cyan-500" },
    { name: "Sedan", count: "3,200+", image: "🚗", gradient: "from-purple-500 to-pink-500" },
    { name: "Hatchback", count: "1,800+", image: "🚕", gradient: "from-orange-500 to-red-500" },
    { name: "Electric", count: "800+", image: "⚡", gradient: "from-green-500 to-emerald-500" },
    { name: "Luxury", count: "600+", image: "💎", gradient: "from-yellow-500 to-amber-500" },
    { name: "Sports", count: "400+", image: "🏎️", gradient: "from-red-500 to-rose-500" },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Gradient Background */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }}></div>
        </div>

        <div className="container-custom relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">India's #1 Automotive Marketplace</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Find Your
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Dream Car
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Discover thousands of verified cars and genuine parts from trusted dealers across India
            </p>

            {/* Enhanced Search Box */}
            <div className="glass-effect rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select 
                  value={searchFilters.brand}
                  onChange={(e) => setSearchFilters({ ...searchFilters, brand: e.target.value })}
                  className="px-6 py-4 border-2 border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                >
                  <option value="">Select Brand</option>
                  {brands?.data?.data?.map((brand: any) => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  ))}
                </select>
                
                <select className="px-6 py-4 border-2 border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all">
                  <option>Select Model</option>
                </select>
                
                <select 
                  value={searchFilters.priceRange}
                  onChange={(e) => setSearchFilters({ ...searchFilters, priceRange: e.target.value })}
                  className="px-6 py-4 border-2 border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                >
                  <option value="">Price Range</option>
                  <option value="0-500000">Under ₹5L</option>
                  <option value="500000-1000000">₹5L - ₹10L</option>
                  <option value="1000000-2000000">₹10L - ₹20L</option>
                  <option value="2000000-999999999">Above ₹20L</option>
                </select>
                
                <Link 
                  href={`/cars?${new URLSearchParams(searchFilters).toString()}`}
                  className="btn-primary flex items-center justify-center gap-2 text-lg"
                >
                  <Search className="w-5 h-5" />
                  Search
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">AutoHood</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of car buying with our premium features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      {brands?.data?.data && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="container-custom">
            <div className="text-center mb-12 animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Popular Brands</h2>
              <p className="text-xl text-gray-600">Explore vehicles from world's leading manufacturers</p>
            </div>
            <BrandCarousel brands={brands.data.data} />
          </div>
        </section>
      )}

      {/* Featured Cars */}
      {featuredCars?.data?.data && (
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="flex justify-between items-center mb-12 animate-slide-up">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Cars</h2>
                <p className="text-xl text-gray-600">Handpicked premium vehicles just for you</p>
              </div>
              <Link 
                href="/cars" 
                className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:gap-4 transition-all group"
              >
                View All
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredCars.data.data.slice(0, 8).map((car: any, index: number) => (
                <div key={car._id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <CarCard car={car} />
                </div>
              ))}
            </div>

            <div className="text-center mt-12 md:hidden">
              <Link href="/cars" className="btn-primary inline-flex items-center gap-2">
                View All Cars
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container-custom">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-300">Find your perfect vehicle type</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                href={`/cars?bodyType=${category.name}`}
                className="group relative overflow-hidden rounded-2xl p-8 text-center glass-effect hover:scale-105 transition-all duration-500 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-500">{category.image}</div>
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-sm text-gray-400">{category.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Find Your Dream Car?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of happy customers who found their perfect vehicle with AutoHood
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cars" className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all hover:shadow-2xl hover:-translate-y-1">
                Browse Cars
              </Link>
              <Link href="/register" className="px-8 py-4 bg-transparent border-2 border-white rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
