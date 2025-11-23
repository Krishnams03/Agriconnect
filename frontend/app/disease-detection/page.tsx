"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Leaf, Menu, X, Upload, AlertCircle, CheckCircle2, Image as ImageIcon, Info } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isAuthenticated, getUserInfo } from "@/app/utils/auth";
import Loader from "@/components/Loader"; 

export default function DiseaseDetectionPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);  // Keep loading true until everything is ready

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // Adjust duration as needed
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
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
  }, [router]);

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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setUploadedImage(file);
      setResult(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetection = async () => {
    if (!uploadedImage) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", uploadedImage);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/predict", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(`Detected disease: ${data.prediction}`);
      } else {
        setResult("Error detecting disease");
      }
    } catch (error) {
      console.error("Detection error:", error);
      setResult("Detection failed");
    } finally {
      setIsLoading(false);
    }
  };

  const diseaseInfo = [
    {
      title: "Early Blight",
      description: "Common in tomatoes and potatoes. Look for dark brown spots with concentric rings.",
      treatment: "Remove infected leaves, improve air circulation, apply fungicide if necessary.",
    },
    {
      title: "Late Blight",
      description: "Affects potatoes and tomatoes. Watch for dark, water-soaked spots on leaves.",
      treatment: "Remove infected plants, improve drainage, use resistant varieties.",
    },
    {
      title: "Leaf Spot",
      description: "Various crops affected. Circular spots with dark margins appear on leaves.",
      treatment: "Rotate crops, maintain proper spacing, apply organic fungicides.",
    },
  ];

  const uploadGuidelines = [
    "Choose clear, well-lit images",
    "Focus on affected plant parts",
    "Include both healthy and diseased areas",
    "Avoid blurry or dark photos",
    "Multiple angles help improve accuracy",
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-green-800">
              Access Restricted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                Please sign in to access the Plant Disease Detection feature.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => router.push("/sign-up")}
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Navbar */}
      <header className="bg-green-800 text-white shadow-lg sticky top-0 z-10">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center hover:text-green-200 transition-colors">
            <Leaf className="mr-2" />
            AgriConnect
          </Link>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div
            className={`absolute top-16 left-0 w-full bg-green-800 text-white shadow-lg md:static md:flex md:space-x-4 md:bg-transparent md:shadow-none md:w-auto ${mobileMenuOpen ? "block" : "hidden"
              }`}
          >
            <Link href="/growth-factors" className="block px-4 py-2 hover:bg-green-700 md:px-0">
              Growth Factors
            </Link>
            <Link href="/marketplace" className="block px-4 py-2 hover:bg-green-700 md:px-0">
              Marketplace
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-grow">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold mb-4 text-green-800 text-center"
          >
            Welcome, {userName || 'User'}! Plant Disease Classification
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-center text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Upload a photo of your plant to instantly identify diseases and get treatment recommendations.
            Our AI-powered system analyzes leaf patterns, spots, and discoloration to provide accurate diagnoses.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Upload Section */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-800 flex items-center">
                    <Upload className="mr-2" />
                    Upload Plant Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <ImageIcon className="h-12 w-12 text-green-600 mb-2" />
                        <span className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </span>
                      </label>
                    </div>

                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-sm text-green-700 mb-2">Preview:</p>
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          className="rounded-lg"
                          layout="responsive"
                          width={300} // Adjust the width as per your requirements
                          height={200} // Adjust the height as per your requirements
                          unoptimized
                        />
                      </div>
                    )}

                    <Button
                      onClick={handleDetection}
                      disabled={!uploadedImage || isLoading}
                      className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center"
                    >
                      {isLoading ? "Analyzing..." : "Detect Disease"}
                    </Button>

                    {result && (
                      <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-600 rounded-md">
                        <h3 className="font-bold text-green-800 flex items-center">
                          <AlertCircle className="mr-2 h-5 w-5" />
                          {result}
                        </h3>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Guidelines Section */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-800 flex items-center">
                    <Info className="mr-2" />
                    Upload Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {uploadGuidelines.map((guideline, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                        <span>{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Common Diseases Section */}
          <motion.section variants={itemVariants} className="mt-12">
            <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
              Common Plant Diseases
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {diseaseInfo.map((disease, index) => (
                <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-700">
                      {disease.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{disease.description}</p>
                    <p className="text-sm text-green-800">
                      <strong>Treatment:</strong> {disease.treatment}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-green-600 hover:text-green-700 transition-colors inline-flex items-center"
            >
              <Leaf className="mr-2" />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
