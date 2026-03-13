"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { FileText, Shield, AlertCircle, Scale, UserCheck, Ban } from "lucide-react";

export default function TermsPage() {
  useEffect(() => {
    document.title = "Terms & Conditions | AutoHood";
  }, []);

  const sections = [
    {
      icon: UserCheck,
      title: "1. Acceptance of Terms",
      content: [
        "By accessing and using AutoHood, you accept and agree to be bound by these Terms and Conditions.",
        "If you do not agree to these terms, please do not use our platform.",
        "We reserve the right to modify these terms at any time. Continued use constitutes acceptance of modified terms.",
        "You must be at least 18 years old to use our services.",
      ],
    },
    {
      icon: Shield,
      title: "2. User Accounts",
      content: [
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You must provide accurate and complete information during registration.",
        "You are responsible for all activities that occur under your account.",
        "Notify us immediately of any unauthorized use of your account.",
        "We reserve the right to suspend or terminate accounts that violate our terms.",
      ],
    },
    {
      icon: FileText,
      title: "3. Buyer Responsibilities",
      content: [
        "Buyers must conduct due diligence before purchasing any vehicle.",
        "Inspect vehicles thoroughly before finalizing any transaction.",
        "Verify all documentation and ownership details.",
        "Payment must be made through AutoHood's secure payment system.",
        "Report any issues or discrepancies immediately to our support team.",
      ],
    },
    {
      icon: Scale,
      title: "4. Dealer Responsibilities",
      content: [
        "Dealers must be verified and provide valid business documentation.",
        "All vehicle listings must be accurate and include complete information.",
        "Dealers must disclose any known defects or issues with vehicles.",
        "Dealers are responsible for the accuracy of pricing and availability.",
        "Dealers must respond to buyer inquiries in a timely manner.",
        "Fraudulent listings will result in immediate account termination.",
      ],
    },
    {
      icon: AlertCircle,
      title: "5. Prohibited Activities",
      content: [
        "Posting false, misleading, or fraudulent listings.",
        "Attempting to circumvent our payment system.",
        "Harassing, threatening, or abusing other users.",
        "Using the platform for any illegal activities.",
        "Scraping or copying content without permission.",
        "Creating multiple accounts to manipulate reviews or ratings.",
        "Selling stolen or illegally obtained vehicles.",
      ],
    },
    {
      icon: FileText,
      title: "6. Transactions & Payments",
      content: [
        "All transactions must be conducted through AutoHood's platform.",
        "We use secure third-party payment processors (Razorpay).",
        "Transaction fees may apply as per our pricing policy.",
        "Refunds are subject to our refund policy and dealer terms.",
        "We are not responsible for disputes between buyers and dealers.",
        "Keep all transaction records for your reference.",
      ],
    },
    {
      icon: Shield,
      title: "7. Intellectual Property",
      content: [
        "All content on AutoHood is protected by copyright and trademark laws.",
        "You may not copy, reproduce, or distribute our content without permission.",
        "User-generated content remains the property of the user but grants us license to use it.",
        "We respect intellectual property rights and expect users to do the same.",
      ],
    },
    {
      icon: Ban,
      title: "8. Limitation of Liability",
      content: [
        "AutoHood acts as a marketplace platform connecting buyers and dealers.",
        "We do not own, sell, or guarantee any vehicles listed on our platform.",
        "We are not responsible for the quality, safety, or legality of vehicles.",
        "Users engage in transactions at their own risk.",
        "We are not liable for any direct, indirect, or consequential damages.",
        "Our total liability is limited to the fees paid by you in the past 12 months.",
      ],
    },
    {
      icon: AlertCircle,
      title: "9. Dispute Resolution",
      content: [
        "We encourage users to resolve disputes amicably.",
        "Contact our support team for assistance with disputes.",
        "Disputes will be governed by the laws of India.",
        "Any legal proceedings must be conducted in Mumbai, Maharashtra courts.",
        "We may provide mediation services but are not obligated to do so.",
      ],
    },
    {
      icon: FileText,
      title: "10. Termination",
      content: [
        "We reserve the right to suspend or terminate accounts without notice.",
        "Violations of these terms may result in immediate termination.",
        "You may close your account at any time through account settings.",
        "Upon termination, your right to use the platform ceases immediately.",
        "Certain provisions of these terms survive termination.",
      ],
    },
    {
      icon: Shield,
      title: "11. Privacy & Data Protection",
      content: [
        "Your use of AutoHood is also governed by our Privacy Policy.",
        "We collect and process data as described in our Privacy Policy.",
        "We implement security measures to protect your information.",
        "You have rights regarding your personal data as per applicable laws.",
      ],
    },
    {
      icon: Scale,
      title: "12. Modifications to Service",
      content: [
        "We reserve the right to modify or discontinue services at any time.",
        "We may update features, pricing, or policies without prior notice.",
        "Continued use after modifications constitutes acceptance.",
        "We are not liable for any modifications or discontinuation of services.",
      ],
    },
  ];

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
            <Scale className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Terms & Conditions</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Please read these terms carefully before using AutoHood
            </p>
            <p className="text-sm text-blue-200 mt-4">Last updated: March 12, 2026</p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to AutoHood</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              These Terms and Conditions ("Terms") govern your access to and use of the AutoHood platform, 
              including our website, mobile applications, and related services (collectively, the "Services"). 
              AutoHood operates as a marketplace connecting vehicle buyers with verified dealers.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using our Services, you agree to comply with and be bound by these Terms. If you do not agree 
              with any part of these Terms, you must not use our Services.
            </p>
          </motion.div>

          {/* Terms Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.content.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-3 text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-8 mt-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-4">Questions About These Terms?</h3>
            <p className="mb-6">
              If you have any questions or concerns about our Terms and Conditions, please contact our legal team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all"
              >
                Contact Us
              </a>
              <a
                href="mailto:legal@autohood.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                legal@autohood.com
              </a>
            </div>
          </motion.div>

          {/* Acceptance Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-8"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Important Notice</h4>
                <p className="text-gray-600 text-sm">
                  By continuing to use AutoHood, you acknowledge that you have read, understood, and agree to be 
                  bound by these Terms and Conditions. These terms constitute a legally binding agreement between 
                  you and AutoHood.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
