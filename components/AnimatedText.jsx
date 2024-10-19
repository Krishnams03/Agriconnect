// components/AnimatedText.jsx
import { motion } from 'framer-motion'

const AnimatedText = ({ text, className, delay = 0 }) => {
  // Split the text into individual letters
  const letters = Array.from(text)

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: i * delay },
    }),
  }

  const child = {
    hidden: {
      opacity: 0,
      y: `0.25em`,
    },
    visible: {
      opacity: 1,
      y: `0em`,
      transition: {
        duration: 0.6,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child}>
          {letter === ' ' ? '\u00A0' : letter} {/* Handle spaces */}
        </motion.span>
      ))}
    </motion.div>
  )
}

export default AnimatedText
