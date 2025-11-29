"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Trees,
  Home,
  ArrowRight,
  Sprout,
  ClipboardCheck,
  Menu,
  X,
  Sparkles,
  Sun
} from "lucide-react";
import Link from "next/link";
import { getUserSession, clearUserSession } from "@/app/utils/auth";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import AboutSection from "@/components/AboutSection";
import GovernmentScheme from "@/components/GovernmentScheme";
import Community from "@/components/Community";
import Contact from "@/components/Contact";
import { ScrollProgressWithSections } from "@/components/ScrollProgress";
import PageTransition from "@/components/PageTransition";
import AnimatedLeafLogo from "@/components/AnimatedLeafLogo";
import "@/app/globals.css";


export default function AgriConnect() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  const navItems = ["about", "features", "contact"];
  const heroHighlights = [
    { label: "Connected farms", value: "12k+", detail: "Using AgriConnect tools" },
    { label: "Live monitoring", value: "24/7", detail: "AI-guided coverage" },
    { label: "Regional markets", value: "180+", detail: "Active commerce hubs" }
  ];
  const mobileQuickActions = [
    {
      title: "Weather pulse",
      description: "Hyperlocal forecasts with irrigation cues",
      cta: "Check weather",
      accentBg: "bg-emerald-50",
      accentText: "text-emerald-700",
      borderClass: "border-emerald-100",
      action: () => router.push("/weather"),
      icon: Sun
    },
    {
      title: "Disease scan",
      description: "Snap a leaf to get prescriptions",
      cta: "Launch lab",
      accentBg: "bg-green-50",
      accentText: "text-green-700",
      borderClass: "border-green-100",
      action: () => router.push("/plant-identification"),
      icon: Trees
    },
    {
      title: "Community help",
      description: "Tap agronomists across regions",
      cta: "Open forum",
      accentBg: "bg-teal-50",
      accentText: "text-teal-700",
      borderClass: "border-teal-100",
      action: () => router.push("/community-forum"),
      icon: Sparkles
    }
  ];

  const initialsFromName = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "AG";

  const userInitials = user?.username ? initialsFromName(user.username) : "AG";
  const renderInitialBadge = (size: "lg" | "md" = "lg") => (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-200/90 via-emerald-100/70 to-cyan-200/60 text-slate-900 font-semibold tracking-tight ${
        size === "lg" ? "h-11 w-11 text-lg" : "h-10 w-10 text-base"
      }`}
    >
      {userInitials}
    </span>
  );

  const handleSectionScroll = (section: string) => {
    if (typeof document === "undefined") return;
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  };

  const closeMobileNav = () => setMobileNavOpen(false);

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
    if (session?.username) {
      setUser({ username: session.username });
    }
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

  

  return (
    <PageTransition variant="fade">
      {/* Scroll Progress Indicator */}
      <ScrollProgressWithSections sections={sections} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-transparent overflow-x-hidden"
      >
      {/* Header */}
      <motion.header
        className={`fixed w-full top-0 z-50 backdrop-blur-md transition-all duration-300 ${
          isScrolled 
            ? "bg-white/90 border-b border-slate-200 shadow-sm" 
            : "bg-white/75 border-b border-transparent"
        }`}
      >
        <nav className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="inline-flex items-center gap-3" aria-label="AgriConnect home">
              <span className="sm:hidden">
                <AnimatedLeafLogo size="md" />
              </span>
              <span className="hidden items-center gap-3 sm:flex">
                <AnimatedLeafLogo size="md" />
                <span className="text-2xl font-semibold tracking-tight text-slate-900">
                  AgriConnect<span className="font-medium">(TerraSyntro)</span>
                </span>
              </span>
            </Link>
          </motion.div>

          {/* Navigation Buttons and User Section */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              {navItems.map((section, index) => (
                <motion.button
                  key={section}
                  onClick={() => handleSectionScroll(section)}
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
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-white/70 shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {renderInitialBadge("lg")}
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
                          {renderInitialBadge("md")}
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

          {/* Mobile Hamburger */}
          <motion.button
            aria-label="Toggle navigation menu"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((prev) => !prev)}
            whileTap={{ scale: 0.92 }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden"
          >
            {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm md:hidden"
            onClick={closeMobileNav}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="ml-auto flex h-full w-full max-w-sm flex-col gap-6 bg-white p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Navigate</p>
                  <p className="text-base font-semibold text-slate-900">AgriConnect</p>
                </div>
                <button
                  aria-label="Close navigation menu"
                  onClick={closeMobileNav}
                  className="rounded-full border border-slate-200 p-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {navItems.map((section) => (
                  <button
                    key={`mobile-${section}`}
                    onClick={() => {
                      handleSectionScroll(section);
                      closeMobileNav();
                    }}
                    className="rounded-2xl border border-slate-100 px-4 py-3 text-left text-base font-medium text-slate-700"
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </div>

              <div className="mt-auto space-y-3 rounded-3xl border border-emerald-100 bg-emerald-50/80 p-5">
                <p className="text-sm font-semibold text-emerald-900">Quick actions</p>
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        closeMobileNav();
                        handleAccountDetails();
                      }}
                      className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-emerald-700"
                    >
                      Account details
                    </button>
                    <button
                      onClick={() => {
                        closeMobileNav();
                        handleLogout();
                      }}
                      className="w-full rounded-2xl border border-red-100 px-4 py-3 text-sm font-medium text-red-600"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/log-in"
                      onClick={closeMobileNav}
                      className="flex w-full items-center justify-center rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white"
                    >
                      Log in to continue
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={closeMobileNav}
                      className="flex w-full items-center justify-center rounded-2xl border border-green-200 px-4 py-3 text-sm font-semibold text-emerald-700"
                    >
                      Create free account
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main>
        <motion.section
          id="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative isolate min-h-[85vh] overflow-hidden bg-gradient-to-br from-white via-emerald-50/60 to-white"
        >
          <div className="absolute inset-y-0 right-[-15%] hidden lg:block w-[560px] bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.2),transparent_60%)]" />
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-green-100/60 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8 lg:py-32">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr,0.95fr] lg:gap-16">
              <div className="mx-auto max-w-xl text-center md:text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-green-600">Connected Agriculture</p>
                <h1 className="mt-6 text-4xl font-semibold text-slate-900 tracking-tight leading-tight md:text-5xl">
                  Navigate your farm with clarity and confidence.
                </h1>
                <p className="mt-6 text-base text-slate-600 leading-relaxed md:text-lg">
                  AgriConnect combines actionable insights, trusted expertise, and a vibrant marketplace to help every grower scale sustainably.
                </p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-start">
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
                  <motion.button
                    onClick={() => router.push("/weather")}
                    className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-7 py-3 text-sm font-semibold text-emerald-700 transition-all duration-300 hover:bg-emerald-100"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View weather insights
                  </motion.button>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6">
                  {heroHighlights.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-3xl border border-white/70 bg-white/80 p-5 text-left shadow-none backdrop-blur sm:border-slate-200 sm:shadow-sm"
                    >
                      <p className="text-3xl font-semibold text-slate-900">{item.value}</p>
                      <p className="mt-1 text-sm font-medium text-slate-500">{item.label}</p>
                      <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 grid gap-4 md:hidden">
                  {mobileQuickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.title}
                        onClick={action.action}
                        className={`flex items-center justify-between rounded-3xl border ${action.borderClass} bg-white/95 p-4 text-left shadow-sm transition-transform duration-300 hover:-translate-y-0.5`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-500">{action.title}</p>
                          <p className="mt-1 text-base font-medium text-slate-900">{action.description}</p>
                          <span className={`mt-2 inline-flex items-center text-xs font-semibold uppercase tracking-[0.25em] ${action.accentText}`}>
                            {action.cta}
                          </span>
                        </div>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${action.accentBg} ${action.accentText}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="relative rounded-3xl border border-white/60 bg-white/80 p-6 shadow-none backdrop-blur sm:border-slate-200 sm:bg-white/90 sm:p-8 sm:shadow-[0_30px_80px_-35px_rgba(15,23,42,0.45)]">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-500">Crop Health Index</span>
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">Live</span>
                  </div>
                  <p className="mt-6 text-5xl font-semibold text-slate-900">96%</p>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Continuous satellite, IoT, and soil data blended into a single, easy-to-read health score.
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm sm:border-slate-100 sm:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                          <Leaf className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-600">Smart Alerts</span>
                      </div>
                      <p className="mt-3 text-2xl font-semibold text-slate-900">+18%</p>
                      <p className="text-xs text-slate-500">Yield boost with timely actions.</p>
                    </div>
                    <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm sm:border-slate-100 sm:bg-slate-50">
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
                  className="absolute -top-10 right-6 w-40 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm sm:border-slate-200 sm:shadow-lg"
                >
                  <span className="text-xs font-medium text-slate-500">Community Threads</span>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">320+</p>
                  <p className="text-xs text-slate-500">Active expert conversations weekly.</p>
                </motion.div>

                <div className="relative mt-6">
                  <Link
                    href="/weather"
                    aria-label="Open weather insights"
                    className="block w-full max-w-[16rem] sm:max-w-[18rem]"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      className="relative -top-8 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50 sm:-top-10 sm:border-slate-200 sm:shadow-lg"
                    >
                      <span className="text-xs font-medium text-slate-500">Weather Sync</span>
                      <div className="mt-2 flex items-end gap-2">
                        <p className="text-3xl font-semibold text-slate-900">72°F</p>
                        <span className="text-xs text-slate-500">Field average</span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">Automated scheduling for irrigation.</p>
                      <p className="mt-2 text-[10px] font-semibold text-emerald-600">Tap for full forecast</p>
                    </motion.div>
                  </Link>
                </div>
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
          <p className="mt-3 text-base font-semibold text-slate-900">Diagnose plant diseases instantly.</p>
          <p className="mt-2 text-xs text-slate-500">
            Upload a symptomatic leaf photo and get prescription-grade guidance.
          </p>
          <Link href="/plant-identification" className="mt-4 inline-flex">
            <motion.button
              className="flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-700"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Trees className="h-4 w-4" />
              Disease Lab
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
          className="relative bg-white px-4 py-24 sm:px-6 min-h-screen flex flex-col justify-center overflow-hidden"
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
            {/* Crop Recommendation Feature */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative flex h-full flex-col justify-between rounded-3xl border border-emerald-50 bg-white/80 p-8 shadow-none backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-400/60 hover:shadow-[0_35px_70px_-40px_rgba(34,197,94,0.45)] sm:p-10 md:border-slate-200 md:bg-white/90 md:shadow-[0_25px_60px_-35px_rgba(15,23,42,0.55)]"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 shadow-[0_12px_30px_-20px_rgba(34,197,94,0.9)]"
                >
                  <Sprout className="h-8 w-8" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10 mt-8">
                  <h3 className="text-2xl font-semibold text-slate-900 tracking-tight mb-4 group-hover:text-green-600 transition-colors duration-300">
                    AI Crop Recommendation
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-10">
                    Blend soil health, weather windows, and regional insights to get planting guidance that keeps inputs lean and yields resilient.
                  </p>

                  <Link href="/crop-recommendation">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 rounded-full border border-green-500/70 bg-white px-6 py-3 text-sm font-semibold text-green-600 transition-all duration-300 hover:bg-green-500 hover:text-white"
                    >
                      Get Recommendations
                      <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            {/* Crop Management Feature */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative flex h-full flex-col justify-between rounded-3xl border border-emerald-50 bg-white/80 p-8 shadow-none backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-400/60 hover:shadow-[0_35px_70px_-40px_rgba(34,197,94,0.45)] sm:p-10 md:border-slate-200 md:bg-white/90 md:shadow-[0_25px_60px_-35px_rgba(15,23,42,0.55)]"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 shadow-[0_12px_30px_-20px_rgba(34,197,94,0.9)]"
                >
                  <ClipboardCheck className="h-8 w-8" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10 mt-8">
                  <h3 className="text-2xl font-semibold text-slate-900 tracking-tight mb-4 group-hover:text-green-600 transition-colors duration-300">
                    Unified Crop Management
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-10">
                    Plan rotations, track field tasks, and sync inventory with fulfilment so your team stays aligned from sowing to shipment.
                  </p>

                  <Link href="/crop-management">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 rounded-full border border-green-500/70 bg-white px-6 py-3 text-sm font-semibold text-green-600 transition-all duration-300 hover:bg-green-500 hover:text-white"
                    >
                      Manage Crops
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
