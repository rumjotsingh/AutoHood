"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, UserCheck, Database } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal information (name, email, phone number) when you register",
        "Vehicle preferences and search history",
        "Transaction and payment information",
        "Device and browser information for analytics",
      ],
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "To provide and improve our services",
        "To process transactions and send notifications",
        "To personalize your experience",
        "To communicate important updates",
        "To prevent fraud and ensure security",
      ],
    },
    {
      icon: Shield,
      title: "Data Security",
      content: [
        "We use industry-standard encryption (SSL/TLS)",
        "Secure payment processing through verified gateways",
        "Regular security audits and updates",
        "Limited access to personal data by authorized personnel only",
      ],
    },
    {
      icon: Eye,
      title: "Information Sharing",
      content: [
        "We never sell your personal information",
        "Data shared with dealers only for transaction purposes",
        "Third-party services bound by confidentiality agreements",
        "Legal compliance when required by law",
      ],
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access and download your personal data",
        "Request correction of inaccurate information",
        "Delete your account and associated data",
        "Opt-out of marketing communications",
        "Control cookie preferences",
      ],
    },
    {
      icon: FileText,
      title: "Cookies & Tracking",
      content: [
        "Essential cookies for site functionality",
        "Analytics cookies to improve user experience",
        "Marketing cookies (with your consent)",
        "You can manage cookie preferences in settings",
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
            <Shield className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              At AutoHood, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. 
              Please read this policy carefully to understand our practices regarding your personal data.
            </p>
          </motion.div>

          {/* Policy Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
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
            <h3 className="text-2xl font-bold mb-4">Questions About Privacy?</h3>
            <p className="mb-6">
              If you have any questions or concerns about our Privacy Policy or how we handle your data, 
              please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all"
              >
                Contact Us
              </a>
              <a
                href="mailto:privacy@autohood.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                privacy@autohood.com
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
