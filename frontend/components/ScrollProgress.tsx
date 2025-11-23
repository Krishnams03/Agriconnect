"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

interface ScrollProgressProps {
  showOnScroll?: boolean;
  className?: string;
}

export default function ScrollProgress({ showOnScroll = true, className = "" }: ScrollProgressProps) {
  const [isVisible, setIsVisible] = useState(!showOnScroll);
  const { scrollYProgress } = useScroll();
  
  // Create smooth spring animation for the progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform scroll progress to dot position (0 to 100%)
  const dotPosition = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const smoothDotPosition = useSpring(dotPosition, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform dot position to Y coordinate
  const dotY = useTransform(smoothDotPosition, (v) => `${(v * 256) / 100 - 8}px`);

  // Transform scroll progress to percentage
  const progressPercentage = useTransform(scrollYProgress, (latest) => Math.round(latest * 100));

  // Show/hide based on scroll position
  useEffect(() => {
    if (!showOnScroll) return;

    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsVisible(scrolled > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showOnScroll]);

  if (!isVisible) return null;

  return (
    <div className={`fixed right-4 top-1/2 -translate-y-1/2 z-50 ${className}`}>
      {/* Main Progress Line */}
      <div className="relative">
        {/* Background Line */}
        <div className="w-1 h-64 bg-gray-200/30 rounded-full backdrop-blur-sm">
          {/* Progress Fill */}
          <motion.div
            className="w-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full origin-top"
            style={{ scaleY: scaleX }}
          />
        </div>

        {/* Moving Dot */}
        <motion.div
          className="absolute -left-1.5 top-0 w-4 h-4 -translate-y-2"
          style={{ y: dotY }}
        >
          <motion.div
            className="w-full h-full bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 border-2 border-white"
            animate={{ 
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 0 0 rgba(16, 185, 129, 0.4)",
                "0 0 0 8px rgba(16, 185, 129, 0.1)",
                "0 0 0 0 rgba(16, 185, 129, 0.4)"
              ]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Progress Percentage (Optional) */}
        <motion.div
          className="absolute -right-12 top-0 w-8 text-xs font-medium text-emerald-600 text-center"
          style={{ y: dotY }}
        >
          <motion.span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
            <motion.span>
              {progressPercentage}
            </motion.span>
            %
          </motion.span>
        </motion.div>
      </div>

      {/* Section Markers (Optional - can be customized) */}
      <div className="absolute left-0 top-0 w-1 h-64 pointer-events-none">
        {[0.25, 0.5, 0.75].map((position, index) => (
          <div
            key={index}
            className="absolute w-2 h-0.5 bg-gray-400/50 -left-0.5 rounded-full"
            style={{ top: `${position * 100}%`, transform: 'translateY(-50%)' }}
          />
        ))}
      </div>
    </div>
  );
}

// Enhanced version with section navigation
export function ScrollProgressWithSections({ 
  sections = [],
  showOnScroll = true,
  className = ""
}: {
  sections?: { id: string; label: string; color?: string }[];
  showOnScroll?: boolean;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(!showOnScroll);
  const [activeSection, setActiveSection] = useState(0);
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const dotPosition = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const smoothDotPosition = useSpring(dotPosition, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform dot position to Y coordinate
  const dotY = useTransform(smoothDotPosition, (v) => `${(v * 256) / 100 - 8}px`);

  // Handle section detection and visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      
      if (showOnScroll) {
        setIsVisible(scrolled > 100);
      }

      // Detect current section
      if (sections.length > 0) {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollProgress = scrolled / documentHeight;
        
        const sectionIndex = Math.floor(scrollProgress * sections.length);
        setActiveSection(Math.min(sectionIndex, sections.length - 1));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showOnScroll, sections]);

  // Navigate to section
  const navigateToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed right-4 top-1/2 -translate-y-1/2 z-50 ${className}`}>
      <div className="relative">
        {/* Background Line */}
        <div className="w-1 h-64 bg-gray-200/30 rounded-full backdrop-blur-sm">
          <motion.div
            className="w-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full origin-top"
            style={{ scaleY: scaleX }}
          />
        </div>

        {/* Moving Dot */}
        <motion.div
          className="absolute -left-1.5 top-0 w-4 h-4 -translate-y-2"
          style={{ y: dotY }}
        >
          <motion.div
            className="w-full h-full bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 border-2 border-white cursor-pointer"
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 0 0 rgba(16, 185, 129, 0.4)",
                "0 0 0 8px rgba(16, 185, 129, 0.1)",
                "0 0 0 0 rgba(16, 185, 129, 0.4)"
              ]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Section Markers */}
        {sections.map((section, index) => {
          const position = (index / Math.max(sections.length - 1, 1)) * 100;
          const isActive = index === activeSection;
          
          return (
            <motion.div
              key={section.id}
              className="absolute -left-2 w-5 h-5 cursor-pointer group"
              style={{ top: `${position}%` }}
              onClick={() => navigateToSection(section.id)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <div
                className={`w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-300 ${
                  isActive 
                    ? `bg-emerald-500 shadow-lg shadow-emerald-500/50` 
                    : `bg-gray-400 group-hover:bg-emerald-400`
                }`}
              />
              
              {/* Section Label */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg text-xs font-medium text-gray-700 whitespace-nowrap">
                  {section.label}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Current Section Label */}
        {sections[activeSection] && (
          <motion.div
            className="absolute -right-16 top-0 text-xs font-medium text-emerald-600"
            style={{ y: dotY }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              <div className="font-semibold">{sections[activeSection].label}</div>
              <div className="text-gray-500 text-xs">
                {Math.round(scrollYProgress.get() * 100)}%
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}