import { Check, Users, Shield, Award, TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Us - AutoHood",
  description: "Learn about AutoHood, India's premier automotive marketplace",
};

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Every dealer is verified and every vehicle is inspected for quality",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your satisfaction is our priority with 24/7 support",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Only the best vehicles and parts make it to our platform",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Leveraging technology to make car buying seamless",
    },
  ];

  const stats = [
    { label: "Happy Customers", value: "50,000+" },
    { label: "Cars Sold", value: "10,000+" },
    { label: "Verified Dealers", value: "500+" },
    { label: "Cities Covered", value: "100+" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Revolutionizing car buying in India
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AutoHood is India's most trusted automotive marketplace, connecting buyers with verified dealers and quality vehicles.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-gray-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
            <div className="prose prose-lg text-gray-600 space-y-4">
              <p>
                Founded in 2024, AutoHood was born from a simple idea: make car buying transparent, trustworthy, and hassle-free for everyone in India.
              </p>
              <p>
                We recognized that buying a car is one of the biggest financial decisions people make, yet the process was often complicated, time-consuming, and filled with uncertainty.
              </p>
              <p>
                Today, we're proud to be India's fastest-growing automotive marketplace, serving thousands of customers across 100+ cities with our network of verified dealers and quality vehicles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600">What drives us every day</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to find your dream car?
          </h2>
          <Link href="/cars" className="btn-primary text-lg px-8 py-4">
            Browse cars
          </Link>
        </div>
      </section>
    </div>
  );
}
