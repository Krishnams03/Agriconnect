import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Order from "@/lib/models/Order";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/agriconnect";

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB(); // Ensure DB is connected

  if (req.method === "GET") {
    try {
      const orders = await Order.find(); // Fetch all orders from DB
      return res.status(200).json(orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ message: "Error fetching orders" });
    }
  } else if (req.method === "POST") {
    try {
      const { userId, items } = req.body;
      if (!userId || !items || items.length === 0) {
        return res.status(400).json({ message: "Invalid order data" });
      }

      const newOrder = new Order({ userId, items, status: "Pending" });
      await newOrder.save(); // Save order to DB

      return res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (err) {
      console.error("Error saving order:", err);
      return res.status(500).json({ message: "Error saving order" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
