"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

export default function CardDetailsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <CardDetailsContent />
    </Suspense>
  );
}

function CardDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cardType, setCardType] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    if (!searchParams) return;

    const type = searchParams.get("type");
    if (!type) {
      router.push("/payment/select-card");
    } else {
      setCardType(type);
    }
  }, [searchParams, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayNow = () => {
    const { number, expiry, cvv } = cardDetails;

    if (!number || !expiry || !cvv) {
      toast({
        title: "Missing Details",
        description: "Please fill in all card details.",
        variant: "destructive",
      });
      return;
    }

    // Save order to localStorage
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");

    const newOrder = {
      id: Date.now().toString(),
      status: "Success",
      date: new Date().toISOString(),
      items: cartItems,
      total: cartItems.reduce((sum: number, item: any) => {
        const discountedPrice = item.price * (1 - item.discount);
        return sum + discountedPrice * item.quantity;
      }, 0),
    };

    localStorage.setItem("orders", JSON.stringify([...existingOrders, newOrder]));
    localStorage.removeItem("cart");

    toast({
      title: "Payment Successful",
      description: "Your order has been placed successfully!",
      variant: "default",
    });

    router.push("/marketplace");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-green-800">
            Enter {cardType?.toUpperCase()} Card Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Card Number"
            name="number"
            value={cardDetails.number}
            onChange={handleInputChange}
            maxLength={16}
          />
          <Input
            type="text"
            placeholder="Expiry Date (MM/YY)"
            name="expiry"
            value={cardDetails.expiry}
            onChange={handleInputChange}
            maxLength={5}
          />
          <Input
            type="password"
            placeholder="CVV"
            name="cvv"
            value={cardDetails.cvv}
            onChange={handleInputChange}
            maxLength={3}
          />
        </CardContent>
        <CardFooter>
          <Button
            onClick={handlePayNow}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Pay Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
