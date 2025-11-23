"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  variant?: "fade" | "slide" | "scale" | "rotate" | "curtain";
}

// Animation variants for different transition types
const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: "easeInOut" }
  },
  slide: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 },
    transition: { duration: 0.4, ease: "easeInOut" }
  },
  rotate: {
    initial: { rotateY: -90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: 90, opacity: 0 },
    transition: { duration: 0.5, ease: "easeInOut" }
  },
  curtain: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "-100%" },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function PageTransition({ 
  children, 
  className = "", 
  variant = "fade" 
}: PageTransitionProps) {
  const selectedVariant = variants[variant];

  return (
    <motion.div
      className={`min-h-screen ${className}`}
      initial={selectedVariant.initial}
      animate={selectedVariant.animate}
      exit={selectedVariant.exit}
      transition={selectedVariant.transition}
    >
      {children}
    </motion.div>
  );
}

// Specialized loading transition component
export function PageLoadingTransition({ isLoading }: { isLoading: boolean }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 bg-gradient-to-br from-emerald-500/90 to-teal-600/90 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <motion.div
              className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
              className="text-white text-lg font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Route transition wrapper
export function RouteTransition({ 
  children, 
  routeKey 
}: { 
  children: ReactNode; 
  routeKey: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.22, 1, 0.36, 1],
          delay: 0.1
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Staggered children animation
export function StaggerChildren({ 
  children, 
  className = "",
  staggerDelay = 0.1,
  childVariant = "fadeInUp"
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  childVariant?: "fadeInUp" | "fadeInScale" | "slideInX";
}) {
  const childVariants = {
    fadeInUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    },
    fadeInScale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    },
    slideInX: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.isArray(children) ? children.map((child, index) => (
        <motion.div
          key={index}
          variants={childVariants[childVariant]}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {child}
        </motion.div>
      )) : (
        <motion.div
          variants={childVariants[childVariant]}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}