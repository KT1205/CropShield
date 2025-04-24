/* "use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"

const Background = () => {
  const { theme } = useTheme()

  return (
    <motion.div
      className="fixed inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`w-full h-full ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
            : "bg-gradient-to-br from-green-50 via-green-100 to-green-200"
        } transition-colors duration-500`}
      />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5" />
    </motion.div>
  )
}

export default Background

 */

"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"

const Background = () => {
  const { theme } = useTheme()

  return (
    <motion.div
      className="fixed inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`w-full h-full transition-colors duration-500 ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#000000] via-[#1a2d25] to-[#040d08]" // Deep green-black tones
            : "bg-gradient-to-br from-green-50 via-green-100 to-green-200"
        }`}
      />
      {/* Subtle noise texture overlay for a premium feel */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
    </motion.div>
  )
}

export default Background
