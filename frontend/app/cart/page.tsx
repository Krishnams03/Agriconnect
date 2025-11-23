"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Leaf, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

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

  // Calculate total price with discount
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = item.price * (1 - item.discount);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  // Calculate total number of items
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Redirect to card selection
  const handleProceedToPayment = () => {
    router.push("/payment/select-card");
  };

  // Handle custom payment flow
  const handleCustomPayment = async () => {
    const totalAmount = calculateTotal();
    try {
      // Send order data to your custom payment API
      const response = await fetch("/api/custom-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          cart: cartItems
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process payment.");
      }

      const paymentResult = await response.json();

      if (paymentResult.success) {
        toast({
          title: "Payment Successful",
          description: `Order completed successfully! Payment ID: ${paymentResult.paymentId}`,
          variant: "default",
        });
        saveOrder(paymentResult.paymentId, totalAmount);
      } else {
        throw new Error(paymentResult.message || "Payment failed.");
      }
    } catch (error: any) {
      console.error("Payment Error:", error.message);
      toast({
        title: "Payment Error",
        description: error.message || "Unable to process payment.",
        variant: "destructive",
      });
    }
  };

  // Save order details locally
  const saveOrder = async (paymentId: string, totalAmount: number) => {
    try {
      const newOrder = {
        paymentId,
        amount: totalAmount,
        date: new Date().toISOString(),
        items: cartItems,
        status: "Pending",
      };
  
      // Send order data to backend
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save order to database");
      }
  
      toast({
        title: "Order Placed!",
        description: "Your order has been successfully saved.",
        variant: "default",
      });
  
      // Clear cart after successful order
      setCartItems([]);
      localStorage.removeItem("cart");
  
      router.push("/orders"); // Redirect to orders page
    } catch (error) {
      console.error("Error saving order:", error);
      toast({
        title: "Order Error",
        description: "Failed to save your order.",
        variant: "destructive",
      });
    }
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
    <div className="min-h-screen bg-green-50">
      <header className="bg-white-800 text-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl text-black font-bold flex items-center hover:text-green-300">
            <Leaf className="mr-2" />
            AgriConnect
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-green-800">Your Cart</h1>

        {cartItems.length === 0 ? (
          <Card className="w-full max-w-8xl mx-auto">
            <CardContent className="p-40 text-center">
              <ShoppingCart className="mx-auto h-16 w-16 text-green-600 mb-4" />
              <p className="text-gray-600 mb-4 text-2xl">Your cart is empty</p>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/marketplace">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>

        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map(item => (
                <Card key={item.id} className="flex shadow-lg rounded-lg">
                  <div className="w-24 h-24 p-2">
                    <Image src={item.image} alt={item.name} width={96} height={96} className="rounded-lg object-cover" />
                  </div>
                  <div className="flex-grow p-4">
                    <div className="flex justify-between">
                      <h2 className="text-lg font-semibold text-green-700">{item.name}</h2>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </Button>
                      <span className="text-lg font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <Card className="shadow-lg rounded-lg">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleProceedToPayment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg"
                  >
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
