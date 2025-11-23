// Animation variants and utilities for consistent animations across the app
import { Variants } from "framer-motion";

// Common easing functions
export const easing = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  bouncy: [0.68, -0.55, 0.265, 1.55],
  soft: [0.22, 1, 0.36, 1],
  sharp: [0.4, 0, 0.2, 1],
} as const;

// Fade animations
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: easing.smooth }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3, ease: easing.sharp }
  }
};

// Slide animations
export const slideVariants = {
  up: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: easing.soft }
    },
    exit: { 
      opacity: 0, 
      y: -30,
      transition: { duration: 0.3, ease: easing.sharp }
    }
  },
  down: {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: easing.soft }
    },
    exit: { 
      opacity: 0, 
      y: 30,
      transition: { duration: 0.3, ease: easing.sharp }
    }
  },
  left: {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: easing.soft }
    },
    exit: { 
      opacity: 0, 
      x: -30,
      transition: { duration: 0.3, ease: easing.sharp }
    }
  },
  right: {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: easing.soft }
    },
    exit: { 
      opacity: 0, 
      x: 30,
      transition: { duration: 0.3, ease: easing.sharp }
    }
  }
};

// Scale animations
export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: easing.bouncy }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.3, ease: easing.sharp }
  },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2, ease: easing.smooth }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1, ease: easing.sharp }
  }
};

// Stagger container animations
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      duration: 0.2
    }
  }
};

// Item animations for staggered containers
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: easing.soft }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2, ease: easing.sharp }
  }
};

// Card hover animations
export const cardVariants: Variants = {
  rest: { 
    scale: 1,
    y: 0,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
  },
  hover: { 
    scale: 1.03,
    y: -8,
    boxShadow: "0px 20px 25px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.3, ease: easing.soft }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1, ease: easing.sharp }
  }
};

// Page transition variants
export const pageVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4, ease: easing.smooth }
  },
  slide: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
    transition: { duration: 0.5, ease: easing.soft }
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 },
    transition: { duration: 0.4, ease: easing.soft }
  }
};

// Loading animations
export const loadingVariants = {
  spin: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  },
  pulse: {
    animate: { 
      scale: [1, 1.1, 1],
      opacity: [1, 0.7, 1] 
    },
    transition: { duration: 1.5, repeat: Infinity, ease: easing.smooth }
  },
  bounce: {
    animate: { y: [0, -10, 0] },
    transition: { duration: 0.6, repeat: Infinity, ease: easing.bouncy }
  }
};

// Text animations
export const textVariants = {
  typewriter: {
    hidden: { width: 0 },
    visible: { 
      width: "100%",
      transition: { duration: 2, ease: easing.smooth }
    }
  },
  fadeInWords: (i: number) => ({
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.6,
        ease: easing.soft 
      }
    }
  }),
  slideInLetters: (i: number) => ({
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.4,
        ease: easing.bouncy 
      }
    }
  })
};

// Scroll-triggered animations
export const scrollVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: easing.soft,
      staggerChildren: 0.2 
    }
  }
};

// Floating animation
export const floatingVariants: Variants = {
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Agricultural-themed animations
export const agriculturalVariants = {
  growing: {
    hidden: { scaleY: 0, opacity: 0 },
    visible: { 
      scaleY: 1, 
      opacity: 1,
      transition: { 
        duration: 1.2,
        ease: easing.soft,
        transformOrigin: "bottom"
      }
    }
  },
  sprouting: {
    hidden: { scale: 0, rotateZ: -45, opacity: 0 },
    visible: { 
      scale: 1, 
      rotateZ: 0, 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: easing.bouncy,
        delay: 0.2
      }
    }
  },
  harvest: {
    animate: {
      scale: [1, 1.05, 1],
      rotateZ: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
};

// Button hover animations
export const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2, ease: easing.smooth }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1, ease: easing.sharp }
  }
};

// Navigation animations
export const navVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.6, 
      ease: easing.soft,
      staggerChildren: 0.1 
    }
  },
  scrolled: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    transition: { duration: 0.3, ease: easing.smooth }
  }
};

// Modal animations
export const modalVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    y: 20
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.3, 
      ease: easing.soft 
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: { 
      duration: 0.2, 
      ease: easing.sharp 
    }
  }
};

// Utility functions
export const createStaggerTransition = (delay = 0.1, duration = 0.6) => ({
  staggerChildren: delay,
  delayChildren: 0.2,
  duration
});

export const createHoverTransition = (scale = 1.05, duration = 0.2) => ({
  scale,
  transition: { duration, ease: easing.smooth }
});

export const createScrollAnimation = (y = 50, duration = 0.8) => ({
  hidden: { opacity: 0, y },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration, ease: easing.soft }
  }
});

export default {
  fadeVariants,
  slideVariants,
  scaleVariants,
  containerVariants,
  itemVariants,
  cardVariants,
  pageVariants,
  loadingVariants,
  textVariants,
  scrollVariants,
  floatingVariants,
  agriculturalVariants,
  buttonVariants,
  navVariants,
  modalVariants,
  easing,
  createStaggerTransition,
  createHoverTransition,
  createScrollAnimation
};