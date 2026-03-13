"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Search, MessageCircle, Book, Shield, CreditCard, Truck } from "lucide-react";

export default function HelpPage() {
  useEffect(() => {
    document.title = "Help Center | AutoHood";
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    { icon: Book, title: "Getting Started", color: "from-blue-500 to-cyan-500" },
    { icon: CreditCard, title: "Payments", color: "from-green-500 to-emerald-500" },
    { icon: Truck, title: "Delivery", color: "from-orange-500 to-red-500" },
    { icon: Shield, title: "Safety & Security", color: "from-purple-500 to-pink-500" },
  ];

  const faqs = [
    {
      category: "Getting Started",
      question: "How do I create an account on AutoHood?",
      answer: "Creating an account is simple! Click on the 'Sign Up' button in the top right corner, fill in your details (name, email, phone, and password), choose your account type (Buyer or Dealer), and click 'Create Account'. You'll receive a verification email to activate your account.",
    },
    {
      category: "Getting Started",
      question: "What's the difference between Buyer and Dealer accounts?",
      answer: "Buyer accounts are for individuals looking to purchase vehicles. Dealer accounts are for verified automotive dealers who want to list and sell vehicles on our platform. Dealers get access to additional features like inventory management, analytics, and lead tracking.",
    },
    {
      category: "Getting Started",
      question: "How do I search for cars?",
      answer: "Use the search bar on the homepage or navigate to the 'Cars' section. You can filter by brand, price range, fuel type, transmission, body type, and location. Save your favorite searches to get notifications when new matching vehicles are listed.",
    },
    {
      category: "Payments",
      question: "What payment methods do you accept?",
      answer: "We accept multiple payment methods including UPI, Credit/Debit Cards, Net Banking, and various digital wallets through our secure payment partner Razorpay. All transactions are encrypted and secure.",
    },
    {
      category: "Payments",
      question: "Is my payment information secure?",
      answer: "Absolutely! We use industry-standard SSL encryption and partner with Razorpay, a PCI-DSS compliant payment gateway. We never store your complete card details on our servers. All sensitive payment information is handled securely by our payment partners.",
    },
    {
      category: "Payments",
      question: "Can I get a refund if I change my mind?",
      answer: "Refund policies vary depending on the dealer and the stage of the transaction. Generally, booking amounts are refundable within 24-48 hours if the vehicle hasn't been reserved. Please check the specific dealer's refund policy before making a payment.",
    },
    {
      category: "Delivery",
      question: "How long does delivery take?",
      answer: "Delivery timelines vary based on your location and the dealer. Typically, vehicles are delivered within 7-15 business days after all documentation is complete. You'll receive regular updates about your delivery status via email and SMS.",
    },
    {
      category: "Delivery",
      question: "Can I inspect the vehicle before taking delivery?",
      answer: "Yes! We highly recommend inspecting the vehicle before accepting delivery. You can also book a test drive before making a purchase decision. If the vehicle doesn't match the description or has undisclosed issues, you can refuse delivery.",
    },
    {
      category: "Delivery",
      question: "What documents will I receive with the vehicle?",
      answer: "You'll receive the Registration Certificate (RC), Insurance papers, Pollution Under Control (PUC) certificate, Service history (if available), and a Bill of Sale. For financed vehicles, the RC will show the lender's hypothecation until the loan is paid off.",
    },
    {
      category: "Safety & Security",
      question: "How do you verify dealers?",
      answer: "All dealers undergo a strict verification process including business license verification, GST registration check, physical address verification, and background checks. Only verified dealers can list vehicles on AutoHood.",
    },
    {
      category: "Safety & Security",
      question: "What if I encounter a fraudulent listing?",
      answer: "Report it immediately using the 'Report' button on the listing page or contact our support team. We take fraud very seriously and will investigate all reports promptly. Verified dealers who engage in fraudulent activities are permanently banned from the platform.",
    },
    {
      category: "Safety & Security",
      question: "How can I ensure a safe transaction?",
      answer: "Always use AutoHood's secure payment system, never share personal banking details directly with dealers, verify all vehicle documents, conduct a thorough inspection, and keep all communication within the platform for your protection.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <HelpCircle className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Help Center</h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Find answers to frequently asked questions
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-16">
        {/* Categories */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-center group cursor-pointer"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">{category.title}</h3>
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-blue-600 mb-1 block">{faq.category}</span>
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-4 ${
                      openIndex === index ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No results found. Try a different search term.</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mt-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-8 text-white text-center"
        >
          <MessageCircle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Still Need Help?</h3>
          <p className="mb-6 text-blue-100">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  );
}
