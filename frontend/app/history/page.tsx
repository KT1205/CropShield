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
    <div className='container mx-auto px-4 py-12'>
      <motion.h1
        className='text-5xl font-bold text-center mb-12 text-green-700 dark:text-green-300'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        Prediction History
      </motion.h1>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {predictions.map((prediction) => (
          <div key={prediction._id} className='bg-white rounded-lg shadow-md'>
            <img
              src={prediction.imageUrl}
              alt={prediction.cropName}
              className='w-full h-48 object-cover rounded-t-lg'
            />
            <div className='p-4'>
              <h2 className='text-xl font-bold'>{prediction.cropName}</h2>
              <p>{prediction.result}</p>
              <p>{new Date(prediction.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
