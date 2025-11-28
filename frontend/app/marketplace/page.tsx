"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Leaf, ShoppingCart, Star, Sparkles, Truck, ShieldCheck, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserInfo } from "@/app/utils/auth";
import Loader from "@/components/Loader";
import { toast } from "@/components/ui/toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
export interface Product {
  id: number;
  name: string;
  type: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  discount: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
    {
        id: 1,
        name: "Organic Tomatoes",
        type: "crop",
        price: 2.99,
        unit: "kg",
        rating: 4.5,
        reviews: 24,
        discount: 0.2,
        image: "/assets/images/tomatoes.jpg",
    },
    {
        id: 2,
        name: "Organic Potatoes",
        type: "crop",
        price: 1.99,
        unit: "kg",
        rating: 4.2,
        reviews: 15,
        discount: 0.1,
        image: "/assets/images/Organic potato.jpg",
    },
    {
        id: 3,
        name: "Red Onions",
        type: "crop",
        price: 3.99,
        unit: "kg",
        rating: 4.7,
        reviews: 18,
        discount: 0.15,
        image: "/assets/images/Red onion.jpg",
    },
    {
        id: 4,
        name: "Green Beans",
        type: "crop",
        price: 2.49,
        unit: "kg",
        rating: 4.1,
        reviews: 20,
        discount: 0,
        image: "/assets/images/Green beans.jpg",
    },
    {
        id: 5,
        name: "Carrots",
        type: "crop",
        price: 1.79,
        unit: "kg",
        rating: 4.3,
        reviews: 12,
        discount: 0,
        image: "/assets/images/Carrots.png",
    },
    {
        id: 6,
        name: "Cabbages",
        type: "crop",
        price: 1.99,
        unit: "kg",
        rating: 4.2,
        reviews: 8,
        discount: 0.1,
        image: "/assets/images/Cabbage.jpg",
    },
    {
        id: 7,
        name: "Lettuce",
        type: "crop",
        price: 2.19,
        unit: "kg",
        rating: 4.4,
        reviews: 10,
        discount: 0.05,
        image: "/assets/images/Lettuce.jpeg",
    },
    {
        id: 8,
        name: "Spinach",
        type: "crop",
        price: 3.49,
        unit: "kg",
        rating: 4.6,
        reviews: 22,
        discount: 0.2,
        image: "/assets/images/Spinach.png",
    },
    {
        id: 9,
        name: "Pumpkins",
        type: "crop",
        price: 4.99,
        unit: "kg",
        rating: 4.0,
        reviews: 14,
        discount: 0.25,
        image: "/assets/images/Pumpkins.png",
    },
    {
        id: 10,
        name: "Watermelons",
        type: "crop",
        price: 5.49,
        unit: "kg",
        rating: 4.8,
        reviews: 30,
        discount: 0.3,
        image: "/assets/images/Watermelons.jpg",
    },

