"use client";"use client";



import { useEffect } from "react";import { useEffect } from "react";

import { motion } from "framer-motion";import { motion } from "framer-motion";



interface InitialLoadingProps {interface InitialLoadingProps {

  onComplete: () => void;  onComplete: () => void;

}}



export default function InitialLoading({ onComplete }: InitialLoadingProps) {export default function InitialLoading({ onComplete }: InitialLoadingProps) {

  useEffect(() => {  useEffect(() => {

    const timer = setTimeout(() => {    // Simple timer - complete loading after animation

      onComplete();    const timer = setTimeout(() => {

    }, 800);      onComplete();

    }, 600); // Quick loading

    return () => clearTimeout(timer);

  }, [onComplete]);    return () => clearTimeout(timer);

  }, [onComplete]);

  return (

    <motion.div  return (

      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900"    <motion.div

      initial={{ opacity: 1 }}      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900"

      exit={{ opacity: 0 }}      initial={{ opacity: 1 }}

      transition={{ duration: 0.5 }}      exit={{ opacity: 0 }}

    >      transition={{ duration: 0.5 }}

      <motion.div    >

        className="text-center"      {/* Logo and Title */}

        initial={{ scale: 0.8, opacity: 0 }}      <motion.div

        animate={{ scale: 1, opacity: 1 }}        className="text-center"

        transition={{ duration: 0.5 }}        initial={{ scale: 0.8, opacity: 0 }}

      >        animate={{ scale: 1, opacity: 1 }}

        <motion.div        transition={{ duration: 0.5 }}

          className="text-6xl mb-4"      >

          animate={{ rotate: 360 }}        <motion.div

          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}          className="text-6xl mb-4"

        >          animate={{ rotate: 360 }}

          🌱          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}

        </motion.div>        >

        <h1 className="text-4xl font-bold text-white mb-2">AgriConnect</h1>          🌱

        <p className="text-green-300 text-lg">Connecting Agriculture</p>        </motion.div>

      </motion.div>        <h1 className="text-4xl font-bold text-white mb-2">AgriConnect</h1>

        <p className="text-green-300 text-lg">Connecting Agriculture</p>

      <motion.div      </motion.div>

        className="mt-8 flex space-x-1"

        initial={{ opacity: 0 }}      {/* Loading Animation */}

        animate={{ opacity: 1 }}      <motion.div

        transition={{ delay: 0.3 }}        className="mt-8 flex space-x-1"

      >        initial={{ opacity: 0 }}

        {[0, 1, 2].map((i) => (        animate={{ opacity: 1 }}

          <motion.div        transition={{ delay: 0.3 }}

            key={i}      >

            className="w-3 h-3 bg-green-400 rounded-full"        {[0, 1, 2].map((i) => (

            animate={{          <motion.div

              scale: [1, 1.2, 1],            key={i}

              opacity: [0.5, 1, 0.5],            className="w-3 h-3 bg-green-400 rounded-full"

            }}            animate={{

            transition={{              scale: [1, 1.2, 1],

              duration: 0.8,              opacity: [0.5, 1, 0.5],

              repeat: Infinity,            }}

              delay: i * 0.2,            transition={{

            }}              duration: 0.8,

          />              repeat: Infinity,

        ))}              delay: i * 0.2,

      </motion.div>            }}

    </motion.div>          />

  );        ))}

}      </motion.div>
    </motion.div>
  );
}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-30"
            initial={{ 
              x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200, 
              y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800,
              scale: 0 
            }}
            animate={{ 
              scale: [0, 1, 0],
              y: [null, typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800]
            }}
            transition={{ 
              duration: 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Animated Title */}
        <AnimatePresence>
          {animationStage >= 1 && (
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
            >
              <div className="flex flex-wrap justify-center gap-2">
                {Array.from("AgriConnect").map((letter, index) => (
                  <motion.span
                    key={index}
                    className="text-4xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400"
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtitle */}
        <AnimatePresence>
          {animationStage >= 2 && (
            <motion.p
              className="text-lg md:text-xl text-emerald-200 mb-8 font-light tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Connecting Farmers, Growing Future
            </motion.p>
          )}
        </AnimatePresence>

        {/* Enhanced Loading Indicator */}
        <AnimatePresence>
          {animationStage >= 3 && (
            <motion.div
              className="flex flex-col items-center space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Spinning Plant Icon */}
              <motion.div
                className="relative"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                <div className="w-12 h-12 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 bg-emerald-400/10 flex items-center justify-center">
                  <motion.div
                    className="w-6 h-6 text-emerald-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🌱
                  </motion.div>
                </div>
              </motion.div>

              {/* Enhanced Loading Dots */}
              <div className="flex items-center space-x-2">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-3 h-3 bg-emerald-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.2,
                      delay: index * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              <motion.p
                className="text-emerald-300 text-sm font-medium tracking-wider"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading your agricultural experience...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-emerald-800 rounded-full overflow-hidden"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 256 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.5, delay: 1, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* Overlay for smooth exit */}
      <motion.div
        className="absolute inset-0 bg-slate-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: animationStage >= 4 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
}
