/* "use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false); // New loading state
  const router = useRouter();

  useEffect(() => {
    if (document.cookie.includes("token=")) {
      router.push("/home");
    }
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const body = isLogin
      ? { usernameOrEmail: username, password }
      : { username, email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data?.token) {
        document.cookie = `token=${data.token}; path=/;`;
        document.cookie = `username=${data.username}; path=/;`;
        router.push("/home");
      } else {
        showBadge("error", data.error || "Invalid credentials or missing data.");
      }
    } catch (error) {
      setLoading(false);
      showBadge("error", "Network error or server issue.");
    }
  };

  const showBadge = (type: "success" | "error", message: string) => {
    const badge = document.createElement("div");
    badge.className = `fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg text-white ${
      type === "success" ? "bg-green-600" : "bg-red-600"
    }`;
    badge.innerText = message;
    document.body.appendChild(badge);
    setTimeout(() => badge.remove(), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        className="text-5xl font-bold text-center mb-12 text-green-700 dark:text-green-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        CropShield
      </motion.h1>

      <motion.div
        className="max-w-md mx-auto bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <motion.button
            type="submit"
            className={`w-full ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white font-bold py-3 px-4 rounded-md shadow-lg`}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Signup"}
          </motion.button>

          <p
            className="text-center text-sm mt-4 cursor-pointer text-green-500"
            onClick={() => {
              setIsLogin(!isLogin);
              setUsername("");
              setPassword("");
              setEmail("");
            }}
          >
            {isLogin ? "Need an account? Signup" : "Already have an account? Login"}
          </p>
        </form>
      </motion.div>
    </div>
  );
}
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (document.cookie.includes("token=")) {
      router.push("/home");
    }
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const body = isLogin
      ? { usernameOrEmail: username, password }
      : { username, email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data?.token) {
        document.cookie = `token=${data.token}; path=/;`;
        document.cookie = `username=${data.username}; path=/;`;
        toast.success(data.message || "Success!");
        router.push("/home");
      } else {
        toast.error(data.error || "Invalid credentials or missing data.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Network error or server issue.");
    }
  };

  return (
    <div className='container mx-auto px-4 py-12'>
      <Toaster position='top-right' reverseOrder={false} />

      <motion.h1
        className='text-5xl font-bold text-center mb-12 text-green-700 dark:text-green-300'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        CropShield
      </motion.h1>

      <motion.div
        className='max-w-md mx-auto bg-white/20 dark:bg-black/20 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        <form onSubmit={handleAuthSubmit} className='p-6 space-y-4'>
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-full p-3 rounded bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400'
          />
          {!isLogin && (
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-3 rounded bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400'
            />
          )}
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full p-3 rounded bg-green-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400'
          />

          <motion.button
            type='submit'
            className={`w-full ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white font-bold py-3 px-4 rounded-md shadow-lg`}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Login" : "Signup"}
          </motion.button>

          <p
            className='text-center text-sm mt-4 cursor-pointer text-green-500'
            onClick={() => {
              setIsLogin(!isLogin);
              setUsername("");
              setPassword("");
              setEmail("");
            }}>
            {isLogin
              ? "Need an account? Signup"
              : "Already have an account? Login"}
          </p>
        </form>
      </motion.div>
    </div>
  );
}
