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

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        className="text-5xl font-bold text-center mb-12 text-green-700 dark:text-green-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Prediction History
      </motion.h1>

      {/* Show "Checking..." while loading */}
      {loading && (
        <div className="flex justify-center items-center h-12 mb-8">
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      )}

      {/* Show error if there is any */}
      {error && (
        <div className="flex justify-center items-center h-12 mb-8">
          <p className="text-xl font-semibold text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Show No History Found if no predictions exist */}
      {predictions.length === 0 && !loading ? (
        <div className="flex justify-center items-center h-12 mb-8">
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">No History Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {predictions.map((prediction) => (
            <div key={prediction._id} className="bg-white rounded-lg shadow-md dark:bg-gray-800">
              <img
                src={prediction.imageUrl}
                alt={prediction.cropName}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-black dark:text-white">{prediction.cropName}</h2>
                <p className="text-red-600 dark:text-red-400">{prediction.result}</p>
                <p className="text-gray-500 dark:text-gray-400">
                  {new Date(prediction.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

