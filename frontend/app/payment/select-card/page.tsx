"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SelectCardPage() {
  const router = useRouter();

  const handleCardSelection = (cardType: string) => {
    router.push(`/payment/card-details?type=${cardType}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-green-800">
            Select Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <Button
            onClick={() => handleCardSelection("debit")}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Pay with Debit Card
          </Button>
          <Button
            onClick={() => handleCardSelection("credit")}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Pay with Credit Card
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
