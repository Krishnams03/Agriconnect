"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, Info, Menu, X } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";

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

export default function GovernmentSchemesPage() {
  const [schemesData, setSchemesData] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<string | undefined>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);  // Keep loading true until everything is ready

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // Adjust duration as needed
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fetch schemes data from JSON
    fetch("/data/schemes.json")
      .then((response) => response.json())
      .then((data) => setSchemesData(data))
      .catch((error) => console.error("Error fetching schemes data:", error));
  }, []);

  if (!schemesData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner-border animate-spin border-4 border-t-4 border-green-600 rounded-full w-16 h-16"></div>
        <p className="ml-4 text-green-600">Loading schemes...</p>
      </div>
    );
  }

  const { national = [], state = {} } = schemesData.schemes;
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-green-100">
      {/* Navbar */}
      <header className="sticky top-0 bg-white-800 text-white shadow-md z-10">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl text-black font-bold flex items-center">
            <Leaf className="mr-2" />
            AgriConnect
          </Link>
          <div className="space-x-4 hidden md:flex">
            <Link href="/" className="text-black hover:text-green-300">
              Home
            </Link>
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
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
              <Link href="/" className="hover:text-green-300">
                Home
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-grow">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold mb-8 text-green-800 text-center"
          >
            Government Schemes
          </motion.h1>

          <p className="mb-12 text-lg text-center text-gray-700">
            Government schemes are crucial as they provide financial assistance,
            training, and resources to farmers. These initiatives support the
            agricultural community in improving productivity, sustainability, and
            access to better opportunities. By taking advantage of these schemes,
            farmers can enhance their livelihoods and contribute to national food security.
          </p>

          <Card className="shadow-xl max-w-4xl mx-auto mb-8 border rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-green-800">Agricultural Schemes and Subsidies</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="national" className="w-full">
                <TabsList className="mb-6 flex justify-center space-x-8">
                  <TabsTrigger
                    value="national"
                    className="text-lg px-6 py-2 border-b-2 border-transparent hover:border-green-800 transition duration-300 ease-in-out"
                  >
                    National Schemes
                  </TabsTrigger>
                  <TabsTrigger
                    value="state"
                    className="text-lg px-6 py-2 border-b-2 border-transparent hover:border-green-800 transition duration-300 ease-in-out"
                  >
                    State Schemes
                  </TabsTrigger>
                </TabsList>

                {/* National Schemes */}
                <TabsContent
                  value="national"
                  className="transition-all duration-300 ease-in-out"
                >
                  <motion.ul
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    {national.map((scheme: any, index: number) => (
                      <motion.li
                        key={index}
                        variants={itemVariants}
                        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
                      >
                        <h3 className="text-lg font-semibold text-green-700">{scheme.name}</h3>
                        <p className="text-gray-600">{scheme.description}</p>
                        <p className="mt-2 text-sm text-gray-500">Objective: {scheme.objective}</p>
                        <p className="mt-2 text-sm text-gray-500">Details: {scheme.details}</p>
                        <p className="mt-2 text-sm text-gray-500">Funding: {scheme.funding}</p>
                        <p className="mt-2 text-sm text-gray-500">Eligibility: {scheme.eligibility}</p>
                        <div className="mt-4 flex justify-between">
                          <Link
                            href={scheme.apply_link}
                            className="text-green-600 hover:underline"
                          >
                            Apply Now
                          </Link>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                </TabsContent>

                {/* State Schemes */}
                <TabsContent
                  value="state"
                  className="transition-all duration-300 ease-in-out"
                >
                  <Select onValueChange={setSelectedState}>
                    <SelectTrigger className="w-full mb-4 p-2 border border-gray-300 rounded-md shadow-md">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(state).map((stateName) => (
                        <SelectItem key={stateName} value={stateName}>
                          {stateName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedState && (
                    <motion.ul
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-6"
                    >
                      {state[selectedState]?.map((scheme: any, index: number) => (
                        <motion.li
                          key={index}
                          variants={itemVariants}
                          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
                        >
                          <h3 className="text-lg font-semibold text-green-700">{scheme.name}</h3>
                          <p className="text-gray-600">{scheme.description}</p>
                          <p className="mt-2 text-sm text-gray-500">Eligibility: {scheme.eligibility}</p>
                          <div className="mt-4 flex justify-between">
                            <Link
                              href={scheme.apply_link}
                              className="text-green-600 hover:underline"
                            >
                              Apply Now
                            </Link>
                          </div>
                        </motion.li>
                      ))}
                    </motion.ul>
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
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
