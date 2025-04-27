/* "use client";

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

/*   const handleLogout = async () => {
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
  }; */

  /*const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        // Remove cookies manually in frontend also
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
        // Force Light Mode on Logout
        if (document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.remove('dark');
        }
  
        // Redirect to login or landing page
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

          {/* Left Side - Logo *//*}
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

          {/* Center - Routes *//*}
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

          {/* Right Side - Dark Mode & Logout *//*}
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
}*/;

/*export default Navbar;*/

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

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/checkAuth", {
        method: "GET",
        cache: "no-store"
      });
      const data = await response.json();
      setIsLoggedIn(data.isLoggedIn);

      if (data.isLoggedIn && pathname === "/") {
        router.push("/home");
      }
      if (!data.isLoggedIn && pathname !== "/") {
        router.push("/");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("focus", checkAuth);

    return () => window.removeEventListener("focus", checkAuth);
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        // Remove cookies manually in frontend also
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
        // Force Light Mode on Logout (if you want to reset the theme)
        if (document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.remove('dark');
        }
  
        // Redirect to login or landing page
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
              <img src="/logo.jpg" alt="Logo" className="w-16 h-16 mr-2" />
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
                  className={`relative text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 no-underline ${
                    pathname === item.href
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
