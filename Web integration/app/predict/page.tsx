"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Predict() {
  const router = useRouter()

  const predictionResult = {
    cropName: "Wheat",
    health: "Healthy",
    confidence: 95,
    recommendations: [
      "Continue with current irrigation schedule",
      "Monitor for any signs of pest activity",
      "Plan for harvest in approximately 2 weeks",
    ],
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        className="text-5xl font-bold text-center mb-12 text-green-600 dark:text-green-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Prediction Result
      </motion.h1>
      <motion.div
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">{predictionResult.cropName}</h2>
            <span
              className={`text-lg font-semibold px-3 py-1 rounded-full ${
                predictionResult.health === "Healthy"
                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
              }`}
            >
              {predictionResult.health}
            </span>
          </div>
          <div className="mb-6">
            <Image src="/placeholder.svg" alt="Analyzed crop image" width={500} height={300} className="rounded-lg" />
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Confidence</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: `${predictionResult.confidence}%` }}
              ></div>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {predictionResult.confidence}% confident in prediction
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Recommendations</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              {predictionResult.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
          <motion.button
            onClick={() => router.push("/")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Analyze Another Image
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

