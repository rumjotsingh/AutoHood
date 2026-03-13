"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8 pb-20 md:pb-8">
        <div className="flex items-center space-x-3 mb-6">
          <ShoppingCart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to get started!</p>
            <Link href="/parts" className="btn-primary inline-block">
              Browse Parts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center p-6 border-b last:border-b-0">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    <div className="flex-1 ml-6">
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-primary font-bold">{formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-x">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18%)</span>
                    <span className="font-semibold">{formatPrice(total * 0.18)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary">{formatPrice(total * 1.18)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="block w-full btn-primary text-center">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
