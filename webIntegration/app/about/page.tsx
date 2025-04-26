"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

export default function About() {
  const ref = useRef(null)

  return (
    <div ref={ref} className="container mx-auto px-4 py-12">
      <motion.h1
        className="text-5xl font-bold text-center mb-12 text-green-700 dark:text-green-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About CropShield
      </motion.h1>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative h-[400px]"> {/* Removed `motion.div` with `y` animation */}
          <Image
            src="/logo.jpg"
            alt="CropShield in action"
            layout="fill"
            objectFit="contain"
            className="rounded-lg shadow-xl"
          />
        </div>
        <motion.div
          className="space-y-6 text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-lg">
            CropShield is an innovative agricultural crop health prediction system that leverages the power of
            artificial intelligence to help farmers and agronomists maintain healthy crops and maximize yields.
          </p>
          <p className="text-lg">
            Our advanced machine learning models analyze images of crops to detect early signs of diseases, pest
            infestations, and nutrient deficiencies. By providing early warnings and actionable insights, CropShield
            empowers farmers to take proactive measures and protect their crops before significant damage occurs.
          </p>
          <p className="text-lg">
            With CropShield, we aim to revolutionize the agricultural industry by combining cutting-edge technology with
            traditional farming practices, ensuring food security and sustainable agriculture for future generations.
          </p>
        </motion.div>
      </div>
      <motion.div
        className="mt-16 bg-white/10 dark:bg-black/10 backdrop-blur-lg rounded-xl p-8 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-green-600 dark:text-green-400">Our Mission</h2>
        <p className="text-xl text-gray-700 dark:text-gray-300">
          To empower farmers worldwide with AI-driven insights, enabling them to make informed decisions, increase crop
          yields, and contribute to global food security.
        </p>
      </motion.div>
    </div>
  )
}
