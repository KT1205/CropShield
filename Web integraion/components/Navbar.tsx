/* "use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DarkModeToggle from "./DarkModeToggle";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/checkAuth");
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    checkAuth();
    window.addEventListener("focus", checkAuth);

    return () => window.removeEventListener("focus", checkAuth);
  }, []);

// Client-side logout function
const handleLogout = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });

    if (response.ok) {
      window.location.href = '/';  // Hard redirect to login page
    } else {
      console.error('Failed to log out');
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

  const navItems = [
    { name: "About", href: "/about" },
    { name: "History", href: "/history" },
  ];

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-900 dark:from-green-900 dark:to-green-950 shadow-lg transition-colors duration-300 z-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <motion.div
                className="text-white text-2xl font-bold flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src="/placeholder-logo.svg" alt="Logo" className="w-16 h-16 mr-2" />
                CropShield
              </motion.div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                {item.name}
                {pathname === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-white"
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-3 rounded-2xl text-base font-semibold shadow-md hover:from-red-600 hover:to-red-800 transition-transform transform hover:scale-105 active:scale-95 duration-300"
              >
                Logout
              </button>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-green-200 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-800 focus:ring-white"
            >
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
*/

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DarkModeToggle from "./DarkModeToggle";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/checkAuth");
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
        if (data.isLoggedIn && pathname === "/") {
          router.push("/home");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    checkAuth();
    window.addEventListener("focus", checkAuth);

    return () => window.removeEventListener("focus", checkAuth);
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        window.location.href = '/';
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const navItems = [
    { name: "Home", href: "/home" },
    { name: "About", href: "/about" },
    { name: "History", href: "/history" },
  ];

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-900 dark:from-green-900 dark:to-green-950 shadow-lg transition-colors duration-300 z-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left Side - Logo */}
          <div className="flex items-center">
            <motion.div
              className="text-white text-2xl font-bold flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="/placeholder-logo.svg" alt="Logo" className="w-16 h-16 mr-2" />
              CropShield
            </motion.div>
          </div>

          {/* Center - Routes */}
          {isLoggedIn && (
            <div className="flex gap-6">
              {navItems.map((item) => (
                <Link
                key={item.name}
                href={item.href}
                className={`relative text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 no-underline
                  ${pathname === item.href
                    ? "bg-green-500 text-white shadow-md"
                    : "hover:text-green-200"
                  }`}
              >
                {item.name}
              </Link>
              ))}
            </div>
          )}

          {/* Right Side - Dark Mode & Logout */}
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md hover:from-red-600 hover:to-red-800 transition-transform transform hover:scale-105 active:scale-95 duration-300"
                >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

