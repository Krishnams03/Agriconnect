"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  variant?: "default" | "pulse" | "spinner" | "dots" | "agricultural";
  size?: "sm" | "md" | "lg";
  color?: "green" | "blue" | "purple" | "emerald";
  message?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  variant = "agricultural", 
  size = "md", 
  color = "green",
  message,
  className = ""
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const colorClasses = {
    green: "text-green-500 border-green-500",
    blue: "text-blue-500 border-blue-500",
    purple: "text-purple-500 border-purple-500",
    emerald: "text-emerald-500 border-emerald-500"
  };

  if (variant === "agricultural") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="relative">
          {/* Rotating seed/plant animation */}
          <motion.div
            className={`${sizeClasses[size]} rounded-full border-2 ${colorClasses[color]} border-opacity-30 flex items-center justify-center relative overflow-hidden`}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            {/* Growing plant animation */}
            <motion.div
              className={`absolute bottom-0 w-full bg-gradient-to-t from-green-400 to-green-600 rounded-full`}
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "bottom" }}
            />
            
            {/* Plant emoji that pulses */}
            <motion.div
              className="relative z-10 text-xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🌱
            </motion.div>
          </motion.div>

          {/* Surrounding particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 bg-green-400 rounded-full`}
              style={{
                top: "50%",
                left: "50%",
              }}
              animate={{
                x: [0, Math.cos(i * Math.PI / 2) * 30],
                y: [0, Math.sin(i * Math.PI / 2) * 30],
                opacity: [1, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.3,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
        
        {message && (
          <motion.p 
            className="mt-4 text-gray-600 text-sm font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {message}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1] 
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        {message && (
          <p className="mt-4 text-gray-600 text-sm font-medium">{message}</p>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`w-3 h-3 ${colorClasses[color]} rounded-full`}
            animate={{
              y: [-8, 8, -8],
              opacity: [1, 0.3, 1]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
        {message && (
          <p className="ml-4 text-gray-600 text-sm font-medium">{message}</p>
        )}
      </div>
    );
  }

  if (variant === "spinner") {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} border-4 ${colorClasses[color]} border-opacity-30 rounded-full`}
          style={{
            borderTopColor: color === "green" ? "#10b981" : 
                           color === "blue" ? "#3b82f6" :
                           color === "purple" ? "#8b5cf6" : "#059669"
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {message && (
          <p className="mt-4 text-gray-600 text-sm font-medium">{message}</p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-4 h-4 ${colorClasses[color]} rounded`}
            style={{
              transformOrigin: "center",
              top: "50%",
              left: "50%",
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
      {message && (
        <p className="ml-4 text-gray-600 text-sm font-medium">{message}</p>
      )}
    </div>
  );
};

export default Loader;
