"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Leaf, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserInfo } from "@/app/utils/auth";
import Loader from "@/components/Loader";
import { toast } from "@/components/ui/toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function Marketplace() {
  const router = useRouter();
  const [name, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true); // Handle loading state
  const [isClient, setIsClient] = useState(false); // Client-side rendering check

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
    <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <header className="sticky top-0 bg-white-800 text-white shadow-md z-10">
                <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl text-black font-bold flex items-center">
                        <Leaf className="mr-2" />
                        AgriConnect
                    </Link>

                    <div className="flex items-center space-x-6">
                        
                        <Link href="/orders" className="text-black hover:text-green-300">Orders</Link>
                        <Link href="/cart" className="text-black relative hover:text-green-300">
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {totalCartItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                                    {totalCartItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </nav>
            </header>


            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Search and Filter */}
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow md:w-1/2 lg:w-1/3"
                    />
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-48 ml-4">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Products</SelectItem>
                            <SelectItem value="crop">Crops</SelectItem>
                            <SelectItem value="fertilizer">Fertilizers</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300 relative">
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={400}
                                height={250}
                                className="rounded-lg object-cover w-full h-64"
                            />
                            {product.discount > 0 && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    Save {Math.round(product.discount * 100)}%
                                </div>
                            )}
                            <CardContent className="p-4">
                                <h2 className="text-lg font-semibold text-green-800">{product.name}</h2>
                                <p className="text-sm text-gray-500 capitalize">{product.type}</p>
                                <p className="text-green-700 font-bold text-lg mt-2">
                                    ₹{(product.price - product.price * product.discount).toFixed(2)}
                                    {product.discount > 0 && (
                                        <span className="line-through text-gray-400 ml-2">
                                            ₹{product.price.toFixed(2)}
                                        </span>
                                    )}
                                </p>
                                <div className="flex items-center mt-2 text-yellow-500">
                                    {[...Array(Math.round(product.rating))].map((_, i) => (
                                        <Star key={i} className="h-4 w-4" />
                                    ))}
                                    <span className="ml-2 text-sm text-gray-500">
                                        ({product.reviews} reviews)
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4">
                                <Button
                                    onClick={() => addToCart(product.id)}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Add to Cart
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
  );
}
