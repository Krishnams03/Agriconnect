"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, ShieldCheck, Zap, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface PaymentMethod {
  type: string;
  label: string;
  description: string;
  badge?: string;
  icon: LucideIcon;
}

const paymentMethods: PaymentMethod[] = [
  {
    type: "debit",
    label: "Debit Card",
    description: "Instant settlement with OTP verification from any major bank.",
    badge: "Most used",
    icon: CreditCard
  },
  {
    type: "credit",
    label: "Credit Card",
    description: "Split payments and unlock seasonal cashback with partner banks.",
    badge: "Cashback enabled",
    icon: Wallet
  }
];

export default function SelectCardPage() {
  const router = useRouter();

  const handleCardSelection = (cardType: string) => {
    router.push(`/payment/card-details?type=${cardType}`);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-700 to-lime-500">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-12 text-white">
        <header className="flex flex-col gap-4 text-center">
          <p className="mx-auto inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-widest">
            <Zap className="mr-2 h-4 w-4" /> Secure checkout desk
          </p>
          <h1 className="text-3xl font-semibold lg:text-4xl">Choose how you would like to settle this order.</h1>
          <p className="mx-auto max-w-3xl text-emerald-50">
            Card payments unlock instant dispatch. We tokenise your details, run bank-grade security, and send confirmed invoices immediately.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="grid gap-6 md:grid-cols-2">
            {paymentMethods.map(method => (
              <Card
                key={method.type}
                className="group flex flex-col justify-between rounded-2xl border border-white/30 bg-white/10 p-6 text-white backdrop-blur"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-white/15 p-3">
                        <method.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-2xl font-semibold text-white">
                        {method.label}
                      </CardTitle>
                    </div>
                    {method.badge && <Badge variant="secondary" className="bg-white/20 text-white">{method.badge}</Badge>}
                  </div>
                  <p className="mt-4 text-sm text-emerald-50">{method.description}</p>
                </div>
                <Button
                  onClick={() => handleCardSelection(method.type)}
                  className="mt-6 inline-flex items-center justify-center bg-white text-emerald-700 hover:bg-emerald-50"
                >
                  Continue with {method.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>

          <Card className="rounded-3xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur">
            <CardHeader className="space-y-2 p-0">
              <CardTitle className="text-xl">Payment assurance</CardTitle>
              <p className="text-sm text-emerald-50">Layered checks ensure compliance with RBI guidelines.</p>
            </CardHeader>
            <CardContent className="mt-4 space-y-4 p-0 text-sm text-emerald-50">
              {["OTP and CVV verified instantly", "Encrypted card vault powered by Razorpay", "GST invoice shared after success"].map(point => (
                <div key={point} className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-white" />
                  {point}
                </div>
              ))}
            </CardContent>
            <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm text-emerald-50">
              Need assistance? <Link href="mailto:support@agriconnect.in" className="font-semibold text-white">support@agriconnect.in</Link>
            </div>
          </Card>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {["Instant bank confirmation", "Dedicated finance manager", "Automated receipt and ledger copy"].map(highlight => (
            <div key={highlight} className="rounded-2xl border border-white/20 bg-white/5 p-4 text-sm text-emerald-50">
              <Sparkles className="mb-2 h-4 w-4 text-white" />
              {highlight}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
