"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {Leaf, Search,Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function GrowthFactorsPage() {
  const [plantName, setPlantName] = useState("");
  const [growthFactors, setGrowthFactors] = useState<string[] | null>(null);

  const handleSearch = () => {
    // Simulating API call for growth factors
    setTimeout(() => {
      setGrowthFactors([
        "Sunlight: Full sun to partial shade",
        "Water: Moderate, keep soil moist but not waterlogged",
        "Soil pH: 6.0 - 7.0",
        "Temperature: 65°F - 75°F (18°C - 24°C)",
        "Fertilizer: Balanced, water-soluble fertilizer every 2 weeks",
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      {/* Navbar */}
      <header className="bg-green-800 text-white">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
          <Leaf className="mr-2" />
            AgriConnect
          </Link>
          <div className="space-x-4 hidden md:flex">
            <Link href="/" className="hover:text-green-300">
              Home
            </Link>
            
          </div>
          
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-green-800 text-center">
          Plant Growth Factors
        </h1>
        <Card className="shadow-lg max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-green-800">
              Search for Plant Growth Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter plant name"
                  value={plantName}
                  onChange={(e) => setPlantName(e.target.value)}
                  className="flex-grow p-2 border-2 rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
                <Button
                  onClick={handleSearch}
                  disabled={!plantName}
                  className="bg-green-600 hover:bg-green-700 flex items-center justify-center"
                >
                  <Search className="mr-2 h-5 w-5" /> Search
                </Button>
              </div>

              {growthFactors && (
                <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-600 rounded-md">
                  <h3 className="font-bold text-green-800 mb-2">
                    Growth Factors for {plantName}:
                  </h3>
                  <ul className="list-disc list-inside text-green-700">
                    {growthFactors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-green-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-6">
        <div className="container mx-auto flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            <div className="flex items-center">
            <Mail className="h-6 w-6 mr-2" />
              <span>contact@agriconnect.com</span>
            </div>
            <div className="flex items-center">
            <Phone className="h-6 w-6 mr-2" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center">
            <MapPin className="h-6 w-6 mr-2" />
              <span>123 Farm Road, Agriville, AG 12345</span>
            </div>
          </div>
          <p className="text-sm">&copy; 2024 AgriConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
