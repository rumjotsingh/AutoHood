"use client";

import { useQuery } from "@tanstack/react-query";
import { dealersAPI } from "@/lib/api";
import Link from "next/link";
import { MapPin, Star, CheckCircle, Phone, Mail } from "lucide-react";

export default function DealersPage() {
  const { data: dealers, isLoading } = useQuery({
    queryKey: ["dealers"],
    queryFn: () => dealersAPI.getAll(),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8 pb-20 md:pb-8">
        <h1 className="text-3xl font-bold mb-6">Verified Dealers</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealers?.data?.data?.map((dealer: any) => (
              <Link key={dealer._id} href={`/dealers/${dealer._id}`}>
                <div className="bg-white rounded-lg shadow-md p-6 card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-xl mb-1">{dealer.businessName}</h3>
                      <p className="text-sm text-gray-600">{dealer.companyName}</p>
                    </div>
                    {dealer.verified && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>

                  <div className="flex items-center text-yellow-500 mb-3">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="ml-1 font-semibold">
                      {dealer.rating?.average?.toFixed(1) || "N/A"}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({dealer.rating?.count || 0} reviews)
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>
                        {dealer.location?.city}, {dealer.location?.state}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{dealer.contactInfo?.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="truncate">{dealer.contactInfo?.email}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      {dealer.stats?.totalListings || 0} Active Listings
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {dealers?.data?.data?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No dealers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
