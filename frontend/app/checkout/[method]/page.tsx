"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PaymentForm() {
  const router = useRouter();
  const { method } = useParams<{ method: string }>();

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = () => {
    if (!cardNumber || !expiryDate || !cvv) {
      alert("Please fill in all card details.");
      return;
    }

    // Mock processing payment and updating orders
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const newOrder = {
      id: Date.now(),
      items: JSON.parse(localStorage.getItem("cart") || "[]"),
      status: "Processing",
    };

    localStorage.setItem("orders", JSON.stringify([...orders, newOrder]));
    localStorage.removeItem("cart"); // Clear cart

    alert("Payment successful! Your order is now processing.");
    router.push("/orders");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Pay with {method === "debit" ? "Debit" : "Credit"} Card</h1>
      <div className="w-full max-w-md space-y-4">
        <Input
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
        <Input
          placeholder="Expiry Date (MM/YY)"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
        <Input
          placeholder="CVV"
          type="password"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
        />
        <Button onClick={handlePayment} className="w-full">
          Pay Now
        </Button>
      </div>
    </div>
  );
}
