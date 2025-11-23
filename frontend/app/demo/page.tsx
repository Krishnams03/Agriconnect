'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import Loader from '@/components/Loader';
import { ScrollProgressWithSections } from '@/components/ScrollProgress';
import { 
  fadeVariants, 
  slideVariants, 
  scaleVariants,
  cardVariants,
  buttonVariants,
  agriculturalVariants,
  floatingVariants
} from '@/lib/animations';

// Simple stagger container component
const StaggerContainer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default function DemoPage() {
  const [showLoader, setShowLoader] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<'agricultural' | 'pulse' | 'dots' | 'spinner'>('agricultural');

  // Demo sections for scroll progress
  const sections = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'animations', label: 'Animation Demo' },
    { id: 'cards', label: 'Card Gallery' },
    { id: 'loaders', label: 'Loader Variants' },
    { id: 'interactions', label: 'Interactions' }
  ];

  const handleLoaderDemo = (variant: typeof selectedVariant) => {
    setSelectedVariant(variant);
    setShowLoader(true);
    setTimeout(() => setShowLoader(false), 3000);
  };

  return (
    <PageTransition variant="fade" className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Show loader overlay when demo is active */}
      {showLoader && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <Loader variant={selectedVariant} size="lg" />
        </div>
      )}

      <ScrollProgressWithSections 
        sections={sections}
        showOnScroll={false}
      />

      <div className="relative">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center p-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <motion.h1
                className="text-6xl font-bold text-emerald-800 mb-4"
                variants={slideVariants.up}
                initial="hidden"
                animate="visible"
              >
                AgriConnect Animation Demo
              </motion.h1>
              
              <motion.p
                className="text-xl text-emerald-600"
                variants={slideVariants.up}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                Experience smooth animations and interactive components
              </motion.p>
            </motion.div>

            {/* Floating elements */}
            <div className="absolute top-20 left-20">
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className="w-12 h-12 bg-emerald-200 rounded-full opacity-50"
              />
            </div>
            
            <div className="absolute top-40 right-32">
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className="w-8 h-8 bg-teal-300 rounded-full opacity-40"
                transition={{ delay: 1 }}
              />
            </div>

            <div className="absolute bottom-32 left-1/4">
              <motion.div
                variants={agriculturalVariants.sprouting}
                initial="hidden"
                animate="visible"
                className="w-6 h-6 bg-green-400 rounded-full"
              />
            </div>
          </div>
        </section>

        {/* Animation Demo Section */}
        <section id="animations" className="min-h-screen py-20 px-8">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-4xl font-bold text-emerald-800 text-center mb-16"
              variants={slideVariants.up}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Animation Variants
            </motion.h2>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Fade Animation */}
              <motion.div
                variants={cardVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <motion.h3
                  className="text-xl font-semibold mb-4 text-emerald-700"
                  variants={fadeVariants}
                  initial="hidden"
                  whileInView="visible"
                >
                  Fade Animation
                </motion.h3>
                <motion.div
                  className="w-full h-32 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg"
                  variants={fadeVariants}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ delay: 0.3 }}
                />
              </motion.div>

              {/* Scale Animation */}
              <motion.div
                variants={cardVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <motion.h3
                  className="text-xl font-semibold mb-4 text-emerald-700"
                  variants={scaleVariants}
                  initial="hidden"
                  whileInView="visible"
                >
                  Scale Animation
                </motion.h3>
                <motion.div
                  className="w-full h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg"
                  variants={scaleVariants}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ delay: 0.3 }}
                />
              </motion.div>

              {/* Slide Animation */}
              <motion.div
                variants={cardVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <motion.h3
                  className="text-xl font-semibold mb-4 text-emerald-700"
                  variants={slideVariants.left}
                  initial="hidden"
                  whileInView="visible"
                >
                  Slide Animation
                </motion.h3>
                <motion.div
                  className="w-full h-32 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg"
                  variants={slideVariants.right}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ delay: 0.3 }}
                />
              </motion.div>
            </StaggerContainer>
          </div>
        </section>

        {/* Card Gallery Section */}
        <section id="cards" className="min-h-screen py-20 px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-4xl font-bold text-emerald-800 text-center mb-16"
              variants={slideVariants.up}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Interactive Cards
            </motion.h2>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }, (_, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="bg-gradient-to-br from-emerald-100 to-teal-200 p-6 rounded-xl shadow-md cursor-pointer"
                >
                  <motion.div
                    className="w-full h-24 bg-emerald-300 rounded-lg mb-4"
                    variants={scaleVariants}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ delay: i * 0.1 }}
                  />
                  <motion.h4
                    className="font-semibold text-emerald-800"
                    variants={fadeVariants}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ delay: i * 0.1 + 0.2 }}
                  >
                    Card {i + 1}
                  </motion.h4>
                  <motion.p
                    className="text-emerald-600 text-sm mt-2"
                    variants={fadeVariants}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ delay: i * 0.1 + 0.3 }}
                  >
                    Hover for animation
                  </motion.p>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Loader Variants Section */}
        <section id="loaders" className="min-h-screen py-20 px-8 bg-gradient-to-br from-teal-50 to-emerald-100">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-4xl font-bold text-emerald-800 text-center mb-16"
              variants={slideVariants.up}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Loader Variants
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(['agricultural', 'pulse', 'dots', 'spinner'] as const).map((variant, i) => (
                <motion.div
                  key={variant}
                  variants={cardVariants}
                  initial="rest"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-lg text-center"
                >
                  <h3 className="text-lg font-semibold mb-6 text-emerald-700 capitalize">
                    {variant} Loader
                  </h3>
                  
                  <div className="flex justify-center mb-6">
                    <Loader variant={variant} size="md" />
                  </div>
                  
                  <motion.button
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleLoaderDemo(variant)}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium"
                  >
                    Demo {variant}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactions Section */}
        <section id="interactions" className="min-h-screen py-20 px-8">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h2
              className="text-4xl font-bold text-emerald-800 mb-16"
              variants={slideVariants.up}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Interactive Elements
            </motion.h2>

            <div className="space-y-8">
              {/* Button Gallery */}
              <div className="flex flex-wrap justify-center gap-4">
                {['Primary', 'Secondary', 'Success', 'Warning'].map((label, i) => (
                  <motion.button
                    key={label}
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    className={`px-6 py-3 rounded-lg font-medium ${
                      i === 0 ? 'bg-emerald-500 text-white' :
                      i === 1 ? 'bg-gray-500 text-white' :
                      i === 2 ? 'bg-green-500 text-white' :
                      'bg-orange-500 text-white'
                    }`}
                  >
                    {label} Button
                  </motion.button>
                ))}
              </div>

              {/* Agricultural Growing Animation */}
              <motion.div
                className="flex justify-center mt-16"
                variants={agriculturalVariants.growing}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="relative">
                  <motion.div
                    className="w-32 h-32 bg-gradient-to-t from-emerald-600 to-green-400 rounded-t-full"
                    variants={agriculturalVariants.sprouting}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ delay: 0.5 }}
                  />
                  <p className="text-emerald-600 mt-4 font-medium">
                    Agricultural Growth Animation
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}