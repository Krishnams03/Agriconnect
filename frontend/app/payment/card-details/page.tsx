"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { ShieldCheck, CreditCard, Lock, Sparkles } from "lucide-react";

interface CartPreviewItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  discount: number;
}

interface StoredOrder {
  id: string;
  status: string;
  date: string;
  items: CartPreviewItem[];
  total: number;
}

const parseJsonArray = <T,>(value: string | null): T[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

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
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [cartPreview, setCartPreview] = useState<CartPreviewItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!searchParams) return;

    const type = searchParams.get("type");
    if (!type) {
      router.push("/payment/select-card");
    } else {
      setCardType(type);
    }
  }, [searchParams, router]);

  useEffect(() => {
    try {
      const parsedCart = parseJsonArray<CartPreviewItem>(localStorage.getItem("cart"));
      setCartPreview(parsedCart);
    } catch (error: unknown) {
      console.error("Error reading cart preview", error);
    }
  }, []);

  const grossTotal = cartPreview.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = cartPreview.reduce((sum, item) => sum + item.price * item.discount * item.quantity, 0);
  const amountDue = Math.max(0, grossTotal - savings);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayNow = () => {
    const { number, expiry, cvv } = cardDetails;

    if (!cardDetails.name || !number || !expiry || !cvv) {
      toast({
        title: "Missing Details",
        description: "Please fill in all card details.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const cartItems = parseJsonArray<CartPreviewItem>(localStorage.getItem("cart"));
      const existingOrders = parseJsonArray<StoredOrder>(localStorage.getItem("orders"));

      const payableAmount = cartItems.reduce((sum, item) => {
        const discountedPrice = item.price * (1 - item.discount);
        return sum + discountedPrice * item.quantity;
      }, 0);

      const newOrder: StoredOrder = {
        id: Date.now().toString(),
        status: "Success",
        date: new Date().toISOString(),
        items: cartItems,
        total: payableAmount,
      };

      localStorage.setItem("orders", JSON.stringify([...existingOrders, newOrder]));
      localStorage.removeItem("cart");

      toast({
        title: "Payment successful",
        description: `Charged ${formatCurrency(payableAmount)}. Receipt shared on email.`,
        variant: "default",
      });

      router.push("/orders");
    } catch (error: unknown) {
      console.error("Payment persistence failed", error);
      toast({
        title: "Unable to save order",
        description: "Please retry in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-700 to-lime-500">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_60%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-12 text-white">
        <header className="text-center">
          <p className="mx-auto inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-widest">
            <CreditCard className="mr-2 h-4 w-4" /> Secure {cardType?.toUpperCase() || "CARD"} payment
          </p>
          <h1 className="mt-4 text-3xl font-semibold lg:text-4xl">Verify your card to dispatch the order.</h1>
          <p className="mx-auto mt-2 max-w-2xl text-emerald-50">We never store sensitive data. RBI compliant tokenisation keeps your cards safe while ensuring instant settlement.</p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-3xl border border-white/20 bg-white p-8 text-emerald-900 shadow-xl">
            <CardHeader className="space-y-2 p-0">
              <CardTitle className="text-2xl text-emerald-900">Card verification</CardTitle>
              <p className="text-sm text-emerald-600">Enter the credentials exactly as printed on your card.</p>
            </CardHeader>
            <CardContent className="mt-6 space-y-5 p-0">
              <div>
                <label className="text-sm font-semibold text-emerald-900">Cardholder name</label>
                <Input
                  className="mt-2"
                  type="text"
                  placeholder="Name on card"
                  name="name"
                  value={cardDetails.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-emerald-900">Card number</label>
                <Input
                  className="mt-2"
                  type="text"
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  name="number"
                  value={cardDetails.number}
                  onChange={handleInputChange}
                  maxLength={16}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-emerald-900">Expiry date</label>
                  <Input
                    className="mt-2"
                    type="text"
                    placeholder="MM/YY"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={handleInputChange}
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-emerald-900">CVV</label>
                  <Input
                    className="mt-2"
                    type="password"
                    placeholder="123"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    maxLength={3}
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-700">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4" /> RBI compliant tokenisation
                </div>
                <p className="mt-1 text-xs">OTP will be requested by your bank on the next screen.</p>
              </div>
              <Button
                onClick={handlePayNow}
                disabled={isProcessing}
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {isProcessing ? "Processing..." : "Pay now"}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur">
              <CardHeader className="p-0">
                <CardTitle className="text-xl">Order summary</CardTitle>
              </CardHeader>
              <CardContent className="mt-4 space-y-4 p-0 text-sm text-emerald-50">
                <div className="flex items-center justify-between">
                  <span>Gross</span>
                  <span>{formatCurrency(grossTotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Savings</span>
                  <span>- {formatCurrency(savings)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/20 pt-4 text-base font-semibold text-white">
                  <span>Amount due</span>
                  <span>{formatCurrency(amountDue)}</span>
                </div>
                <div className="pt-2 text-xs text-emerald-100">GST inclusive where applicable.</div>
                <div className="rounded-2xl border border-white/20 p-3 text-xs">
                  {cartPreview.length === 0 ? "Cart data unavailable" : `${cartPreview.length} items ready for dispatch.`}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur">
              <CardHeader className="p-0">
                <CardTitle className="text-xl">Security & assistance</CardTitle>
              </CardHeader>
              <CardContent className="mt-4 space-y-3 p-0 text-sm text-emerald-50">
                {[
                  "PCI-DSS compliant processing",
                  "Encrypted data tunnel",
                  "Dedicated finance desk helpline +91 80471 12345"
                ].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-white" />
                    {item}
                  </div>
                ))}
                <div className="mt-4 rounded-2xl border border-white/25 p-4 text-sm">
                  <div className="flex items-center gap-2 font-semibold">
                    <Sparkles className="h-4 w-4" /> Need help?
                  </div>
                  <p className="text-xs text-emerald-50">Email finance@agriconnect.in or ping your relationship manager.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
