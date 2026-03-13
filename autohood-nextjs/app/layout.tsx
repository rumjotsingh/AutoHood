import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "AutoHood - Premium Automotive Marketplace",
    template: "%s | AutoHood",
  },
  description: "Discover thousands of cars and genuine parts from trusted dealers. India's most trusted automotive marketplace with verified dealers and secure transactions.",
  keywords: ["cars", "automotive", "marketplace", "buy cars", "sell cars", "car dealers", "auto parts", "vehicles", "India"],
  authors: [{ name: "AutoHood" }],
  creator: "AutoHood",
  publisher: "AutoHood",
  metadataBase: new URL("https://autohood.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://autohood.com",
    title: "AutoHood - Premium Automotive Marketplace",
    description: "Discover thousands of cars and genuine parts from trusted dealers",
    siteName: "AutoHood",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoHood - Premium Automotive Marketplace",
    description: "Discover thousands of cars and genuine parts from trusted dealers",
    creator: "@autohood",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <Footer />
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
