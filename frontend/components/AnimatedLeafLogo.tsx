"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

type AnimatedLeafLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap: Record<NonNullable<AnimatedLeafLogoProps["size"]>, string> = {
  sm: "h-12 w-12",
  md: "h-14 w-14",
  lg: "h-18 w-18"
};

const MAIN_PATH = "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z";
const VEIN_PATH = "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12";
const PATH_LENGTH = 120;

const AnimatedLeafLogo = ({ size = "md", className }: AnimatedLeafLogoProps) => {
  const containerClass = sizeMap[size];
  const gradientId = useId();
  const fillId = `${gradientId}-leaf-fill`;

  return (
    <motion.div
      className={clsx(
        "relative inline-flex items-center justify-center rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/4 via-white/2 to-transparent px-3 py-2 text-white shadow-[0_15px_40px_-35px_rgba(15,23,42,0.9)] backdrop-blur",
        containerClass,
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute inset-0 rounded-[2rem] bg-white/1" />
      <div className="absolute inset-[2px] rounded-[1.9rem] bg-gradient-to-br from-white/8 via-transparent to-black/5" />
      <motion.svg
        viewBox="0 0 24 24"
        className="relative h-full w-full"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <radialGradient id={fillId} cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#d1ffe0" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.12" />
          </radialGradient>
        </defs>
        <path d={MAIN_PATH} fill={`url(#${fillId})`} stroke="none" opacity={0.9} />
        <motion.path
          d={MAIN_PATH}
          fill="none"
          stroke="rgba(10,10,10,0.92)"
          strokeWidth={1.65}
          strokeDasharray={PATH_LENGTH}
          initial={{ strokeDashoffset: PATH_LENGTH, opacity: 0.32 }}
          animate={{ strokeDashoffset: [PATH_LENGTH, PATH_LENGTH * 0.3, -PATH_LENGTH], opacity: [0.32, 0.9, 0.35] }}
          transition={{ duration: 3.4, repeat: Infinity, repeatType: "loop", ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.path
          d={VEIN_PATH}
          fill="none"
          stroke="rgba(10,10,10,0.9)"
          strokeWidth={1.25}
          strokeDasharray={82}
          initial={{ strokeDashoffset: 82, opacity: 0.2 }}
          animate={{ strokeDashoffset: [82, 10, -82], opacity: [0.2, 0.8, 0.3] }}
          transition={{ duration: 3.4, repeat: Infinity, repeatType: "loop", ease: [0.4, 0, 0.2, 1] }}
        />
      </motion.svg>
    </motion.div>
  );
};

export default AnimatedLeafLogo;
