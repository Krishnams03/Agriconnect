"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Trees, Home, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getUserSession, saveUserSession, clearUserSession } from "@/app/utils/auth";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import AboutSection from "@/components/AboutSection";
import GovernmentScheme from "@/components/GovernmentScheme";
import Community from "@/components/Community";
import Contact from "@/components/Contact";
import ScrollProgress, { ScrollProgressWithSections } from "@/components/ScrollProgress";
import PageTransition, { StaggerChildren } from "@/components/PageTransition";
import "@/app/globals.css";


export default function AgriConnect() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);  // Keep loading true until everything is ready
  const router = useRouter();

  // Define sections for scroll progress
  const sections = [
    { id: "hero", label: "Home", color: "emerald" },
    { id: "about", label: "About", color: "green" },
    { id: "features", label: "Features", color: "teal" },
    { id: "government-schemes", label: "Schemes", color: "blue" },
    { id: "community-forum", label: "Community", color: "indigo" },
    { id: "contact", label: "Contact", color: "purple" }
  ];

  // Check if it's the first load or if a login has just occurred
  useEffect(() => {
    const session = getUserSession();
    if (session) {
      setUser({ username: session.username });
    }

    // Simulating data load
    const timer = setTimeout(() => setLoading(false), 3000); // Adjust duration as needed
    return () => clearTimeout(timer);
  }, []);

  // Scroll Behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Logout
  const handleLogout = () => {
    clearUserSession();
    setUser(null);
    router.push("/"); // Redirect to home
  };

  // Handle Account Details Navigation
  const handleAccountDetails = () => {
    router.push("/AccountDetails");
  };

  // Function to Get User Initials
  const getInitials = (name: string) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part[0]?.toUpperCase()).join("");
    return initials || "U";
  };

  

  return (
    <PageTransition variant="fade">
      {/* Scroll Progress Indicator */}
      <ScrollProgressWithSections sections={sections} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-transparent"
      >
      {/* Header */}
      <motion.header
        className={`fixed w-full top-0 z-50 backdrop-blur-md transition-all duration-300 ${
          isScrolled 
            ? "bg-white/90 border-b border-slate-200 shadow-sm" 
            : "bg-white/75 border-b border-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="inline-flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Leaf className="w-8 h-8 text-green-600 transition-transform duration-300" />
              </motion.div>
              <span className="text-2xl font-semibold tracking-tight text-slate-900">
                Agri<span className="font-medium">Connect</span>
              </span>
            </Link>
          </motion.div>

          {/* Navigation Buttons and User Section */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              {["about", "features", "contact"].map((section, index) => (
                <motion.button
                  key={section}
                  onClick={() =>
                    document
                      .getElementById(section)
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                  className="relative text-sm font-medium text-slate-600 transition-all duration-300 group hover:text-slate-900"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-green-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                </motion.button>
              ))}
            </div>

            {/* User Section / Sign Up Button */}
            <div className="flex items-center">
              {user ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl flex items-center justify-center font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {getInitials(user.username)}
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {mobileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 bg-white shadow-2xl rounded-2xl p-2 w-56 z-10 border border-green-100"
                      >
                        <div className="flex items-center space-x-3 p-4 border-b border-green-100/60">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl flex items-center justify-center font-medium">
                            {getInitials(user.username)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Welcome back!
                            </p>
                            <p className="text-sm text-gray-600 font-light">
                              {user.username}
                            </p>
                          </div>
                        </div>

                        <div className="p-2">
                          <motion.button
                            onClick={handleAccountDetails}
                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl transition-all duration-200 group"
                            whileHover={{ x: 2 }}
                          >
                            <Leaf className="w-4 h-4 mr-3 text-green-500 group-hover:text-green-600 transition-colors duration-200" />
                            Account Details
                          </motion.button>
                          <motion.button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group"
                            whileHover={{ x: 2 }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 mr-3 text-red-500 group-hover:text-red-600 transition-colors duration-200"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
                              />
                            </svg>
                            Sign Out
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href="/sign-up">
                    <motion.button
                      className="px-6 py-3 rounded-full font-semibold bg-green-600 text-white transition-all duration-300 shadow-sm hover:shadow-md hover:bg-green-700"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Main Content */}
      <main>
        <motion.section
          id="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative isolate min-h-[85vh] overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-white"
        >
          <div className="absolute inset-y-0 right-[-15%] hidden lg:block w-[560px] bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.2),transparent_60%)]" />
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-green-100/60 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-32">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr,0.95fr]">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-green-600">Connected Agriculture</p>
                <h1 className="mt-6 text-5xl md:text-6xl font-semibold text-slate-900 tracking-tight leading-tight">
                  Navigate your farm with clarity and confidence.
                </h1>
                <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                  AgriConnect combines actionable insights, trusted expertise, and a vibrant marketplace to help every grower scale sustainably.
                </p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  {!user && (
                    <motion.button
                      onClick={() => router.push("/sign-up")}
                      className="inline-flex items-center justify-center rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-700 hover:shadow-md"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Get started
                    </motion.button>
                  )}

                  <motion.button
                    onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                    className="inline-flex items-center justify-center rounded-full border border-green-500/70 bg-white px-7 py-3 text-sm font-semibold text-green-600 transition-all duration-300 hover:bg-green-500 hover:text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Discover the platform
                  </motion.button>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                    <p className="text-3xl font-semibold text-slate-900">12k+</p>
                    <p className="mt-2 text-sm text-slate-500">Farmers rely on AgriConnect tools</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                    <p className="text-3xl font-semibold text-slate-900">24/7</p>
                    <p className="mt-2 text-sm text-slate-500">AI-guided crop monitoring coverage</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                    <p className="text-3xl font-semibold text-slate-900">180+</p>
                    <p className="mt-2 text-sm text-slate-500">Regional marketplaces connected</p>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="relative rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-500">Crop Health Index</span>
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">Live</span>
                  </div>
                  <p className="mt-6 text-5xl font-semibold text-slate-900">96%</p>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Continuous satellite, IoT, and soil data blended into a single, easy-to-read health score.
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                          <Leaf className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-600">Smart Alerts</span>
                      </div>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">+18%</p>
                      <p className="text-xs text-slate-500">Yield boost with timely actions.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                          <Home className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-600">Marketplace</span>
                      </div>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">4.8</p>
                      <p className="text-xs text-slate-500">Avg. buyer rating across regions.</p>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="absolute -top-10 right-6 w-40 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg"
                >
                  <span className="text-xs font-medium text-slate-500">Community Threads</span>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">320+</p>
                  <p className="text-xs text-slate-500">Active expert conversations weekly.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute -bottom-10 left-6 w-48 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg"
                >
                  <span className="text-xs font-medium text-slate-500">Weather Sync</span>
                  <div className="mt-2 flex items-end gap-2">
                    <p className="text-3xl font-semibold text-slate-900">72°F</p>
                    <span className="text-xs text-slate-500">Field average</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Automated scheduling for irrigation.</p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-12 left-1/2 hidden -translate-x-1/2 transform text-slate-500 md:flex"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <span className="mb-2 text-xs font-medium uppercase tracking-[0.3em]">Scroll</span>
              <div className="h-8 w-px bg-slate-300"></div>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="fixed bottom-8 right-8 z-30 hidden w-64 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur lg:block"
        >
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500">Need help?</span>
          <p className="mt-3 text-base font-semibold text-slate-900">Identify any crop in seconds.</p>
          <p className="mt-2 text-xs text-slate-500">
            Upload a snapshot and our AI will guide you with treatment pathways.
          </p>
          <Link href="/plant-identification" className="mt-4 inline-flex">
            <motion.button
              className="flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-700"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Trees className="h-4 w-4" />
              Plant ID
            </motion.button>
          </Link>
        </motion.div>
        <AboutSection />
        
        {/* Features Section - Modern Agriculture Theme */}
        <motion.section
          id="features"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: false }}
          className="relative bg-white py-24 min-h-screen flex flex-col justify-center overflow-hidden"
        >
          {/* Subtle accent top border */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>

          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-20 relative z-10"
          >
            <p className="uppercase text-xs tracking-[0.35em] text-green-500 font-semibold">Our Features</p>
            <h2 className="mt-6 text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight">
              Smart tools designed for modern cultivators
            </h2>
            <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto px-4 leading-relaxed">
              Focus on the harvest while we handle the insights, connections, and commerce that keep your farm thriving year-round.
            </p>
          </motion.div>

          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl relative z-10">
            {/* Disease Detection Feature */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-green-400/60 hover:shadow-[0_35px_70px_-40px_rgba(34,197,94,0.45)]"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 shadow-[0_12px_30px_-20px_rgba(34,197,94,0.9)]"
                >
                  <Leaf className="h-8 w-8" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10 mt-8">
                  <h3 className="text-2xl font-semibold text-slate-900 tracking-tight mb-4 group-hover:text-green-600 transition-colors duration-300">
                    AI Disease Detection
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-10">
                    Instantly spot symptoms, surface precise diagnoses, and access treatment tips backed by agronomists—all from a single image upload.
                  </p>

                  <Link href="/disease-detection">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 rounded-full border border-green-500/70 bg-white px-6 py-3 text-sm font-semibold text-green-600 transition-all duration-300 hover:bg-green-500 hover:text-white"
                    >
                      Start Diagnosis
                      <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            {/* Marketplace Feature */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-green-400/60 hover:shadow-[0_35px_70px_-40px_rgba(34,197,94,0.45)]"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 shadow-[0_12px_30px_-20px_rgba(34,197,94,0.9)]"
                >
                  <Home className="h-8 w-8" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10 mt-8">
                  <h3 className="text-2xl font-semibold text-slate-900 tracking-tight mb-4 group-hover:text-green-600 transition-colors duration-300">
                    Digital Marketplace
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-10">
                    Bring products online, negotiate confidently, and manage fulfilment through a streamlined experience tailored for agricultural trade.
                  </p>

                  <Link href="/marketplace">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 rounded-full border border-green-500/70 bg-white px-6 py-3 text-sm font-semibold text-green-600 transition-all duration-300 hover:bg-green-500 hover:text-white"
                    >
                      Explore Market
                      <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
        
        <GovernmentScheme />
        <Community />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </motion.div>
    </PageTransition>
  );
}
