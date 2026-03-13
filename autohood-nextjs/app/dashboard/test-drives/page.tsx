"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testDriveAPI } from "@/lib/api";
import { Calendar, Clock, Car, MapPin, Phone, Mail, X, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function MyTestDrivesPage() {
  const queryClient = useQueryClient();
  const [selectedTestDrive, setSelectedTestDrive] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const { data: testDrivesData, isLoading } = useQuery({
    queryKey: ["my-test-drives"],
    queryFn: () => testDriveAPI.getMyBookings(),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => testDriveAPI.cancel(id, cancelReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-test-drives"] });
      toast.success("Test drive cancelled successfully");
      setShowCancelModal(false);
      setSelectedTestDrive(null);
      setCancelReason("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to cancel test drive");
    },
  });

  const testDrives = testDrivesData?.data?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleCancelClick = (testDrive: any) => {
    setSelectedTestDrive(testDrive);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }
    cancelMutation.mutate(selectedTestDrive._id);
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8">
      <div className="container-custom py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">My Test Drives</h1>
          <p className="text-sm md:text-base text-gray-600">
            View and manage your test drive bookings
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : testDrives.length === 0 ? (
          <div className="text-center py-20">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-6">No test drives booked yet</p>
            <Link
              href="/cars"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 active:scale-95 transition-all"
            >
              Browse Cars
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {testDrives.map((testDrive: any) => (
              <div
                key={testDrive._id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Mobile & Desktop Layout */}
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Car Image */}
                    {testDrive.car?.images?.[0]?.url && (
                      <div className="w-full md:w-48 h-40 md:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={testDrive.car.images[0].url}
                          alt={testDrive.car.title}
                          width={192}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-1 line-clamp-1">
                            {testDrive.car?.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {testDrive.car?.year} • {testDrive.car?.fuelType}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                            testDrive.status
                          )}`}
                        >
                          {testDrive.status}
                        </span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-900 flex-shrink-0" />
                          <span className="font-medium">
                            {new Date(testDrive.preferredDate).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-900 flex-shrink-0" />
                          <span className="font-medium">{testDrive.preferredTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-900 flex-shrink-0" />
                          <span className="font-medium">
                            {testDrive.car?.location?.city}, {testDrive.car?.location?.state}
                          </span>
                        </div>
                        {testDrive.car?.owner?.dealerProfile && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="font-medium">Verified Dealer</span>
                          </div>
                        )}
                      </div>

                      {/* Contact Info */}
                      {testDrive.status === "confirmed" && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                          <p className="text-sm font-semibold text-green-900 mb-2">
                            Test Drive Confirmed!
                          </p>
                          <div className="space-y-1 text-sm text-green-800">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{testDrive.contactPhone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{testDrive.contactEmail}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {testDrive.notes?.customer && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Your Note</p>
                              <p className="text-sm text-gray-700">{testDrive.notes.customer}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Dealer Response */}
                      {testDrive.notes?.dealer && (
                        <div className="bg-blue-50 rounded-lg p-3 mb-4">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-blue-600 mb-1">Dealer Response</p>
                              <p className="text-sm text-blue-900">{testDrive.notes.dealer}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          href={`/cars/${testDrive.car?._id}`}
                          className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 active:scale-95 transition-all text-center"
                        >
                          View Car Details
                        </Link>
                        {(testDrive.status === "pending" || testDrive.status === "confirmed") && (
                          <button
                            onClick={() => handleCancelClick(testDrive)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 active:scale-95 transition-all"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Cancel Test Drive</h3>
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedTestDrive(null);
                    setCancelReason("");
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to cancel your test drive for{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedTestDrive?.car?.title}
                  </span>
                  ?
                </p>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for cancellation <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedTestDrive(null);
                    setCancelReason("");
                  }}
                  disabled={cancelMutation.isPending}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelConfirm}
                  disabled={cancelMutation.isPending || !cancelReason.trim()}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 text-sm"
                >
                  {cancelMutation.isPending ? "Cancelling..." : "Cancel Booking"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