    // Fertilizers
    {
        id: 11,
        name: "NPK Fertilizer",
        type: "fertilizer",
        price: 15.99,
        unit: "bag",
        rating: 4.0,
        reviews: 10,
        discount: 0,
        image: "/assets/images/NPK.jpg",
    },
    {
        id: 12,
        name: "Organic Compost",
        type: "fertilizer",
        price: 8.99,
        unit: "bag",
        rating: 4.3,
        reviews: 12,
        discount: 0.1,
        image: "/assets/images/Organic compost.jpg",
    },
    {
        id: 13,
        name: "Urea Fertilizer",
        type: "fertilizer",
        price: 12.49,
        unit: "bag",
        rating: 4.1,
        reviews: 5,
        discount: 0.05,
        image: "/assets/images/Urea.jpg",
    },
    {
        id: 14,
        name: "Superphosphate Fertilizer",
        type: "fertilizer",
        price: 10.99,
        unit: "bag",
        rating: 4.2,
        reviews: 8,
        discount: 0,
        image: "/assets/images/Superphosphate.jpg",
    },
    {
        id: 15,
        name: "Lime Fertilizer",
        type: "fertilizer",
        price: 7.99,
        unit: "bag",
        rating: 4.0,
        reviews: 9,
        discount: 0.15,
        image: "/assets/images/Lime.jpg",
    },
    {
        id: 16,
        name: "Potash Fertilizer",
        type: "fertilizer",
        price: 13.49,
        unit: "bag",
        rating: 4.5,
        reviews: 10,
        discount: 0.1,
        image: "/assets/images/Potash.jpg",
    },
    {
        id: 17,
        name: "Fish Emulsion Fertilizer",
        type: "fertilizer",
        price: 18.99,
        unit: "bag",
        rating: 4.3,
        reviews: 12,
        discount: 0.2,
        image: "/assets/images/Fish emulsion.jpg",
    },
    {
        id: 18,
        name: "Blood Meal Fertilizer",
        type: "fertilizer",
        price: 9.49,
        unit: "bag",
        rating: 4.4,
        reviews: 7,
        discount: 0,
        image: "/assets/images/Blood meal.jpg",
    },
    {
        id: 19,
        name: "Kelp Meal Fertilizer",
        type: "fertilizer",
        price: 6.99,
        unit: "bag",
        rating: 4.0,
        reviews: 6,
        discount: 0.1,
        image: "/assets/images/Kelp meal.jpg",
    },
    {
        id: 20,
        name: "Bone Meal Fertilizer",
        type: "fertilizer",
        price: 11.99,
        unit: "bag",
        rating: 4.6,
        reviews: 15,
        discount: 0.25,
        image: "/assets/images/Bone meal.jpg",
    }
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Marketplace() {
  const router = useRouter();
  const [name, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true); // Handle loading state
  const [isClient, setIsClient] = useState(false); // Client-side rendering check
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const catalogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Ensure we are only on the client side when running this code
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || typeof window === "undefined") return;

    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);

      if (!authenticated) {
        router.push("/sign-up");
        return;
      }

      const userInfo = getUserInfo();
      if (userInfo) {
        setUserName(userInfo.name || 'User');
      }
    };

    checkAuth();
  }, [isClient, router]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // Simulate a delay for loading
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Error parsing cart:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId: number) => {
    setCart((prevCart) => {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        toast({ title: "Error", description: "Product not found", variant: "destructive" });
        return prevCart;
      }

      const existingItemIndex = prevCart.findIndex((item) => item.id === productId);
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;

        toast({ title: "Cart Updated", description: `Increased quantity of ${product.name}` });
        return updatedCart;
      } else {
        const newCartItem: CartItem = { ...product, quantity: 1 };

        toast({ title: "Added to Cart", description: `${product.name} added to cart` });
        return [...prevCart, newCartItem];
      }
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || product.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const inventoryCounts = {
    all: products.length,
    crop: products.filter((p) => p.type === "crop").length,
    fertilizer: products.filter((p) => p.type === "fertilizer").length,
  } as const;

  const categoryFilters = [
    {
      key: "all",
      label: "All inventory",
      description: "Fresh produce + soil health",
    },
    {
      key: "crop",
      label: "Field-fresh crops",
      description: "Tomatoes, greens, fruits",
    },
    {
      key: "fertilizer",
      label: "Fertilizers",
      description: "NPK, compost, bio stimulants",
    },
  ].map((filter) => ({
    ...filter,
    count: inventoryCounts[filter.key as keyof typeof inventoryCounts],
    active: filterType === filter.key,
  }));

  const marketplaceStats = [
    { label: "Active buyers", value: "12k+", subtext: "Across 14 regions" },
    { label: "Avg. fulfillment", value: "36h", subtext: "from order to dispatch" },
    { label: "Quality score", value: "4.8/5", subtext: "community rated" },
  ];

  const assuranceHighlights = [
    {
      icon: Truck,
      title: "Cold-chain ready",
      description: "Coordinated logistics windows keep leafy produce crisp.",
    },
    {
      icon: ShieldCheck,
      title: "Verified suppliers",
      description: "Every seller undergoes agronomy-grade quality screens.",
    },
    {
      icon: Tag,
      title: "Transparent pricing",
      description: "Live benchmark pricing keeps negotiations fair for both sides.",
    },
  ];

  const featuredVendors = [
    {
      name: "Greenfields Collective",
      specialty: "Organic vegetables",
      metric: "6.2k orders",
    },
    {
      name: "SoilGuard Inputs",
      specialty: "Premium fertilizers",
      metric: "4.1k shipments",
    },
    {
      name: "HarvestCircle Co-op",
      specialty: "Mixed crop lots",
      metric: "3.5k buyers",
    },
  ];

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return <Loader />;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <Card className="w-96">
          <CardContent>
            <div className="text-center text-green-800">
              <h2 className="text-xl font-bold mb-4">Access Restricted</h2>
              <p>Please sign in to access the Marketplace.</p>
              <Button
                onClick={() => router.push("/sign-up")}
                className="mt-4 bg-green-600 hover:bg-green-700"
              >
                Go to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50/40 to-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900">
            <Leaf className="h-6 w-6 text-green-600" />
            AgriConnect Market
          </Link>
          <button
            className="md:hidden rounded-full border border-slate-200 p-2 text-slate-600"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <ArrowRight className="h-5 w-5 rotate-180" /> : <ShoppingCart className="h-5 w-5" />}
          </button>
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/orders" className="text-sm text-slate-600 hover:text-slate-900">
              Orders
            </Link>
            <Button
              variant="outline"
              className="relative rounded-full border-slate-200 bg-white px-6 text-slate-700 hover:bg-slate-50"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> My Cart
              {totalCartItems > 0 && (
                <span className="ml-2 rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {totalCartItems}
                </span>
              )}
            </Button>
            <Button className="rounded-full bg-green-600 px-6 text-white" onClick={scrollToCatalog}>
              Browse catalog
            </Button>
          </div>
        </nav>
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-4 text-slate-600 md:hidden">
            <div className="space-y-3">
              <Link href="/orders" className="block" onClick={() => setMobileMenuOpen(false)}>
                Orders
              </Link>
              <button
                className="flex w-full items-center justify-between rounded-full border border-slate-200 px-4 py-2"
                onClick={() => {
                  router.push("/cart");
                  setMobileMenuOpen(false);
                }}
              >
                <span>My Cart</span>
                {totalCartItems > 0 && (
                  <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                    {totalCartItems}
                  </span>
                )}
              </button>
              <Button className="w-full rounded-full bg-green-600 text-white" onClick={() => {
                scrollToCatalog();
                setMobileMenuOpen(false);
              }}>
                Browse catalog
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative isolate overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-white"
        >
          <div className="absolute inset-y-0 right-0 hidden w-[480px] bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.15),transparent_60%)] lg:block" />
          <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-green-100/70 blur-3xl" />
          <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-[1.05fr,0.95fr]">
            <div className="space-y-8">
              <motion.p variants={itemVariants} className="text-xs font-semibold uppercase tracking-[0.35em] text-green-600">
                Marketplace · Trusted growers
              </motion.p>
              <motion.h1 variants={itemVariants} className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
                {name ? `${name},` : "Hey grower,"} restock your farm with confidence.
              </motion.h1>
              <motion.p variants={itemVariants} className="max-w-2xl text-lg text-slate-600">
                Match the homepage aesthetic with curated produce, soil inputs, and logistics support in one canvas. Apply filters,
                lock transparent pricing, and sync deliveries to your crop calendar.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <Button className="rounded-full bg-green-600 px-6 text-white" onClick={scrollToCatalog}>
                  Explore inventory
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-green-200 bg-white px-6 text-green-700 hover:bg-green-50"
                  onClick={() => router.push("/orders")}
                >
                  View your orders
                </Button>
              </motion.div>
              <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-3">
                {marketplaceStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                    <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                    <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
                    <p className="text-xs text-slate-400">{stat.subtext}</p>
                  </div>
                ))}
              </motion.div>
            </div>
            <motion.div
              variants={itemVariants}
              className="relative rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.35)]"
            >
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Sparkles className="h-4 w-4 text-green-600" />
                Live lot tracking enabled
              </div>
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Fulfillment rate</p>
                    <p className="text-4xl font-semibold text-slate-900">97%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Cold chain lots</p>
                    <p className="text-2xl font-semibold text-slate-900">52</p>
                  </div>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white">
                  <div className="h-full w-[97%] rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600">
                  <Truck className="mb-2 h-5 w-5 text-green-600" />
                  640+ delivery routes syncing with agri-co-ops weekly.
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600">
                  <ShieldCheck className="mb-2 h-5 w-5 text-green-600" />
                  Escrow-backed payments for safer supplier contracts.
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <section className="px-6 py-12" ref={catalogRef}>
          <div className="mx-auto max-w-7xl space-y-8">
            <Card className="border border-slate-200 bg-white/90 p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-green-600">Smart filters</p>
                  <h2 className="text-2xl font-semibold text-slate-900">Zero in on the lots you need</h2>
                </div>
                <div className="flex flex-1 flex-col gap-4 md:flex-row">
                  <Input
                    type="text"
                    placeholder="Search produce, fertilizers, vendors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-2xl border-slate-200"
                  />
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="rounded-2xl border-slate-200">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="crop">Crops</SelectItem>
                      <SelectItem value="fertilizer">Fertilizers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full border-slate-200 px-6 text-slate-700 hover:bg-slate-50"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                  }}
                >
                  Reset filters
                </Button>
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              {categoryFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setFilterType(filter.key)}
                  className={`rounded-2xl border p-5 text-left transition-all ${
                    filter.active ? "border-green-500 bg-white shadow-lg" : "border-slate-200 bg-white/70 hover:border-green-200"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{filter.label}</p>
                  <p className="text-xs text-slate-500">{filter.description}</p>
                  <p className="mt-4 text-2xl font-semibold text-slate-900">{filter.count}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-12">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col gap-2 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-green-600">Catalog</p>
              <h2 className="text-3xl font-semibold text-slate-900">Fresh produce & soil inputs</h2>
              <p className="text-slate-600">Curated cards with the same card language as the homepage.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.length === 0 && (
                <Card className="col-span-full border border-slate-200 bg-white/90 p-8 text-center text-slate-600">
                  No products match your filters yet. Try clearing them or exploring another category.
                </Card>
              )}
              {filteredProducts.map((product) => (
                <Card key={product.id} className="relative flex h-full flex-col overflow-hidden border border-slate-200 bg-white/90">
                  <div className="relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={250}
                      className="h-48 w-full object-cover"
                    />
                    {product.discount > 0 && (
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-red-500">
                        Save {Math.round(product.discount * 100)}%
                      </span>
                    )}
                  </div>
                  <CardContent className="flex flex-1 flex-col gap-3 p-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{product.type}</p>
                      <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-semibold text-green-700">
                        ₹{(product.price - product.price * product.discount).toFixed(2)}
                      </p>
                      {product.discount > 0 && (
                        <span className="text-sm text-slate-400 line-through">₹{product.price.toFixed(2)}</span>
                      )}
                      <span className="text-xs text-slate-500">per {product.unit}</span>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      {[...Array(Math.round(product.rating))].map((_, i) => (
                        <Star key={i} className="h-4 w-4" />
                      ))}
                      <span className="ml-2 text-xs text-slate-500">{product.rating.toFixed(1)} · {product.reviews} reviews</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 pt-0">
                    <Button
                      onClick={() => addToCart(product.id)}
                      className="w-full rounded-full bg-green-600 text-white hover:bg-green-700"
                    >
                      Add to cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-12">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              {assuranceHighlights.map((highlight) => {
                const Icon = highlight.icon;
                return (
                  <Card key={highlight.title} className="border border-slate-200 bg-white/90 p-6">
                    <Icon className="mb-4 h-6 w-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-slate-900">{highlight.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{highlight.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col gap-2 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-green-600">Featured vendors</p>
              <h2 className="text-3xl font-semibold text-slate-900">Trusted sellers from across the network</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredVendors.map((vendor) => (
                <Card key={vendor.name} className="border border-slate-200 bg-white/90 p-6 text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{vendor.specialty}</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">{vendor.name}</h3>
                  <p className="mt-4 text-sm text-slate-600">{vendor.metric} fulfilled</p>
                </Card>
              ))}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-10 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-green-600">Next steps</p>
              <h3 className="mt-3 text-3xl font-semibold text-slate-900">Ready to finalize your cart?</h3>
              <p className="mt-3 text-slate-600">Proceed to checkout or sync with the orders dashboard for scheduling.</p>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button className="rounded-full bg-green-600 px-6 text-white" onClick={() => router.push("/cart")}>
                  Go to cart
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-green-200 bg-white px-6 text-green-700 hover:bg-green-50"
                  onClick={() => router.push("/orders")}
                >
                  Review orders
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
