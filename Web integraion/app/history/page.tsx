"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Prediction {
  _id: string;
  cropName: string;
  result: string;
  createdAt: string;
  imageUrl: string;
}

export default function History() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch("/api/history");
        const data = await response.json();

        if (data.success) {
          setPredictions(data.data);
        } else {
          setError("Failed to load history.");
        }
      } catch {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const formatPredictionResult = (result: string) => {
    // Convert "Tomato___Leaf_Mold" to "Tomato Leaf Mold"
    return result.split("___").join(" ");
  };

  return (
    <div className='container mx-auto px-4 py-12'>
      <motion.h1
        className='text-5xl font-bold text-center mb-12 text-green-700 dark:text-green-300'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        Prediction History
      </motion.h1>

      {loading && (
        <p className='text-center text-gray-500 dark:text-gray-400'>
          Loading history...
        </p>
      )}
      {error && <p className='text-center text-red-500'>{error}</p>}

      {!loading && !error && predictions.length === 0 && (
        <p className='text-center text-gray-500 dark:text-gray-400'>
          No history found.
        </p>
      )}

      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        {predictions.map((prediction, index) => (
          <motion.div
            key={prediction._id}
            className='bg-white/10 dark:bg-black/10 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden transition-shadow duration-300 hover:shadow-2xl'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}>
            <div className='relative h-48'>
              <Image
                src={prediction.imageUrl || "/placeholder.svg"}
                alt={prediction.cropName}
                layout='fill'
                objectFit='cover'
              />
            </div>
            <div className='p-6'>
              <h2 className='text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200'>
                {formatPredictionResult(prediction.cropName)}
              </h2>
              <p
                className={`text-lg mb-2 ${
                  prediction.result.toLowerCase().includes("healthy")
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}>
                Result: {formatPredictionResult(prediction.result)}
              </p>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                {new Date(prediction.createdAt).toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
