/**
 * Mobile Animation Optimization Utilities
 * Provides responsive animation configurations and performance optimizations for mobile devices
 */

import React, { useEffect, useState } from 'react';
import { Variants } from 'framer-motion';

// Extended Navigator interface for device memory
interface ExtendedNavigator extends Navigator {
  deviceMemory?: number;
}

// Device detection hook
export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Device type detection
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }

      setIsTouchDevice(hasTouch);

      // Basic performance detection
      const extendedNavigator = navigator as ExtendedNavigator;
      const isSlowDevice = Boolean(
        (userAgent.includes('android') && userAgent.includes('chrome/') && 
        parseInt(userAgent.split('chrome/')[1]) < 80) ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
        (extendedNavigator.deviceMemory && extendedNavigator.deviceMemory <= 2)
      );
        
      setIsLowPerformance(isSlowDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { deviceType, isTouchDevice, isLowPerformance };
};

// Reduced motion preference detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Adaptive animation configuration
export const useAdaptiveAnimation = () => {
  const { deviceType, isTouchDevice, isLowPerformance } = useDeviceType();
  const prefersReducedMotion = useReducedMotion();

  const getAnimationConfig = () => ({
    // Disable animations if user prefers reduced motion
    shouldAnimate: !prefersReducedMotion && !isLowPerformance,
    
    // Reduced duration for mobile devices
    duration: deviceType === 'mobile' ? 0.3 : deviceType === 'tablet' ? 0.4 : 0.5,
    
    // Simplified easing for better performance
    ease: isLowPerformance ? 'linear' : [0.25, 0.46, 0.45, 0.94] as const,
    
    // Touch-optimized hover states
    enableHover: !isTouchDevice,
    
    // Reduced stagger delay for mobile
    staggerDelay: deviceType === 'mobile' ? 0.05 : 0.1,
    
    // Simplified transforms for low-end devices
    useSimpleTransforms: isLowPerformance,
  });

  return getAnimationConfig();
};

// Mobile-optimized animation variants
export const createMobileOptimizedVariants = (
  baseVariants: Variants,
  config: ReturnType<typeof useAdaptiveAnimation>
): Variants => {
  if (!config.shouldAnimate) {
    // Return static variants if animations are disabled
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 }
    };
  }

  // Optimize variants based on device capabilities
  const optimizedVariants: Variants = {};
  
  Object.entries(baseVariants).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      optimizedVariants[key] = {
        ...value,
        transition: {
          ...value.transition,
          duration: config.duration,
          ease: config.ease
        }
      };

      // Simplify transforms for low-performance devices
      if (config.useSimpleTransforms) {
        // Remove complex transforms like rotateY, scale combinations
        const simplified = { ...value };
        delete simplified.rotateY;
        delete simplified.rotateX;
        delete simplified.rotateZ;
        
        // Reduce scale variations
        if (simplified.scale && Array.isArray(simplified.scale) && simplified.scale.length > 2) {
          const scaleArray = simplified.scale as (string | number)[];
          simplified.scale = [scaleArray[0], scaleArray[scaleArray.length - 1]];
        }
        
        optimizedVariants[key] = simplified;
      }
    }
  });

  return optimizedVariants;
};

// Touch-optimized gesture configurations
export const getTouchGestureConfig = (deviceType: 'mobile' | 'tablet' | 'desktop') => ({
  // Larger tap targets for mobile
  tap: {
    scale: deviceType === 'mobile' ? 0.98 : 0.95,
    transition: { duration: 0.1 }
  },
  
  // Adjust hover states for touch devices
  hover: deviceType === 'desktop' ? {
    scale: 1.05,
    transition: { duration: 0.2 }
  } : {},
  
  // Optimized drag constraints
  drag: deviceType === 'mobile',
  dragConstraints: deviceType === 'mobile' ? { top: -10, bottom: 10, left: -10, right: 10 } : {},
  
  // Touch-friendly momentum
  dragElastic: deviceType === 'mobile' ? 0.1 : 0.2
});

// Performance monitoring utilities
export const useAnimationPerformance = () => {
  const [frameRate, setFrameRate] = useState(60);
  const [isPerformant, setIsPerformant] = useState(true);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrame: number;

    const measurePerformance = (currentTime: number) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setFrameRate(fps);
        setIsPerformant(fps > 30);
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationFrame = requestAnimationFrame(measurePerformance);
    };

    animationFrame = requestAnimationFrame(measurePerformance);
    
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return { frameRate, isPerformant };
};

// Responsive animation wrapper component
interface ResponsiveAnimationProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const ResponsiveAnimation: React.FC<ResponsiveAnimationProps> = ({
  children,
  fallback,
  className = ''
}) => {
  const config = useAdaptiveAnimation();
  
  if (!config.shouldAnimate && fallback) {
    return React.createElement('div', { className }, fallback);
  }
  
  return React.createElement('div', { className }, children);
};

// Optimized scroll animation hook
export const useOptimizedScrollAnimation = () => {
  const { deviceType } = useDeviceType();
  const [isScrolling, setIsScrolling] = useState(false);
  
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, deviceType === 'mobile' ? 100 : 150);
    };

    // Use passive listeners for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [deviceType]);

  return { isScrolling };
};

// Animation utilities for different scenarios
export const animationUtils = {
  // Reduced complexity for mobile
  getMobileVariants: (variants: Variants) => ({
    ...variants,
    transition: { duration: 0.3, ease: 'easeOut' }
  }),
  
  // Battery-saving mode
  getBatterySavingVariants: () => ({
    initial: { opacity: 0.8 },
    animate: { opacity: 1 },
    exit: { opacity: 0.8 }
  }),
  
  // High-performance variants
  getHighPerformanceVariants: (variants: Variants) => ({
    ...variants,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const mobileAnimations = {
  useDeviceType,
  useReducedMotion,
  useAdaptiveAnimation,
  createMobileOptimizedVariants,
  getTouchGestureConfig,
  useAnimationPerformance,
  ResponsiveAnimation,
  useOptimizedScrollAnimation,
  animationUtils
};

export default mobileAnimations;