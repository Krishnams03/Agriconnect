import mongoose, { Schema, Document } from "mongoose";

interface IOrder extends Document {
  userId: string;
  items: { name: string; quantity: number; price: number }[];
  status: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
