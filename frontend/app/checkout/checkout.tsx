"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Checkout() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"debit" | "credit" | null>(null);

  const handleProceed = () => {
    if (!paymentMethod) return alert("Please select a payment method.");
    router.push(`/checkout/${paymentMethod}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Choose Payment Method</h1>
      <div className="flex space-x-4">
        <Button
          variant={paymentMethod === "debit" ? "default" : "outline"}
          onClick={() => setPaymentMethod("debit")}
        >
          Debit Card
        </Button>
        <Button
          variant={paymentMethod === "credit" ? "default" : "outline"}
          onClick={() => setPaymentMethod("credit")}
        >
          Credit Card
        </Button>
      </div>
      <Button onClick={handleProceed} className="mt-6">
        Proceed
      </Button>
    </div>
  );
}
