"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUsername = document.cookie
      .split("; ")
      .find((row) => row.startsWith("username="))
      ?.split("=")[1];
    setUsername(storedUsername || null);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first!");
      return;
    }

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setPrediction(
          `Prediction: ${data.class} (${(data.confidence * 100).toFixed(2)}%)`
        );
      } else {
        setError(data.error || "Failed to get prediction.");
      }
    } catch (err) {
      setError("Error connecting to API.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        className="text-5xl font-bold text-center mb-12 text-green-700 dark:text-green-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {username ? `Welcome, ${username}!` : "CropShield"}
      </motion.h1>

      <motion.div
        className="max-w-md mx-auto bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-6 space-y-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload an image of your crop
            </label>
            <div
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md bg-white/50 dark:bg-black/50"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="space-y-1 text-center">
                <AnimatePresence>
                  {!previewUrl ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer"
                    >
                      <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Drag and drop or click to select a file
                      </p>
                    </motion.div>
                  ) : (
                    <motion.img
                      src={previewUrl}
                      alt="Preview"
                      className="mx-auto h-32 w-auto object-cover rounded cursor-pointer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => fileInputRef.current?.click()}
                    />
                  )}
                </AnimatePresence>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                  ref={fileInputRef}
                />
              </div>
            </div>
          </div>

          <motion.button
            onClick={prediction ? resetFile : handleUpload}
            className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95 duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(0,255,0,0.5)" }}
            whileTap={{ scale: 0.95 }}
            disabled={!selectedFile || isProcessing}
          >
            {isProcessing
              ? "Processing..."
              : prediction
              ? "Choose Another Image"
              : "Predict"}
          </motion.button>

          {prediction && (
            <motion.p
              className="mt-4 text-lg font-semibold text-green-700 dark:text-green-400 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {prediction}
            </motion.p>
          )}

          {error && (
            <motion.p
              className="mt-4 text-lg font-semibold text-red-700 dark:text-red-400 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
