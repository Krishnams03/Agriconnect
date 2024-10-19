"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, ShoppingCart, Search } from "lucide-react"
import Link from "next/link"

// Mock data for products
const products = [
  { id: 1, name: "Organic Tomatoes", type: "crop", price: 2.99, unit: "kg" },
  { id: 2, name: "NPK Fertilizer", type: "fertilizer", price: 15.99, unit: "bag" },
  { id: 3, name: "Fresh Lettuce", type: "crop", price: 1.99, unit: "head" },
  { id: 4, name: "Organic Compost", type: "fertilizer", price: 8.99, unit: "bag" },
  { id: 5, name: "Sweet Corn", type: "crop", price: 3.99, unit: "dozen" },
  { id: 6, name: "Urea Fertilizer", type: "fertilizer", price: 12.99, unit: "bag" },
]

export default function Marketplace() {
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const addToCart = (productId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { id: productId, quantity: 1 }]
    })
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || product.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-800 text-white">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <Leaf className="mr-2" />
              AgriConnect
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="hover:text-green-300">Home</Link>
              <Button variant="outline" className="bg-green-700 text-white hover:bg-green-600">
                <ShoppingCart className="mr-2 h-4 w-4" />
                <Link href="/cart">Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</Link>
                
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-green-800">AgriConnect Marketplace</h1>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 w-full md:w-auto">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="crop">Crops</SelectItem>
              <SelectItem value="fertilizer">Fertilizers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="buy" className="mb-6">
          <TabsList>
            <TabsTrigger value="buy">Buy Products</TabsTrigger>
            <TabsTrigger value="sell">Sell Products</TabsTrigger>
          </TabsList>
          <TabsContent value="buy">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{product.type.charAt(0).toUpperCase() + product.type.slice(1)}</p>
                    <p className="text-lg font-semibold text-green-700">
                     ₹{product.price.toFixed(2)} / {product.unit}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => addToCart(product.id)} className="w-full bg-green-600 hover:bg-green-700">
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="sell">
            <Card>
              <CardHeader>
                <CardTitle>List Your Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <Input placeholder="Product Name" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Product Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crop">Crop</SelectItem>
                      <SelectItem value="fertilizer">Fertilizer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="Price" />
                  <Input placeholder="Unit (e.g., kg, bag)" />
                  <Input type="number" placeholder="Quantity Available" />
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    List Product
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-green-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 AgriConnect Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}