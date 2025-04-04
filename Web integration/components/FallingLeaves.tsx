/* "use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const FallingLeaves = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const leaves = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className={`absolute w-8 h-8 ${theme === "dark" ? "text-red-800" : "text-green-600"}`}
      initial={{
        x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 0),
        y: -20,
        rotate: 0,
        scale: Math.random() * 0.5 + 0.5,
      }}
      animate={{
        y: typeof window !== "undefined" ? window.innerHeight + 20 : 0,
        rotate: 360,
        x: `calc(${Math.random() * 100}vw + ${Math.sin(Math.random() * Math.PI * 2) * 200}px)`,
      }}
      transition={{
        duration: Math.random() * 20 + 20,
        repeat: Number.POSITIVE_INFINITY,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      style={{
        zIndex: Math.floor(Math.random() * 20),
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" />
      </svg>
    </motion.div>
  ))

  return <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">{leaves}</div>
}

export default FallingLeaves

 */

"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const FallingLeaves = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const leaves = Array.from({ length: 20 }, (_, i) => {
    const duration = Math.random() * 10 + 10 // Slightly faster fall (10s to 20s)
    const delay = Math.random() * 5 // Random delay to stagger leaves
    const xOffset = Math.random() * 100 // Random initial x position

    return (
      <motion.div
        key={i}
        className="absolute"
        initial={{
          x: `calc(${xOffset}vw)`,
          y: -50,
          rotate: Math.random() * 360,
          scale: Math.random() * 0.5 + 0.5, // Keeps original size variation
        }}
        animate={{
          y: typeof window !== "undefined" ? window.innerHeight + 50 : 0,
          rotate: 360,
          x: `calc(${Math.random() * 100}vw + ${Math.sin(Math.random() * Math.PI * 2) * 150}px)`,
        }}
        transition={{
          duration: duration, // Faster fall effect
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          delay: delay,
        }}
        style={{
          zIndex: 0,
          width: "100px", // Keeps original leaf size
          height: "100x",
          color: theme === "dark" ? "#8B0000" : "#228B22", // Dark mode = red, Light mode = green
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" />
        </svg>
      </motion.div>
    )
  })

  return <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">{leaves}</div>
}

export default FallingLeaves
