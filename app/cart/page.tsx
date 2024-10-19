"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Leaf, Minus, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

// Mock data for cart items
const initialCartItems = [
  { id: 1, name: "Organic Tomatoes", price: 2.99, quantity: 2, unit: "kg" },
  { id: 2, name: "NPK Fertilizer", price: 15.99, quantity: 1, unit: "bag" },
]

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity >= 0) {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const removeItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <header className="bg-green-800 text-white">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <Leaf className="mr-2" />
              AgriConnect
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="hover:text-green-300">Home</Link>
              <Link href="/marketplace" className="hover:text-green-300">Marketplace</Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-green-800">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">Your cart is empty.</p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/marketplace">Continue Shopping</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-green-700">
                    ₹{item.price.toFixed(2)} / {item.unit}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                        className="w-16 text-center"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <p className="font-semibold">
                    Subtotal:  ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span> ₹{calculateTotal().toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="justify-end space-x-4">
                <Button variant="outline" asChild>
                  <Link href="/marketplace">Continue Shopping</Link>
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>

      <footer className="bg-green-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 AgriConnect Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}