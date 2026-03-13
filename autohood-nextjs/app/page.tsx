"use client";

import Link from "next/link";
import { ArrowRight, Check, Zap, Shield, Star, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { carsAPI, brandsAPI } from "@/lib/api";
import CarCard from "@/components/CarCard";
import BrandCarousel from "@/components/BrandCarousel";

export default function HomePage() {
  const { data: featuredCars } = useQuery({
    queryKey: ["featured-cars"],
    queryFn: () => carsAPI.getFeatured(),
  });

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandsAPI.getAll(),
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section - Apple/Linear Style */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-40 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-full mb-8 animate-slide-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Trusted by 50,000+ customers
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Buy cars the
              <span className="block mt-2">modern way</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Premium marketplace for verified cars and parts. Instant booking, secure payments, and trusted dealers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Link 
                href="/cars" 
                className="group btn-primary px-8 py-4 text-base"
              >
                Explore cars
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/parts" 
                className="btn-secondary px-8 py-4 text-base"
              >
                Shop parts
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Verified dealers</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Secure payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Instant booking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-gray-200 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: "Cars available", value: "10,000+", icon: TrendingUp },
              { label: "Happy customers", value: "50,000+", icon: Star },
              { label: "Verified dealers", value: "500+", icon: Shield },
              { label: "5-star reviews", value: "25,000+", icon: Zap },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-3 text-gray-400" />
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      {featuredCars?.data?.data && (
        <section className="py-24 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured cars</h2>
                <p className="text-gray-600">Handpicked premium vehicles</p>
              </div>
              <Link 
                href="/cars" 
                className="hidden md:flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCars.data.data.slice(0, 8).map((car: any) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/cars" className="btn-secondary">
                View all cars
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Brands */}
      {brands?.data?.data && (
        <section className="py-24 bg-white border-t border-gray-200">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Popular brands</h2>
              <p className="text-gray-600">World's leading manufacturers</p>
            </div>
            <BrandCarousel brands={brands.data.data} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Join thousands of customers finding their perfect car
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/cars" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 active:scale-[0.98] transition-all"
              >
                Browse cars
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 active:scale-[0.98] transition-all"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
