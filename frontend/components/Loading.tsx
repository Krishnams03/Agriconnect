"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface InitialLoadingProps {
  onComplete?: () => void;
}

const randomWithin = (limit: number) => Math.random() * limit;

export default function InitialLoading({ onComplete }: InitialLoadingProps) {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStage(1), 200),
      setTimeout(() => setAnimationStage(2), 600),
      setTimeout(() => setAnimationStage(3), 1000),
      setTimeout(() => setAnimationStage(4), 1600),
    ];

    const completion = setTimeout(() => onComplete?.(), 2200);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completion);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-30"
            initial={{
              x: randomWithin(typeof window === "undefined" ? 1200 : window.innerWidth),
              y: randomWithin(typeof window === "undefined" ? 800 : window.innerHeight),
              scale: 0,
            }}
            animate={{
              scale: [0, 1, 0],
              y: [null, randomWithin(typeof window === "undefined" ? 800 : window.innerHeight)],
            }}
            transition={{ duration: 3, delay: Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4">
        <AnimatePresence>
          {animationStage >= 1 && (
            <motion.div
              key="title"
              className="mb-4"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 10 }}
            >
              <div className="flex flex-wrap justify-center gap-2">
                {Array.from("AgriConnect").map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400"
                    initial={{ opacity: 0, y: 40, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {animationStage >= 2 && (
            <motion.p
              key="subtitle"
              className="text-lg md:text-xl text-emerald-200 mb-8 font-light tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              Connecting Farmers, Growing Futures
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {animationStage >= 3 && (
            <motion.div
              key="loader"
              className="flex flex-col items-center space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div className="relative" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                <div className="w-14 h-14 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 bg-emerald-400/10 flex items-center justify-center">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                    🌱
                  </motion.div>
                </div>
              </motion.div>
              <div className="flex items-center space-x-2">
                {[0, 1, 2].map(index => (
                  <motion.div
                    key={index}
                    className="w-3 h-3 bg-emerald-400 rounded-full"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.2, delay: index * 0.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>
              <motion.p
                className="text-emerald-300 text-sm font-medium tracking-wider"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                Loading your agricultural experience...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-10 w-64 h-1 bg-emerald-800 rounded-full overflow-hidden mx-auto"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 256 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.2, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
