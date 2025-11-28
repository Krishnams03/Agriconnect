"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string; // MongoDB ObjectId
  items: OrderItem[];
  status: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/orders"); // Ensure backend is running

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }

        const data: Order[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }

        setOrders(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error fetching orders";
        setError(message);
        console.error("Fetch Orders Error:", err);
      } finally {
        setLoading(false);
      }
    };

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
          <p className="text-center text-gray-600">Loading orders...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders yet. Start shopping!</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order._id} className="border p-4 rounded-lg shadow bg-white">
                <h2 className="text-lg font-semibold">Order #{order._id}</h2>
                <p className="text-gray-600">Status: {order.status}</p>
                <ul className="list-disc ml-6 mt-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="text-gray-800">
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
