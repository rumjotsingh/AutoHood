"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MessageSquare, Mail, Phone, Car, Calendar, CheckCircle, X } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function DealerInquiriesPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [responseText, setResponseText] = useState("");

  const { data: inquiriesData, isLoading } = useQuery({
    queryKey: ["dealer-inquiries", selectedStatus],
    queryFn: async () => {
      return api.get("/contact/dealer/inquiries");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ inquiryId, status, dealerResponse }: any) => {
      return api.patch(`/contact/${inquiryId}/status`, { status, dealerResponse });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dealer-inquiries"] });
      toast.success("Inquiry status updated successfully");
      setSelectedInquiry(null);
      setResponseText("");
    },
    onError: () => {
      toast.error("Failed to update inquiry status");
    },
  });

  const inquiries = inquiriesData?.data?.data || [];
  const filteredInquiries = selectedStatus === "all" 
    ? inquiries 
    : inquiries.filter((inq: any) => inq.status === selectedStatus);

  const statusOptions = [
    { value: "all", label: "All Inquiries", color: "gray", count: inquiries.length },
    { value: "pending", label: "Pending", color: "yellow", count: inquiries.filter((i: any) => i.status === "pending").length },
    { value: "contacted", label: "Contacted", color: "blue", count: inquiries.filter((i: any) => i.status === "contacted").length },
    { value: "resolved", label: "Resolved", color: "green", count: inquiries.filter((i: any) => i.status === "resolved").length },
    { value: "closed", label: "Closed", color: "gray", count: inquiries.filter((i: any) => i.status === "closed").length },
  ];

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || "gray";
  };

  const handleUpdateStatus = (inquiryId: string, newStatus: string) => {
    updateStatusMutation.mutate({
      inquiryId,
      status: newStatus,
      dealerResponse: responseText || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="container-custom py-8 pb-20 md:pb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Customer Inquiries
            </h1>
            <p className="text-gray-600 mt-2">Manage customer messages and inquiries</p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedStatus === option.value
                    ? `bg-${option.color}-500 text-white shadow-lg`
                    : `bg-${option.color}-50 text-${option.color}-700 hover:bg-${option.color}-100`
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>

        {/* Inquiries List */}
        <div className="space-y-4">
          {filteredInquiries.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No inquiries found</h3>
              <p className="text-gray-600">Customer inquiries will appear here</p>
            </div>
          ) : (
            filteredInquiries.map((inquiry: any, index: number) => (
              <motion.div
                key={inquiry._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {inquiry.customerName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-${getStatusColor(
                          inquiry.status
                        )}-100 text-${getStatusColor(inquiry.status)}-700`}
                      >
                        {inquiry.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {inquiry.customerEmail}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {inquiry.customerPhone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(inquiry.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {inquiry.carTitle && (
                      <div className="flex items-center space-x-2 mb-3 p-3 bg-blue-50 rounded-lg">
                        <Car className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-900">
                          Interested in: {inquiry.carTitle}
                        </span>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Customer Message:</p>
                      <p className="text-gray-800">{inquiry.message}</p>
                    </div>

                    {inquiry.dealerResponse && (
                      <div className="bg-green-50 rounded-xl p-4 mb-4">
                        <p className="text-sm font-semibold text-green-700 mb-2">Your Response:</p>
                        <p className="text-green-900">{inquiry.dealerResponse}</p>
                        <p className="text-xs text-green-600 mt-2">
                          Responded: {new Date(inquiry.respondedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {inquiry.status === "pending" && (
                    <>
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center space-x-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Respond & Mark Contacted</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(inquiry._id, "contacted")}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark as Contacted</span>
                      </button>
                    </>
                  )}
                  {inquiry.status === "contacted" && (
                    <button
                      onClick={() => handleUpdateStatus(inquiry._id, "resolved")}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark as Resolved</span>
                    </button>
                  )}
                  {inquiry.status === "resolved" && (
                    <button
                      onClick={() => handleUpdateStatus(inquiry._id, "closed")}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Close Inquiry</span>
                    </button>
                  )}
                  <a
                    href={`tel:${inquiry.customerPhone}`}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all flex items-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Customer</span>
                  </a>
                  <a
                    href={`mailto:${inquiry.customerEmail}`}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Email</span>
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Response Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Respond to Inquiry</h3>
              <button
                onClick={() => {
                  setSelectedInquiry(null);
                  setResponseText("");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">Customer:</p>
              <p className="text-gray-900">{selectedInquiry.customerName}</p>
              <p className="text-sm text-gray-600">{selectedInquiry.customerEmail}</p>
            </div>

            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-semibold text-blue-700 mb-2">Their Message:</p>
              <p className="text-blue-900">{selectedInquiry.message}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Response (Optional)
              </label>
              <textarea
                rows={4}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Add a note about how you responded to this inquiry..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedInquiry(null);
                  setResponseText("");
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedInquiry._id, "contacted")}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Mark as Contacted
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
