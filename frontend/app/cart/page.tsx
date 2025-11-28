"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Leaf,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ShieldCheck,
  Truck,
  BadgePercent,
  Gift,
  CheckCircle2,
  Clock,
  MessageSquare,
  Phone
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";

const assuranceHighlights: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: "Quality checked harvests",
    description: "Every lot is inspected by regional agronomists before dispatch.",
    icon: ShieldCheck
  },
  {
    title: "Cold-chain logistics",
    description: "Climate-controlled trucks keep perishables fresh across states.",
    icon: Truck
  },
  {
    title: "Marketplace savings",
    description: "Bulk sourcing protects you from 12-18% price swings each week.",
    icon: BadgePercent
  }
];

const membershipPerks = [
  {
    title: "Priority dispatch window",
    description: "Orders placed before 2 PM leave warehouses the same day."
  },
  {
    title: "Crop advisory voucher",
    description: "Redeem a complimentary agronomist call for orders above ₹5,000."
  },
  {
    title: "Bundled logistics credit",
    description: "We absorb rural delivery fees on every third shipment."
  }
];

const nextSteps = [
  {
    title: "Confirm delivery cluster",
    description: "Share mandi or FPO hub so we can plan the shortest cold-chain hop."
  },
  {
    title: "Select payment preference",
    description: "Cards, UPI and bank transfers are supported with instant receipts."
  },
  {
    title: "Track fulfilment",
    description: "Live telemetry pings when consignments are out for delivery."
  }
];

