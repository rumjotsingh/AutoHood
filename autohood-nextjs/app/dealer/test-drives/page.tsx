"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Car, User, Phone, Mail, CheckCircle, XCircle, Clock } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function DealerTestDrivesPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { data: testDrivesData, isLoading } = useQuery({
    queryKey: ["dealer-test-drives"],
    queryFn: () => api.get("/test-drives"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: any) => {
      return api.patch(`/test-drives/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dealer-test-drives"] });
      toast.success("Test drive status updated");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const testDrives = testDrivesData?.data?.data || [];
  const filteredDrives = selectedStatus === "all" 
    ? testDrives 
    : testDrives.filter((td: any) => td.status === selectedStatus);

  const statusOptions = [
    { value: "all", label: "All", icon: Calendar, color: "gray" },
    { value: "pending", label: "Pending", icon: Clock, color: "yellow" },
    { value: "confirmed", label: "Confirmed", icon: CheckCircle, color: "blue" },
    { value: "completed", label: "Completed", icon: CheckCircle, color: "green" },
    { value: "cancelled", label: "Cancelled", icon: XCircle, color: "red" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Test Drive Bookings
          </h1>
          <p className="text-gray-600 mt-2">Manage customer test drive requests</p>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                    selectedStatus === option.value
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Test Drives List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDrives.length === 0 ? (
            <div className="col-span-2 bg-white rounded-2xl shadow-lg p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No test drives found</h3>
              <p className="text-gray-600">Test drive bookings will appear here</p>
            </div>
          ) : (
            filteredDrives.map((testDrive: any, index: number) => (
              <motion.div
                key={testDrive._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      testDrive.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : testDrive.status === "confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : testDrive.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {testDrive.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    {new Date(testDrive.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Car Info */}
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{testDrive.car?.title || "Car"}</h3>
                    <p className="text-sm text-gray-600">{testDrive.car?.model}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{testDrive.contactName || testDrive.user?.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{testDrive.contactEmail || testDrive.user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{testDrive.contactPhone || testDrive.user?.phone || "N/A"}</span>
                  </div>
                </div>

                {/* Preferred Date & Time */}
                <div className="bg-blue-50 rounded-xl p-3 mb-4">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Preferred Schedule</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {new Date(testDrive.preferredDate).toLocaleDateString()} at{" "}
                      {testDrive.preferredTime}
                    </span>
                  </div>
                </div>

                {/* Message */}
                {testDrive.notes?.customer && (
                  <div className="bg-gray-50 rounded-xl p-3 mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Customer Message</p>
                    <p className="text-sm text-gray-600">{testDrive.notes.customer}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {testDrive.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({ id: testDrive._id, status: "confirmed" })
                        }
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Confirm</span>
                      </button>
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({ id: testDrive._id, status: "cancelled" })
                        }
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center justify-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                  {testDrive.status === "confirmed" && (
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({ id: testDrive._id, status: "completed" })
                      }
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark as Completed</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
