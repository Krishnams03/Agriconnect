"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Leaf,Upload,Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function DiseaseDetectionPage() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedImage(event.target.files[0]);
      setResult(null); // Clear previous result
    }
  };

  const handleDetection = () => {
    // Simulating disease detection process
    setTimeout(() => {
      setResult("Detected: Leaf Spot Disease (Cercospora)");
    }, 2000);
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
            <Link href="/" className="hover:text-green-300">
              Go to Features
            </Link>
            
          </div>
          
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-green-800 text-center">
          Plant Disease Classification
        </h1>
        <Card className="shadow-lg max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-green-800">
              Upload Plant Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full p-2 rounded-md border-2 border-dashed border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
              <Button
                onClick={handleDetection}
                disabled={!uploadedImage}
                className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center"
              >
                <Upload className="mr-2 h-5 w-5" /> Detect Disease
              </Button>

              {uploadedImage && (
                <p className="text-sm text-green-700">
                  Image uploaded: {uploadedImage.name}
                </p>
              )}

              {result && (
                <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-600 rounded-md">
                  <h3 className="font-bold text-green-800">{result}</h3>
                  <p className="mt-2 text-green-700">
                    Recommended action: Apply copper-based fungicide and improve
                    air circulation around plants.
                  </p>
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
