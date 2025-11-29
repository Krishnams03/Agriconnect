"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Leaf, Search, Droplets, Sun, Thermometer, Sprout, Info, AlertCircle, Menu, X } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import plantsData from "../../public/data/plants.json";
import Loader from "@/components/Loader";


interface GrowthFactors {
  sunlight: string;
  water: string;
  soil_ph: string;
  temperature: string;
  fertilizer: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function GrowthFactorsPage() {
  const [plantName, setPlantName] = useState("");
  const [growthFactors, setGrowthFactors] = useState<GrowthFactors | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);  // Keep loading true until everything is ready

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // Adjust duration as needed
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    if (!plantName) return; // Guard clause

    const plant = plantsData.plants.find(
      (p) => p.name.toLowerCase() === plantName.toLowerCase()
    );

    if (!plant) {
      alert("No plant found!");
      return;
    }

    setGrowthFactors(plant.growth_factors);
  };

  const commonPlants = [
    { name: "Tomato", icon: "🍅" },
    { name: "Cucumber", icon: "🥒" },
    { name: "Lettuce", icon: "🥬" },
    { name: "Pepper", icon: "🫑" },
    { name: "Carrot", icon: "🥕" }
  ];

  const growthTips = [
    {
      title: "Soil Preparation",
      description: "Prepare well-draining soil rich in organic matter. Test soil pH before planting.",
      icon: <Sprout className="h-6 w-6 text-green-600" />
    },
    {
      title: "Watering Schedule",
      description: "Water deeply but less frequently to encourage deep root growth.",
      icon: <Droplets className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Light Management",
      description: "Most vegetables need 6-8 hours of direct sunlight daily.",
      icon: <Sun className="h-6 w-6 text-yellow-600" />
    }
  ];

  const seasonalGuidelines = {
    spring: ["Prepare soil", "Start seeds indoors", "Plan garden layout"],
    summer: ["Regular watering", "Pest monitoring", "Harvest vegetables"],
    fall: ["Plant cold crops", "Collect seeds", "Prepare for frost"],
    winter: ["Plan next season", "Maintain tools", "Indoor growing"]
  };
  // If it's still loading, return the loading screen
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full bg-transparent text-black z-50 backdrop-blur-md">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center hover:text-green-200 transition-colors">
            <Leaf className="mr-2" />
            AgriConnect
          </Link>
          <div className="flex items-center space-x-4 md:flex-row">
            <div className="hidden md:flex space-x-4">
              <Link href="/" className="hover:text-green-200 transition-colors">
                Home
              </Link>
              
            </div>
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-green-800 text-white shadow-lg absolute top-16 left-0 right-0 p-4"
          >
            <div className="flex flex-col space-y-4">
              <Link href="/plant-disease-detection" className="hover:text-green-200 transition-colors">
                Plant Disease Detection
              </Link>
              <Link href="/marketplace" className="hover:text-green-200 transition-colors">
                Marketplace
              </Link>
            </div>
          </motion.div>
        )}
      </header>


      {/* Main Content */}
      <main className="container mx-auto px-4 py-24 flex-grow">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold mb-4 text-green-800 text-center"
          >
            Plant Growth Factors
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-center text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Get detailed information about optimal growing conditions for your plants.
            Learn about sunlight, water, soil requirements, and more.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Search Section */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-800 flex items-center">
                    <Search className="mr-2" />
                    Find Growth Factors
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
                        className="flex-grow"
                      />
                      <Button
                        onClick={handleSearch}
                        disabled={!plantName}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Search
                      </Button>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Common Plants:</h3>
                      <div className="flex flex-wrap gap-2">
                        {commonPlants.map((plant) => (
                          <Button
                            key={plant.name}
                            variant="outline"
                            className="text-sm"
                            onClick={() => {
                              setPlantName(plant.name);
                              handleSearch();
                            }}
                          >
                            {plant.icon} {plant.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {growthFactors && (
                      <div className="mt-6 space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg text-green-700">
                              Basic Requirements
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-3">
                              <li className="flex items-center">
                                <Sun className="h-5 w-5 text-yellow-600 mr-2" />
                                <span>Sunlight: {growthFactors.sunlight}</span>
                              </li>
                              <li className="flex items-center">
                                <Droplets className="h-5 w-5 text-blue-600 mr-2" />
                                <span>Water: {growthFactors.water}</span>
                              </li>
                              <li className="flex items-center">
                                <AlertCircle className="h-5 w-5 text-purple-600 mr-2" />
                                <span>Soil pH: {growthFactors.soil_ph}</span>
                              </li>
                              <li className="flex items-center">
                                <Thermometer className="h-5 w-5 text-red-600 mr-2" />
                                <span>Temperature: {growthFactors.temperature}</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg text-green-700">
                              Advanced Care
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-3">
                              <li><strong>Fertilizer:</strong> {growthFactors.fertilizer}</li>
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Growing Tips Section */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-800 flex items-center">
                    <Info className="mr-2" />
                    Growing Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {growthTips.map((tip, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg shadow">
                        <div className="flex items-center mb-2">
                          {tip.icon}
                          <h3 className="ml-2 font-semibold text-gray-800">{tip.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm">{tip.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Seasonal Guide */}
              <Card className="shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-800">
                    Seasonal Growing Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(seasonalGuidelines).map(([season, tips]) => (
                      <div key={season} className={`p-4 rounded-lg ${season === 'spring' ? 'bg-green-50' : season === 'summer' ? 'bg-yellow-50' : season === 'fall' ? 'bg-orange-50' : 'bg-blue-50'}`}>
                        <h4 className="font-semibold mb-2 capitalize">{season}</h4>
                        <ul className="text-sm space-y-1">
                          {tips.map((tip, idx) => <li key={idx}>• {tip}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
