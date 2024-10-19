"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Leaf,Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function GovernmentSchemesPage() {
  const [selectedState, setSelectedState] = useState<string | undefined>();

  const nationalSchemes = [
    {
      name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      description:
        "Crop insurance scheme to provide financial support to farmers in case of crop failure due to natural calamities.",
    },
    {
      name: "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
      description:
        "Scheme to improve farm productivity by ensuring efficient water management and irrigation facilities.",
    },
  ];

  const stateSchemes = {
    Maharashtra: [
      {
        name: "Mahatma Jyotirao Phule Shetkari Karjamukti Yojana",
        description: "Loan waiver scheme for farmers.",
      },
      {
        name: "Nanaji Deshmukh Krishi Sanjivani Yojana",
        description: "Project on climate resilient agriculture.",
      },
    ],
    Punjab: [
      {
        name: "Pani Bachao Paise Kamao",
        description: "Scheme to promote water conservation in agriculture.",
      },
      {
        name: "Crop Residue Management Scheme",
        description:
          "Initiative to manage crop residue and prevent stubble burning.",
      },
    ],
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
            <Link href="/about" className="hover:text-green-300">
              About
            </Link>
            <Link href="/features" className="hover:text-green-300">
              Features
            </Link>
            <Link href="/contact" className="hover:text-green-300">
              Contact Us
            </Link>
          </div>
          <Button
            variant="outline"
            className="bg-green-700 text-white hover:bg-green-600"
          >
            Sign Up
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-green-800 text-center">
          Government Schemes
        </h1>
        <Card className="shadow-lg max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-green-800">
              Agricultural Schemes and Subsidies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="national">
              <TabsList className="mb-6">
                <TabsTrigger value="national" className="text-lg">
                  National Schemes
                </TabsTrigger>
                <TabsTrigger value="state" className="text-lg">
                  State Schemes
                </TabsTrigger>
              </TabsList>

              {/* National Schemes */}
              <TabsContent value="national">
                <ul className="space-y-4">
                  {nationalSchemes.map((scheme, index) => (
                    <li key={index}>
                      <h3 className="text-lg font-semibold text-green-700">
                        {scheme.name}
                      </h3>
                      <p className="text-gray-600">{scheme.description}</p>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              {/* State Schemes */}
              <TabsContent value="state">
                <Select onValueChange={setSelectedState}>
                  <SelectTrigger className="w-full mb-4 p-2 border border-gray-300 rounded-md">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Punjab">Punjab</SelectItem>
                  </SelectContent>
                </Select>

                {selectedState && (
                  <ul className="space-y-4">
                    {stateSchemes[selectedState as keyof typeof stateSchemes].map(
                      (scheme, index) => (
                        <li key={index}>
                          <h3 className="text-lg font-semibold text-green-700">
                            {scheme.name}
                          </h3>
                          <p className="text-gray-600">{scheme.description}</p>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </TabsContent>
            </Tabs>
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
