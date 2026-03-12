"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { carsAPI, api } from "@/lib/api";
import Image from "next/image";
import Script from "next/script";
import { Heart, Share2, MapPin, Fuel, Gauge, Calendar, Settings, ShoppingCart, X, CreditCard } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore, useAuthStore, useCartStore } from "@/store/useStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const { data: carData, isLoading } = useQuery({
    queryKey: ["car", id],
    queryFn: () => carsAPI.getById(id),
  });

  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const { isAuthenticated, user } = useAuthStore();
  const { addItem: addToCart } = useCartStore();
  const car = carData?.data?.data;
  const inWishlist = car ? isInWishlist(car._id) : false;

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      router.push("/login");
      return;
    }
    
    if (inWishlist) {
      removeItem(car._id);
      toast.success("Removed from wishlist");
    } else {
      addItem(car._id);
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }
    
    addToCart({
      id: car._id,
      name: car.title,
      price: car.price,
      quantity: 1,
      image: car.images?.[0]?.url || car.images?.[0] || "",
      type: "car",
    });
    toast.success("Added to cart");
  };

  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [testDriveData, setTestDriveData] = useState({
    preferredDate: "",
    preferredTime: "",
    contactName: user?.name || "",
    contactEmail: user?.email || "",
    contactPhone: "",
    message: "",
  });

  const handleBookTestDrive = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to book a test drive");
      router.push("/login");
      return;
    }
    // Pre-fill user data
    setTestDriveData({
      ...testDriveData,
      contactName: user?.name || "",
      contactEmail: user?.email || "",
    });
    setShowTestDriveModal(true);
  };

  const submitTestDrive = async () => {
    // Validate required fields
    if (!testDriveData.contactName || !testDriveData.contactEmail || !testDriveData.contactPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(testDriveData.contactPhone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    try {
      await api.post("/test-drives", {
        car: car._id,
        preferredDate: testDriveData.preferredDate,
        preferredTime: testDriveData.preferredTime,
        contactName: testDriveData.contactName,
        contactEmail: testDriveData.contactEmail,
        contactPhone: testDriveData.contactPhone,
        notes: {
          customer: testDriveData.message,
        },
      });
      toast.success("Test drive booked successfully!");
      setShowTestDriveModal(false);
      setTestDriveData({ 
        preferredDate: "", 
        preferredTime: "", 
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        message: "" 
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to book test drive");
    }
  };

  // Booking functions
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    customerName: user?.name || "",
    customerEmail: user?.email || "",
    customerPhone: "",
    notes: "",
  });

  const handleBookCar = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book this car");
      router.push("/login");
      return;
    }
    setBookingData({
      customerName: user?.name || "",
      customerEmail: user?.email || "",
      customerPhone: "",
      notes: "",
    });
    setShowBookingModal(true);
  };

  const submitBooking = async () => {
    if (!bookingData.customerName || !bookingData.customerEmail || !bookingData.customerPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(bookingData.customerPhone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setBookingLoading(true);
    try {
      // Fixed booking amount of ₹10,000
      const bookingAmount = 10000;

      // Create booking order
      const orderResponse = await api.post("/bookings/create-order", {
        carId: car._id,
        bookingAmount,
        customerDetails: {
          name: bookingData.customerName,
          email: bookingData.customerEmail,
          phone: bookingData.customerPhone,
        },
        notes: bookingData.notes,
      });

      const { booking, razorpayOrder } = orderResponse.data.data;

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SPxIn27ZXX76fe",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "AutoHood",
        description: `Booking for ${car.title}`,
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            await api.post("/bookings/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            });
            toast.success("Booking confirmed! Seller will contact you soon.");
            setShowBookingModal(false);
            router.push("/orders");
          } catch (error) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: bookingData.customerName,
          email: bookingData.customerEmail,
          contact: bookingData.customerPhone,
        },
        theme: {
          color: "#2563EB",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create booking");
    } finally {
      setBookingLoading(false);
    }
  };

  const [bookingLoading, setBookingLoading] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: car.title,
        text: `Check out this ${car.title} on AutoHood`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Car not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative h-96">
                <Image
                  src={car.images?.[0]?.url || car.images?.[0] || "/placeholder-car.jpg"}
                  alt={car.title}
                  fill
                  className="object-cover"
                />
              </div>
              {car.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {car.images.slice(1, 5).map((img: any, idx: number) => (
                    <div key={idx} className="relative h-24">
                      <Image src={img?.url || img} alt={`${car.title} ${idx + 1}`} fill className="object-cover rounded" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{car.title}</h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{car.location?.city}, {car.location?.state}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleWishlist}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                  <button 
                    onClick={handleShare}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Gauge className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">KM Driven</p>
                    <p className="font-semibold">{car.kmDriven?.toLocaleString() || car.mileage?.toLocaleString() || "N/A"} km</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Fuel className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-semibold capitalize">{car.fuelType || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Transmission</p>
                    <p className="font-semibold capitalize">{car.transmission || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-semibold">{car.year || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600">{car.description || "No description available"}</p>
              </div>

              {car.features && car.features.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4">Features</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {car.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <p className="text-3xl font-bold text-primary mb-6">
                {formatPrice(car.price)}
              </p>

              <div className="space-y-3">
                <button 
                  onClick={handleBookCar}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Book Now (₹10,000 Token)</span>
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button 
                  onClick={handleBookTestDrive}
                  className="w-full py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition"
                >
                  Book Test Drive
                </button>
                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error("Please login to contact dealer");
                      router.push("/login");
                      return;
                    }
                    toast.success("Contact dealer feature coming soon!");
                  }}
                  className="w-full py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Contact Dealer
                </button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-green-800 mb-2">Token Booking Available</h3>
                  <p className="text-sm text-green-700">
                    Book this car with just ₹10,000 token amount
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    Remaining {formatPrice(car.price - 10000)} payable offline to dealer
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Dealer Information</h3>
                <p className="text-gray-600 text-sm">
                  {car.owner?.name || "Verified Dealer"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Drive Modal */}
      {showTestDriveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Book Test Drive</h3>
              <button
                onClick={() => setShowTestDriveModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={testDriveData.contactName}
                  onChange={(e) =>
                    setTestDriveData({ ...testDriveData, contactName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={testDriveData.contactEmail}
                  onChange={(e) =>
                    setTestDriveData({ ...testDriveData, contactEmail: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={testDriveData.contactPhone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setTestDriveData({ ...testDriveData, contactPhone: value });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="9876543210"
                />
                <p className="text-xs text-gray-500 mt-1">Enter 10 digit mobile number</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={testDriveData.preferredDate}
                  onChange={(e) =>
                    setTestDriveData({ ...testDriveData, preferredDate: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <select
                  required
                  value={testDriveData.preferredTime}
                  onChange={(e) =>
                    setTestDriveData({ ...testDriveData, preferredTime: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select time</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  rows={3}
                  value={testDriveData.message}
                  onChange={(e) =>
                    setTestDriveData({ ...testDriveData, message: e.target.value })
                  }
                  placeholder="Any specific requirements or questions..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowTestDriveModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitTestDrive}
                  disabled={
                    !testDriveData.preferredDate || 
                    !testDriveData.preferredTime || 
                    !testDriveData.contactName || 
                    !testDriveData.contactEmail || 
                    !testDriveData.contactPhone ||
                    testDriveData.contactPhone.length !== 10
                  }
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Book This Car</h2>
                  <p className="text-sm text-gray-600 mt-1">Pay 10% token amount online</p>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Car Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">{car.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Car Price</p>
                    <p className="font-bold text-lg">{formatPrice(car.price)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Booking Amount (Token)</p>
                    <p className="font-bold text-lg text-green-600">{formatPrice(10000)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Remaining Amount (Offline)</p>
                    <p className="font-semibold text-orange-600">{formatPrice(car.price - 10000)}</p>
                  </div>
                </div>
              </div>

              {/* Customer Details Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingData.customerName}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, customerName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingData.customerEmail}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, customerEmail: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={bookingData.customerPhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setBookingData({ ...bookingData, customerPhone: value });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="9876543210"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter 10 digit mobile number</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={bookingData.notes}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, notes: e.target.value })
                    }
                    placeholder="Any specific requirements or questions..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• You will pay {formatPrice(10000)} online as booking token</li>
                    <li>• Remaining {formatPrice(car.price - 10000)} to be paid offline to dealer</li>
                    <li>• Seller will contact you within 24 hours</li>
                    <li>• Booking is non-refundable once confirmed</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    disabled={bookingLoading}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitBooking}
                    disabled={
                      bookingLoading ||
                      !bookingData.customerName ||
                      !bookingData.customerEmail ||
                      !bookingData.customerPhone ||
                      bookingData.customerPhone.length !== 10
                    }
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {bookingLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Pay {formatPrice(10000)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Load Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </div>
  );
}
