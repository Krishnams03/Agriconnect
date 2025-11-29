import { motion } from "framer-motion";
import { Leaf, Home, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  accent: "green" | "blue";
}

const features: Feature[] = [
  {
    icon: <Leaf className="h-12 w-12 text-white" />,
    title: "Plant Disease Detection",
    description:
      "Advanced AI-powered plant disease identification system. Upload a photo of your plant and get instant, accurate diagnosis with treatment recommendations.",
    link: "/plant-disease-detection",
    buttonText: "Start Detection",
    accent: "green",
  },
  {
    icon: <Home className="h-12 w-12 text-white" />,
    title: "Agricultural Marketplace",
    description:
      "Complete marketplace for farmers and buyers. Trade crops, fertilizers, and equipment with secure payments and transparent pricing.",
    link: "/marketplace",
    buttonText: "Explore Market",
    accent: "blue",
  },
];

export default function FeaturesSection() {
  return (
    <motion.section
      id="features"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.3 }}
      className="bg-gradient-to-b from-white via-green-50 to-green-100 py-20"
    >
      <motion.h2
      className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Core Features</span>
      </motion.h2>

      <motion.p
        className="text-lg md:text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        Discover the tools that make agricultural management smarter, easier, and more productive than ever before.
      </motion.p>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl">
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>
    </motion.section>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const isGreen = feature.accent === "green";
  const iconBg = isGreen
    ? "bg-gradient-to-br from-green-400 to-emerald-500"
    : "bg-gradient-to-br from-blue-400 to-cyan-500";
  const buttonBg = isGreen
    ? "bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600"
    : "bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative overflow-hidden bg-white/90 backdrop-blur-sm border border-white/40 shadow-xl rounded-3xl p-8 text-center group"
    >
      <motion.div
        className={`relative z-10 p-6 ${iconBg} rounded-2xl mb-6 mx-auto w-fit shadow-lg`}
        whileHover={{ scale: 1.05 }}
      >
        {feature.icon}
      </motion.div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
      <p className="text-gray-600 mb-8 leading-relaxed">{feature.description}</p>
      <Link href={feature.link}>
        <Button className={`w-full ${buttonBg} text-white border-0 py-3 px-6 rounded-xl font-semibold transition-all duration-300`}>
          {feature.buttonText}
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </Link>
      <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
    </motion.div>
  );
}
