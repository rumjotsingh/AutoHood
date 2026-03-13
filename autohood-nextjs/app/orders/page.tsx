"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useStore";
import { 
  Package, 
  Calendar, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Truck,
  CheckCircle,
  Clock
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => api.get("/orders/my-orders"),
    enabled: isAuthenticated,
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => api.get("/bookings/user"),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return null;
  }

  const orders = ordersData?.data?.data || [];
  const bookings = bookingsData?.data?.data || [];

  const getStatusOption = (status: string) => {
    const options: any = {
      pending: { color: "yellow", icon: Clock, label: "Pending" },
      confirmed: { color: "blue", icon: CheckCircle, label: "Confirmed" },
      processing: { color: "purple", icon: Package, label: "Processing" },
      shipped: { color: "indigo", icon: Truck, label: "Shipped" },
      delivered: { color: "green", icon: CheckCircle, label: "Delivered" },
      cancelled: { color: "red", icon: CheckCircle, label: "Cancelled" },
    };
    return options[status] || options.pending;
  };

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`);
      const invoiceData = response.data.data;
      
      // Create a printable invoice HTML
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${invoiceData.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px; }
            .header h1 { margin: 0; font-size: 32px; }
            .info-section { margin-bottom: 30px; }
            .info-section h3 { margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .two-column { display: flex; justify-content: space-between; }
            .column { flex: 1; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .total-row { font-weight: bold; font-size: 18px; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <p><strong>AutoHood</strong> - Premium Automotive Marketplace</p>
          </div>
          
          <div class="two-column">
            <div class="column">
              <div class="info-section">
                <h3>Invoice Details</h3>
                <p><strong>Invoice Number:</strong> ${invoiceData.invoiceNumber}</p>
                <p><strong>Order Number:</strong> ${invoiceData.orderNumber}</p>
                <p><strong>Date:</strong> ${new Date(invoiceData.date).toLocaleDateString("en-IN")}</p>
                <p><strong>Payment Status:</strong> ${invoiceData.paymentStatus}</p>
              </div>
            </div>
            <div class="column">
              <div class="info-section">
                <h3>Customer Details</h3>
                <p><strong>Name:</strong> ${invoiceData.customer.name}</p>
                <p><strong>Email:</strong> ${invoiceData.customer.email}</p>
                ${invoiceData.customer.phone ? `<p><strong>Phone:</strong> ${invoiceData.customer.phone}</p>` : ''}
              </div>
            </div>
          </div>
          
          ${invoiceData.shippingAddress ? `
          <div class="info-section">
            <h3>Shipping Address</h3>
            <p>${invoiceData.shippingAddress.name || invoiceData.customer.name}</p>
            <p>${invoiceData.shippingAddress.address}</p>
            <p>${invoiceData.shippingAddress.city}, ${invoiceData.shippingAddress.state} - ${invoiceData.shippingAddress.pincode}</p>
            ${invoiceData.shippingAddress.phone ? `<p>Phone: ${invoiceData.shippingAddress.phone}</p>` : ''}
          </div>
          ` : ''}
          
          <div class="info-section">
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${invoiceData.items.map((item: any) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price?.toLocaleString()}</td>
                    <td>₹${item.subtotal?.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="info-section">
            <table>
              <tr>
                <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                <td>₹${invoiceData.pricing.subtotal?.toLocaleString()}</td>
              </tr>
              ${invoiceData.pricing.discount > 0 ? `
              <tr>
                <td colspan="3" style="text-align: right;"><strong>Discount:</strong></td>
                <td>-₹${invoiceData.pricing.discount?.toLocaleString()}</td>
              </tr>
              ` : ''}
              <tr>
                <td colspan="3" style="text-align: right;"><strong>Tax (${invoiceData.pricing.taxRate}%):</strong></td>
                <td>₹${invoiceData.pricing.tax?.toLocaleString()}</td>
              </tr>
              ${invoiceData.pricing.deliveryCharge > 0 ? `
              <tr>
                <td colspan="3" style="text-align: right;"><strong>Delivery Charge:</strong></td>
                <td>₹${invoiceData.pricing.deliveryCharge?.toLocaleString()}</td>
              </tr>
              ` : ''}
              <tr class="total-row">
                <td colspan="3" style="text-align: right;"><strong>Total Amount:</strong></td>
                <td>₹${invoiceData.pricing.total?.toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>AutoHood - Premium Automotive Marketplace</p>
            <p>For support, contact: support@autohood.com</p>
          </div>
        </body>
        </html>
      `;
      
      // Open in new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
      
      toast.success("Invoice opened for printing");
    } catch (error) {
      toast.error("Failed to load invoice");
      console.error("Invoice error:", error);
    }
  };

  const isLoading = ordersLoading || bookingsLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6 md:py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">My Orders</h1>
          <p className="text-gray-600 text-sm md:text-base">Track and manage your orders and bookings</p>
        </div>
      </div>

      <div className="container-custom py-6 md:py-8 pb-20 md:pb-8">
        {/* Parts Orders Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Parts Orders
          </h2>
          
          {ordersLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Start shopping for automotive parts</p>
              <Link href="/parts" className="btn-primary inline-flex items-center">
                Browse Parts
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any, index: number) => {
                const statusOption = getStatusOption(order.orderStatus);
                const StatusIcon = statusOption.icon;
                const isExpanded = expandedOrder === order._id;

                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="p-4 md:p-6">
                      {/* Order Header */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900">
                              #{order.orderNumber || order._id.slice(-8)}
                            </h3>
                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-${statusOption.color}-100 text-${statusOption.color}-700`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {order.orderStatus}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CreditCard className="w-4 h-4" />
                              {order.paymentStatus}
                            </div>
                          </div>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {formatPrice(order.pricing?.total || order.totalAmount)}
                          </p>
                          <p className="text-sm text-gray-600 capitalize">{order.orderType}</p>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <div className="space-y-3">
                          {order.items?.slice(0, isExpanded ? undefined : 2).map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="w-14 h-14 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                {item.part?.images?.[0] && (
                                  <img
                                    src={item.part.images[0]?.url || item.part.images[0]}
                                    alt={item.part?.name || item.name}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm truncate">
                                  {item.part?.name || item.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Qty: {item.quantity} × {formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                          {!isExpanded && order.items?.length > 2 && (
                            <p className="text-xs text-gray-500 text-center">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && order.shippingAddress && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="bg-blue-50 rounded-xl p-4 mb-4"
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-sm text-gray-900 mb-1">Shipping Address</p>
                              <p className="text-sm text-gray-700">
                                {order.shippingAddress.name}
                              </p>
                              <p className="text-sm text-gray-700">
                                {order.shippingAddress.address}
                              </p>
                              <p className="text-sm text-gray-700">
                                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                              </p>
                              {order.shippingAddress.phone && (
                                <p className="text-sm text-gray-700 flex items-center gap-2 mt-1">
                                  <Phone className="w-3.5 h-3.5" />
                                  {order.shippingAddress.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {order.invoice && (
                          <button
                            onClick={() => handleDownloadInvoice(order._id)}
                            className="flex-1 md:flex-none px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2 font-medium text-sm"
                          >
                            <Download className="w-4 h-4" />
                            <span>View Invoice</span>
                          </button>
                        )}
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 active:scale-95 transition-all flex items-center gap-2 font-medium text-sm"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              <span className="hidden sm:inline">Less</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              <span className="hidden sm:inline">More</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Car Bookings Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Car Bookings
          </h2>
          
          {bookingsLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
              <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No car bookings yet</h3>
              <p className="text-gray-600 mb-6">Book your dream car with just ₹10,000 token</p>
              <Link href="/cars" className="btn-primary inline-flex items-center">
                Browse Cars
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking: any, index: number) => {
                const statusOption = getStatusOption(booking.status);
                const StatusIcon = statusOption.icon;

                return (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg">{booking.car?.title || "Car Booking"}</h3>
                          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-${statusOption.color}-100 text-${statusOption.color}-700`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4" />
                            Token Paid
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Token Amount: </span>
                            <span className="font-semibold text-gray-900">
                              {formatPrice(booking.bookingAmount || 10000)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Remaining: </span>
                            <span className="font-semibold text-gray-900">
                              {formatPrice(booking.remainingAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {booking.car && (
                        <Link
                          href={`/cars/${booking.car._id}`}
                          className="btn-secondary text-sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Car
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
