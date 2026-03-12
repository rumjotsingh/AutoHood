"use client";

import { motion } from "framer-motion";
import { Car, Users, Shield, Award, Target, Heart, TrendingUp, Globe } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Cars Listed", value: "10K+", icon: Car },
    { label: "Verified Dealers", value: "500+", icon: Shield },
    { label: "Cities Covered", value: "100+", icon: Globe },
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Every dealer is verified and every transaction is secure. Your safety is our priority.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "We put our customers at the heart of everything we do, ensuring the best experience.",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Only the best vehicles make it to our platform. Quality is never compromised.",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We constantly innovate to bring you the latest features and best user experience.",
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About AutoHood</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              India's most trusted automotive marketplace connecting buyers with verified dealers
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all"
            >
              <stat.icon className="w-10 h-10 mx-auto mb-3 text-blue-600" />
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              At AutoHood, we're on a mission to revolutionize the way people buy and sell vehicles in India. 
              We believe that finding your dream car should be simple, transparent, and trustworthy.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              By connecting verified dealers with genuine buyers, we create a marketplace where trust meets convenience, 
              making every transaction smooth and secure.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-4">Why Choose AutoHood?</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Shield className="w-6 h-6 flex-shrink-0 mt-1" />
                <span>100% verified dealers and secure transactions</span>
              </li>
              <li className="flex items-start space-x-3">
                <Award className="w-6 h-6 flex-shrink-0 mt-1" />
                <span>Wide selection of quality vehicles</span>
              </li>
              <li className="flex items-start space-x-3">
                <Heart className="w-6 h-6 flex-shrink-0 mt-1" />
                <span>Dedicated customer support</span>
              </li>
              <li className="flex items-start space-x-3">
                <TrendingUp className="w-6 h-6 flex-shrink-0 mt-1" />
                <span>Best prices and easy financing options</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at AutoHood
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