const supportChannels: Array<{ title: string; description: string; subtext: string; icon: LucideIcon }> = [
  {
    title: "Delivery desk",
    description: "Active 8 AM – 9 PM IST",
    subtext: "Slot confirmations shared over WhatsApp.",
    icon: Clock
  },
  {
    title: "Chat with sourcing",
    description: "Ask for bulk combos or soil inputs",
    subtext: "Live agents typically respond within 5 minutes.",
    icon: MessageSquare
  },
  {
    title: "Direct helpline",
    description: "+91 80471 12345",
    subtext: "Available during working hours.",
    icon: Phone
  }
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

// Define types for cart functionality
interface Product {
  id: number;
  name: string;
  type: string;
  price: number;
  unit: string;
  image: string;
  discount: number;
  rating: number;
  reviews: number;
}

interface CartItem extends Product {
  quantity: number;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const grossTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountSavings = cartItems.reduce(
    (total, item) => total + item.price * item.discount * item.quantity,
    0
  );
  const loyaltyCredit = cartItems.length ? Math.min(75, (grossTotal - discountSavings) * 0.03) : 0;
  const logisticsFee = cartItems.length ? (grossTotal > 3000 ? 0 : 45) : 0;
  const amountDue = Math.max(0, grossTotal - discountSavings - loyaltyCredit + logisticsFee);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const heroStats = [
    {
      label: "Items ready",
      value: totalItems || 0,
      helper: "awaiting dispatch"
    },
    {
      label: "Instant savings",
      value: discountSavings ? formatCurrency(discountSavings) : formatCurrency(0),
      helper: "marketplace protection"
    },
    {
      label: "Logistics fee",
      value: logisticsFee === 0 ? "Waived" : formatCurrency(logisticsFee),
      helper: "state-adjusted"
    }
  ];

  // Load cart items from localStorage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      toast({
        title: "Cart Error",
        description: "Unable to load cart items",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cartItems]);

  // Update quantity of an item
  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(currentItems => {
      if (newQuantity <= 0) {
        const updatedCart = currentItems.filter(item => item.id !== id);
        toast({
          title: "Item Removed",
          description: "Item removed from cart",
          variant: "default"
        });
        return updatedCart;
      }
      return currentItems.map(item =>
        item.id === id
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  // Remove specific item from cart
  const removeItem = (id: number) => {
    const itemToRemove = cartItems.find(item => item.id === id);

    setCartItems(currentItems =>
      currentItems.filter(item => item.id !== id)
    );

    toast({
      title: "Item Removed",
      description: `${itemToRemove?.name} removed from cart`,
      variant: "default"
    });
  };

  // Redirect to card selection
  const handleProceedToPayment = () => {
    router.push("/payment/select-card");
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-green-600 animate-pulse" />
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_65%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-32 mx-auto h-48 w-3/4 rounded-full bg-emerald-100/40 blur-3xl" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-emerald-100/80 bg-white/80 backdrop-blur">
          <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-semibold text-slate-900">
              <Leaf className="h-6 w-6 text-emerald-600" />
              AgriConnect
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="ghost" className="text-slate-600 hover:text-slate-900">
                <Link href="/marketplace">Marketplace</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-emerald-200/70 text-emerald-800 hover:bg-emerald-50"
              >
                <Link href="/orders">View orders</Link>
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleProceedToPayment}>
                Proceed to checkout
              </Button>
            </div>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 lg:px-6">
          <section className="relative mb-12 overflow-hidden rounded-[32px] border border-emerald-100/80 bg-white/90 shadow-[0_35px_90px_-50px_rgba(16,185,129,0.5)]">
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_60%)] lg:block" />
            <div className="relative grid gap-10 p-8 lg:grid-cols-[1.1fr,0.9fr] lg:p-12">
              <div className="space-y-6">
                <p className="inline-flex items-center rounded-full border border-emerald-200/60 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
                  Cart control
                </p>
                <h1 className="text-4xl font-semibold leading-tight text-slate-900 lg:text-5xl">
                  This cart mirrors the landing hero: clean typography, layered gradients, and procurement-grade polish.
                </h1>
                <p className="max-w-2xl text-lg text-slate-600">
                  Keep prices locked, compare dispatch windows, and hand over to the same logistics grid highlighted upfront on AgriConnect.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-full bg-emerald-600 px-6 hover:bg-emerald-700" onClick={handleProceedToPayment}>
                    Continue to payment
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-slate-200/80 px-6 text-slate-700 hover:bg-slate-50"
                  >
                    <Link href="/marketplace">Browse more inputs</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-full px-6 text-emerald-700 hover:bg-emerald-50"
                    asChild
                  >
                    <Link href="/community-forum">Ask sourcing desk</Link>
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {heroStats.map(stat => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
                      <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
                      <p className="text-xs text-emerald-600">{stat.helper}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-emerald-100/70 bg-gradient-to-br from-white via-emerald-50/60 to-white p-6 text-slate-800 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600">Projected dispatch window</p>
                <h3 className="mt-4 text-3xl font-semibold text-slate-900">Within 18 hours</h3>
                <p className="mt-4 text-slate-600">
                  Twice-daily mandi pickups sync with cold-chain slots once payment clears. Nothing sits idle or loses shelf-life.
                </p>
                <div className="mt-6 space-y-3 text-sm text-slate-700">
                  {["Inventory reserved for 45 minutes", "QC photographs shared post packing", "Dedicated relationship manager on call"].map(
                    item => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3"
                      >
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        {item}
                      </div>
                    )
                  )}
                </div>
                <div className="mt-6 rounded-2xl border border-dashed border-emerald-200 bg-white/90 p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">Need express movement?</p>
                  <p>Share mandi coordinates and we reroute the cold-chain hop within minutes.</p>
                </div>
              </div>
            </div>
          </section>

          {cartItems.length === 0 ? (
            <Card className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/95 p-12 text-center shadow-[0_45px_100px_-60px_rgba(15,23,42,0.5)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(16,185,129,0.12),_transparent_65%)]" />
              <div className="relative z-10 space-y-6">
                <ShoppingCart className="mx-auto h-16 w-16 text-emerald-500" />
                <div>
                  <p className="text-2xl font-semibold text-slate-900">Cart is empty but the marketplace is buzzing.</p>
                  <p className="mt-2 text-lg text-slate-600">Add curated inputs and the cart will keep the same gradients and typography as the landing hero.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild className="rounded-full bg-emerald-600 px-6 hover:bg-emerald-700">
                    <Link href="/marketplace">Explore marketplace</Link>
                  </Button>
                  <Button variant="outline" className="rounded-full border-slate-200/80 px-6 text-slate-700 hover:bg-slate-50">
                    Talk to sourcing desk
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.6fr)]">
              <div className="space-y-6">
                {cartItems.map(item => {
                  const discountedPrice = item.price * (1 - item.discount);
                  return (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_45px_80px_-60px_rgba(15,23,42,0.5)]"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row">
                        <div className="h-32 w-full overflow-hidden rounded-2xl bg-slate-50 sm:w-32">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={128}
                            height={128}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col gap-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">{item.type}</p>
                              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{item.name}</h2>
                              <p className="text-sm text-slate-500">{item.unit}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-semibold text-slate-900">{formatCurrency(discountedPrice)}</p>
                              <p className="text-sm text-slate-400 line-through">{formatCurrency(item.price)}</p>
                              <p className="text-xs font-semibold text-emerald-600">You save {Math.round(item.discount * 100)}%</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-slate-200/80 px-4 py-3 text-sm text-slate-600">
                            <div className="flex items-center gap-2 text-emerald-600">
                              <Truck className="h-4 w-4" /> Cluster-ready delivery
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                              <ShieldCheck className="h-4 w-4" /> QC cleared
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="min-w-[2ch] text-lg font-semibold">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              className="ml-auto text-sm text-rose-500 hover:text-rose-600"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] border border-emerald-100/80 bg-gradient-to-br from-white via-emerald-50/70 to-white p-6 shadow-[0_55px_120px_-60px_rgba(16,185,129,0.45)]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">Order summary</p>
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-slate-500">Secured 45 min</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-900">Amount due now</h3>
                  <p className="text-sm text-slate-500">Inclusive of GST as applicable</p>
                  <p className="mt-4 text-4xl font-bold text-emerald-700">{formatCurrency(amountDue)}</p>
                  <div className="mt-6 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Gross items ({totalItems})</span>
                      <span>{formatCurrency(grossTotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-600">
                      <span>Marketplace savings</span>
                      <span>- {formatCurrency(discountSavings)}</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-600">
                      <span>Membership credit</span>
                      <span>- {formatCurrency(loyaltyCredit)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cold-chain & handling</span>
                      <span>{formatCurrency(logisticsFee)}</span>
                    </div>
                  </div>
                  <Button className="mt-8 w-full rounded-full bg-emerald-600 py-6 text-base hover:bg-emerald-700" onClick={handleProceedToPayment}>
                    Proceed to secure payment
                  </Button>
                  <p className="mt-3 text-center text-xs text-slate-500">Need a PO copy? We email invoices instantly.</p>
                </div>

                <div className="rounded-3xl border border-dashed border-emerald-200/80 bg-emerald-50/60 p-5">
                  <div className="flex items-start gap-3">
                    <Gift className="h-6 w-6 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Loyalty program</p>
                      <p className="text-sm text-slate-600">Earn an extra ₹150 credit once this order crosses ₹6,000.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <section className="mt-16">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">Reliability guardrails</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Same trust badges featured on the homepage</h2>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {assuranceHighlights.map(item => (
                <div key={item.title} className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14 grid gap-8 lg:grid-cols-2">
            <Card className="rounded-[28px] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-emerald-600">
                <Gift className="h-5 w-5" />
                Membership perks
              </div>
              <div className="mt-4 space-y-4">
                {membershipPerks.map(perk => (
                  <div key={perk.title} className="rounded-2xl border border-slate-200/80 p-4">
                    <p className="font-semibold text-slate-900">{perk.title}</p>
                    <p className="text-sm text-slate-600">{perk.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[28px] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
                Next steps before dispatch
              </div>
              <div className="mt-4 space-y-4">
                {nextSteps.map((step, index) => (
                  <div key={step.title} className="flex items-start gap-4">
                    <div className="rounded-full border border-emerald-200/80 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{step.title}</p>
                      <p className="text-sm text-slate-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="mt-14 grid gap-6 md:grid-cols-3">
            {supportChannels.map(channel => (
              <div key={channel.title} className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm">
                <div className="flex items-center gap-3 text-emerald-600">
                  <channel.icon className="h-5 w-5" />
                  {channel.title}
                </div>
                <p className="mt-3 text-sm text-slate-600">{channel.description}</p>
                <p className="text-sm text-slate-500">{channel.subtext}</p>
              </div>
            ))}
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
