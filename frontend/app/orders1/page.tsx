"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";

interface Order {
  _id: string;  // Updated to match MongoDB ObjectId
  items: { name: string; quantity: number; price: number }[];
  status: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/orders"); // Use Next.js API route
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (err) {
        setError("Error fetching orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navbar */}
      <header className="bg-green-800 text-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center hover:text-green-300">
            <Leaf className="mr-2" />
            AgriConnect
          </Link>
          <div className="space-x-4">
            <Link href="/marketplace" className="text-white hover:text-green-300">
              Marketplace
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p>No orders yet. Start shopping!</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order._id} className="border p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Order #{order._id}</h2>
                <p>Status: {order.status}</p>
                <ul className="list-disc ml-6 mt-2">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} - {item.quantity} x ₹{item.price}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
